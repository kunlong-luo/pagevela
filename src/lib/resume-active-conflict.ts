import type { ResumeDraft, ResumeProfile } from '../types';

/** A raw IndexedDB snapshot, captured before Zustand sanitizes profile state. */
export interface ActiveResumeBaseline {
  markdown: string | null;
  profiles: ResumeProfile[];
  jdText: string | null;
}

export interface ActiveResumeWrite extends ActiveResumeBaseline {
  markdown: string;
  jdText: string;
}

export type ActiveWriteDecision = 'write' | 'already-current' | 'conflict';

/**
 * This policy compares the actual persisted content, not just the Web Lock.
 * The lock serializes writes but otherwise permits a stale tab to overwrite a
 * newer tab. An equivalent already-committed write is safe to acknowledge.
 */
export function decideActiveResumeWrite(
  committed: ActiveResumeBaseline,
  base: ActiveResumeBaseline,
  next: ActiveResumeWrite,
): ActiveWriteDecision {
  const matches = (a: ActiveResumeBaseline, b: ActiveResumeBaseline) =>
    a.markdown === b.markdown &&
    a.jdText === b.jdText &&
    JSON.stringify(a.profiles) === JSON.stringify(b.profiles);
  if (matches(committed, base)) return 'write';
  if (matches(committed, next)) return 'already-current';
  return 'conflict';
}

/**
 * Store each stale tab's source text + layout as a durable *manual* draft in
 * the existing drafts table. Never delete previously saved drafts.
 * These are restoreable in the existing Drafts UI; photo/profile metadata
 * and full-workspace reconciliation still require a separate solution.
 */
export function prepareConflictingResumeDrafts(
  snapshot: ActiveResumeWrite,
  recoveryId: string,
  when: Date,
): ResumeDraft[] {
  const timestamp = when.toISOString();
  const drafts: ResumeDraft[] = snapshot.profiles.map((profile, index) => ({
    id: `${recoveryId}_${index}`,
    title: `Conflict recovery · ${profile.name || 'Resume'}`.slice(0, 220),
    markdown: profile.markdown,
    settings: profile.settings,
    templateId: profile.templateId,
    timestamp,
    isAutoSave: false,
  }));

  // Active markdown should usually equal one of the in-memory profiles, but
  // don't silently lose it if a legacy state contains an unsynced active copy.
  if (snapshot.profiles.length > 0 &&
      !snapshot.profiles.some(profile => profile.markdown === snapshot.markdown)) {
    const active = snapshot.profiles[0];
    drafts.push({
      id: `${recoveryId}_active`,
      title: 'Conflict recovery · active editor',
      markdown: snapshot.markdown,
      settings: active.settings,
      templateId: active.templateId,
      timestamp,
      isAutoSave: false,
    });
  }
  // The plain-text JD also lives in the active snapshot. Preserve a readable
  // copy in the same local Drafts view rather than silently discarding it.
  if (snapshot.jdText.length > 0 && snapshot.profiles.length > 0) {
    drafts.push({
      id: `${recoveryId}_jd`,
      title: 'Conflict recovery · job description',
      markdown: snapshot.jdText,
      settings: snapshot.profiles[0].settings,
      timestamp,
      isAutoSave: false,
    });
  }
  return drafts;
}
