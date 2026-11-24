# Auto Fit layout restore / 自动适配前排版恢复

> **2026-11-24 merged into main `db8919f` — independent production deployment acceptance pending, NOT a new stable release.** This is an independent change for [issue #312](https://github.com/kunlong-luo/pagevela/issues/312), separate from the merged CI gate repair #317 and the documentation-only PR #318.

### 2026-11-24 已验证主分支交付 / Verified main delivery

- `main` `202bcead397ef9c3ef77d6f83f7ee715a6dfd4ee`：[完整 CI #45324490754](https://github.com/kunlong-luo/pagevela/actions/runs/45324490754) **success**，覆盖 quality、Chromium 全量、Firefox 2/2、WebKit 2/2、跨浏览器汇总以及实际执行的 protected `build-and-test`；[同 SHA Pages #45326859873](https://github.com/kunlong-luo/pagevela/actions/runs/45326859873) 的 **build/deploy 均 success**。
- [Release 工作流 #45326978990](https://github.com/kunlong-luo/pagevela/actions/runs/45326978990) **success**，但复用发布门禁并没有创建新包：最新正式 Release 仍为 **v2.8.3**，tag `501ca26`，ZIP/TAR.GZ 不追溯包含 `202bcea` 之后的功能。
- [#317](https://github.com/kunlong-luo/pagevela/pull/317) 的 CI 防跳过保护和 [#318](https://github.com/kunlong-luo/pagevela/pull/318) 的九份文档已随 `202bcea` 取得线上同 SHA 验收。此前 `6532c57` 的 CI **failure** 与 Pages **skipped** 是另一个提交的历史记录，不能覆盖。
- [#319](https://github.com/kunlong-luo/pagevela/pull/319) Auto Fit 一键恢复：最新 PR 头 `f0e94a9` 的[完整 CI #45327296976](https://github.com/kunlong-luo/pagevela/actions/runs/45327296976) **success**（quality、Chromium、Firefox/WebKit、实际执行的 `build-and-test`），且已通过 squash 合并为 `main` **`db8919f49d4866796809bda5f2e3fe3cc4a2cdc8`**。但 [新 main CI #45334379703](https://github.com/kunlong-luo/pagevela/actions/runs/45334379703) 于 2026-11-24 05:35 UTC 触发；记录本快照时仍在执行，**该 SHA 的同 SHA Pages 尚未验收**，不可写成已上线。正式归档仍是 v2.8.3，[#312](https://github.com/kunlong-luo/pagevela/issues/312) 继续开放；评分维持 **84/100**。

## Scope / 实现范围

- Capture the **active profile's complete pre-fit settings** only when a visible-preview measured Auto Fit run actually changes a layout value. Keep the snapshot in transient React memory; do not add a separate localStorage, IndexedDB, analytics or share-link record.
- Show a bilingual, branded **Restore layout before Auto Fit / 恢复自动适配前排版** button in the existing Height Guard after fitting ends. The same page-details UI supports mobile preview. No native alert, confirm, select or tooltip.
- Restore in one operation via the established `useResumeStore.updateSettings` profile-settings journal, preserving Markdown and the selected 1/2/3-page target. **Explicitly ignore the deprecated per-profile `themeMode` field** from legacy settings, because the app theme is global and must not change during layout restoration. Clear the one-time action before restoring, and never replay it after a reload.
- Revoke the restore if Markdown, active profile, selected target, manual layout/settings, preview edit permissions **or a newly started Auto Fit run** change. Ineligible shared/overridden previews cannot write into local local-first profiles.
- Hidden mobile form previews still use one safe adjustment; do not pretend they performed the measurement-driven sequence.

## Required tests / 验收

- Pure Vitest policy covers eligible snapshot, no-change/no-snapshot, manual layout edits, profile changes, document changes, target changes, disabled/shared contexts and legacy global-theme isolation.
- Fictional-data Chromium E2E covers measured 2-page target, a changed setting, restoring the exact previous layout, unchanged Markdown, retained target and persistence after reload, with the one-time restore action absent.
- **2026-11-24 first full Chromium run:** [CI #45325027690](https://github.com/kunlong-luo/pagevela/actions/runs/45325027690) recorded **223 passed / 1 failed**. The single new E2E failed because its baseline read `resume-settings` **before any profile-settings write**, producing `undefined` for margin/font/spacing; after restoration those fields correctly held the default `standard / standard / 1 / 1.6` values. Seed these four fields explicitly **before page navigation**, assert the materialized baseline, and rerun the full CI. This is a **test fixture failure**, not evidence of broken production layout restore. **Do not mark the hotfix as accepted before its new exact-head CI succeeds.**
- **Latest PR-head gate passed:** [CI #45327296976](https://github.com/kunlong-luo/pagevela/actions/runs/45327296976) succeeded with quality, full Chromium (including corrected restoration E2E), Firefox/WebKit critical and an **executed** protected `build-and-test`. Merged as `db8919f`; **new-main CI/Pages independent acceptance remains pending**. Never substitute PR success for deployment success.
- A4/Letter × Chinese/English × multiple templates, phone sizes and real Android OEM printing/PWA are separate unverified matrix items. Printed PDF pagination may differ from browser estimates. The v2.8.3 release assets are never retroactively changed.

[Measured Auto Fit guide](./MEASURED_AUTO_FIT_20261124.md) · [Project status](./PROJECT_STATUS.md) · [Issue #312](https://github.com/kunlong-luo/pagevela/issues/312)
