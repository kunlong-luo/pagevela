import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ResumeProfile, ResumeSettings } from '../types';
import {
  acknowledgeSavedProfileSettings,
  discardPendingProfileSettings,
  recoverPendingProfile,
  stageProfileSettings,
} from '../lib/pending-profile-settings';
import { STORAGE_KEYS } from '../lib/storage';

const settings = {
  lang: 'en',
  marketRegion: 'cn',
  paperSize: 'a4',
  dateStyle: 'cn-dot',
} as ResumeSettings;
const when = '2026-10-14T05:00:00.000Z';
function profile(id: string, updatedAt = when, config = settings): ResumeProfile {
  return {
    id, name: id, markdown: '# Test', settings: config,
    createdAt: '2026-10-01T00:00:00.000Z', updatedAt,
  };
}

describe('pending per-profile settings recovery', () => {
  const data = new Map<string, string>();
  beforeEach(() => {
    data.clear();
    const mockStorage = {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => { data.set(key, String(value)); },
      removeItem: (key: string) => { data.delete(key); },
    };
    vi.stubGlobal('window', {});
    vi.stubGlobal('localStorage', mockStorage);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('recovers newer unsaved UK market settings for only the edited profile', () => {
    const changed: ResumeSettings = {
      ...settings, marketRegion: 'uk', paperSize: 'letter', dateStyle: 'month-long',
    };
    const timestamp = '2026-10-14T05:00:02.000Z';
    stageProfileSettings('first', changed, timestamp);
    const restored = recoverPendingProfile(profile('first'));
    expect(restored.settings).toEqual(changed);
    expect(restored.updatedAt).toBe(timestamp);
    expect(recoverPendingProfile(profile('second')).settings).toEqual(settings);
  });

  it('does not replace a newer committed profile with an obsolete local marker', () => {
    const changed = { ...settings, marketRegion: 'uk' as const };
    stageProfileSettings('first', changed, '2026-10-14T05:00:01.000Z');
    const newer = profile('first', '2026-10-14T05:00:10.000Z', settings);
    expect(recoverPendingProfile(newer)).toEqual(newer);
  });

  it('clears matching writes only after successful persistence and retains newer edits', () => {
    const newer = { ...settings, marketRegion: 'uk' as const };
    const latest = { ...settings, marketRegion: 'ca' as const };
    stageProfileSettings('first', newer, '2026-10-14T05:00:01.000Z');
    stageProfileSettings('first', latest, '2026-10-14T05:00:02.000Z');
    acknowledgeSavedProfileSettings([
      profile('first', '2026-10-14T05:00:01.000Z', newer),
    ]);
    expect(recoverPendingProfile(profile('first')).settings).toEqual(latest);
    acknowledgeSavedProfileSettings([
      profile('first', '2026-10-14T05:00:02.000Z', latest),
    ]);
    expect(data.has(STORAGE_KEYS.PENDING_PROFILE_SETTINGS)).toBe(false);
  });

  it('preserves other profiles pending changes when one is saved', () => {
    const updated = { ...settings, marketRegion: 'uk' as const };
    stageProfileSettings('a', updated, '2026-10-14T05:00:01.000Z');
    stageProfileSettings('b', updated, '2026-10-14T05:00:01.000Z');
    acknowledgeSavedProfileSettings([
      profile('a', '2026-10-14T05:00:01.000Z', updated),
    ]);
    expect(recoverPendingProfile(profile('b')).settings.marketRegion).toBe('uk');
    discardPendingProfileSettings('b');
    expect(data.has(STORAGE_KEYS.PENDING_PROFILE_SETTINGS)).toBe(false);
  });

  it('drops old pending values when a workspace import replaces all profiles', () => {
    stageProfileSettings('same-id', { ...settings, marketRegion: 'us' }, '2026-10-14T05:00:02.000Z');
    discardPendingProfileSettings();
    expect(recoverPendingProfile(profile('same-id')).settings).toEqual(settings);
  });
});
