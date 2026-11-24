import { describe, expect, it } from 'vitest';
import type { ResumeProfile, ResumeSettings } from '../types';
import {
  decideActiveResumeWrite, prepareConflictingResumeDrafts,
  type ActiveResumeBaseline, type ActiveResumeWrite,
} from '../lib/resume-active-conflict';

const settings: ResumeSettings = {
  themeColor: 'indigo', fontSize: 'standard', fontFamily: 'sans',
  margin: 'standard', layoutMode: 'split', h2Style: 'accent-line',
  topAccentLine: true, lineHeight: 1.6, blockGap: 1,
  letterSpacing: 0, showPageBreakLine: true, templateLayout: 'single',
};

const profile = (markdown: string, id = 'profile_a'): ResumeProfile => ({
  id, name: id, markdown, settings, templateId: 'custom',
  createdAt: '2026-11-24T00:00:00.000Z',
  updatedAt: '2026-11-24T00:00:00.000Z',
});

const snapshot = (markdown: string): ActiveResumeWrite => ({
  markdown,
  profiles: [profile(markdown)],
  jdText: 'Fictional job description',
});

describe('active resume cross-tab compare-and-write policy', () => {
  it('allows a write only while the committed content equals this tab\'s baseline', () => {
    const base = snapshot('# Original');
    expect(decideActiveResumeWrite(base, base, snapshot('# Edited'))).toBe('write');
  });

  it('does not create false conflicts when another tab saved identical content', () => {
    const base = snapshot('# Original');
    const current = snapshot('# Both tabs wrote the same text');
    expect(decideActiveResumeWrite(current, base, current)).toBe('already-current');
  });

  it('refuses an older tab after another tab committed a different resume', () => {
    const original = snapshot('# Original');
    expect(decideActiveResumeWrite(
      snapshot('# Newer tab version'), original, snapshot('# Stale tab version'),
    )).toBe('conflict');
  });

  it('detects other-profile and JD changes, not only active markdown', () => {
    const original = snapshot('# Same');
    const changedProfile: ActiveResumeBaseline = {
      ...original,
      profiles: [...original.profiles, profile('# Other profile changed', 'profile_b')],
    };
    expect(decideActiveResumeWrite(
      changedProfile, original, snapshot('# Stale editor changed'),
    )).toBe('conflict');
    const changedJd: ActiveResumeBaseline = { ...original, jdText: 'Other job description' };
    expect(decideActiveResumeWrite(
      changedJd, original, snapshot('# Stale editor changed'),
    )).toBe('conflict');
  });

  it('keeps all profile markdown and layout as recoverable manual drafts', () => {
    const stale = snapshot('# Stale active version');
    stale.profiles.push(profile('# Stale second profile', 'profile_b'));
    const before = structuredClone(stale);
    const drafts = prepareConflictingResumeDrafts(
      stale, 'draft_conflict_test', new Date('2026-11-24T09:00:00.000Z'),
    );
    expect(drafts).toHaveLength(3); // Two profiles and one JD text copy.
    expect(drafts.map(d => d.id)).toEqual([
      'draft_conflict_test_0', 'draft_conflict_test_1', 'draft_conflict_test_jd',
    ]);
    expect(drafts.map(d => d.markdown)).toEqual([
      '# Stale active version', '# Stale second profile', 'Fictional job description',
    ]);
    expect(drafts.every(d => d.isAutoSave === false)).toBe(true);
    expect(drafts[0].settings).toEqual(settings);
    expect(stale).toEqual(before);
  });

  it('preserves unsynced editor content as an additional draft when profiles lag', () => {
    const stale = snapshot('# Edited but not synced to profile');
    stale.profiles = [profile('# Older profile markdown')];
    stale.jdText = '';
    const drafts = prepareConflictingResumeDrafts(stale, 'draft_conflict_race', new Date());
    expect(drafts.map(d => d.id)).toEqual([
      'draft_conflict_race_0', 'draft_conflict_race_active',
    ]);
    expect(drafts[1].markdown).toBe('# Edited but not synced to profile');
  });
});
