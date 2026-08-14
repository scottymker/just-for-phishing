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
// A well-formed body is about 40 bytes. 1 KB is generous and still bounds how
// much we will parse.
const MAX_BODY_BYTES = 1024;

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

    // Two independent budgets: one per source address, so a single client
    // cannot enumerate; one per submitted email, so a distributed client cannot
    // repeatedly re-add the same person.
    const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
    const [ipOk, emailOk] = await Promise.all([
      withinRateLimit(env, `ip:${clientIp}`),
      withinRateLimit(env, `email:${email}`),
    ]);
    if (!ipOk || !emailOk) {
      return json({ error: 'Too many attempts. Please try again shortly.' }, 429, origin);
    }

    let brevoRes;
    try {
      brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'content-type': 'application/json',
          'api-key': env.BREVO_API_KEY,
        },
        body: JSON.stringify({ email, listIds: [3], updateEnabled: true }),
      });
    } catch (error) {
      console.error('[subscribe] brevo request failed', error);
      return json({ error: 'Subscription failed' }, 502, origin);
    }

    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return json({ ok: true }, 200, origin);
    }

    // Brevo's own message can carry account and implementation detail. Log it
    // where only we can read it and hand the browser a fixed string.
    const detail = await brevoRes.text().catch(() => '');
    console.error(`[subscribe] brevo ${brevoRes.status}: ${detail}`);
    return json({ error: 'Subscription failed' }, 502, origin);
  },
};
