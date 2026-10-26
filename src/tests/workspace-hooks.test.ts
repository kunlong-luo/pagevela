import { describe, expect, it, vi } from 'vitest';
import type { ResumeDraft, ResumeSettings } from '../types';
import { preparePeriodicDraftHistory } from '../hooks/usePeriodicDraftHistory';
import { ratioForPointer } from '../hooks/useResizableSplitPane';

const settings = {
  themeColor: 'indigo',
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
} as const satisfies ResumeSettings;

const state = (markdown: string) => ({
  markdown, settings, currentTemplateId: 'custom', uiLanguage: 'en' as const,
});
const draft = (markdown: string, isAutoSave = true): ResumeDraft => ({
  id: markdown, title: markdown, markdown, settings,
  timestamp: '2026-10-26 16:00:00', isAutoSave,
});

describe('split pane geometry', () => {
  it('maps the pointer to the two panes and clamps extreme positions', () => {
    expect(ratioForPointer(100, 0, 200)).toBe(50);
    expect(ratioForPointer(0, 0, 200)).toBe(28);
    expect(ratioForPointer(200, 0, 200)).toBe(72);
    expect(ratioForPointer(149, 100, 100)).toBe(50);
    expect(ratioForPointer(152, 100, 100)).toBe(52);
  });

  it('rejects a zero-width or non-finite container instead of corrupting the saved ratio', () => {
    expect(ratioForPointer(10, 0, 0)).toBeNull();
    expect(ratioForPointer(Number.NaN, 0, 100)).toBeNull();
    expect(ratioForPointer(10, 0, Number.POSITIVE_INFINITY)).toBeNull();
  });
});

describe('periodic local draft history', () => {
  const now = new Date('2026-10-26T08:00:00.000Z');

  it('does not replace drafts when identical markdown is already stored', () => {
    const existing = [draft('# current'), draft('# manual', false)];
    expect(preparePeriodicDraftHistory(existing, state('# current'), now)).toBeNull();
    expect(existing).toHaveLength(2);
  });

  it('retains five automatic drafts plus all manual drafts in their original order', () => {
    const manual = [draft('manual-one', false), draft('manual-two', false)];
    const previous = Array.from({ length: 8 }, (_, i) => draft('old-' + i));
    const next = preparePeriodicDraftHistory([...manual, ...previous], state('# new'), now);
    expect(next?.filter((item) => item.isAutoSave).map((item) => item.markdown))
      .toEqual(['# new', 'old-0', 'old-1', 'old-2', 'old-3']);
    expect(next?.filter((item) => !item.isAutoSave)).toEqual(manual);
    expect(next?.[0]).toMatchObject({ markdown: '# new', templateId: 'custom', isAutoSave: true });
  });

  it('does not mutate existing records or their order', () => {
    const existing = [draft('manual', false), draft('old')];
    const clone = structuredClone(existing);
    expect(preparePeriodicDraftHistory(existing, state('fresh'), now)).toHaveLength(3);
    expect(existing).toEqual(clone);
  });

  it('uses the selected language when naming a new snapshot', () => {
    const spanish = preparePeriodicDraftHistory([], { ...state('a'), uiLanguage: 'zh' }, now);
    expect(spanish?.[0].title).toBe(new Date(now).toLocaleTimeString('zh-CN', { hour12: false }));
  });
});
