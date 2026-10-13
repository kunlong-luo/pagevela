import { describe, expect, it } from 'vitest';
import type { ResumeDraft, ResumeProfile, ResumeSettings } from '../types';
import {
  MAX_PORTABLE_WORKSPACE_BYTES,
  normalizePortableWorkspaceBackup,
  PORTABLE_WORKSPACE_VERSION,
  serializePortableWorkspaceBackup,
} from '../lib/portable-workspace-backup';

const settings: ResumeSettings = {
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
  headerLayout: 'stacked',
  lang: 'en',
  marketRegion: 'us',
  paperSize: 'letter',
};
const profiles: ResumeProfile[] = [
  { id: 'a', name: 'Developer', markdown: '# Developer',
    settings, createdAt: '2026-10-01', updatedAt: '2026-10-02', templateId: 'custom' },
  { id: 'b', name: 'Designer', markdown: '# Designer',
    settings, createdAt: '2026-10-01', updatedAt: '2026-10-03' },
];
const drafts: ResumeDraft[] = [
  { id: 'draft_one', title: 'Old copy', markdown: '# Previous', settings,
    timestamp: '2026-10-03', isAutoSave: true },
];
const photo = 'data:image/jpeg;base64,aGVsbG8=';

const original = {
  version: PORTABLE_WORKSPACE_VERSION,
  exportedAt: '2026-10-13T00:00:00.000Z',
  profiles,
  activeProfileId: 'b',
  drafts,
  jdText: 'Job description saved only in the browser',
};

describe('cross-origin portable workspace backups', () => {
  it('round trips all profiles, active selection, drafts, JD, layout and optional JPEG', () => {
    const source = {
      ...original,
      profiles: [{ ...profiles[0], photoDataUrl: photo, settings: { ...settings, showPhoto: true } }, profiles[1]],
    };
    const parsed = normalizePortableWorkspaceBackup(
      JSON.parse(serializePortableWorkspaceBackup(source, settings)), settings,
    );
    expect(parsed?.version).toBe(PORTABLE_WORKSPACE_VERSION);
    expect(parsed?.activeProfileId).toBe('b');
    expect(parsed?.profiles.map(p => p.name)).toEqual(['Developer', 'Designer']);
    expect(parsed?.drafts).toEqual(drafts);
    expect(parsed?.jdText).toBe(original.jdText);
    expect(parsed?.profiles[0]).toMatchObject({
      photoDataUrl: photo,
      settings: { headerLayout: 'stacked', showPhoto: true },
    });
  });

  it('keeps the old single-resume backup type distinct', () => {
    expect(normalizePortableWorkspaceBackup({
      version: 'markdown-resume-backup-v1', markdown: '# Single', settings,
    }, settings)).toBeNull();
  });

  it('rejects missing or wrong active profile, duplicate IDs, invalid drafts and versions', () => {
    expect(normalizePortableWorkspaceBackup({ ...original, activeProfileId: 'missing' }, settings)).toBeNull();
    expect(normalizePortableWorkspaceBackup({ ...original, profiles: [profiles[0], profiles[0]] }, settings)).toBeNull();
    expect(normalizePortableWorkspaceBackup({
      ...original, drafts: [drafts[0], drafts[0]],
    }, settings)).toBeNull();
    expect(normalizePortableWorkspaceBackup({
      ...original, drafts: [{ ...drafts[0], markdown: '' }],
    }, settings)).toBeNull();
    expect(normalizePortableWorkspaceBackup({ ...original, version: 'evil' }, settings)).toBeNull();
  });

  it('rejects external, SVG and oversized portraits rather than silently losing them', () => {
    for (const photoDataUrl of [
      'https://tracking.example/photo.jpg',
      'data:image/svg+xml;base64,PHN2Zz4=',
      'data:image/jpeg;base64,' + 'a'.repeat(500_001),
    ]) {
      expect(normalizePortableWorkspaceBackup({
        ...original,
        profiles: [{ ...profiles[0], photoDataUrl }, profiles[1]],
      }, settings)).toBeNull();
    }
  });

  it('rejects oversized content and exports a bounded JSON file', () => {
    expect(normalizePortableWorkspaceBackup({
      ...original, jdText: 'x'.repeat(2_000_001),
    }, settings)).toBeNull();
    const json = serializePortableWorkspaceBackup(original, settings);
    expect(new Blob([json]).size).toBeLessThan(MAX_PORTABLE_WORKSPACE_BYTES);
    expect(JSON.parse(json).version).toBe(PORTABLE_WORKSPACE_VERSION);
  });
});
