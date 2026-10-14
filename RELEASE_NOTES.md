# Resume Craft v2.6.0

## Highlights / 本次更新

- **Chinese-market portrait support / 国内简历证件照**: Optional local PNG, JPEG or WebP upload, 3:4 crop and JPEG downscaling. Displays the portrait in the top-right résumé header for supported Chinese-market layouts; international résumés remain photo-free by default.
- **Complete portable workspace / 完整工作区备份**: Export and restore all resume profiles, drafts and job-description text as a versioned `.json` file, including photos associated with their original profiles. Restores require explicit confirmation and replace destination workspace data.
- **Interrupted-save settings recovery / 刷新恢复**: Recover pending per-profile layout/market changes if a browser reload interrupts the IndexedDB autosave debounce. Recovery markers contain settings only, never resume text or portraits, and are cleared after matching successful writes.
- **Regression coverage**: Chromium, Firefox/WebKit critical flows, cross-origin workspace transfer, multi-profile portrait isolation, PDF download smoke tests and restore/cancel behavior.

## Important privacy and compatibility notes / 隐私与兼容说明

- **No account or cloud migration.** All résumé content remains local to the browser. Moving to another browser, device or hostname requires the **manual** workspace JSON export/import flow.
- The exported workspace file is **not encrypted** and can contain personal details, drafts, job descriptions and photos. Keep it private, and do not delete the original data until the import is verified.
- Existing single-resume JSON backups remain supported independently of the new full-workspace format. The stable internal workspace file version is `resume-craft-workspace-v1`.
- Existing GitHub Pages URL, product name, and legacy share-link formats remain unchanged. This release **does not change the public domain or brand**.
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

Release: https://github.com/kunlong-luo/resume-craft/releases/tag/v2.5.0

---

#### Earlier history

### Resume Craft v2.4.1

- Sanitized all built-in demo contact identities with explicit placeholders.
- Added regression test suite preventing accidental inclusion of realistic third-party contacts.
- Verified US contact line parsing without orphaned punctuation.
- Release: https://github.com/kunlong-luo/resume-craft/releases/tag/v2.4.1
