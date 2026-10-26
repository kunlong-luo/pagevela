import { useEffect } from 'react';
import type { Language, ResumeDraft, ResumeSettings } from '../types';
import { resumeRepository } from '../lib/resume-repository';
import { useResumeStore } from '../store/useResumeStore';

export const AUTO_DRAFT_INTERVAL_MS = 180_000;
const MAX_AUTO_DRAFTS = 5;

export interface DraftHistoryState {
  markdown: string;
  settings: ResumeSettings;
  currentTemplateId: string;
  uiLanguage: Language;
}

/**
 * Pure rotation policy: preserve manual drafts, retain up to five autosaves
 * and avoid storing an identical document twice.
 */
export function preparePeriodicDraftHistory(
  currentDrafts: ResumeDraft[],
  current: DraftHistoryState,
  now: Date,
): ResumeDraft[] | null {
  if (currentDrafts.some((draft) => draft.markdown === current.markdown)) return null;

  const locale = current.uiLanguage === 'en' ? 'en-US' : 'zh-CN';
  const autoDraft: ResumeDraft = {
    id: `draft_auto_${now.getTime()}`,
    title: now.toLocaleTimeString(locale, { hour12: false }),
    markdown: current.markdown,
    settings: current.settings,
    templateId: current.currentTemplateId,
    timestamp: now.toLocaleString(locale, { hour12: false }),
    isAutoSave: true,
  };

  const manualDrafts = currentDrafts.filter((draft) => !draft.isAutoSave);
  const previousAutoDrafts = currentDrafts.filter((draft) => draft.isAutoSave);
  return [autoDraft, ...previousAutoDrafts].slice(0, MAX_AUTO_DRAFTS).concat(manualDrafts);
}

/** A single timer with no overlapping history replacements per workspace. */
export function usePeriodicDraftHistory(): void {
  useEffect(() => {
    let active = true;
    let inFlight = false;

    const snapshot = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const currentDrafts = await resumeRepository.getDrafts();
        if (!active) return;
        const current = useResumeStore.getState();
        const nextDrafts = preparePeriodicDraftHistory(currentDrafts, current, new Date());
        if (nextDrafts) await resumeRepository.replaceDrafts(nextDrafts);
      } catch (error) {
        console.error('[autosave] Failed to save draft to IndexedDB:', error);
      } finally {
        inFlight = false;
      }
    };

    const interval = window.setInterval(() => { void snapshot(); }, AUTO_DRAFT_INTERVAL_MS);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);
}
