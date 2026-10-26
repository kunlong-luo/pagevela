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

## P1 architecture extraction (PR under review, 2026-10-26)

- Split-pane pointer geometry, RAF coalescing, event listener cleanup, last-pointer persistence and double-click reset are isolated in `useResizableSplitPane`.
- The 3-minute historical draft rotation is isolated in `usePeriodicDraftHistory` with a pure, tested retention policy (five automatic drafts plus existing manual drafts) and a per-workspace in-flight guard.
- The current draft-history replacement still shares IndexedDB with manually edited draft history; a future issue should serialize all draft-history writers, not just the active resume snapshot.
- The component still retains keyboard shortcuts, storage notifications and presence announcements for a subsequent scoped PR. No native browser dropdown/confirmation widgets were introduced.

## Follow-up review (not implemented here)

- Isolate autosave history, shortcuts and window-event handling from `EditorWorkspace` into composable hooks.
- Split `Editor.tsx` (921 lines) and `useResumeStore.ts` (~1043 lines) by editor modes, state domain and side effect boundary, preserving selectors and dynamic imports.
- Evaluate a *non-destructive* IndexedDB brand rename only with a cross-version rollback design, data-copy verification and real browser upgrade tests.
- Keep the no-native-popup/select UI policy, route lazy loading, full Chromium/Firefox/WebKit gates, PDF text integrity and mobile layout acceptance unchanged.

## Acceptance

Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the required Chromium and cross-browser suites. This change must not alter the already published v2.8.2 tag or downloadable assets.
