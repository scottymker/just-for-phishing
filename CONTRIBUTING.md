# Contributing to Just For Phishing

Thanks for helping improve phishing-awareness training. This project is intentionally simple: static HTML, CSS, and vanilla JavaScript with no required build step.

## Ground rules

- Keep scenarios educational and defensive. Do not add credential collection, real brand impersonation assets, malware, or instructions that enable abuse.
- Use fictional organizations/domains unless referencing a public reporting resource.
- Preserve accessibility: keyboard navigation, visible focus states, semantic HTML, useful alt text, and clear screen-reader feedback.
- Keep learner progress local to the browser unless a future feature clearly documents otherwise.
- Avoid new third-party dependencies unless there is a strong reason and the dependency is pinned.

## Local development

```bash
git clone https://github.com/scottymker/just-for-phishing.git
cd just-for-phishing
python3 -m http.server 8080
# open http://localhost:8080
```

You can also open `index.html` directly for most pages, but a local server is closer to production.

## Pull request checklist

- [ ] Pages load without console errors
- [ ] Links still work
- [ ] New copy is accurate, professional, and defensively framed
- [ ] Keyboard-only navigation works for interactive elements
- [ ] No secrets, real credentials, real tokens, or live phishing infrastructure
- [ ] If a third-party script/resource was added, the privacy policy and Cloudflare CSP notes were updated

## Reporting problems

For bugs and content improvements, open a GitHub issue. For security concerns, follow `SECURITY.md`.
