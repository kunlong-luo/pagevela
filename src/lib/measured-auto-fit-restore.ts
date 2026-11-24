import type { ResumeSettings } from '../types';

export interface AutoFitRestoreSnapshot {
  before: ResumeSettings;
  expectedSettings: string;
  markdown: string;
  profileId: string;
  target: 1 | 2 | 3;
}

interface RestoreContext {
  settings: ResumeSettings;
  markdown: string;
  profileId: string;
  target: 1 | 2 | 3;
  disabled: boolean;
}

/** Never replay a stale layout over a different document or manual edits. */
export function canRestoreMeasuredAutoFit(
  snapshot: AutoFitRestoreSnapshot | null,
  context: RestoreContext,
): snapshot is AutoFitRestoreSnapshot {
  return snapshot !== null &&
    !context.disabled &&
    snapshot.markdown === context.markdown &&
    snapshot.profileId === context.profileId &&
    snapshot.target === context.target &&
    snapshot.expectedSettings === JSON.stringify(context.settings);
}
