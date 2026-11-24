# Changelog

## Unreleased — post-v2.8.3 main development

- **#310 (deployed):** Editor presence and storage-health Hook extraction; `16b11ff` passed [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) and [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196).
- **#311 (merged and deployed):** Repeated Auto Fit no longer loosens compact layout; `e8fdda0` merged after successful [PR CI](https://github.com/kunlong-luo/pagevela/actions/runs/45306184066) and was independently validated in the subsequent main `d0d5486` [full CI](https://github.com/kunlong-luo/pagevela/actions/runs/45309378710) and [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45310525156).
- **#314 (merged and deployed on main `12c7044`):** Empty Quick PDF protection, branded error feedback and injected JPEG failure E2E; [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45312509947) + [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45313889157) success, not retrospectively in v2.8.3 archives.
- **#316 (merged, superseded by #317 fix):** Target-aware measured Auto Fit for 1/2/3 pages landed in `6532c57`; its [main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45320068534) **failed** the old desktop button assertion and [Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45321277493) **skipped**. The initial merge was not a successful production acceptance.
- **#317 + #318 (merged and deployed on main `202bcea`):** Fixed the stale desktop Auto Fit accessible-name E2E, made the required `build-and-test` fail instead of skip when any dependent browser check fails, and reconciled nine bilingual/status documents. [Full new-main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) and [same-SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) **success**; [Release workflow](https://github.com/kunlong-luo/pagevela/actions/runs/45326978990) verified the delivery without rewriting stable v2.8.3 archives. #319 one-click restore remains a separate unmerged candidate. [Engineering acceptance](./docs/ENGINEERING_ACCEPTANCE_20261124.md).
- Still open: measured Auto Fit #312, cross-tab conflict resolution, Android system PDF / installed PWA, private alerts #298, and independent v2.8.3 archive checksum checks.
- No new stable version has been tagged for these changes. [Dated acceptance log](./docs/ENGINEERING_ACCEPTANCE_20261124.md).

## [2.8.3](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.3) — 2026-11-23 (published)

### Reliability and architecture
- Coordinate local draft history and serialized IndexedDB saves; fix split-pane regression without destructive storage changes.
- Extract split-pane, periodic-history and editor keyboard-shortcut responsibilities into tested hooks, preserving existing save, print and Auto Fit behaviors.
- Fix PWA production app-shell precache and add Chromium production offline navigation checks.

### Quality and delivery
- Full Chromium plus parallel Firefox/WebKit tests, PDF validity and draft-retention regressions, type/lint/i18n/performance gates.
- Protected CI → identical-SHA Pages deploy → Release pipeline, preserving old tags and assets.
- Security Inventory registry audit and refreshed bilingual docs, launch guidance, 84/100 engineering assessment and release acceptance evidence.

### Pending evidence
- v2.8.3 was published from main `501ca26` after successful same-SHA CI, Pages and Release; ZIP/TAR and SHA256SUMS are listed in the Release. Independent download/extraction and checksum comparison remain unrecorded.
- Other Android browsers/system PDF/PWA, GitHub private Dependabot alerts and trademark/platform work remain separately tracked.
- [Acceptance checklist](./docs/V2_8_3_RELEASE_ACCEPTANCE_20261123.md) · [Full release notes](./RELEASE_NOTES.md)


## [2.8.2](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.2) — 2026-10-25

### Pagevela naming and compatibility
- Unified new npm package, release archives, media captures, issue templates and application event names under Pagevela.
- Corrected the official Pages path used by analytics and support prompts.
- New Pagevela workspace backups can still restore historical portable backups.
- New encrypted shares use Pagevela authenticated metadata while preserving decryption of existing v2/v3 share links.
- Preserved historic IndexedDB, cross-tab locking and older release archives rather than breaking saved data or existing downloads.
- Required checks remain full Chromium, Firefox/WebKit, code quality and same-SHA Pages deployment.

### Limits
- This is a brand and compatibility release, not a declaration that every Android browser or device flow passed.
- [Full notes](./RELEASE_NOTES.md) · [Open Android matrix](https://github.com/kunlong-luo/pagevela/issues/262)


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
