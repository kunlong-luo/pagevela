import { describe, expect, it } from 'vitest';
import type { ResumeSettings } from '../types';
import { canRestoreMeasuredAutoFit, type AutoFitRestoreSnapshot } from '../lib/measured-auto-fit-restore';

const before: ResumeSettings = {
  themeColor: 'indigo', fontSize: 'standard', fontFamily: 'sans',
  margin: 'standard', layoutMode: 'split', h2Style: 'accent-line',
  topAccentLine: true, lineHeight: 1.6, blockGap: 1,
  letterSpacing: 0, showPageBreakLine: true, templateLayout: 'single',
};
const fitted: ResumeSettings = { ...before, margin: 'compact' };
const snapshot: AutoFitRestoreSnapshot = {
  before, expectedSettings: JSON.stringify(fitted),
  markdown: '# Fictional Resume', profileId: 'fictional-1', target: 2,
};
const context = {
  settings: fitted, markdown: '# Fictional Resume',
  profileId: 'fictional-1', target: 2 as const, disabled: false,
};

describe('Auto Fit pre-change layout recovery', () => {
  it('permits restoration only for exactly the last fitted settings', () => {
    expect(canRestoreMeasuredAutoFit(snapshot, context)).toBe(true);
  });

  it('does not offer a restore when no actual adjustment was made', () => {
    expect(canRestoreMeasuredAutoFit(null, context)).toBe(false);
  });

  it('invalidates after manual layout changes', () => {
    expect(canRestoreMeasuredAutoFit(snapshot, {
      ...context, settings: { ...fitted, fontSize: 'relaxed' },
    })).toBe(false);
  });

  it('invalidates after profile, markdown or target changes', () => {
    expect(canRestoreMeasuredAutoFit(snapshot, { ...context, profileId: 'fictional-2' })).toBe(false);
    expect(canRestoreMeasuredAutoFit(snapshot, { ...context, markdown: '# Updated' })).toBe(false);
    expect(canRestoreMeasuredAutoFit(snapshot, { ...context, target: 3 })).toBe(false);
  });

  it('never restores shared or overridden preview settings', () => {
    expect(canRestoreMeasuredAutoFit(snapshot, { ...context, disabled: true })).toBe(false);
  });
});
