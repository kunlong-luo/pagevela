import { describe, expect, it } from 'vitest';
import { DEFAULT_MARKDOWN, TEMPLATES } from '../data';

describe('starter template social links', () => {
  const cases = [
    { name: 'default', content: DEFAULT_MARKDOWN },
    ...TEMPLATES.map(({ id, content }) => ({ name: id, content })),
  ];

  for (const { name, content } of cases) {
    it(name + ' uses full HTTPS social URLs instead of label-plus-handle examples', () => {
      expect(content).not.toMatch(/\b(?:GitHub|LinkedIn)\s*[:：]\s*your[-\w]+/i);
      // Parse complete URL tokens instead of testing a substring that could
      // also occur inside a different hostname or an untrusted URL path.
      const socialUrls = content.match(/(?:https?:\/\/)?(?:www\.)?(?:github\.com|linkedin\.com)\/[^\s·|｜]+/gi) || [];
      for (const candidate of socialUrls) {
        const parsed = new URL(candidate);
        expect(parsed.protocol).toBe('https:');
        expect(['github.com', 'linkedin.com', 'www.linkedin.com']).toContain(parsed.hostname);
      }
    });
  }
});
