import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function source(path: string) {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

describe('Pagevela post-rename publication links', () => {
  it('does not publish retired Pages URLs in current promotion or release links', () => {
    for (const path of ['PROMOTION.md', 'RELEASE_NOTES.md', 'docs/V2_6_0_SOCIAL_LAUNCH_KIT.md']) {
      const doc = source(path);
      expect(doc, path).toContain('https://kunlong-luo.github.io/pagevela/');
      expect(doc, path).not.toContain('https://kunlong-luo.github.io/resume-craft/');
      expect(doc, path).not.toContain('https://github.com/kunlong-luo/resume-craft');
    }
  });

  it('gives prominent current-brand context while preserving historic release identities', () => {
    expect(source('RELEASE_NOTES.md')).toContain('# Resume Craft v2.6.0');
    expect(source('RELEASE_NOTES.md')).toContain('Current project name (2026-10-16): Pagevela');
    expect(source('PROMOTION.md')).toContain('Do not post the original campaign copy as-is');
    expect(source('docs/V2_6_0_SOCIAL_LAUNCH_KIT.md')).toContain('现行品牌为 Pagevela');
  });

  it('creates future Pagevela release titles but leaves old artifact filenames stable', () => {
    const workflow = source('.github/workflows/release.yml');
    expect(workflow).toContain('git tag -a "${TAG}" -m "Pagevela ${TAG}"');
    expect(workflow).toContain('--title "Pagevela ${TAG}"');
    expect(workflow).not.toContain('--title "Resume Craft ${TAG}"');
    expect(workflow).toContain('pagevela-${VERSION}.zip');
    expect(workflow).toContain('SHA256SUMS.txt');
  });
});
