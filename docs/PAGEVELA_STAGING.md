# Pagevela rollout — status and remaining migration checklist

> **Live on the existing origin (2026-10-15):** The owner explicitly authorized merging [PR #210](https://github.com/kunlong-luo/resume-craft/pull/210) into `main`, and [GitHub Pages Deploy #38737845195](https://github.com/kunlong-luo/resume-craft/actions/runs/38737845195) succeeded. The existing `https://kunlong-luo.github.io/resume-craft/` site now displays **Pagevela** in English and Chinese. **This was a public brand-display update only**, not trademark clearance, a domain purchase, a new HTTPS origin, or completion of cross-origin/PWA migration.

## Brand-display changes now on `main`

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
- [x] **PR #210 CI #922 fully PASSED**: lint, typecheck, unit tests, build, full Chromium E2E, Firefox/WebKit critical E2E and final gate.
- [x] **Main GitHub Pages deploy #38737845195 PASSED** and live site returned HTTP 200 with Pagevela title and Open Graph metadata.
- [ ] Capture complete **post-merge main CI** results separately; a deploy success does not replace full main-branch browser verification.
- [ ] Verify both language variants display Pagevela on desktop/mobile, in SEO head, PWA install UI, error/notices and screenshots.
- [x] Static diff audit: old-origin canonical/sitemap and existing data identifiers are unchanged. This is not a substitute for browser proof.
- [x] The README diagrams now use approved **Pagevela** capitalization (not all caps); generated promotional visuals are staged with the same user-visible name. Historical asset *filenames* stay as-is.
- [ ] Confirm no original-origin redirect and no silent loss of old IndexedDB drafts.
- [ ] Validate opt-in HTTPS-to-HTTPS workspace export/restore across independent old/new sites when a second site is actually available.
- [ ] Validate legacy encrypted and unencrypted share links, PWA reinstall/update behavior, A4 and US Letter export, portrait backup and cancellation of import.
- [ ] Review localization, accessible descriptions and final creative assets. New [promotion media checklist](./PROMOTION_MEDIA.md) defines a separate, opt-in workflow on the Pagevela branch; **no actual screenshot/video capture or human visual sign-off has been completed**.
- [x] Owner explicitly approved **existing-origin Pagevela brand publication**; merged as `ac05a3d` on 2026-10-15.
- [ ] Approve a rollback plan and any **future new-host/domain migration** separately; do not infer these from the existing-origin release.

**Current status:** The Pagevela **brand display is already live on the existing GitHub Pages origin** by explicit owner authorization. **NO-GO for a new-domain launch or redirects** until trademark near-mark review, domain authorization, real two-origin tests, installed-PWA validation and rollback approval are completed. The current deployment is **not** evidence of trademark clearance. The existing-origin user data and original URLs must be retained.

Tracking: [global brand decision #202](https://github.com/kunlong-luo/resume-craft/issues/202); [readiness PR #203](https://github.com/kunlong-luo/resume-craft/pull/203). This staging PR stays separate from the earlier documentation-only readiness work.
