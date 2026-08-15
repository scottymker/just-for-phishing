# Cloudflare configuration

GitHub Pages does not support custom response headers, so production hardening
for `justforphishing.com` is applied in Cloudflare. This file documents what
should be set; it is not applied automatically, so check it against the live
headers when you change either one.

## SSL/TLS → Edge Certificates

- Minimum TLS Version: **TLS 1.2**
- TLS 1.3: **On**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

## Rules → Transform Rules → Modify Response Header

A rule named `Security headers` applying to all incoming requests, setting:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com; script-src-attr 'none'; connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://jfp-subscribe.ymkerphotos.workers.dev; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; font-src 'self'; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests
```

### What changed and why

**`'unsafe-inline'` is gone from `script-src`.** Every inline `<script>` and
every `onclick`/`onsubmit` attribute was moved into a file, so the policy is now
load-bearing: an HTML-injection bug could no longer execute. `script-src-attr
'none'` blocks handler attributes outright, so a reintroduced `onclick=` fails
loudly instead of quietly weakening the policy. Verified by serving the whole
site under this exact policy before deploying it.

**No CDN entry for icons or fonts.** Icons are self-hosted at
`assets/icons.js` (regenerate with `node tools/generate-icons.mjs`) and the
webfonts at `assets/fonts/` (`node tools/fetch-fonts.mjs`). That is why
`font-src` is `'self'` and `fonts.googleapis.com` is no longer in `style-src`.
Do not add these back — self-hosting also keeps visitors' IP addresses away from
Google, which matters on a site that promises training answers stay local.

**`connect-src` uses `https://*.google-analytics.com`,** not the bare `www.`
host. GA4 routes European traffic through `region1.google-analytics.com`, so the
narrower form silently dropped EU analytics.

**`challenges.cloudflare.com` appears in `script-src` and `frame-src`** for
Turnstile on the newsletter form. Both entries are harmless before Turnstile is
switched on, so this policy can be applied now.

**`style-src` still allows `'unsafe-inline'`,** because 136 elements carry
`style` attributes — per-card accent colours and similar. Inline style is a far
smaller risk than inline script; removing it would mean a data-attribute
rewrite, and is not currently worth the churn.

**Cloudflare Web Analytics should stay off.** Its beacon is not in `script-src`,
so if it is re-enabled it will error on every page and record nothing.

## Scrape Shield → Email Address Obfuscation: **Off**

Cloudflare rewrites email addresses in the page into
`<a href="/cdn-cgi/l/email-protection">[email protected]</a>`. On this site the
addresses are deliberate phishing examples, so obfuscation turns teaching
content into clickable links and, if the decode script is blocked, replaces the
homoglyph domain the lesson is about with the words "[email protected]".

## Verify

```bash
curl -sI https://justforphishing.com | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer|permissions'
```

Then check <https://securityheaders.com/?q=justforphishing.com>.

---

# Newsletter Worker

Source: `worker/`. Deployed as `jfp-subscribe`.

```bash
cd worker
wrangler deploy
wrangler secret put BREVO_API_KEY
```

## Rate limiting

`wrangler.toml` declares a `RATE_LIMITER` binding at 10 requests per 60 seconds,
applied twice per request: once keyed on the caller's IP, once on the submitted
address. The worker fails open if the binding is missing, so a deploy that drops
it will keep working — and keep no abuse control. Confirm the binding is listed
after deploying:

```bash
wrangler deployments list
```

Locally, `wrangler dev --local` prints the bindings on startup.

## Origin allowlist is not authentication

`Origin` is a header the browser sets; any scripted client can send whatever
value it likes. The allowlist keeps other *websites* from using the endpoint —
it does nothing against `curl`. The controls that matter are the 1 KB body cap,
the 254-character address cap, the format check, and the rate limiter.

`http://localhost` origins are **not** in the production allowlist. For local
work, run `wrangler dev --var ALLOW_DEV_ORIGINS:true`. Never set that variable
on the deployed worker.

## Turnstile — active

Live on the newsletter signup and validated end to end on 08-15-2026.

| | |
|---|---|
| Sitekey | `0x4AAAAAAEQhhN9V-SXVjSIY` (public; set in `index.js`) |
| Widget | `justforphishing.com (Spin)`, mode `managed` |
| Widget domains | `justforphishing.com`, `localhost`, `127.0.0.1` |
| Action | `newsletter-signup` |
| Secret | `TURNSTILE_SECRET`, bound on Worker `jfp-subscribe` |
| Accepted hostnames | `TURNSTILE_HOSTNAMES = "justforphishing.com"` |

The Worker accepts a token only when siteverify reports `success` **and** the
action matches **and** the hostname is in `TURNSTILE_HOSTNAMES`. Checking
`success` alone would accept a token minted by this sitekey on any other page,
including a locally served one — which is why `localhost` is registered on the
widget for development but deliberately absent from the accepted hostnames.

Once `TURNSTILE_SECRET` exists the Worker fails **closed**: no token, a
malformed token, or a siteverify error all return 403. If you ever rotate the
sitekey, update `index.js` and the secret together — a secret without a
matching sitekey rejects every real visitor.

### Diagnosing a rejection

Observability is enabled on the Worker, so rejections are queryable:

```bash
wrangler tail jfp-subscribe --format json
```

A rejected attempt logs the siteverify verdict. The `error-codes` distinguish
the two failure modes that look identical from the browser:

- `invalid-input-response` — the **token** was bad. Normal for a stale, replayed
  or forged token. The secret is fine.
- `invalid-input-secret` — the **secret** is wrong or missing on the Worker.
  Re-run the retrieval flow.

A mismatch on `action` or `hostname` logs those fields with `success: true`,
which points at the frontend rather than the secret.

### If a visitor cannot subscribe

`index.js` detects a challenge that fails to render, times out, or whose script
is blocked, and tells the visitor to allow `challenges.cloudflare.com` rather
than showing a generic error. That covers the most likely support report — an
ad blocker or privacy extension blocking the challenge host.

## Turning on double opt-in

This is the change that actually makes an open endpoint harmless: Brevo emails
the address a confirmation link and adds the contact only when it is clicked, so
enrolling somebody else achieves nothing.

1. **Brevo → Campaigns → Templates → New template**, type **Double opt-in
   confirmation**. Include the `{{ doubleoptin }}` confirmation link.
2. Note the numeric template id from the template list.
3. Set it on the Worker:
   ```bash
   cd worker
   wrangler deploy --var BREVO_DOI_TEMPLATE_ID:12345
   ```
   or add it under `[vars]` in `wrangler.toml`.

With the id set, the Worker posts to `/v3/contacts/doubleOptinConfirmation`
instead of `/v3/contacts`, and the site's success message changes to "check your
inbox". Unset it and the previous direct-add behaviour returns.

## Still open

- **Double opt-in.** `BREVO_DOI_TEMPLATE_ID` is unset, so contacts are still
  added directly. This is the one remaining control that would make an endpoint
  anyone can reach genuinely harmless — Turnstile and the rate limiter only make
  abuse slower, whereas a confirmation email makes enrolling someone else's
  address pointless. Steps above.
