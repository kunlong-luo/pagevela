/**
 * Stable opaque profile IDs for local IndexedDB and portable backups.
 *
 * Date.now() alone collides when a user creates/duplicates more than one
 * profile within the same millisecond; Dexie's primary key would then silently
 * replace one record. Keep the legacy "profile_" prefix but use a UUID on
 * secure origins and a timestamp + per-context sequence + random fallback.
 * Existing stored/backup IDs are never rewritten.
 */
let fallbackSequence = 0;

export function createResumeProfileId(
  getUuid: () => string | undefined = () =>
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : undefined,
  now: () => number = Date.now,
  random: () => number = Math.random,
): string {
  const uuid = getUuid();
  if (uuid) return `profile_${uuid}`;

  fallbackSequence += 1;
  return `profile_${now()}_${fallbackSequence.toString(36)}_${random().toString(36).slice(2, 10)}`;
}
