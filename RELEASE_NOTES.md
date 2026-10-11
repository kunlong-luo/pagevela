# Resume Craft v2.5.0

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

# Previous Releases

### Resume Craft v2.4.1

- Sanitized all built-in demo contact identities with explicit placeholders.
- Added regression test suite preventing accidental inclusion of realistic third-party contacts.
- Verified US contact line parsing without orphaned punctuation.
- Release: https://github.com/kunlong-luo/resume-craft/releases/tag/v2.4.1
