# Pagevela — rollout status and remaining quality gates

> **Latest release (v2.8.2; verified 2026-10-25):** [PR #279](https://github.com/kunlong-luo/pagevela/pull/279) merged as `59246623fdbf727a0a767c1e67375401995e0299`; same-SHA [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/40202793334), [Release](https://github.com/kunlong-luo/pagevela/actions/runs/40202793368), [Pages build and deploy](https://github.com/kunlong-luo/pagevela/actions/runs/40203720040) all succeeded. Stable packages use `pagevela-2.8.2.zip` / `.tar.gz` and checksums. Site content has not been independently smoke-tested in this record; remaining Android hardware and legal evidence still belong to #262 / #202.

> **v2.8.1 scope and rollout gate (2026-10-25):** [Android WeChat owner-confirmed PASS and remaining coverage](./V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md) · [#202 brand audit](./PAGEVELA_BRAND_MIGRATION_AUDIT_20261025.md). v2.8.1 is a documentation/test/version-only patch with no changed mobile/PDF runtime behavior. Automated CI and owner-reported WeChat testing are sufficient for this patch **once the new stable Release and same-SHA CI-gated Pages deployment succeed**. Other Android browsers, native print/Downloads and offline PWA results remain explicitly unverified under #262; branding legal clearance remains under #202. Historical status below is kept for traceability.

## Production deployment and China pilot status (2026-10-24)

- [x] Full [main CI #40044538057](https://github.com/kunlong-luo/pagevela/actions/runs/40044538057) passed all Chromium, Firefox 1/2 + 2/2, WebKit 1/2 + 2/2, headed Firefox and final aggregate checks for SHA `218fcc482070718f4a0190c501c77c2115571409`.
- [x] [GitHub Pages #40048470349](https://github.com/kunlong-luo/pagevela/actions/runs/40048470349) was triggered by successful main-push CI, built and deployed the **same SHA**; [issue #265](https://github.com/kunlong-luo/pagevela/issues/265) was closed after validation.
- [x] Optional Tencent EdgeOne / China access pilot PR #240 was **closed unmerged** at owner request on 2026-10-24. No EdgeOne launch, ICP registration, DNS, custom-domain switch or hosting migration is claimed.

This establishes the **v2.7.0-codebase successor** production gate; each future release still requires its own SHA-matched Pages verification.

---

> **Published on GitHub Pages:** The product name **Pagevela** is live at https://kunlong-luo.github.io/pagevela/ and the GitHub repository was renamed to https://github.com/kunlong-luo/pagevela. The user explicitly selected **Option A** on 2026-10-16: the former `/resume-craft/` website path is no longer supported and **must not be restored or redirected**. This choice does not assert trademark clearance.

## Completed

- [x] Pagevela is the English and Chinese display name.
- [x] Owner approved PR #210 publication; production brand launched in October 2026.
- [x] GitHub project renamed from `kunlong-luo/resume-craft` to `kunlong-luo/pagevela`.
- [x] GitHub Pages is serving the Pagevela welcome homepage from `/pagevela/`.
- [x] PR #218 corrected current canonical/OG URLs, sitemap, robots, active repository links and SEO workflows for the renamed Pages path.
- [x] Old Pages redirect was **declined** (Option A); no user-site redirect repository is required.

## Compatibility preserved intentionally

- Legacy `resume-craft` IndexedDB database, cross-tab channel and write lock remain intentionally unchanged to preserve drafts and concurrent-session behavior. New support-prompt storage uses `pagevela.support-prompt.v3` with legacy-state fallback. New backup exports use `pagevela-workspace-v1` and accept older files; new encrypted-share AAD is `pagevela-share-v3` with a legacy v2/v3 decryption fallback; PWA PDF cache was renamed to `pagevela-pdf-tools`. None of these compatible public changes is evidence that every historical identifier was destructively renamed.
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
