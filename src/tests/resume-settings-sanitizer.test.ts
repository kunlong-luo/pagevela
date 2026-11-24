import { describe, expect, it } from 'vitest';
import type { ResumeSettings } from '../types';
import { sanitizeSettings } from '../lib/resume-settings-sanitizer';

const defaults: ResumeSettings = {
  themeColor: 'indigo',
  customColor: '#4F46E5',
  fontSize: 'standard',
  fontFamily: 'sans',
  margin: 'standard',
  layoutMode: 'split',
  h2Style: 'accent-line',
  topAccentLine: true,
  lineHeight: 1.6,
  blockGap: 1,
  letterSpacing: 0,
  showPageBreakLine: true,
  templateLayout: 'single',
  headerLayout: 'split',
  lang: 'en',
  marketRegion: 'international',
  paperSize: 'a4',
  dateStyle: 'month-short',
};

describe('pure resume settings sanitizer', () => {
  it('returns defaults for absent or malformed input without mutation', () => {
    expect(sanitizeSettings(null, defaults)).toBe(defaults);
    expect(sanitizeSettings([] as unknown as Partial<ResumeSettings>, defaults)).toEqual(defaults);
    expect(defaults.themeColor).toBe('indigo');
  });

  it('preserves valid visual settings and never revives a legacy global themeMode', () => {
    const source: Partial<ResumeSettings> = {
      margin: 'compact',
      fontSize: 'relaxed',
      topAccentLine: false,
      isPrivacyMasked: true,
      themeMode: 'dark',
    };
    const result = sanitizeSettings(source, defaults);
    expect(result).toMatchObject({
      margin: 'compact',
      fontSize: 'relaxed',
      topAccentLine: false,
      isPrivacyMasked: true,
    });
    expect(result.themeMode).toBeUndefined();
    expect(source.themeMode).toBe('dark');
    expect(defaults.margin).toBe('standard');
  });

  it('replaces corrupt enums/colors with safe defaults while retaining valid controls', () => {
    const invalid = {
      themeColor: 'not-a-theme', fontSize: 'huge', fontFamily: 'wingdings',
      margin: 'negative', layoutMode: 'freeform', h2Style: 'invalid',
      templateLayout: 'danger', headerLayout: 'unknown',
      customColor: 'javascript:alert(1)',
      topAccentLine: 'false', showPageBreakLine: 1, isPrivacyMasked: 'true',
      lang: 'xx',
    } as unknown as Partial<ResumeSettings>;
    const result = sanitizeSettings(invalid, defaults);
    expect(result).toMatchObject({
      themeColor: 'indigo', fontSize: 'standard', fontFamily: 'sans',
      margin: 'standard', layoutMode: 'split', h2Style: 'accent-line',
      templateLayout: 'single', headerLayout: 'split',
      customColor: '#4F46E5', topAccentLine: true, showPageBreakLine: true,
      lang: 'en', marketRegion: 'international', paperSize: 'a4',
    });
    expect(result.isPrivacyMasked).toBeUndefined();
  });

  it('clamps numeric dimensions and falls back for NaN', () => {
    const result = sanitizeSettings({
      lineHeight: -300, blockGap: 1000, letterSpacing: NaN,
    }, defaults);
    expect(result.lineHeight).toBe(1);
    expect(result.blockGap).toBe(3);
    expect(result.letterSpacing).toBe(0);
    expect(defaults.lineHeight).toBe(1.6);
  });

  it('uses Chinese or US market defaults for invalid paper and date fields', () => {
    const china = sanitizeSettings({
      lang: 'zh', marketRegion: 'cn',
      paperSize: 'unknown', dateStyle: 'invalid',
    } as unknown as Partial<ResumeSettings>, defaults);
    expect(china.marketRegion).toBe('cn');
    expect(china.paperSize).toBe('a4');
    expect(china.dateStyle).toBe('cn-dot');

    const us = sanitizeSettings({
      marketRegion: 'us', paperSize: 'unknown', dateStyle: 'invalid',
    } as unknown as Partial<ResumeSettings>, defaults);
    expect(us.paperSize).toBe('letter');
    expect(us.dateStyle).toBe('month-short');
  });

  it('preserves an explicitly chosen paper size even if market defaults differ', () => {
    const result = sanitizeSettings({
      lang: 'zh', marketRegion: 'cn',
      paperSize: 'letter', dateStyle: 'month-long',
    }, defaults);
    expect(result.paperSize).toBe('letter');
    expect(result.dateStyle).toBe('month-long');
  });
});
