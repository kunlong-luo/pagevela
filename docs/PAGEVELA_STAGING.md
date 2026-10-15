# Pagevela brand staging — review checklist

> **Not deployed.** Owner-selected global product name: **Pagevela**, for both English and Chinese interfaces. This feature branch is deliberately a **draft PR**. Name selection is not trademark clearance, domain ownership, permission to switch production, or approval of final logo design.

## What changes in this branch

- English/Chinese user-visible product wordmarks, navigation/footer, FAQ/feature names, privacy panel, multi-tab warning and first-paint startup initial.
- Browser title, Open Graph/Twitter titles, app structured-data name and descriptions, Apple web-app title and PWA display labels.
- Active README landing copy in English/Chinese, existing SVG banner and editable Open Graph artwork wordmark, plus static regression tests guarding brand consistency and old technical identifiers.
- The same Latin-script wordmark **Pagevela** is displayed in Chinese UI; only supporting copy is localized.
- The bilingual [workspace transfer guide](./WORKSPACE_TRANSFER.md) now explicitly says the old production origin is still live and a new Pagevela HTTPS destination has **not** been deployed; it does not imply data already moved.

## What deliberately does not change

- **Existing production origin** `https://kunlong-luo.github.io/resume-craft/`, canonical, OG URL/image link, robots and sitemap. No new hostname exists or is configured.
- **GitHub repository** `kunlong-luo/resume-craft`, its paths, package identifier, historical released tags, v2.6.0 release notes and promotion playbook for that historical release.
- **Encryption protocol AAD** `resume-craft-share-v2` and `resume-craft-share-v3`; old encrypted shares must remain usable.
- IndexedDB database, storage keys, workspace backup file/schema/version, cross-tab BroadcastChannel identity, event names and PDF-tool Workbox cache key. Display names must not become storage migrations.
- Historical blog/commit/release archives that correctly reflect their originally published brand.
- A new logo, trademark symbols or claims of registered rights; current paper-themed icons remain provisional until visual identity review.

## Required approval and quality gates

- [x] Owner has selected Pagevela (2026-10-15).
- [ ] Review relevant similar marks and commercial uses in countries of intended launch; record trademark counsel conclusion if needed.
- [ ] Confirm domain registration and separately authorize purchase, DNS and independent HTTPS deployment.
- [x] GitHub Actions CI #892 passed lint, typecheck, unit tests, build, full Chromium E2E, Firefox/WebKit PR E2E and final gate. Later commits require a fresh green run.
- [ ] Re-validate full CI after the workspace-guide and regression-guard follow-up commits.
- [ ] Verify both language variants display Pagevela on desktop/mobile, in SEO head, PWA install UI, error/notices and screenshots.
- [x] Static diff audit: old-origin canonical/sitemap and existing data identifiers are unchanged. This is not a substitute for browser proof.
- [ ] Confirm no original-origin redirect and no silent loss of old IndexedDB drafts.
- [ ] Validate opt-in HTTPS-to-HTTPS workspace export/restore across independent old/new sites when a second site is actually available.
- [ ] Validate legacy encrypted and unencrypted share links, PWA reinstall/update behavior, A4 and US Letter export, portrait backup and cancellation of import.
- [ ] Review localization, accessible descriptions and final creative assets.
- [ ] Receive explicit approval for public release and rollback plan.

**No-Go for deployment:** pass of local/PR CI alone does not clear the legal, domain, two-origin migration and installed PWA gates.

Tracking: [global brand decision #202](https://github.com/kunlong-luo/resume-craft/issues/202); [readiness PR #203](https://github.com/kunlong-luo/resume-craft/pull/203). This staging PR stays separate from the earlier documentation-only readiness work.
