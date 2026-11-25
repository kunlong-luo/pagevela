import type { ResumeDraft } from '../types';
import { resumeRepository, type DraftHistoryMutation } from './resume-repository';
import { RESUME_DB_WRITE_LOCK_NAME } from './resume-storage-contract';

/**
 * Manual draft edits, timed snapshots and workspace replacement share one FIFO.
 * The repository's Dexie mutation is itself a single read/write transaction:
 * Web Locks and this queue help across contexts, but transaction atomicity is
 * needed even on Android browsers without navigator.locks.
 */
export interface DraftHistoryPersistenceDependencies {
  mutateDrafts?: (change: DraftHistoryMutation) => Promise<ResumeDraft[]>;
  readDrafts?: () => Promise<ResumeDraft[]>;
  withWriteLock?: <T>(work: () => Promise<T>) => Promise<T>;
}

export function createDraftHistoryPersistenceCoordinator(
  dependencies: DraftHistoryPersistenceDependencies = {},
) {
  const mutate = dependencies.mutateDrafts ?? ((change: DraftHistoryMutation) =>
    resumeRepository.mutateDrafts(change));
  const readDrafts = dependencies.readDrafts ?? (() => resumeRepository.getDrafts());
  const withWriteLock = dependencies.withWriteLock ?? (async <T>(work: () => Promise<T>): Promise<T> => {
    if (typeof navigator !== 'undefined' && navigator.locks?.request) {
      return navigator.locks.request(RESUME_DB_WRITE_LOCK_NAME, work);
    }
    return work();
  });
  const listeners = new Set<(drafts: ResumeDraft[]) => void>();
  let chain: Promise<void> = Promise.resolve();
  let resetSuspended = false;

  // Failures reach the initiating UI but must not prevent the next save.
  const enqueue = <T>(action: () => Promise<T>): Promise<T> => {
    if (resetSuspended) return Promise.reject(new Error('resume-reset-in-progress'));
    const task = chain.then(() => {
      // An action queued before reset must not reopen IndexedDB after deletion.
      if (resetSuspended) throw new Error('resume-reset-in-progress');
      return action();
    });
    chain = task.then(() => undefined, () => undefined);
    return task;
  };

  const update = (change: DraftHistoryMutation): Promise<ResumeDraft[]> =>
    enqueue(async () => {
      const drafts = await withWriteLock(() => mutate(change));
      for (const listener of listeners) listener(drafts);
      return drafts;
    });

  const read = (): Promise<ResumeDraft[]> => enqueue(readDrafts);

  /** Prevent periodic saves from running during a confirmed workspace restore. */
  const exclusive = <T>(action: () => Promise<T>): Promise<T> => enqueue(action);

  /** Finish in-flight draft operations; disallow later mutations and reads. */
  const suspendForReset = async () => {
    resetSuspended = true;
    await chain;
  };

  const subscribe = (listener: (drafts: ResumeDraft[]) => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };

  return { update, read, exclusive, subscribe, suspendForReset };
}

export const activeDraftHistoryPersistence = createDraftHistoryPersistenceCoordinator();
