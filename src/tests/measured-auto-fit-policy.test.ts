import { describe, expect, it } from 'vitest';
import {
  evaluateMeasuredFitProgress,
  hasFreshFitMeasurement,
  MAX_MEASURED_AUTO_FIT_STALLS,
  MAX_MEASURED_AUTO_FIT_STEPS,
} from '../lib/measured-auto-fit-policy';

describe('measured Auto Fit stop policy', () => {
  it('waits for a newer measured DOM frame after applying a layout change', () => {
    expect(hasFreshFitMeasurement(8, 8)).toBe(false);
    expect(hasFreshFitMeasurement(9, 8)).toBe(true);
    expect(hasFreshFitMeasurement(8, null)).toBe(true);
  });

  it('does not compact a document that already fits its measured target', () => {
    expect(evaluateMeasuredFitProgress({
      isOver: false, overflowPixels: 0, steps: 0, lastOverflowPixels: null, stalledSteps: 0,
    }).decision).toBe('fitted');
  });

  it('continues while measured overflow decreases and resets stall count', () => {
    expect(evaluateMeasuredFitProgress({
      isOver: true, overflowPixels: 130, steps: 3, lastOverflowPixels: 152, stalledSteps: 2,
    })).toEqual({ decision: 'continue', stalledSteps: 0 });
  });

  it('stops after repeated settings changes that do not improve the measurement', () => {
    expect(evaluateMeasuredFitProgress({
      isOver: true, overflowPixels: 300, steps: 4, lastOverflowPixels: 299,
      stalledSteps: MAX_MEASURED_AUTO_FIT_STALLS - 1,
    })).toEqual({ decision: 'no-progress', stalledSteps: MAX_MEASURED_AUTO_FIT_STALLS });
  });

  it('stops at the hard bound even if every prior adjustment appeared to help', () => {
    expect(evaluateMeasuredFitProgress({
      isOver: true, overflowPixels: 30, steps: MAX_MEASURED_AUTO_FIT_STEPS,
      lastOverflowPixels: 40, stalledSteps: 0,
    }).decision).toBe('step-limit');
  });

  it('never counts the first unadjusted measurement as a stalled step', () => {
    expect(evaluateMeasuredFitProgress({
      isOver: true, overflowPixels: 900, steps: 0, lastOverflowPixels: 900, stalledSteps: 3,
    })).toEqual({ decision: 'continue', stalledSteps: 0 });
  });
});
