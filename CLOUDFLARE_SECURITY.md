# Cloudflare Security Headers

GitHub Pages does not support custom response headers directly, so production hardening for `justforphishing.com` should be applied in Cloudflare.

## SSL/TLS → Edge Certificates

- Minimum TLS Version: **TLS 1.2**
- TLS 1.3: **On**
- Always Use HTTPS: **On**
- Automatic HTTPS Rewrites: **On**

## Rules → Transform Rules → Modify Response Header

Create a rule named `Security headers` that applies to all incoming requests. Add these response headers:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://sql.js.org; worker-src 'self' blob:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://sql.js.org; object-src 'none'; base-uri 'self'; frame-ancestors 'self'; form-action 'self'; upgrade-insecure-requests
```

Start with `Content-Security-Policy-Report-Only` so the site does not break if a module depends on an unexpected browser feature. After a week of clean testing, rename it to `Content-Security-Policy` to enforce it.

## Verify

```bash
curl -sI https://justforphishing.com | grep -iE 'strict-transport|content-security|x-frame|x-content-type|referrer|permissions'
```

Then check <https://securityheaders.com/?q=justforphishing.com>.
