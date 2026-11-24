import type { ResumeSettings } from '../types';
import { getMarketProfile, isMarketRegion, resolveDefaultPaperSize } from './market-profile';
import { isPaperSize } from './paper';

/**
 * Normalize persisted profile/settings data without side effects.
 * Shared by bootstrap, profile switching and imported workspace paths.
 * Keep the existing migration behavior stable while testing it in isolation.
 */
export const sanitizeSettings = (raw: Partial<ResumeSettings> | null, defaultSettings: ResumeSettings): ResumeSettings => {
  if (!raw || typeof raw !== 'object') return defaultSettings;

  const merged = { ...defaultSettings, ...raw };

  const themeColors: ResumeSettings['themeColor'][] = [
    'blue', 'emerald', 'slate', 'indigo', 'crimson', 'amber', 'teal', 'bronze', 'custom',
  ];
  const fontSizes: ResumeSettings['fontSize'][] = ['compact', 'standard', 'relaxed'];
  const fontFamilies: ResumeSettings['fontFamily'][] = ['sans', 'serif', 'mono'];
  const margins: ResumeSettings['margin'][] = ['compact', 'standard', 'relaxed'];
  const layoutModes: ResumeSettings['layoutMode'][] = ['split', 'editor', 'preview'];
  const h2Styles: ResumeSettings['h2Style'][] = [
    'accent-line', 'modern-badge', 'minimal-clean', 'academic-line', 'bracket-tag',
  ];
  const templateLayouts: ResumeSettings['templateLayout'][] = [
    'single', 'two-column', 'academic', 'modern-card',
  ];
  const headerLayouts: NonNullable<ResumeSettings['headerLayout']>[] = [
    'split', 'centered', 'stacked',
  ];

  if (!themeColors.includes(merged.themeColor)) {
    merged.themeColor = defaultSettings.themeColor;
  }
  if (!fontSizes.includes(merged.fontSize)) {
    merged.fontSize = defaultSettings.fontSize;
  }
  if (!fontFamilies.includes(merged.fontFamily)) {
    merged.fontFamily = defaultSettings.fontFamily;
  }
  if (!margins.includes(merged.margin)) {
    merged.margin = defaultSettings.margin;
  }
  if (!layoutModes.includes(merged.layoutMode)) {
    merged.layoutMode = defaultSettings.layoutMode;
  }
  if (!h2Styles.includes(merged.h2Style)) {
    merged.h2Style = defaultSettings.h2Style;
  }
  if (!templateLayouts.includes(merged.templateLayout)) {
    merged.templateLayout = defaultSettings.templateLayout;
  }
  if (!merged.headerLayout || !headerLayouts.includes(merged.headerLayout)) {
    merged.headerLayout = 'split';
  }

  if (
    typeof merged.customColor !== 'string' ||
    !/^#[0-9a-f]{6}$/i.test(merged.customColor)
  ) {
    if (
      typeof defaultSettings.customColor === 'string' &&
      /^#[0-9a-f]{6}$/i.test(defaultSettings.customColor)
    ) {
      merged.customColor = defaultSettings.customColor;
    } else {
      delete merged.customColor;
    }
  }

  merged.topAccentLine =
    typeof merged.topAccentLine === 'boolean'
      ? merged.topAccentLine
      : defaultSettings.topAccentLine;
  merged.showPageBreakLine =
    typeof merged.showPageBreakLine === 'boolean'
      ? merged.showPageBreakLine
      : defaultSettings.showPageBreakLine;

  if (merged.lang !== 'zh' && merged.lang !== 'en') {
    merged.lang = defaultSettings.lang;
  }

  if (typeof merged.isPrivacyMasked !== 'boolean') {
    if (typeof defaultSettings.isPrivacyMasked === 'boolean') {
      merged.isPrivacyMasked = defaultSettings.isPrivacyMasked;
    } else {
      delete merged.isPrivacyMasked;
    }
  }

  // Sanitize numeric bounds to prevent corrupted stored state
  merged.lineHeight = typeof merged.lineHeight === 'number' && !isNaN(merged.lineHeight)
    ? Math.min(Math.max(merged.lineHeight, 1.0), 2.5)
    : defaultSettings.lineHeight;

  merged.blockGap = typeof merged.blockGap === 'number' && !isNaN(merged.blockGap)
    ? Math.min(Math.max(merged.blockGap, 0.0), 3.0)
    : defaultSettings.blockGap;

  merged.letterSpacing = typeof merged.letterSpacing === 'number' && !isNaN(merged.letterSpacing)
    ? Math.min(Math.max(merged.letterSpacing, -1.0), 2.0)
    : defaultSettings.letterSpacing;

  // themeMode is a global app preference now. Strip legacy per-profile values.
  delete merged.themeMode;

  // Sanitize marketRegion
  if (!merged.marketRegion || !isMarketRegion(merged.marketRegion)) {
    merged.marketRegion = merged.lang === 'zh' ? 'cn' : 'international';
  }

  // Sanitize paperSize
  if (!merged.paperSize || !isPaperSize(merged.paperSize)) {
    merged.paperSize = resolveDefaultPaperSize(merged.marketRegion);
  }

  // Sanitize dateStyle and derive a market-appropriate default for legacy data.
  if (!merged.dateStyle || !['cn-dot', 'month-short', 'month-long'].includes(merged.dateStyle)) {
    merged.dateStyle = getMarketProfile(merged.marketRegion).dateStyle;
  }

  return merged;
};
