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
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; connect-src 'self' https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net https://jfp-subscribe.ymkerphotos.workers.dev; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests
```

### Notes on the policy

**No CDN entry is needed for icons.** They used to come from `unpkg.com`, which
this policy blocked on every page load — the icons silently never rendered.
They are now self-hosted at `assets/icons.js` and covered by `'self'`. Do not
add a CDN back; regenerate the subset with `node tools/generate-icons.mjs`
instead.

**`connect-src` uses `https://*.google-analytics.com`,** not the bare
`www.` host. GA4 routes European traffic through `region1.google-analytics.com`,
so the narrower form silently dropped EU analytics at the CSP layer.

**Cloudflare Web Analytics is still blocked.** The `static.cloudflareinsights.com`
beacon Cloudflare injects is not in `script-src`, so it errors on every page and
has never recorded a hit. Either add that host, or turn Web Analytics off under
**Analytics → Web Analytics** so it stops injecting.

**`'unsafe-inline'` in `script-src` is a known weakness.** The homepage still
uses inline scripts and an inline `onsubmit` handler. Moving those into a file
and dropping `'unsafe-inline'` (plus adding `script-src-attr 'none'`) is the
remaining hardening step. Nothing currently routes attacker-controlled input
into an HTML sink, but the policy would stop being load-bearing if that changed.

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

## Still open

- **Turnstile.** A server-validated challenge would be the real fix for
  automated enrolment. It needs a site key in the signup form, the secret in the
  worker, and `https://challenges.cloudflare.com` added to `script-src` and
  `frame-src`.
- **Double opt-in.** Brevo can send a confirmation before adding a contact,
  which makes enrolling someone else's address harmless. It needs a DOI template
  configured in Brevo and a switch to the `POST /v3/contacts/doubleOptinConfirmation`
  endpoint.
