/**
 * Persistent browser protocol identifiers used by previously published builds.
 *
 * These identifiers are intentionally stable and are NOT public product names.
 * Renaming them without a verified cross-tab, PWA and IndexedDB migration can
 * strand existing drafts or allow multiple browser versions to write unsafely.
 */
export const RESUME_DB_NAME = 'resume-craft';
export const RESUME_DB_WRITE_LOCK_NAME = 'resume-craft:indexeddb-write';
export const RESUME_TABS_CHANNEL_NAME = 'resume-craft:tabs:v1';
