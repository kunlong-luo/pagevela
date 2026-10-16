# Pagevela — Global Brand Implementation Contract

> **Historical archive (2026-10-16):** This document records the **pre-launch** research and decisions as they were documented. **Pagevela is now live** at https://kunlong-luo.github.io/pagevela/ and https://github.com/kunlong-luo/pagevela. Any instructions below saying the rename has not launched, that `/resume-craft/` is the live site, or that an old-site redirect is required are **superseded**. The owner chose not to redirect the retired Pages path. Use [PAGEVELA_STAGING.md](./PAGEVELA_STAGING.md) and [channel-refresh/README.md](./channel-refresh/README.md) for current status. Historical trademark observations do not establish clearance.

> Decision recorded: **2026-10-15**. The owner explicitly selected **Pagevela** as the **sole public product brand** for English- and Chinese-language markets. This settles the naming choice, **not** legal/trademark clearance, domain ownership, public launch authorization, logo approval, or deployment. Tracking: [#202](https://github.com/kunlong-luo/resume-craft/issues/202), [PR #203](https://github.com/kunlong-luo/resume-craft/pull/203).
>
> **Change boundary:** This file is an implementation specification only. No runtime strings, production site, GitHub Pages settings, DNS, purchase, URLs or caches should be changed in this planning PR.

## 1. Approved identity (name only)

| Field | Decision |
| --- | --- |
| Worldwide product name (English UI) | **Pagevela** |
| Worldwide product name (Chinese UI) | **Pagevela** (same Latin-script wordmark, no separate Chinese product name) |
| Exact capitalization in UI | **Pagevela** |
| Trademark-search form | **PAGEVELA** (search input notation, not UI capitalization) |
| Prior English and Chinese marketing identities | To be retired from new public branding in the staged launch |
| New domain | **Not approved / not acquired**. `pagevela.com` has only a dated availability/price observation, no reservation |
| Logo, icon, palette, brand slogan, Chinese phonetic name | **Not approved**. Do not imply their approval from the product-name decision |

Chinese-language product descriptions, support text and onboarding should be localized, while the product name remains **Pagevela**. Do not revive the historical Chinese candidate nicknames shown in research tables. Never market the name as trademark-registered or legally cleared.

## 2. Draft launch copy (PROPOSED, not approved)

| Placement | English (draft) | 中文（草稿） |
| --- | --- | --- |
| App name / navigation / footer / PWA display | Pagevela | Pagevela |
| Browser title | Pagevela — Local-First Resume Builder | Pagevela — 本地优先的简历编辑器 |
| Product description | Create and edit resumes with forms or Markdown. Preview A4 and US Letter pages, then export. Your resume content stays in your browser by default. | 使用表单或 Markdown 制作简历，预览 A4 与 US Letter 排版并导出。简历内容默认保存在浏览器本地。 |
| Primary tagline (draft) | Build your resume. Keep control of your data. | 制作你的简历，自己掌控数据。 |
| GitHub link accessible label | View the Pagevela source on GitHub | 在 GitHub 查看 Pagevela 源代码 |

**Copy discipline:** Avoid unqualified "ATS pass rate", "AI-powered", privacy/security guarantees or server-sync promises; confirm feature copy against the release before launch. Avoid stuffing the old name into new UI for SEO. Add a transitional "formerly..." disclosure only where necessary to help existing users and only after review.

## 3. Real code surfaces and acceptance owners

Confirmed on `docs/international-rebrand-readiness-20261013` (audit sample, **not** an exhaustive string search):

| File / surface | Existing coupling | Implementation acceptance gate |
| --- | --- | --- |
| `index.html` | Static title, keywords, canonical, Open Graph, Twitter, JSON-LD, Apple web-app title, startup mark | Approved wordmark/copy consistency; correct destination URL after new HTTPS site exists; no premature canonical switch |
| `src/lib/seo.ts` + `src/tests/seo.test.ts` | English/Chinese dynamic SEO copy and tests | Both locales use Pagevela; tests assert expected metadata and pre/post deployment URL behavior |
| `src/components/landing/LandingNavbar.tsx` | Bilingual wordmark and GitHub tooltip/aria-label | Both locales show Pagevela and truthful accessible labels; GitHub repository URL remains valid |
| `src/components/landing/LandingFooter.tsx` | Bilingual footer brand | Pagevela in both locales; valid help, support, and source links |
| `vite.config.ts` | PWA manifest `name`, `short_name`, description and Workbox cache name | Change only approved user-visible manifest fields for the new deployment; audit installed PWA and caches separately |
| `scripts/generate-og-card.mjs`, `.github/assets`, README files | Generated and editorial image/text assets | Review all banners, preview cards, language docs; preserve repo/release history |
| `public/robots.txt` / `public/sitemap.xml` and deployment workflow | Legacy GitHub Pages origin | Leave old origin usable; update new-origin SEO only after real dual-site verification |
| `src/components/share/*` and share routes | Previously issued share links | Old links still open; new links only reference working endpoints |

Re-run repository-wide string search before code merge, including `public/`, CSS, i18n messages, tests, generated assets and release docs. Historical changelogs and protocol constants may legitimately retain previous identifiers.

## 4. NEVER bulk-rename compatibility identifiers

- `src/lib/share-utils.ts`: keep byte-for-byte `resume-craft-share-v2` and `resume-craft-share-v3` encryption associated-data constants; preserve v2/v3 share decryption.
- Preserve `resume-craft` IndexedDB database name, storage/localStorage keys, workspace backup schema/version and existing serialized fields unless a **separate, versioned, reversible compatibility migration** is designed and tested.
- Preserve legacy share route parsing, original public URLs and GitHub repository links while existing users depend on them. Changing a display name is not a reason to rename GitHub repo paths or package identifiers.
- Treat Workbox cache identifiers, PWA scope, service worker update behavior and deployment path as functional identifiers requiring an isolated migration plan, not cosmetic strings.
- Continue providing the complete old-origin workspace exporter. A 301/302 redirect cannot move browser IndexedDB between origins.

## 5. Launch work packages (order matters)

1. **Done:** Name decision — the owner selected global **Pagevela**, English and Chinese.
2. **Blocked:** Complete similarity / phonetic trademark and common-law-use assessment for relevant regions and services; document legal review. Exact-name 0-result searches do not establish clearance.
3. **Blocked:** Fresh registrar checkout, purchase consent, appropriate domain verification, and a separately hosted HTTPS site. Never change existing GitHub Pages custom-domain settings as a shortcut.
4. **Ready to develop on a separate branch once gate 2 permits:** Centralize display-only brand labels with Pagevela translations, metadata, navigation/footer and accessible labels; then integrate approved logo and creative assets.
5. **Blocked until two real HTTPS origins exist:** Execute opt-in `e2e/rebrand-live-origins.e2e.ts` in Chromium/Firefox/WebKit plus existing encrypted share, PWA, PDF and recovery tests. Use **fictional** resumes and portraits.
6. **Blocked:** Public rollout/SEO canonical changes only after technical/privacy checks, explicit launch approval and a rollback plan. Retain the legacy exporter and guidance throughout the transition.

## 6. Release gate checklist

- [x] Product name and capitalization approved by owner on 2026-10-15.
- [x] Single worldwide wordmark; Chinese interface uses the same name.
- [ ] Similarity / phonetic trademark, target-country and actual market-use review recorded.
- [ ] Registrar checkout/ownership and second deployment approved.
- [ ] User-visible copy, logo and support materials reviewed.
- [ ] Old-origin export and encrypted share compatibility test passed.
- [ ] Two-real-HTTPS-origin rehearsal passed on all supported browsers.
- [ ] Installed PWA and A4/US Letter PDF export regression evidence recorded.
- [ ] Privacy, DNS, SEO/canonical, rollback and owner launch sign-off recorded.

**Current deployment decision: NO-GO.** Product-name selection is approved; trademark, domain purchase and public migration are separate decisions.
