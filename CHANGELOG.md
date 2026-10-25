# Changelog

## [2.8.1](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.1) — 2026-10-25

### Reliability and QA
- Strengthened direct Quick PDF download E2E: parse every PDF page, require valid geometry and drawing operations, and re-open the browser to verify the saved resume remains unchanged.
- Recorded the owner's real Android WeChat acceptance as **owner-reported PASS**, not Playwright simulation, without inventing device versions or individual PDF/PWA results.
- Documented the supported-device matrix, migration decisions and outstanding legal trademark / offsite listing work in separate tracked reports.
- Preserved browser-local storage compatibility, historical archive filenames and strict CI-to-Pages deployment gates.

### Scope
- No schema/API breaking changes, no new native browser UI components and no inferred global Android certification.
- [Release notes](./RELEASE_NOTES.md) · [Android acceptance](./docs/V2_8_1_ANDROID_RELEASE_ACCEPTANCE.md)


## [2.8.0](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.0) — 2026-10-24

### Product and mobile
- Faster welcome-page rendering before the editor initializes; branded QR scan action beside the Start button.
- Clearer mobile Form / Code / Preview navigation, consolidated quick actions, 44px touch targets, and reachable tool controls.
- Safer mobile preview bottom clearance, keyboard-focused inputs, bottom-sheet menus and tablet viewport handling.
- Tighter bilingual labels, global language control near Theme, unified branded menus/scrollbars and tests prohibiting visible native browser widgets.
- Expanded A4 PDF, resume-portrait, mobile and i18n regression coverage.

### Engineering and release
- Full Chromium, Firefox (2 shards), WebKit (2 shards), headed Firefox check, and a protected build-and-test aggregate.
- Automatic Pages deployment only after successful main-push CI on the same validated commit SHA.
- Stable React/React DOM 19.3.1, Motion 14.4, Lucide 1.59, ESLint 10.13 and Vitest 5.0.5.
- GitHub Release titles use **Pagevela**, while archive filenames use `pagevela-VERSION` starting with the next branded packaging update; existing historical release assets remain available.

### Limits
- ATS diagnostics are guidance, not a hiring-system acceptance guarantee. Workspace backups are unencrypted; moving browsers/devices requires manual export/import.
- Automated responsive and browser tests do not establish complete coverage on physical Android handsets.
- [Detailed release notes](./RELEASE_NOTES.md) · [Compare v2.7.0…v2.8.0](https://github.com/kunlong-luo/pagevela/compare/v2.7.0...v2.8.0)


## [2.7.0](https://github.com/kunlong-luo/pagevela/releases/tag/v2.7.0) — 2026-10-17

### Added and improved
- Renamed the public project and experience to **Pagevela（页帆）**, keeping legacy resume storage and sharing identifiers compatible.
- Simplified first-run welcome → template selection → editing; avoid duplicate onboarding.
- Made the primary mobile ATS PDF export action more accessible.
- Captured genuine welcome-page and editor screenshots in Chinese and English.
- Updated dependencies after automated unit, quality and browser test checks.

### Migration notes
- Official site: https://kunlong-luo.github.io/pagevela/
- Source repository: https://github.com/kunlong-luo/pagevela
- Old `/resume-craft/` Pages URLs are **not redirected**.
- Browser-local resumes do **not** automatically transfer between different website origins; follow [workspace transfer](./docs/WORKSPACE_TRANSFER.md).

## [2.6.0](https://github.com/kunlong-luo/pagevela/releases/tag/v2.6.0) — 2026-10-14

- Added optional Chinese-market 3:4 portrait handling.
- Added complete local workspace JSON import/export with explicit overwrite confirmation.
- Improved interrupted-save settings recovery and regression coverage.
- Originally released under the **Resume Craft** name; historical binaries and archives are retained unchanged.

See [detailed release notes](./RELEASE_NOTES.md) for compatibility and privacy details.
