# Auto Fit layout restore / 自动适配前排版恢复

> **2026-11-24 development candidate — NOT RELEASED or deployed.** This is an independent change for [issue #312](https://github.com/kunlong-luo/pagevela/issues/312), separate from the merged CI gate repair #317 and the documentation-only PR #318.

## Scope / 实现范围

- Capture the **active profile's complete pre-fit settings** only when a visible-preview measured Auto Fit run actually changes a layout value. Keep the snapshot in transient React memory; do not add a separate localStorage, IndexedDB, analytics or share-link record.
- Show a bilingual, branded **Restore layout before Auto Fit / 恢复自动适配前排版** button in the existing Height Guard after fitting ends. The same page-details UI supports mobile preview. No native alert, confirm, select or tooltip.
- Restore in one operation via the established `useResumeStore.updateSettings` profile-settings journal, preserving Markdown and the selected 1/2/3-page target. Clear the one-time action before restoring, and never replay it after a reload.
- Revoke the restore if Markdown, active profile, selected target, manual layout/settings, preview edit permissions **or a newly started Auto Fit run** change. Ineligible shared/overridden previews cannot write into local local-first profiles.
- Hidden mobile form previews still use one safe adjustment; do not pretend they performed the measurement-driven sequence.

## Required tests / 验收

- Pure Vitest policy covers eligible snapshot, no-change/no-snapshot, manual layout edits, profile changes, document changes, target changes and disabled/shared contexts.
- Fictional-data Chromium E2E covers measured 2-page target, a changed setting, restoring the exact previous layout, unchanged Markdown, retained target and persistence after reload, with the one-time restore action absent.
- Must pass latest PR quality, full Chromium, Firefox/WebKit critical and **executed** `build-and-test`. After merge, independently verify the new main SHA full browser shard matrix and **same-SHA Pages** before claiming production acceptance.
- A4/Letter × Chinese/English × multiple templates, phone sizes and real Android OEM printing/PWA are separate unverified matrix items. Printed PDF pagination may differ from browser estimates. The v2.8.3 release assets are never retroactively changed.

[Measured Auto Fit guide](./MEASURED_AUTO_FIT_20261124.md) · [Project status](./PROJECT_STATUS.md) · [Issue #312](https://github.com/kunlong-luo/pagevela/issues/312)
