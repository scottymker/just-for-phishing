/**
 * Newsletter subscribe endpoint for justforphishing.com.
 *
 * The Origin allowlist below is a convenience, not a control: Origin is a
 * header a browser sets and any scripted client can forge. Everything that
 * actually limits abuse is downstream of it — the size caps, the address
 * validation, and the RATE_LIMITER binding.
 */

const ALLOWED_ORIGINS = [
  'https://justforphishing.com',
  'https://www.justforphishing.com',
];

// Deliberately not in ALLOWED_ORIGINS: this worker is the production
// deployment. Run `wrangler dev` for local work, which serves its own origin.
const DEV_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
];

// RFC 5321 caps a local part at 64 octets and a whole path at 256. Anything
// near that is not a real signup.
const MAX_EMAIL_LENGTH = 254;
// An address-only body is about 40 bytes, but a Turnstile token can be up to
// 2048 characters on its own, so the cap has to clear address + token + JSON
// overhead. 4 KB does that and still bounds how much we will parse.
const MAX_BODY_BYTES = 4096;

// Brevo list the newsletter writes to.
const LIST_ID = 3;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

/**
 * Verify a Cloudflare Turnstile token with Cloudflare.
 *
 * Follows the canonical siteverify contract: a token is only accepted when
 * Cloudflare reports success AND the action matches the surface that issued it
 * AND the hostname is one this deployment expects. Checking success alone is
 * not enough — a token minted by the same sitekey on a different page, or
 * replayed from an attacker-controlled host, would otherwise pass.
 *
 * Unlike the rate limiter this fails CLOSED once configured: if TURNSTILE_SECRET
 * is set we require a valid token, because a challenge that can be skipped when
 * the verification endpoint hiccups is not a challenge. When the secret is not
 * set at all the check is skipped entirely, so the endpoint keeps working on a
 * deployment that has not been given keys yet.
 */
const TURNSTILE_ACTION = 'newsletter-signup';
const MAX_TOKEN_LENGTH = 2048;

async function turnstileOk(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;      // not configured; nothing to check

  // Deployment-specific frontend hostnames. Must never contain localhost in
  // production — a widget registered for local development would otherwise let
  // a locally-served page mint tokens this deployment accepts.
  const expectedHostnames = new Set(
    (env.TURNSTILE_HOSTNAMES || '')
      .split(',')
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );

  if (typeof token !== 'string' || token.length === 0
      || token.length > MAX_TOKEN_LENGTH || expectedHostnames.size === 0) {
    return false;
  }

  let result;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        ...(ip && ip !== 'unknown' ? { remoteip: ip } : {}),
      }),
    });
    if (!res.ok) throw new Error(`siteverify ${res.status}`);
    result = await res.json();
  } catch (error) {
    console.error('[subscribe] turnstile verification failed', error);
    return false;
  }

  if (!result.success
      || result.action !== TURNSTILE_ACTION
      || !expectedHostnames.has(result.hostname)) {
    console.warn('[subscribe] turnstile rejected:', JSON.stringify({
      success: result.success,
      action: result.action,
      hostname: result.hostname,
      codes: result['error-codes'] || [],
    }));
    return false;
  }

  return true;
}

/**
 * Ask the rate limiter whether this key may proceed. Fails open when the
 * binding is absent so the endpoint keeps working on a deployment that has not
 * been reconfigured yet — see wrangler.toml.
 */
async function withinRateLimit(env, key) {
  if (!env.RATE_LIMITER) return true;
  try {
    const { success } = await env.RATE_LIMITER.limit({ key });
    return success;
  } catch {
    return true;
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.concat(env.ALLOW_DEV_ORIGINS === 'true' ? DEV_ORIGINS : []);

    if (!allowed.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, origin);
    }

    // Reject oversized bodies before reading them. Content-Length is a hint, so
    // the read below is bounded too.
    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return json({ error: 'Request too large' }, 413, origin);
    }

    let raw;
    try {
      raw = await request.text();
    } catch {
      return json({ error: 'Could not read request' }, 400, origin);
    }
    if (raw.length > MAX_BODY_BYTES) {
      return json({ error: 'Request too large' }, 413, origin);
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: 'Invalid JSON' }, 400, origin);
    }

    if (typeof body?.email !== 'string') {
      return json({ error: 'Invalid email address' }, 400, origin);
    }

    const email = body.email.trim().toLowerCase();
    if (email.length > MAX_EMAIL_LENGTH || !EMAIL_RE.test(email)) {
      return json({ error: 'Invalid email address' }, 400, origin);
    }

    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';

    // Challenge first: it is the cheapest way to shed automated traffic, and
    // doing it before the rate-limit accounting keeps bots from consuming a
    // real visitor's budget.
    if (!(await turnstileOk(env, body.turnstileToken, clientIp))) {
      return json({ error: 'Could not verify you are human. Please try again.' }, 403, origin);
    }

    // Two independent budgets: one per source address, so a single client
    // cannot enumerate; one per submitted email, so a distributed client cannot
    // repeatedly re-add the same person.
    const [ipOk, emailOk] = await Promise.all([
      withinRateLimit(env, `ip:${clientIp}`),
      withinRateLimit(env, `email:${email}`),
    ]);
    if (!ipOk || !emailOk) {
      return json({ error: 'Too many attempts. Please try again shortly.' }, 429, origin);
    }

    // Double opt-in when a DOI template is configured: Brevo emails the address
    // a confirmation link and only adds the contact once it is clicked. That
    // makes enrolling someone else's address harmless, which is the real fix
    // for an endpoint anyone can reach — the rate limit and the challenge only
    // make abuse slower.
    const doiTemplateId = Number(env.BREVO_DOI_TEMPLATE_ID) || 0;
    const useDoi = doiTemplateId > 0;

    const endpoint = useDoi
      ? 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation'
      : 'https://api.brevo.com/v3/contacts';

    const payload = useDoi
      ? {
          email,
          includeListIds: [LIST_ID],
          templateId: doiTemplateId,
          redirectionUrl: env.BREVO_DOI_REDIRECT || 'https://justforphishing.com/',
        }
      : { email, listIds: [LIST_ID], updateEnabled: true };

    let brevoRes;
    try {
      brevoRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('[subscribe] brevo request failed', error);
      return json({ error: 'Subscription failed' }, 502, origin);
    }

    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return json({ ok: true, confirm: useDoi }, 200, origin);
    }

    // Brevo's own message can carry account and implementation detail. Log it
    // where only we can read it and hand the browser a fixed string.
    const detail = await brevoRes.text().catch(() => '');
    console.error(`[subscribe] brevo ${brevoRes.status}: ${detail}`);
    return json({ error: 'Subscription failed' }, 502, origin);
  },
};
