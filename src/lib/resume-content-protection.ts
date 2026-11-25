import { STARTER_MARKDOWN, STARTER_MARKDOWN_EN } from '../data';
import type { ResumeProfile } from '../types';

/**
 * The onboarding localStorage marker may be missing even when IndexedDB still
 * contains real resumes. Only the untouched, single-profile starter can be
 * replaced without an explicit confirmation.
 */
export function hasExistingResumeWork(
  markdown: string,
  profiles: readonly Pick<ResumeProfile, 'id' | 'markdown'>[],
): boolean {
  if (markdown !== STARTER_MARKDOWN && markdown !== STARTER_MARKDOWN_EN) return true;
  return profiles.length !== 1 ||
    profiles[0]?.id !== 'profile_default' ||
    profiles[0]?.markdown !== markdown;
}
