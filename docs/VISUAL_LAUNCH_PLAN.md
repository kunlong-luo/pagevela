# Pagevela — visual launch and first-run activation plan

> **Pagevela is live:** The public brand and repo are at https://kunlong-luo.github.io/pagevela/ and https://github.com/kunlong-luo/pagevela. Historical stage checkmarks below do not establish review/approval of current screenshots, promotional videos, final logo or trademark rights. The old `/resume-craft/` Pages URL is not redirected.
>
> Goal: improve the first impression and first-edit activation **without** blocking the existing editor or making unverified conversion claims.

## Stage 1 — reusable launch assets (this PR)

- [x] Audit existing `public/og-card.svg`, `.github/assets/readme-banner.svg`, `index.html` and the build-time PNG generator.
- [x] Refresh the README banner and SVG design source with one honest product story: **Markdown / form → live preview → ATS checks → PDF**.
- [x] Replace the hard-coded OG PNG with build-time rasterization of the new SVG using `@napi-rs/canvas` (CI / final render still to be verified).
- [ ] Add one genuine redacted editor screenshot from the running product when browser capture is available; never use a fictional AI UI screenshot as product proof.
- [ ] Confirm text contrast, image safe areas, mobile cropping, OG metadata, cache behavior and final build size.

## Stage 2 — lower-friction welcome (this PR)

- [x] Preserve the existing three-step accessible `OnboardingTour`; no new blocking splash page.
- [x] Add a direct, clearly labelled route from the first step to the existing starting choices (sample / guided / blank / import).
- [x] Clarify that the workspace is local-first and sign-up-free. Match the UI language, not the content language.
- [x] Keep the existing resume-overwrite confirmation when reopening onboarding and avoid changing IndexedDB data until an action is explicitly chosen.
- [x] Add E2E coverage for first-visit shortcut; existing E2E covers skip, focus, mobile layout, and replay protection.

## Stage 3 — conditional marketing landing (Landing Page Phase 1 implemented)

- [x] Provide an independent, accessible, responsive React product landing page (`LandingPage.tsx`) with bilingual support (zh / en) and dark/light themes.
- [x] Unify URL routing between Landing Page (`/`, `?page=landing`, `#/landing`) and Editor (`/editor`, `?page=editor`, `#/editor`), preserving browser history (back/forward) and bookmarks.
- [x] Protect existing user data, IndexedDB / LocalStorage persistence, PWA offline operation, and encrypted share links (`getSharePayloadFromLocation`).
- [x] Add prominent entry points to open the editor directly, resume existing drafts, choose templates, or return to the landing page from the editor header.
- [x] Maintain zero-tracking privacy: local-first architecture without external databases or mandatory sign-ups.

## Deliverables & verification

- Designed source files remain editable SVG/React, not AI-generated fake application screenshots.
- Keep the banner and OG preview synchronized; the build now rasterizes `public/og-card.svg` to the actual 1200×630 `public/og-card.png` using `@napi-rs/canvas`.
- `pnpm typecheck`, `pnpm lint`, unit tests, Vite build and protected Chromium/Firefox/WebKit E2E must pass.
- Screenshots/video of real interaction remain a manual capture task; do not represent a drawing as a capture.

Related: [#115](https://github.com/kunlong-luo/pagevela/issues/115), [live app](https://kunlong-luo.github.io/pagevela/).
