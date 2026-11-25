import type { ResumeProfile } from '../types';
import { persistActiveResumeIfUnchanged } from './resume-repository';
import type { ActiveResumeBaseline } from './resume-active-conflict';
import { STORAGE_HEALTH_EVENT } from './storage';
import { acknowledgeSavedProfileSettings, discardConflictingProfileSettings } from './pending-profile-settings';
import { RESUME_DB_WRITE_LOCK_NAME } from './resume-storage-contract';

export interface PersistedResumeSnapshot {
  markdown: string;
  profiles: ResumeProfile[];
  jdText: string;
}

/** Compare with live store state before announcing a manual-save success toast. */
export function isCommittedSnapshotCurrent(
  saved: PersistedResumeSnapshot,
  current: PersistedResumeSnapshot,
): boolean {
  return saved.markdown === current.markdown &&
    saved.profiles === current.profiles &&
    saved.jdText === current.jdText;
}

/** 'saved' is emitted only after the latest requested IndexedDB write commits. */
export type ResumeSaveProgress = 'idle' | 'saving' | 'saved' | 'failed';

/**
 * The saved document in another tab is authoritative on a conflict. The local
 * text/layout is preserved as manual recovery drafts, never silently merged.
 */
export class ActiveResumeWriteConflictError extends Error {
  constructor() {
    super('active-resume-conflict');
    this.name = 'ActiveResumeWriteConflictError';
  }
}

const DEFAULT_DEBOUNCE_MS = 350;

/** Injectable persistence side effects make sequencing testable without a live IndexedDB. */
export interface ResumePersistenceDependencies {
  writeSnapshot?: (snapshot: PersistedResumeSnapshot) => Promise<void>;
  acknowledgeProfiles?: (profiles: ResumeProfile[]) => void;
}

/**
 * Coalesces rapid editor updates into a single asynchronous IndexedDB write.
 * Core resume data is persisted in IndexedDB; localStorage is reserved for lightweight UI/bootstrap preferences.
 */
export function createResumePersistenceCoordinator(
  debounceMs = DEFAULT_DEBOUNCE_MS,
  dependencies: ResumePersistenceDependencies = {},
) {
  let baseline: ActiveResumeBaseline | null = null;

  // Keep injected writers for FIFO unit tests. Production uses an atomic
  // read/compare/write under the existing shared lock, also safe without it.
  const writeSnapshot = dependencies.writeSnapshot ?? (async (snapshot: PersistedResumeSnapshot) => {
    if (baseline === null) {
      // Failed bootstrap must not overwrite unknown IndexedDB contents.
      throw new Error('missing-resume-persistence-baseline');
    }
    const recoveryId = `draft_conflict_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 11)}`;
    const result = await persistActiveResumeIfUnchanged(snapshot, baseline, recoveryId);
    if (result === 'conflict') {
      // The stale settings have a durable Drafts copy. Never replay their
      // small localStorage journal after a reload and defeat the DB guard.
      discardConflictingProfileSettings(snapshot.profiles);
      throw new ActiveResumeWriteConflictError();
    }
    baseline = {
      markdown: snapshot.markdown,
      profiles: snapshot.profiles,
      jdText: snapshot.jdText,
    };
  });
  const acknowledgeProfiles = dependencies.acknowledgeProfiles ?? acknowledgeSavedProfileSettings;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: { snapshot: PersistedResumeSnapshot; revision: number } | null = null;
  let writeChain: Promise<void> = Promise.resolve();
  let hasWriteFailure = false;
  let latestRevision = 0;
  let progress: ResumeSaveProgress = 'idle';
  const progressListeners = new Set<(status: ResumeSaveProgress) => void>();

  const notifyProgress = (status: ResumeSaveProgress) => {
    progress = status;
    for (const listener of progressListeners) listener(status);
  };

  /** A late-mounting editor receives the last known status immediately. */
  const subscribeProgress = (listener: (status: ResumeSaveProgress) => void) => {
    progressListeners.add(listener);
    listener(progress);
    return () => { progressListeners.delete(listener); };
  };

  const beginRevision = () => {
    const revision = ++latestRevision;
    notifyProgress('saving');
    return revision;
  };

  const emitHealth = (status: 'error' | 'recovered', error?: unknown) => {
    if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') return;
    const errorName =
      error && typeof error === 'object' && 'name' in error
        ? String((error as { name?: unknown }).name ?? '')
        : '';
    window.dispatchEvent(new CustomEvent(STORAGE_HEALTH_EVENT, {
      detail: {
        status,
        operation: 'set',
        key: errorName === 'ActiveResumeWriteConflictError' ? 'indexeddb-conflict' : 'indexeddb',
        quotaExceeded: errorName === 'QuotaExceededError',
      },
    }));
  };

  /**
   * Only call after a verified bootstrap read or an explicit, successfully
   * committed workspace replacement, while the write queue is drained.
   */
  const setBaseline = (value: ActiveResumeBaseline) => {
    baseline = {
      markdown: value.markdown,
      profiles: value.profiles,
      jdText: value.jdText,
    };
    if (hasWriteFailure) emitHealth('recovered');
    hasWriteFailure = false;
  };

  const persist = (snapshot: PersistedResumeSnapshot, revision: number) => {
    // A failed write must not poison every later autosave attempt.
    writeChain = writeChain
      .catch(() => undefined)
      .then(async () => {
        try {
          const commitSnapshot = async () => {
            await writeSnapshot(snapshot);
            // Clear only journal entries included in this committed snapshot.
            acknowledgeProfiles(snapshot.profiles);
          };

          if (typeof navigator !== 'undefined' && navigator.locks?.request) {
            await navigator.locks.request(RESUME_DB_WRITE_LOCK_NAME, commitSnapshot);
          } else {
            await commitSnapshot();
          }

          if (hasWriteFailure) emitHealth('recovered');
          hasWriteFailure = false;
          // Never mark a newer scheduled/uncommitted edit as already saved.
          if (revision === latestRevision) notifyProgress('saved');
        } catch (error) {
          if (!hasWriteFailure) emitHealth('error', error);
          hasWriteFailure = true;
          if (revision === latestRevision) notifyProgress('failed');
          throw error;
        }
      });
    return writeChain;
  };

  /**
   * Manual save joins the same FIFO write queue as autosave. Clearing the
   * debounced snapshot prevents a stale timer from replaying an older draft.
   */
  const saveNow = (snapshot: PersistedResumeSnapshot): Promise<void> => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    pending = null;
    return persist(snapshot, beginRevision());
  };

  const flush = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const next = pending;
    pending = null;
    if (next) await persist(next.snapshot, next.revision);
    await writeChain;
  };

  const schedule = (snapshot: PersistedResumeSnapshot) => {
    pending = { snapshot, revision: beginRevision() };
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const next = pending;
      pending = null;
      if (next) void persist(next.snapshot, next.revision).catch((error) => {
        console.error('[resume-persistence] IndexedDB autosave failed:', error);
      });
    }, debounceMs);
  };

  const dispose = async () => {
    await flush();
  };

  return { schedule, saveNow, flush, dispose, setBaseline, subscribeProgress };
}

// Shared by the bootstrapped app and the explicit portable workspace importer.
// Flush pending autosaves before overwriting IndexedDB, then flush restored state.
export const activeResumePersistence = createResumePersistenceCoordinator();
