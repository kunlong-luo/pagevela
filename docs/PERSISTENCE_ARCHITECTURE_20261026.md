# Pagevela persistence architecture / 2026-10-26

## Problem and change

Editor shortcuts previously called `resumeRepository.saveSnapshot` directly while the debounced autosave coordinator used its own serialized write queue and Web Locks. These two paths could race and commit an older snapshot after a newer one.

Both immediate Ctrl/Cmd+S and debounced saves now enter `activeResumePersistence` through `saveNow` or `schedule`. The coordinator has one FIFO promise chain and one existing browser write-lock name. An immediate write cancels its pending timer and supersedes the previously scheduled snapshot; writes already in flight complete before it. Profile-settings write-ahead entries are acknowledged **only after** successful IndexedDB writes.

Existing database / write-lock / BroadcastChannel names are declared in `src/lib/resume-storage-contract.ts` as backward-compatible data protocol identifiers, **not public product branding**. This refactor does not rename the IndexedDB, migrate any user data, or change service worker scope.

Unit tests inject a persistence writer to cover coalescing, manual-save FIFO ordering, queued autosave, failure recovery, and legacy identifier stability without touching real resumes.

## Architecture boundaries

1. `src/main.tsx` bootstraps IndexedDB and creates the Zustand store only after reading its persisted snapshot.
2. `src/store/useResumeStore.ts` owns in-memory editable state, derived settings and actions.
3. `src/lib/resume-persistence.ts` is the **single ordered writer for active markdown/profiles/JD snapshots**; `src/lib/resume-repository.ts` performs Dexie transactions. Do not bypass the coordinator when saving the active snapshot.
4. `src/lib/pending-profile-settings.ts` handles the small synchronous settings journal. It is not a second source of truth for markdown or photos.
5. Separate draft-history operations still use repository methods; these are a future concurrency-review boundary, not covered by active-snapshot ordering.
6. Workspace backup import/restore must flush pending active writes before replacing data.

## P1 architecture extraction (merged as PR #283, 2026-10-26)

- Split-pane pointer geometry, RAF coalescing, event listener cleanup, last-pointer persistence and double-click reset are isolated in `useResizableSplitPane`. **2026-11-22 follow-up:** the split-handle E2E double-click reset was failing across browsers because the drag-disabled tooltip could replace its trigger DOM during a click sequence; see [current status](./PROJECT_STATUS.md). Do not mark P1 full regression acceptance passed until main CI and same-SHA Pages succeed.
- The 3-minute historical draft rotation is isolated in `usePeriodicDraftHistory` with a pure, tested retention policy (five automatic drafts plus existing manual drafts) and a per-workspace in-flight guard.
- **Historical snapshot as of 2026-10-26:** draft history then shared IndexedDB with manually edited drafts; the subsequent #293 atomic transaction and FIFO coordination addressed this writer-race risk on 2026-11-22, as documented below.
- **Historical snapshot as of 2026-10-26:** the component then retained keyboard shortcuts, storage notifications and presence announcements for follow-up PRs. These extractions have since been delivered (#307 and #310); see the dated addendum below. No native browser dropdown/confirmation widgets were introduced.

## Follow-up review (not implemented here)

- Isolate autosave history, shortcuts and window-event handling from `EditorWorkspace` into composable hooks.
- Split `Editor.tsx` (921 lines) and `useResumeStore.ts` (~1043 lines) by editor modes, state domain and side effect boundary, preserving selectors and dynamic imports.
- Evaluate a *non-destructive* IndexedDB brand rename only with a cross-version rollback design, data-copy verification and real browser upgrade tests.
- Keep the no-native-popup/select UI policy, route lazy loading, full Chromium/Firefox/WebKit gates, PDF text integrity and mobile layout acceptance unchanged.

## Acceptance

Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the required Chromium and cross-browser suites. This change must not alter the already published v2.8.2 tag or downloadable assets.

## 2026-11-22: draft history atomicity

- `resume-draft-persistence.ts` shares one FIFO across manual create/rename/delete, periodic snapshots, export reads, and the explicitly confirmed portable-workspace replacement barrier. UI shows a success message only **after** the repository mutation commits.
- `resumeRepository.mutateDrafts` reads and transforms the current list **inside the same Dexie read/write transaction**, preventing stale read/replace overwrites even if `navigator.locks` is unsupported. The coordinator additionally acquires the existing write lock when available, shared with active resumes and full workspace restore.
- The timed rotation uses fresh current editor state **when its queued update executes**, so a timer queued during workspace restoration cannot replay old data after the import.
- Tests cover overlapping writes, delete/rename vs timer, restore barriers, ordered reads, no-op handling and recovery after failed writes. Existing IndexedDB names, schema, portable backups and Web Lock names are preserved.

## 2026-11-24: Editor-side lifecycle extraction fully verified

- [PR #307](https://github.com/kunlong-luo/pagevela/pull/307) extracted global keyboard shortcuts into `src/hooks/useEditorKeyboardShortcuts.ts`, preserving Ctrl/Cmd+S, Ctrl/Cmd+P, Ctrl/Cmd+Shift+F and autosave coordinator semantics; its earlier same-SHA main CI/Pages evidence remains documented in [project status](./PROJECT_STATUS.md).
- [PR #310](https://github.com/kunlong-luo/pagevela/pull/310) extracted `BroadcastChannel` presence and storage-health toast effects into `src/hooks/useEditorSafetyNotifications.ts`, preserving existing channel and `STORAGE_HEALTH_EVENT` identifiers. The merged commit `16b11ff2a6e713ab0567c6548406252c659dd5ff` has [full main CI](https://github.com/kunlong-luo/pagevela/actions/runs/45305029314) including Chromium, Firefox/WebKit and final `build-and-test` plus [same SHA Pages](https://github.com/kunlong-luo/pagevela/actions/runs/45307035196), both **success**. See [hook behavior contract](./EDITOR_SAFETY_NOTIFICATIONS_20261124.md).
- This does **not** implement two-tab conflict resolution or guarantee lossless merge of simultaneously edited resumes: the presence channel warns rather than resolving writes. Domain isolation in the ~1,043-line Zustand store, measured Auto Fit, parser/export modularity and full Android real-device QA also remain open.
- The currently published `v2.8.3` ZIP/TAR archives belong to tag SHA `501ca26`; later main commits are deployed, not automatically repackaged. A new version requires a separate release procedure.
