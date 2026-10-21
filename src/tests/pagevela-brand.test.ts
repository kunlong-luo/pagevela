import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PRODUCT_NAME, PRODUCT_NAME_ZH, getProductDisplayName } from '../lib/brand';
import { SEO_COPY, STATIC_SEO_COPY } from '../lib/seo';
import { en } from '../i18n/locales/en';
import { zh } from '../i18n/locales/zh';

// Branding guardrails: visual product naming must never silently change persisted
// storage, encrypted share constants, or compatibility identifiers.
function source(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

describe('Pagevela public brand and compatibility', () => {
  it('shows 页帆 in Chinese UI and Pagevela in English while retaining compatibility names', () => {
    expect(PRODUCT_NAME).toBe('Pagevela');
    expect(SEO_COPY.en.title).toContain(PRODUCT_NAME);
    expect(SEO_COPY.zh.title).toContain(PRODUCT_NAME);
    expect(PRODUCT_NAME_ZH).toBe('页帆');
    expect(getProductDisplayName('en')).toBe(PRODUCT_NAME);
    expect(getProductDisplayName('zh')).toBe(PRODUCT_NAME_ZH);
    expect(SEO_COPY.zh.title).toContain(PRODUCT_NAME_ZH);
    expect(en.header.title).toBe(PRODUCT_NAME);
    expect(zh.header.title).toBe(PRODUCT_NAME_ZH);
    expect(en.errorBoundary.reset).toContain(PRODUCT_NAME);
    expect(zh.errorBoundary.reset).toContain(PRODUCT_NAME_ZH);
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
      'docs/PROMOTION_MEDIA.md',
      'SUPPORT.md',
      'RELEASING.md',
      'scripts/render-promotion-assets.mjs',
      'scripts/capture-promotion-media.mjs',
      '.github/assets/readme-banner.svg',
      'public/og-card.svg',
    ];
    for (const path of surfaces) {
      expect(source(path), path).not.toMatch(/Resume Craft|简匠/);
    }
    expect(source('index.html')).toContain(`<title>${STATIC_SEO_COPY.title}</title>`);
    expect(STATIC_SEO_COPY.title).toContain(PRODUCT_NAME);
    expect(STATIC_SEO_COPY.title).toContain(PRODUCT_NAME_ZH);
    expect(source('index.html')).toContain('property="og:site_name" content="Pagevela"');
    expect(source('index.html')).toContain('name="apple-mobile-web-app-title" content="Pagevela"');
    expect(source('vite.config.ts')).toContain("short_name: 'Pagevela'");
    expect(source('metadata.json')).toContain('"name": "Pagevela"');
    expect(source('README.md')).not.toContain('PAGEVELA');
    expect(source('README.zh-CN.md')).not.toContain('PAGEVELA');
    expect(source('docs/PROMOTION_MEDIA.md')).toContain('select `main`');
    expect(source('docs/PAGEVELA_STAGING.md')).toContain('**Pagevela** is live at');
    expect(source('docs/WORKSPACE_TRANSFER.md')).toContain('former `/resume-craft/`');
    expect(source('README.en.md')).toContain('Pagevela is live');
    expect(source('README.md')).toContain('https://kunlong-luo.github.io/pagevela/');
    expect(source('README.zh-CN.md')).toContain('https://kunlong-luo.github.io/pagevela/');
    expect(source('.github/workflows/capture-promotion-media.yml')).toContain('workflow_dispatch:');
    expect(source('scripts/render-promotion-assets.mjs')).toContain("text(x, 'Pagevela'");
    expect(source('scripts/render-promotion-assets.mjs')).toContain("text(x, 'P', left + 14");
    expect(source('src/components/landing/LandingNavbar.tsx')).toContain("getProductDisplayName(isEn ? 'en' : 'zh')");
    expect(source('src/components/landing/LandingFooter.tsx')).toContain("getProductDisplayName(isEn ? 'en' : 'zh')");
    expect(source('index.html')).toContain('resume_ui_language');
    expect(source('index.html')).toContain('class="startup-brand-zh">页帆');
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

  it('uses the renamed live Pages path without changing user-data identifiers', () => {
    expect(source('index.html')).toContain(
      'rel="canonical" href="https://kunlong-luo.github.io/pagevela/"',
    );
    expect(source('public/sitemap.xml')).toContain('https://kunlong-luo.github.io/pagevela/');
    expect(source('public/robots.txt')).toContain('https://kunlong-luo.github.io/pagevela/sitemap.xml');
    expect(source('index.html')).toContain('property="og:url" content="https://kunlong-luo.github.io/pagevela/"');
    expect(source('index.html')).toContain('property="og:image" content="https://kunlong-luo.github.io/pagevela/og-card.png"');
    expect(source('index.html')).not.toContain('kunlong-luo.github.io/resume-craft/');
    expect(source('.github/workflows/seo-submit.yml')).toContain('https://kunlong-luo.github.io/pagevela/sitemap.xml');
    expect(source('.github/workflows/promote.yml')).toContain('/pagevela/');
    expect(source('src/components/landing/LandingNavbar.tsx')).toContain('https://github.com/kunlong-luo/pagevela');
    expect(source('src/components/landing/LandingFooter.tsx')).toContain('https://github.com/kunlong-luo/pagevela');
    const help = source('src/components/layout/HelpLegalModal.tsx');
    expect(help).toContain('https://github.com/kunlong-luo/pagevela/discussions');
    expect(help).toContain('kunlong-luo/pagevela</span>');
    expect(help).not.toContain('github.com/kunlong-luo/resume-craft');
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
