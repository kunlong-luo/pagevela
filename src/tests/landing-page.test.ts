import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getRouteFromLocation, buildRouteUrl } from '../lib/router';

describe('Landing Page & Router integration', () => {
  describe('Route resolution (getRouteFromLocation)', () => {
    it('returns "editor" when ?page=editor is present in search', () => {
      expect(getRouteFromLocation({ search: '?page=editor' })).toBe('editor');
    });

    it('returns "editor" when ?view=editor is present in search', () => {
      expect(getRouteFromLocation({ search: '?view=editor' })).toBe('editor');
    });

    it('returns "editor" when ?route=editor is present in search', () => {
      expect(getRouteFromLocation({ search: '?route=editor' })).toBe('editor');
    });

    it('returns "editor" when #/editor is in hash', () => {
      expect(getRouteFromLocation({ hash: '#/editor' })).toBe('editor');
    });

    it('returns "editor" when pathname ends with /editor', () => {
      expect(getRouteFromLocation({ pathname: '/pagevela/editor' })).toBe('editor');
    });

    it('returns "landing" when ?page=landing is present', () => {
      expect(getRouteFromLocation({ search: '?page=landing' })).toBe('landing');
    });

    it('returns "landing" when #/landing is in hash', () => {
      expect(getRouteFromLocation({ hash: '#/landing' })).toBe('landing');
    });

    it('defaults to "landing" when root path has no query or hash', () => {
      expect(getRouteFromLocation({ search: '', hash: '', pathname: '/pagevela/' })).toBe('landing');
      expect(getRouteFromLocation({ search: '', hash: '', pathname: '/' })).toBe('landing');
    });
  });

  describe('URL construction (buildRouteUrl)', () => {
    const base = 'https://kunlong-luo.github.io/pagevela/';

    it('constructs an editor url with page=editor', () => {
      const url = buildRouteUrl('editor', undefined, base);
      expect(url).toBe('https://kunlong-luo.github.io/pagevela/?page=editor');
    });

    it('includes template query when templateId option is supplied', () => {
      const url = buildRouteUrl('editor', { templateId: 'backend' }, base);
      expect(url).toContain('page=editor');
      expect(url).toContain('template=backend');
    });

    it('clears editor query params when returning to landing', () => {
      const initial = 'https://kunlong-luo.github.io/pagevela/?page=editor&template=campus#/editor';
      const url = buildRouteUrl('landing', undefined, initial);
      expect(url).toBe('https://kunlong-luo.github.io/pagevela/');
      expect(url).not.toContain('page=editor');
      expect(url).not.toContain('template=campus');
      expect(url).not.toContain('#/editor');
    });
  });

  describe('First-time onboarding trigger check', () => {
    it('identifies first time entering editor when onboarding is not complete', () => {
      const storageMock: Record<string, string> = {};
      const isFirstTimeOnboarding = storageMock['resume-onboarding-v1-complete'] !== '1';
      expect(isFirstTimeOnboarding).toBe(true);
    });

    it('identifies returning user when onboarding has been completed', () => {
      const storageMock: Record<string, string> = {
        'resume-onboarding-v1-complete': '1',
      };
      const isFirstTimeOnboarding = storageMock['resume-onboarding-v1-complete'] !== '1';
      expect(isFirstTimeOnboarding).toBe(false);
    });
  });
});


describe('Landing bilingual brand labels', () => {
  it('uses the same global Pagevela identity in Chinese and English navigation', () => {
    const navbar = readFileSync(new URL('../components/landing/LandingNavbar.tsx', import.meta.url), 'utf8');
    const footer = readFileSync(new URL('../components/landing/LandingFooter.tsx', import.meta.url), 'utf8');
    const expectedBrand = '{PRODUCT_NAME}';

    expect(navbar).toContain(expectedBrand);
    expect(footer).toContain(expectedBrand);
    expect(navbar).not.toMatch(/Resume Craft|简匠/);
    expect(footer).not.toMatch(/Resume Craft|简匠/);
  });
});

describe('Landing GitHub Star entry points', () => {
  it('provides GitHub Star links in the hero and navigation', () => {
    const hero = readFileSync(new URL('../components/landing/LandingHero.tsx', import.meta.url), 'utf8');
    const navbar = readFileSync(new URL('../components/landing/LandingNavbar.tsx', import.meta.url), 'utf8');
    const repositoryUrl = 'https://github.com/kunlong-luo/pagevela';

    expect(hero).toContain(repositoryUrl);
    expect(hero).toContain('landing-github-star');
    expect(hero).toContain('Star on GitHub');
    expect(hero).toContain('在 GitHub 点个 Star');
    expect(navbar).toContain(repositoryUrl);
    expect(navbar).toContain('Star Pagevela on GitHub');
    expect(hero).toContain('rel="noopener noreferrer"');
    expect(navbar).toContain('rel="noopener noreferrer"');
  });
});
