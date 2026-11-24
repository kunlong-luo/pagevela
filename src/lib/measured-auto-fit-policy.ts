/** Decisions for bounded, measured preview Auto Fit. */
export const MAX_MEASURED_AUTO_FIT_STEPS = 24;
export const MAX_MEASURED_AUTO_FIT_STALLS = 4;

export interface FitProgress {
  isOver: boolean;
  overflowPixels: number;
  steps: number;
  lastOverflowPixels: number | null;
  stalledSteps: number;
}

export type FitDecision = 'continue' | 'fitted' | 'step-limit' | 'no-progress';

export function evaluateMeasuredFitProgress(progress: FitProgress): {
  decision: FitDecision;
  stalledSteps: number;
} {
  if (!progress.isOver) return { decision: 'fitted', stalledSteps: 0 };
  if (progress.steps >= MAX_MEASURED_AUTO_FIT_STEPS) {
    return { decision: 'step-limit', stalledSteps: progress.stalledSteps };
  }

  const stalledSteps = progress.steps > 0 &&
    progress.lastOverflowPixels !== null &&
    progress.overflowPixels >= progress.lastOverflowPixels - 1
      ? progress.stalledSteps + 1
      : 0;
  return stalledSteps >= MAX_MEASURED_AUTO_FIT_STALLS
    ? { decision: 'no-progress', stalledSteps }
    : { decision: 'continue', stalledSteps };
}

/** Do not evaluate a changed layout until a fresh DOM measurement completed. */
export function hasFreshFitMeasurement(
  measurementRevision: number,
  awaitingRevision: number | null,
): boolean {
  return awaitingRevision === null || measurementRevision > awaitingRevision;
}
