import { describe, expect, it } from 'vitest';
import { MASTER_PRESETS } from '../components/toolbar/toolbar-presets';

describe('Chinese resume visual presets', () => {
  const chinese = MASTER_PRESETS.filter((preset) => preset.audience === 'cn');

  it('provides three distinct domestic formats', () => {
    expect(chinese.map((preset) => preset.id)).toEqual([
      'cn_classic',
      'cn_graduate',
      'cn_modern',
    ]);
    expect(chinese.map((preset) => preset.settings.headerLayout)).toEqual([
      'split',
      'centered',
      'stacked',
    ]);
    expect(chinese.map((preset) => preset.settings.templateLayout)).toEqual([
      'single',
      'single',
      'two-column',
    ]);
  });

  it('contains complete styling settings without changing language, market or resume content', () => {
    for (const preset of chinese) {
      expect(preset.settings.fontFamily).toBeDefined();
      expect(preset.settings.fontSize).toBeDefined();
      expect(preset.settings.lineHeight).toBeGreaterThan(0);
      expect(preset.settings.blockGap).toBeGreaterThan(0);
      expect(preset.settings.margin).toBeDefined();
      expect(preset.settings).not.toHaveProperty('lang');
      expect(preset.settings).not.toHaveProperty('marketRegion');
      expect(preset.settings).not.toHaveProperty('paperSize');
      expect(preset.settings).not.toHaveProperty('markdown');
    }
  });

  it('keeps established international style presets', () => {
    expect(MASTER_PRESETS.some((preset) => preset.id === 'tech')).toBe(true);
    expect(MASTER_PRESETS.some((preset) => preset.id === 'latex_academic')).toBe(true);
  });
});
