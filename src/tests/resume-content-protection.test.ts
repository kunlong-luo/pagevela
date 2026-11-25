import { describe, expect, it } from 'vitest';
import { STARTER_MARKDOWN, STARTER_MARKDOWN_EN } from '../data';
import { hasExistingResumeWork } from '../lib/resume-content-protection';

describe('saved-resume detection independent of onboarding flag', () => {
  it('recognizes a new, untouched starter as safe for a first start choice', () => {
    expect(hasExistingResumeWork(STARTER_MARKDOWN, [{
      id: 'profile_default', markdown: STARTER_MARKDOWN,
    }])).toBe(false);
    expect(hasExistingResumeWork(STARTER_MARKDOWN_EN, [{
      id: 'profile_default', markdown: STARTER_MARKDOWN_EN,
    }])).toBe(false);
  });

  it('protects edited content, renamed profiles and multiple existing profiles', () => {
    expect(hasExistingResumeWork('# Actual CV\nWork history', [{
      id: 'profile_default', markdown: '# Actual CV\nWork history',
    }])).toBe(true);
    expect(hasExistingResumeWork(STARTER_MARKDOWN, [{
      id: 'custom-profile', markdown: STARTER_MARKDOWN,
    }])).toBe(true);
    expect(hasExistingResumeWork(STARTER_MARKDOWN, [{
      id: 'profile_default', markdown: STARTER_MARKDOWN,
    }, {
      id: 'another', markdown: 'Some work',
    }])).toBe(true);
  });

  it('treats a deliberately blank resume and inconsistent profile state as protected', () => {
    expect(hasExistingResumeWork('', [{ id: 'profile_default', markdown: '' }])).toBe(true);
    expect(hasExistingResumeWork(STARTER_MARKDOWN, [])).toBe(true);
  });
});
