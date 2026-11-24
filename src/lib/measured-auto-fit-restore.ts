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
/**
 * The app theme is global, not per-resume. Legacy profile settings can still
 * carry a deprecated themeMode; never reapply it while restoring Auto Fit.
 * updateSettings strips this property before its profile journal write.
 */
export function prepareAutoFitRestoreSettings(before: ResumeSettings): ResumeSettings {
  return { ...before, themeMode: undefined };
}

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
