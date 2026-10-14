import type { ResumeProfile, ResumeSettings } from '../types';
import { storage, STORAGE_KEYS } from './storage';

/**
 * Synchronous, small write-ahead marker for settings that have not yet reached
 * the debounced IndexedDB profile snapshot. No resume text or photo is stored.
 */
interface PendingSettings {
  settings: ResumeSettings;
  updatedAt: string;
}
type Journal = Record<string, PendingSettings>;
const MAX_PENDING_PROFILES = 100;

function readJournal(): Journal {
  const raw = storage.get<unknown>(STORAGE_KEYS.PENDING_PROFILE_SETTINGS, null);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const values = Object.entries(raw).slice(0, MAX_PENDING_PROFILES);
  const valid: Journal = {};
  for (const [id, value] of values) {
    if (!id || id.length > 240 || !value || typeof value !== 'object' || Array.isArray(value)) continue;
    const item = value as Partial<PendingSettings>;
    if (!item.settings || typeof item.settings !== 'object' || Array.isArray(item.settings) ||
      typeof item.updatedAt !== 'string' || !Number.isFinite(Date.parse(item.updatedAt))) continue;
    valid[id] = { settings: item.settings, updatedAt: item.updatedAt };
  }
  return valid;
}

export function stageProfileSettings(profileId: string, settings: ResumeSettings, updatedAt: string): void {
  if (!profileId || profileId.length > 240) return;
  const journal = readJournal();
  journal[profileId] = { settings, updatedAt };
  if (Object.keys(journal).length > MAX_PENDING_PROFILES) {
    const oldest = Object.keys(journal)[0];
    if (oldest && oldest !== profileId) delete journal[oldest];
  }
  storage.set(STORAGE_KEYS.PENDING_PROFILE_SETTINGS, journal);
}

/** Used only for profile settings; the DB is still authoritative for resume content. */
export function recoverPendingProfile(profile: ResumeProfile): ResumeProfile {
  const pending = readJournal()[profile.id];
  if (!pending) return profile;
  const persistedAt = Date.parse(profile.updatedAt);
  const pendingAt = Date.parse(pending.updatedAt);
  if (Number.isFinite(persistedAt) && persistedAt > pendingAt) {
    // A newer database revision supersedes an older interrupted settings write.
    discardPendingProfileSettings(profile.id);
    return profile;
  }
  // Carry the write-ahead revision through bootstrap so a successful
  // IndexedDB snapshot can acknowledge it and clear the journal.
  return { ...profile, settings: pending.settings, updatedAt: pending.updatedAt };
}

/** A successful DB commit acknowledges only matching, not newer, pending edits. */
export function acknowledgeSavedProfileSettings(profiles: ResumeProfile[]): void {
  const journal = readJournal();
  if (Object.keys(journal).length === 0) return;
  let changed = false;
  for (const profile of profiles) {
    const pending = journal[profile.id];
    if (!pending) continue;
    const savedAt = Date.parse(profile.updatedAt);
    const pendingAt = Date.parse(pending.updatedAt);
    if (Number.isFinite(savedAt) && savedAt >= pendingAt &&
      JSON.stringify(profile.settings) === JSON.stringify(pending.settings)) {
      delete journal[profile.id];
      changed = true;
    }
  }
  if (changed) {
    if (Object.keys(journal).length) storage.set(STORAGE_KEYS.PENDING_PROFILE_SETTINGS, journal);
    else storage.remove(STORAGE_KEYS.PENDING_PROFILE_SETTINGS);
  }
}

export function discardPendingProfileSettings(profileId?: string): void {
  if (!profileId) {
    storage.remove(STORAGE_KEYS.PENDING_PROFILE_SETTINGS);
    return;
  }
  const journal = readJournal();
  if (!(profileId in journal)) return;
  delete journal[profileId];
  if (Object.keys(journal).length) storage.set(STORAGE_KEYS.PENDING_PROFILE_SETTINGS, journal);
  else storage.remove(STORAGE_KEYS.PENDING_PROFILE_SETTINGS);
}
