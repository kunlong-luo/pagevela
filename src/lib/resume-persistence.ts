import type { ResumeProfile } from '../types';
import { resumeRepository } from './resume-repository';
import { STORAGE_HEALTH_EVENT } from './storage';
import { acknowledgeSavedProfileSettings } from './pending-profile-settings';
import { RESUME_DB_WRITE_LOCK_NAME } from './resume-storage-contract';

export interface PersistedResumeSnapshot {
  markdown: string;
  profiles: ResumeProfile[];
  jdText: string;
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
  const writeSnapshot = dependencies.writeSnapshot ?? ((snapshot: PersistedResumeSnapshot) =>
    resumeRepository.saveSnapshot(snapshot));
  const acknowledgeProfiles = dependencies.acknowledgeProfiles ?? acknowledgeSavedProfileSettings;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: PersistedResumeSnapshot | null = null;
  let writeChain: Promise<void> = Promise.resolve();
  let hasWriteFailure = false;

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
        key: 'indexeddb',
        quotaExceeded: errorName === 'QuotaExceededError',
      },
    }));
  };

  const persist = (snapshot: PersistedResumeSnapshot) => {
    // A failed write must not poison every later autosave attempt.
    writeChain = writeChain
      .catch(() => undefined)
      .then(async () => {
        try {
          const writeSnapshot = async () => {
            await writeSnapshot(snapshot);
            // Clear only journal entries included in this committed snapshot.
            acknowledgeProfiles(snapshot.profiles);
          };

          if (typeof navigator !== 'undefined' && navigator.locks?.request) {
            await navigator.locks.request(RESUME_DB_WRITE_LOCK_NAME, writeSnapshot);
          } else {
            await writeSnapshot();
          }

          if (hasWriteFailure) emitHealth('recovered');
          hasWriteFailure = false;
        } catch (error) {
          if (!hasWriteFailure) emitHealth('error', error);
          hasWriteFailure = true;
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
    return persist(snapshot);
  };

  const flush = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    const snapshot = pending;
    pending = null;
    if (snapshot) await persist(snapshot);
    await writeChain;
  };

  const schedule = (snapshot: PersistedResumeSnapshot) => {
    pending = snapshot;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      const next = pending;
      pending = null;
      if (next) void persist(next).catch((error) => {
        console.error('[resume-persistence] IndexedDB autosave failed:', error);
      });
    }, debounceMs);
  };

  const dispose = async () => {
    await flush();
  };

  return { schedule, saveNow, flush, dispose };
}

// Shared by the bootstrapped app and the explicit portable workspace importer.
// Flush pending autosaves before overwriting IndexedDB, then flush restored state.
export const activeResumePersistence = createResumePersistenceCoordinator();
