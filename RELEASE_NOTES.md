# Pagevela v2.8.1

**中文名称：** 页帆 v2.8.1

**Release verification:** Refer to the [v2.8.1 GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.1) for the published tag and release artifacts; the website deployment must independently show a successful main-push CI followed by a same-SHA Pages build and deploy. This document alone is not deployment evidence.

## Reliability / 可靠性
- Downloaded Quick PDF is now opened by a genuine PDF parser during full Chromium E2E. Tests validate parseability, positive drawing-operator lists on all pages, valid page geometry and preservation of the existing fictional draft after reload.
- International market E2E fixtures no longer reseed default region settings on reload, so the US Letter persistence check tests actual saved state without weakened assertions.
- The existing separate ATS/print PDF E2E checks selectable Chinese/English text and A4 geometry. These automated checks are not substitutes for Android's native print/save dialog.
- The product owner reported successfully testing Pagevela on **real Android + WeChat** (2026-10-25); recorded as **owner-reported PASS**, not simulated or independently reproduced. Individual Android PDF/Downloads/PWA flows and Android Chrome, Samsung/OEM testing remain scoped in [#262](https://github.com/kunlong-luo/pagevela/issues/262). These are not presented as passing; because this patch does not modify those runtime paths, repeat hardware testing is not required for this patch.

## Pagevela identity / 品牌与兼容
- Records implemented Pagevela branding and canonical site, deliberately retired old-site redirect, retained legacy encrypted-share AAD, workspace backup and archive naming conventions.
- Current trademark/near-mark legal review is **not finished**. The product name's public use should not be presented as formal trademark clearance or exclusive rights; see [#202](https://github.com/kunlong-luo/pagevela/issues/202).
- Public GitHub Pages remains the only approved hosting origin. There was no Tencent EdgeOne/DNS switch, account service, external media publication, or real-resume upload.

## Downloads / 下载
Pagevela-branded archive filenames are `pagevela-2.8.1.zip` and `pagevela-2.8.1.tar.gz` with `SHA256SUMS.txt` after re-packaging; original published files remain as historical artifacts. New release display name is **Pagevela v2.8.1**.

**References:** [Device QA](./docs/V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md) · [Migration audit](./docs/PAGEVELA_BRAND_MIGRATION_AUDIT_20261025.md) · [v2.8.1 target release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.1) · [Diff from v2.8.0](https://github.com/kunlong-luo/pagevela/compare/v2.8.0...v2.8.1)

---

# Pagevela v2.8.0

**中文名称：** 页帆 v2.8.0

**Release date:** 2026-10-24 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.0) · [Live website](https://kunlong-luo.github.io/pagevela/) · [Announcement kit](./docs/V2_8_0_RELEASE_KIT.md)

## Highlights / 本次更新

- **Welcome / 欢迎页：** Show useful welcome content before heavier editor initialization. Add the consistently styled QR code button immediately left of Start, opening a branded modal for phone scanning.
- **Mobile editing / 移动端：** More reliable Form / Code / Preview controls, unified touch-friendly actions without duplicate Fit/Check entries, visible toolbar actions and menus above the bottom dock.
- **Preview and keyboard / 预览与键盘：** Ensure resume's bottom text and focused inputs remain clear of mobile action controls; improve 320–767px layout and tablet behavior.
- **Branded UI / 自定义组件：** Consistent English/Chinese labels, shared language switch near Theme, custom modals and menus, thin capsule scrollbars, automated bans on visible native popup/select widgets.
- **Export / 导出：** Stronger A4 multi-page print, PDF and profile-photo regression checks. Use ATS/browser-print for selectable PDF text; quick PDF can be rasterized.
- **Release safety / 发布安全：** Full Chromium and two Firefox/two WebKit shards, headed Firefox proof, and a strict final CI summary; Pages publishing is gated on success of the exact main-push CI commit.
- **Stable dependencies / 依赖：** React / React DOM 19.3.1, Motion 14.4, Lucide 1.59, ESLint 10.13, Vitest 5.0.5.

## Privacy, limits and migration / 隐私与迁移

Pagevela remains local-first; there is no account-based automatic browser/device sync. Full-workspace backups are **unencrypted** and should be handled privately. The old `/resume-craft/` URL is not redirected; [manual export/import](./docs/WORKSPACE_TRANSFER.md) is required to move data across devices or origins.

ATS checks are heuristic guidance, not guaranteed acceptance by any particular employer. Automated browser tests do **not** constitute physical Android handset verification. Existing media captures may be outdated; new screenshots and external media posts require a separate visual review.

## Assets / 发布文件

New v2.8.0 assets retain historical compatible archive filenames: `resume-craft-2.8.0.zip`, `resume-craft-2.8.0.tar.gz`, `SHA256SUMS.txt`. Older `resume-craft-*` release archives and internal storage identifiers are deliberately retained unchanged.

**Full compare:** https://github.com/kunlong-luo/pagevela/compare/v2.7.0...v2.8.0

---

# Pagevela v2.7.0

**Release date:** 2026-10-17 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.7.0) · [Live demo](https://kunlong-luo.github.io/pagevela/) · [Product video](https://youtu.be/z3RNFD4s-kk)

## Highlights / 更新亮点

- **Brand / 品牌：** Complete public rename from Resume Craft to **Pagevela**; Chinese UI uses **页帆**. Official site and repository now use the `/pagevela/` path.
- **First-run flow / 快速开始：** A simpler welcome-to-editor flow, two-click entry, and no redundant tutorial when a template has already been selected.
- **Mobile PDF / 移动端导出：** Easier access to the primary ATS/browser-print PDF action on mobile.
- **Product imagery / 真实界面展示：** Automated English and Chinese captures of the welcome page and editor for honest product demonstrations.
- **Dependencies / 依赖：** Tested maintenance updates to production and development packages, including Vite, Playwright and Vitest.

## Compatibility and privacy / 兼容与隐私

- Resume content remains primarily **local to each browser origin**. The new Pages path does not automatically carry over drafts from the old `/resume-craft/` origin. Back up and verify imports before retiring any old browser data.
- Existing workspace JSON formats, application data keys, and historical release archives are preserved for compatibility; do not rename those internal identifiers just to match the new marketing name.
- Full workspace JSON exports are **not encrypted** and can include personally identifying résumé content, so handle them privately.
- The ATS/browser-print PDF route supports selectable text; the alternative quick-download PDF may be rasterized depending on the chosen mode.

Read [workspace transfer](./docs/WORKSPACE_TRANSFER.md), [promotion media](./docs/PROMOTION_MEDIA.md) and the [full changelog](./CHANGELOG.md).

---

# Resume Craft v2.6.0

> **Current project name (2026-10-16): Pagevela.** This is the archived October 14 release record under the former brand. For the current product visit [Pagevela](https://kunlong-luo.github.io/pagevela/) or [GitHub](https://github.com/kunlong-luo/pagevela). The retired `/resume-craft/` Pages path is not redirected. Existing v2.6.0 binaries, artifact filenames, version tags and checksums are unchanged.

**Published:** 2026-10-14 · [GitHub Release](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0) · [Live Demo](https://kunlong-luo.github.io/pagevela/)

## Highlights / 本次更新

- **Chinese-market portrait support / 国内简历证件照**: Optional local PNG, JPEG or WebP upload, 3:4 crop and JPEG downscaling. Displays the portrait in the top-right résumé header for supported Chinese-market layouts; international résumés remain photo-free by default.
- **Complete portable workspace / 完整工作区备份**: Export and restore all resume profiles, drafts and job-description text as a versioned `.json` file, including photos associated with their original profiles. Restores require explicit confirmation and replace destination workspace data.
- **Interrupted-save settings recovery / 刷新恢复**: Recover pending per-profile layout/market changes if a browser reload interrupts the IndexedDB autosave debounce. Recovery markers contain settings only, never resume text or portraits, and are cleared after matching successful writes.
- **Regression coverage**: Chromium, Firefox/WebKit critical flows, cross-origin workspace transfer, multi-profile portrait isolation, PDF download smoke tests and restore/cancel behavior.

## Important privacy and compatibility notes / 隐私与兼容说明

- **No account or cloud migration.** All résumé content remains local to the browser. Moving to another browser, device or hostname requires the **manual** workspace JSON export/import flow.
- The exported workspace file is **not encrypted** and can contain personal details, drafts, job descriptions and photos. Keep it private, and do not delete the original data until the import is verified.
- Existing single-resume JSON backups remain supported independently of the new full-workspace format. The stable internal workspace file version is `resume-craft-workspace-v1`.
- **At the time v2.6.0 was published (2026-10-14)** the public product still used the Resume Craft name and old Pages path. The product was **subsequently renamed to Pagevela**; the current website URL is above. Historical share protocol formats remain compatible, but an old URL pointing at `/resume-craft/` is not redirected.
- The **ATS PDF** print-to-PDF flow uses browser printing for selectable text. The **Quick PDF** direct-download option is rasterized; choose ATS PDF for online job systems.

Read the bilingual [workspace transfer guide](./docs/WORKSPACE_TRANSFER.md) before migrating between browser origins.

---

## Previous Releases

### Resume Craft v2.5.0

## Highlights

- **Independent Product Landing Page (欢迎页)**: Added an accessible, responsive, full-featured product landing page with bilingual support (中 / EN) and dark/light themes.
  - **Hero & Value Proposition**: Clearly showcases the Local-First philosophy (100% browser IndexedDB storage, zero server database, no sign-up, zero tracking).
  - **Interactive Workspace Showcase**: Live split-pane demo highlighting Markdown dual-way sync, modular structured form, Auto Fit single-page optimization, and ATS parsing rule audit.
  - **Six Feature Pillars**: Markdown AST synchronization, smart single-page auto fit, strict ATS checklist, crisp vector PDF export, multi-profile vault, and encrypted share links.
  - **Built-in Templates**: Direct 1-click loading of industry-standard templates (AI Backend, Campus New Grad, Product Operations, US Software Engineer).
- **Universal Dual-Route Architecture**:
  - Seamless navigation between the Landing Page (`/`, `?page=landing`, `#/landing`) and the Editor Workspace (`/editor`, `?page=editor`, `#/editor`).
  - Full browser history synchronization (`popstate`, `hashchange`, `history.pushState`) supporting smooth back/forward navigation and bookmarking.
  - Editor header provides direct return-to-home navigation via the RC brand mark and More Actions menu.
- **First-Time User Onboarding Guarantee**:
  - When entering the editor from the welcome page for the first time, automatically triggers the 3-step beginner tutorial tour.
  - Preserves first-visit state reliably; once completed or dismissed, returning users proceed directly to the workspace without interruptions.
- **Data Protection & Share Continuity**:
  - Existing user resume drafts, multi-profiles, and IndexedDB snapshots remain completely untouched and safe.
  - Direct encrypted share links (`getSharePayloadFromLocation`) continue to open `SharedResumePage` with priority.

## Language Behavior

- The top `中 / EN` control switches the application interface and landing page language.
- `Layout → Resume language` remains dedicated to standard resume content headings (`Summary`, `Skills`, `Work Experience`, etc.).

## Release Status

v2.5.0 is a feature release introducing the independent product landing page, dual-route navigation, and seamless first-visit onboarding activation.

Release: https://github.com/kunlong-luo/pagevela/releases/tag/v2.5.0

---

#### Earlier history

### Resume Craft v2.4.1

- Sanitized all built-in demo contact identities with explicit placeholders.
- Added regression test suite preventing accidental inclusion of realistic third-party contacts.
- Verified US contact line parsing without orphaned punctuation.
- Release: https://github.com/kunlong-luo/pagevela/releases/tag/v2.4.1
