# Resume settings sanitizer boundary / 简历设置清洗独立模块

> 2026-11-24 — **development candidate**, not a deployed feature, release or verified engineering score increase. Related: [architecture #282](https://github.com/kunlong-luo/pagevela/issues/282). See the [project status](./PROJECT_STATUS.md) and CI for exact deployment facts.

## Purpose / 目的

The Zustand `src/store/useResumeStore.ts` file previously mixed persisted-profile settings normalization with UI actions, profile management and bootstrap. The extracted pure `src/lib/resume-settings-sanitizer.ts` owns that **same existing normalization policy** without introducing a new storage service or changing any profile IDs, IndexedDB names, JSON data formats, settings journal, global theme preference or share-link crypto identifiers.

The store still calls `sanitizeSettings` during initial settings load, existing profile hydration, profile creation and imports. This is a behavior-preserving file boundary rather than a rewrite of the profile/store model.

## Regression / 新增单元验收

`src/tests/resume-settings-sanitizer.test.ts` exercises:

- Defaults on missing or malformed settings, including non-mutating behavior.
- Valid visual overrides, while stripping deprecated `themeMode` from legacy per-profile settings so the **global UI theme** is not switched by imported profiles.
- Invalid theme, typography, layout, color, language and boolean values falling back to previously defined safe settings.
- Numeric size/spacing bounds and `NaN` fallback.
- US Letter and Chinese A4/date-style market defaults for corrupted records, while preserving an **explicit** paper-size choice across markets.

## Guardrails / 边界

- The pure extraction must not alter semantics or unexpectedly rewrite old drafts, profile data, PDF output or localStorage keys.
- The browser bootstrap still migrates and reads IndexedDB **before importing Zustand**. The production application still persists core content through `activeResumePersistence` and its established lock/journal.
- **Not a cross-tab conflict fix.** The existing lock serializes writes but has no compare-and-swap revision protection. A separate design, explicit conflict state and two-tab E2E recovery proof remain required for [#282](https://github.com/kunlong-luo/pagevela/issues/282).
- PR quality, TypeScript, unit tests, full Chromium, Firefox/WebKit and protected `build-and-test` must all pass on the **latest PR head**. After merge, verify the **new main SHA** complete CI and same-SHA Pages independently.
- Do not mark new points in [2026-11-24 assessment](./ASSESSMENT_20261124.md) from this candidate until its production gate is recorded. Stable v2.8.3 ZIP/TAR.GZ remains unchanged.

## Follow-up / 下一步

Move broader profile operations into isolated pure domain functions with strong create/duplicate/delete/import tests. For data safety, design revisioned cross-tab conflict detection with a recoverable copy before changing existing writers; do not silently overwrite existing IndexedDB state.

[Project status](./PROJECT_STATUS.md) · [Persistence architecture](./PERSISTENCE_ARCHITECTURE_20261026.md) · [Architecture roadmap #282](https://github.com/kunlong-luo/pagevela/issues/282)
