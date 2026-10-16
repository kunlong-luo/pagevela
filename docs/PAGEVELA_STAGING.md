# Pagevela — rollout status and remaining quality gates

> **Published on GitHub Pages:** The product name **Pagevela** is live at https://kunlong-luo.github.io/pagevela/ and the GitHub repository was renamed to https://github.com/kunlong-luo/pagevela. The user explicitly selected **Option A** on 2026-10-16: the former `/resume-craft/` website path is no longer supported and **must not be restored or redirected**. This choice does not assert trademark clearance.

## Completed

- [x] Pagevela is the English and Chinese display name.
- [x] Owner approved PR #210 publication; production brand launched in October 2026.
- [x] GitHub project renamed from `kunlong-luo/resume-craft` to `kunlong-luo/pagevela`.
- [x] GitHub Pages is serving the Pagevela welcome homepage from `/pagevela/`.
- [x] PR #218 corrected current canonical/OG URLs, sitemap, robots, active repository links and SEO workflows for the renamed Pages path.
- [x] Old Pages redirect was **declined** (Option A); no user-site redirect repository is required.

## Compatibility preserved intentionally

- Existing IndexedDB database names, localStorage keys, encrypted-share protocol AAD `resume-craft-share-v2` / `resume-craft-share-v3`, workspace backup schemas, PWA PDF cache key and cross-tab identifiers remain unchanged.
- `github.io/pagevela/` and the retired `github.io/resume-craft/` path share the same HTTPS **origin**, but PWA service-worker scopes and saved/installed launch URLs can differ. Do not assume old installed PWAs continue working.
- Historical v2.6.0 release artifacts and original publication records are historical documents, not a requirement to keep promoting outdated URLs.
- The prepared redirect source files under `docs/legacy-pages-redirect/site/` are **inactive reference material only**. Do not deploy them without a new explicit owner decision.

## Remaining checks

- [ ] Review relevant near-mark/trademark registrations before making commercial exclusivity claims.
- [ ] Check fresh installation, installed-PWA handling, existing IndexedDB drafts, templates, PDF export and fictional encrypted/plain share links on the *current* site.
- [ ] Re-capture **real UI screenshots** from current `main`, confirm visible Pagevela branding and actual `/pagevela/` links, and review each PNG, video, crop, accessibility label and product listing before publishing.
- [ ] Update controllable external article/demo URLs, profile descriptions, launch directories (including Product Hunt) and social links. An old Pages URL can return 404.
- [ ] Avoid any custom-domain/DNS change unless separately approved.

Media: [PROMOTION_MEDIA.md](./PROMOTION_MEDIA.md). Data export/backups: [WORKSPACE_TRANSFER.md](./WORKSPACE_TRANSFER.md). Tracking: [#202](https://github.com/kunlong-luo/pagevela/issues/202).
