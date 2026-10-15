import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PRODUCT_NAME } from '../lib/brand';
import { SEO_COPY } from '../lib/seo';
import { en } from '../i18n/locales/en';
import { zh } from '../i18n/locales/zh';

// Staging guardrails: cosmetic rebranding must never silently modify storage,
// encrypted share protocol constants, or the legacy production origin.
function source(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

describe('Pagevela global brand staging', () => {
  it('uses the exact same product name in both locales', () => {
    expect(PRODUCT_NAME).toBe('Pagevela');
    expect(SEO_COPY.en.title).toContain(PRODUCT_NAME);
    expect(SEO_COPY.zh.title).toContain(PRODUCT_NAME);
    expect(en.header.title).toBe(PRODUCT_NAME);
    expect(zh.header.title).toBe(PRODUCT_NAME);
    expect(en.errorBoundary.reset).toContain(PRODUCT_NAME);
    expect(zh.errorBoundary.reset).toContain(PRODUCT_NAME);
    expect(SEO_COPY.en.title).not.toMatch(/Resume Craft|简匠/);
    expect(SEO_COPY.zh.title).not.toMatch(/Resume Craft|简匠/);
  });

  it('removes retired marketing names from the targeted user-facing surfaces', () => {
    const surfaces = [
      'index.html',
      'src/lib/seo.ts',
      'src/components/landing/LandingNavbar.tsx',
      'src/components/landing/LandingFooter.tsx',
      'src/components/landing/LandingFeatures.tsx',
      'src/components/layout/HelpLegalModal.tsx',
      'src/components/modals/SupportProjectModal.tsx',
      'src/components/modals/RawTextImportModal.tsx',
      'src/data.ts',
      'src/i18n/locales/en.ts',
      'src/i18n/locales/zh.ts',
      'src/components/landing/LandingPrivacy.tsx',
      'src/components/landing/showcaseData.ts',
      'src/components/EditorWorkspace.tsx',
      'vite.config.ts',
      'README.md',
      'README.zh-CN.md',
      'README.en.md',
      'docs/WORKSPACE_TRANSFER.md',
      '.github/assets/readme-banner.svg',
      'public/og-card.svg',
    ];
    for (const path of surfaces) {
      expect(source(path), path).not.toMatch(/Resume Craft|简匠/);
    }
    expect(source('index.html')).toContain('<title>Pagevela — Local-First Resume Builder</title>');
    expect(source('index.html')).toContain('property="og:site_name" content="Pagevela"');
    expect(source('index.html')).toContain('name="apple-mobile-web-app-title" content="Pagevela"');
    expect(source('vite.config.ts')).toContain("short_name: 'Pagevela'");
    expect(source('src/components/landing/LandingNavbar.tsx')).toContain('{PRODUCT_NAME}');
    expect(source('src/components/landing/LandingFooter.tsx')).toContain('{PRODUCT_NAME}');
  });

  it('does not ship retired public brand names in production source modules', () => {
    const sourceDir = fileURLToPath(new URL('../', import.meta.url));
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        if (entry.isDirectory()) {
          return entry.name === 'tests' ? [] : walk(join(dir, entry.name));
        }
        return ['.ts', '.tsx', '.js', '.jsx'].some((ext) => entry.name.endsWith(ext)) &&
          !entry.name.includes('.test.')
          ? [join(dir, entry.name)]
          : [];
      });

    for (const file of walk(sourceDir)) {
      expect(readFileSync(file, 'utf8'), file).not.toMatch(/Resume Craft|简匠/);
    }
  });

  it('retains the real production origin until separate migration approval', () => {
    expect(source('index.html')).toContain(
      'rel="canonical" href="https://kunlong-luo.github.io/resume-craft/"',
    );
    expect(source('public/sitemap.xml')).toContain('https://kunlong-luo.github.io/resume-craft/');
  });

  it('does not break legacy share decryption or client-side cache identities', () => {
    const shareUtils = source('src/lib/share-utils.ts');
    expect(shareUtils).toContain("'resume-craft-share-v2'");
    expect(shareUtils).toContain("'resume-craft-share-v3'");
    expect(source('vite.config.ts')).toContain("cacheName: 'resume-craft-pdf-tools'");
    expect(source('package.json')).toContain('"name": "resume-craft"');
    expect(source('src/components/EditorWorkspace.tsx')).toContain(
      "new BroadcastChannel('resume-craft:tabs:v1')",
    );
    expect(source('src/components/layout/Header.tsx')).toContain(
      "window.addEventListener('resume-craft:open-backup'",
    );
  });
});
