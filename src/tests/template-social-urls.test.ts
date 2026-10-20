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
      for (const line of content.split('\n')) {
        if (line.includes('github.com/')) expect(line).toContain('https://github.com/');
        if (line.includes('linkedin.com/')) expect(line).toMatch(/https:\/\/(?:www\.)?linkedin\.com\//);
      }
    });
  }
});
