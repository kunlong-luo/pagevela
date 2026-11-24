import { describe, expect, it, vi } from 'vitest';
import type { ResumeSettings } from '../types';
import { smartAutoFit } from '../lib/preview-utils';

function baseline(): ResumeSettings {
  return {
    themeColor: 'indigo',
    fontSize: 'relaxed',
    fontFamily: 'sans',
    margin: 'relaxed',
    layoutMode: 'split',
    h2Style: 'accent-line',
    topAccentLine: true,
    lineHeight: 1.6,
    blockGap: 1,
    letterSpacing: 0,
    showPageBreakLine: true,
    templateLayout: 'single',
    lang: 'en',
    paperSize: 'a4',
    marketRegion: 'international',
  };
}

const order = { compact: 0, standard: 1, relaxed: 2 };

describe('incremental Auto Fit safety', () => {
  it('never enlarges an already compact resume when Auto Fit is pressed', () => {
    const settings = { ...baseline(), fontSize: 'compact', margin: 'compact', blockGap: 0.3, lineHeight: 1.2 } as ResumeSettings;
    const update = vi.fn();
    expect(smartAutoFit(settings, update)).toBe(false);
    expect(smartAutoFit(settings, update)).toBe(false);
    expect(update).not.toHaveBeenCalled();
  });

  it('reduces one property at a time and terminates without oscillation', () => {
    let settings = baseline();
    let adjustedSteps = 0;
    const update = vi.fn((key: keyof ResumeSettings, value: ResumeSettings[keyof ResumeSettings]) => {
      settings = { ...settings, [key]: value };
    });

    for (let i = 0; i < 60; i++) {
      const before = settings;
      const changed = smartAutoFit(settings, update);
      if (!changed) break;
      adjustedSteps++;
      expect(update).toHaveBeenCalledTimes(adjustedSteps);
      expect(order[settings.margin]).toBeLessThanOrEqual(order[before.margin]);
      expect(order[settings.fontSize]).toBeLessThanOrEqual(order[before.fontSize]);
      expect(settings.blockGap).toBeLessThanOrEqual(before.blockGap);
      expect(settings.lineHeight).toBeLessThanOrEqual(before.lineHeight);
      expect(
        settings.margin !== before.margin ||
        settings.fontSize !== before.fontSize ||
        settings.blockGap !== before.blockGap ||
        settings.lineHeight !== before.lineHeight,
      ).toBe(true);
    }
    expect(adjustedSteps).toBeGreaterThan(5);
    expect(adjustedSteps).toBeLessThan(60);
    expect(smartAutoFit(settings, update)).toBe(false);
    expect(settings.margin).toBe('compact');
    expect(settings.fontSize).toBe('compact');
    expect(settings.blockGap).toBe(0.3);
    expect(settings.lineHeight).toBe(1.2);
  });

  it('can reduce the last spacing increment below the old hard-coded thresholds', () => {
    let settings = { ...baseline(), fontSize: 'compact', margin: 'compact', blockGap: 0.35, lineHeight: 1.24 } as ResumeSettings;
    const update = (key: keyof ResumeSettings, value: ResumeSettings[keyof ResumeSettings]) => {
      settings = { ...settings, [key]: value };
    };
    expect(smartAutoFit(settings, update)).toBe(true);
    expect(settings.blockGap).toBe(0.3);
    expect(smartAutoFit(settings, update)).toBe(true);
    expect(settings.lineHeight).toBe(1.2);
    expect(smartAutoFit(settings, update)).toBe(false);
  });
});
