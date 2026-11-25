# Changelog

## Unreleased

- **2026-11-25 background save lifecycle [PR #339](https://github.com/kunlong-luo/pagevela/pull/339) candidate:** Flush the existing IndexedDB FIFO as soon as the page becomes hidden, with pagehide fallback; remove beforeunload to preserve BFCache behavior. Unit tests check successful/failed async commits and listener cleanup. This is **best effort**, not an absolute guarantee after OS termination. [Design and acceptance](./docs/BACKGROUND_SAVE_LIFECYCLE_20261125.md).
- **2026-11-25 resume content integrity:** [#334](https://github.com/kunlong-luo/pagevela/pull/334) merged as `07368d64` after [full PR CI #45587102689](https://github.com/kunlong-luo/pagevela/actions/runs/45587102689). Guarded resume replacement, import recovery drafts, form/Markdown roundtrip and photo safety. Main [CI #45588914443](https://github.com/kunlong-luo/pagevela/actions/runs/45588914443) and [same-SHA Pages #45590609387](https://github.com/kunlong-luo/pagevela/actions/runs/45590609387) succeeded; not part of published v2.8.4. [Integrity contract](./docs/RESUME_CONTENT_INTEGRITY_20261125.md).
- **2026-11-25 full browser-data reset (deployed main `bb347487`; not part of v2.8.4 release):** Unify Runtime ErrorBoundary and Help/Privacy reset actions; stop active resume and draft writes before deleting IndexedDB and Pagevela-owned localStorage; explicitly report partial deletion failures instead of pretending the reset succeeded. Add unit and browser E2E coverage. See [complete reset contract](./docs/FULL_LOCAL_DATA_RESET_20261125.md); [main CI #45591475788](https://github.com/kunlong-luo/pagevela/actions/runs/45591475788) and [same-SHA Pages #45593665011](https://github.com/kunlong-luo/pagevela/actions/runs/45593665011) succeeded.

- **2026-11-25 IndexedDB save acknowledgement (merged; verified on main `0fea9fc`):** Replace timer-driven “Saved” indicator with revision-aware acknowledgements after the latest actual IndexedDB commit; handle stale in-flight writes and failures, replay progress for the lazy editor, suppress outdated Ctrl/Cmd+S success toasts, and add latency/failure regression tests. [Acceptance and remaining risks](./docs/INDEXEDDB_SAVE_ACKNOWLEDGEMENT_20261125.md). No version bump or new published artifact yet.

- **2026-11-25 release integrity verification (merged and independently checked):** Add a read-only workflow that downloads the latest/specified published Release, recomputes ZIP/TAR.GZ SHA-256 against the manifest, checks archive stream safety and identical files, and saves an audit report. Add synthetic negative unit tests to CI and verify archives before future tag creation. See [release archive integrity](./docs/RELEASE_ARCHIVE_INTEGRITY_20261125.md). Independent v2.8.4 archive download/checksum verification passed in [workflow #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817); related documentation is tracked separately.

## [2.8.4](https://github.com/kunlong-luo/pagevela/releases/tag/v2.8.4) — 2026-11-24

> **2026-11-24 正式发布已验收：** tag `ea2a65b`；[完整 main CI #45387428722](https://github.com/kunlong-luo/pagevela/actions/runs/45387428722)、[同 SHA Pages #45388989138](https://github.com/kunlong-luo/pagevela/actions/runs/45388989138) 与 [Release #45389125140](https://github.com/kunlong-luo/pagevela/actions/runs/45389125140) 均成功。归档已由 [独立验收 #45559458817](https://github.com/kunlong-luo/pagevela/actions/runs/45559458817) 下载与复算。

> **Previous independently deployed pre-release main:** `a8ec3ae15a819c3465a039cf11a659e0ca59afc8` — [full main CI #45372820105](https://github.com/kunlong-luo/pagevela/actions/runs/45372820105) and [same-SHA Pages #45374647806](https://github.com/kunlong-luo/pagevela/actions/runs/45374647806) **success**. The [current assessment is 88/100](./docs/ASSESSMENT.md). This was the independently deployed **pre-v2.8.4 source baseline**; the new v2.8.4 tag/assets must be verified against their own main CI/Pages/Release gates.

- **Data safety:** [#323](https://github.com/kunlong-luo/pagevela/pull/323) rejects stale-tab active resume overwrites in one Dexie transaction and preserves recoverable manual drafts; the persistent bilingual warning no longer obstructs the editor. [#325](https://github.com/kunlong-luo/pagevela/pull/325) prevents same-millisecond profile primary-key collisions with UUID and a monotonic fallback. Neither changes existing stored IDs, the legacy database/channel/lock contract or the published backup format. Old-version already-open tabs and complete photo/metadata conflict recovery remain outside scope.
- **Architecture and user experience:** [#322](https://github.com/kunlong-luo/pagevela/pull/322) isolated persisted-settings sanitization with focused unit tests; [#321](https://github.com/kunlong-luo/pagevela/pull/321) added synthetic A4/US Letter, Chinese/English, 1/3-page Auto Fit coverage and corrected the wording to Estimated Fit; [#319](https://github.com/kunlong-luo/pagevela/pull/319) delivered pre-fit layout restore. These do not certify actual Android Print/Save-as-PDF pagination.
- **Release reliability:** [#317](https://github.com/kunlong-luo/pagevela/pull/317) ensured `build-and-test` fails when dependent browser checks fail, rather than allowing skipped checks. [#324](https://github.com/kunlong-luo/pagevela/pull/324) synchronized dated evidence and historical scoring. Older failed PR runs remain available in GitHub Actions, not reproduced as obsolete `pending` claims in the root README.
- **Docs consolidation:** One bilingual README pair, one [docs index](./docs/README.md), one [current assessment](./docs/ASSESSMENT.md), one [current status](./docs/PROJECT_STATUS.md) and a separate [CI/Pages ledger](./docs/ENGINEERING_ACCEPTANCE_20261124.md); old version specifications moved under `docs/history/versions/`. The unshipped former-site redirect experiment was removed per the owner's no-redirect decision. Local links are checked by `pnpm run docs:check`.



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
