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

## Turning on Turnstile

The code is in place and inert. To activate:

1. **Cloudflare dashboard → Turnstile → Add widget.** Domain
   `justforphishing.com`, widget mode **Managed**. You get a site key and a
   secret key.
2. Paste the **site key** into `TURNSTILE_SITE_KEY` at the top of `index.js`.
   It is public by design — the Worker verifies the token server-side, so the
   key alone grants nothing.
3. Give the Worker the **secret key**:
   ```bash
   cd worker && wrangler secret put TURNSTILE_SECRET
   ```

Once `TURNSTILE_SECRET` exists the Worker **requires** a valid token and fails
closed — a challenge that can be skipped when verification hiccups is not a
challenge. So set the site key in `index.js` before or at the same time as the
secret, or the form will start rejecting real people.

The CSP above already allows `challenges.cloudflare.com`.

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

- **Nothing blocking.** Turnstile and double opt-in are coded and waiting on the
  credentials above. Everything else in this file is applied.
