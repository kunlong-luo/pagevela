import { activeResumePersistence } from './resume-persistence';
import { activeDraftHistoryPersistence } from './resume-draft-persistence';
import { deleteResumeDatabase } from './resume-db';
import { storage } from './storage';

export type ResumeResetFailureStage = 'suspend' | 'database' | 'preferences';

export class ResumeResetError extends Error {
  constructor(
    public readonly stage: ResumeResetFailureStage,
    cause?: unknown,
  ) {
    super(`resume-reset-failed:${stage}`, { cause });
    this.name = 'ResumeResetError';
  }
}

export interface ResumeResetDependencies {
  suspendActiveWrites: () => Promise<void>;
  suspendDraftWrites: () => Promise<void>;
  deleteDatabase: () => Promise<void>;
  clearPreferences: () => boolean;
}

/**
 * Complete Pagevela-owned data wipe. Runs only after explicit branded UI
 * confirmation. Never calls localStorage.clear() or clears another app's data.
 *
 * A database deletion and localStorage are separate browser mechanisms, not
 * an atomic transaction. Any failure is reported to the UI, not called success.
 * Once begun, writers remain suspended until the page reloads; this prevents
 * stale autosaves from reopening the deleted IndexedDB database.
 */
export async function performResumeFullReset(deps: ResumeResetDependencies): Promise<void> {
  try {
    // Both coordinator queues must finish before deleting the database.
    await Promise.all([deps.suspendActiveWrites(), deps.suspendDraftWrites()]);
  } catch (error) {
    throw new ResumeResetError('suspend', error);
  }

  try {
    await deps.deleteDatabase();
  } catch (error) {
    // Keep lightweight browser preferences if IndexedDB could not be deleted.
    throw new ResumeResetError('database', error);
  }

  try {
    if (!deps.clearPreferences()) {
      throw new Error('browser-rejected-local-data-clear');
    }
  } catch (error) {
    // IndexedDB may already have been deleted. Never say the wipe succeeded.
    throw new ResumeResetError('preferences', error);
  }
}

let activeReset: Promise<void> | null = null;

/** Shared by the error screen and Help → Privacy; concurrent clicks share one operation. */
export function clearPagevelaLocalData(): Promise<void> {
  if (!activeReset) {
    activeReset = performResumeFullReset({
      suspendActiveWrites: () => activeResumePersistence.suspendForReset(),
      suspendDraftWrites: () => activeDraftHistoryPersistence.suspendForReset(),
      deleteDatabase: () => deleteResumeDatabase(),
      clearPreferences: () => storage.clearAllResumeData(),
    });
  }
  return activeReset;
}
