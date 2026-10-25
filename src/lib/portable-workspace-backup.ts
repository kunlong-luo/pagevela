import type { ResumeDraft, ResumeProfile, ResumeSettings } from '../types';
import { normalizeImportedProfiles, normalizeImportedSettings } from './import-validation';

/** New exports are branded, while imports accept the original durable format token. */
export const PORTABLE_WORKSPACE_VERSION = 'pagevela-workspace-v1' as const;
const LEGACY_PORTABLE_WORKSPACE_VERSION = 'resume-craft-workspace-v1' as const;
export const MAX_PORTABLE_WORKSPACE_BYTES = 64 * 1024 * 1024;
const MAX_DRAFTS = 300;
const MAX_TEXT = 2_000_000;
const MAX_SHORT_TEXT = 240;
const JPEG_DATA_URL = /^data:image\/jpeg;base64,[a-z0-9+/]+={0,2}$/i;

export interface PortableWorkspaceBackup {
  version: typeof PORTABLE_WORKSPACE_VERSION;
  exportedAt: string;
  activeProfileId: string;
  profiles: ResumeProfile[];
  drafts: ResumeDraft[];
  jdText: string;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function safePortrait(value: unknown): value is string {
  return typeof value === 'string' && value.length < 500_000 && JPEG_DATA_URL.test(value);
}

function withOptionalLayoutSettings(
  normalized: ResumeSettings,
  source: unknown,
): ResumeSettings {
  if (!record(source)) return normalized;
  const result: ResumeSettings & { showPhoto?: boolean } = { ...normalized };
  if (source.headerLayout === 'split' ||
      source.headerLayout === 'centered' ||
      source.headerLayout === 'stacked') {
    result.headerLayout = source.headerLayout;
  }
  if (typeof source.showPhoto === 'boolean') result.showPhoto = source.showPhoto;
  return result;
}

/**
 * Validate an untrusted portable file before any persistence writes.
 * The original origin can include a locally cropped portrait in each profile.
 */
export function normalizePortableWorkspaceBackup(
  value: unknown,
  fallbackSettings: ResumeSettings,
): PortableWorkspaceBackup | null {
  if (!record(value) || (value.version !== PORTABLE_WORKSPACE_VERSION &&
      value.version !== LEGACY_PORTABLE_WORKSPACE_VERSION)) return null;
  if (typeof value.exportedAt !== 'string' || value.exportedAt.length > 80) return null;
  if (typeof value.activeProfileId !== 'string' ||
      value.activeProfileId.length > MAX_SHORT_TEXT) return null;
  if (typeof value.jdText !== 'string' || value.jdText.length > MAX_TEXT) return null;

  const normalizedProfiles = normalizeImportedProfiles(value.profiles, fallbackSettings, { allowEmptyMarkdown: true });
  if (!normalizedProfiles || !Array.isArray(value.profiles)) return null;
  const sourceProfiles = value.profiles as unknown[];
  const profiles = normalizedProfiles.map((profile, index) => {
    const raw = sourceProfiles[index];
    if (!record(raw)) return null;
    // Unknown values are rejected, not silently removed from a photo backup.
    const photoCandidate = raw.photoDataUrl;
    if (photoCandidate !== undefined && photoCandidate !== null &&
        !safePortrait(photoCandidate)) return null;
    const withPhoto = photoCandidate == null
      ? profile
      : { ...profile, photoDataUrl: photoCandidate };
    return {
      ...withPhoto,
      settings: withOptionalLayoutSettings(profile.settings, raw.settings),
    };
  });
  if (profiles.some(profile => profile === null)) return null;
  const cleanProfiles = profiles as ResumeProfile[];
  if (!cleanProfiles.some(profile => profile.id === value.activeProfileId)) return null;

  if (!Array.isArray(value.drafts) || value.drafts.length > MAX_DRAFTS) return null;
  const drafts: ResumeDraft[] = [];
  const draftIds = new Set<string>();
  for (const item of value.drafts) {
    if (!record(item) ||
        typeof item.id !== 'string' || item.id.length < 1 || item.id.length > MAX_SHORT_TEXT ||
        draftIds.has(item.id) ||
        typeof item.title !== 'string' || item.title.length < 1 || item.title.length > MAX_SHORT_TEXT ||
        typeof item.timestamp !== 'string' || item.timestamp.length > MAX_SHORT_TEXT ||
        typeof item.markdown !== 'string' || item.markdown.length > MAX_TEXT) return null;
    const settings = normalizeImportedSettings(item.settings, fallbackSettings);
    if (!settings) return null;
    const draft: ResumeDraft = {
      id: item.id,
      title: item.title,
      timestamp: item.timestamp,
      markdown: item.markdown,
      settings: withOptionalLayoutSettings(settings, item.settings),
    };
    if (typeof item.templateId === 'string' && item.templateId.length <= MAX_SHORT_TEXT) {
      draft.templateId = item.templateId;
    }
    if (typeof item.isAutoSave === 'boolean') draft.isAutoSave = item.isAutoSave;
    drafts.push(draft);
    draftIds.add(item.id);
  }

  return {
    version: PORTABLE_WORKSPACE_VERSION,
    exportedAt: value.exportedAt,
    activeProfileId: value.activeProfileId,
    profiles: cleanProfiles,
    drafts,
    jdText: value.jdText,
  };
}

export function serializePortableWorkspaceBackup(
  value: Omit<PortableWorkspaceBackup, 'version' | 'exportedAt'>,
  fallbackSettings: ResumeSettings,
): string {
  const input = {
    ...value,
    version: PORTABLE_WORKSPACE_VERSION,
    exportedAt: new Date().toISOString(),
  };
  const normalized = normalizePortableWorkspaceBackup(input, fallbackSettings);
  if (!normalized) throw new Error('invalid-workspace-backup');
  const json = JSON.stringify(normalized, null, 2);
  if (new Blob([json]).size > MAX_PORTABLE_WORKSPACE_BYTES) {
    throw new Error('workspace-backup-too-large');
  }
  return json;
}
