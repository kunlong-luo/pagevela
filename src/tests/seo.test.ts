import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEO_COPY, updateSiteSeo } from '../lib/seo';

const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

afterEach(() => vi.unstubAllGlobals());

describe('public product metadata', () => {
  it('serves English metadata to crawlers before JavaScript loads', () => {
    expect(indexHtml).toContain(`<title>${SEO_COPY.en.title}</title>`);
    expect(indexHtml).toContain(`name="description" content="${SEO_COPY.en.description}"`);
    expect(indexHtml).toContain(`property="og:title" content="${SEO_COPY.en.title}"`);
    expect(indexHtml).toContain(`property="og:description" content="${SEO_COPY.en.description}"`);
    expect(indexHtml).toContain(`name="twitter:title" content="${SEO_COPY.en.title}"`);
    expect(indexHtml).toContain(`name="twitter:description" content="${SEO_COPY.en.description}"`);
    expect(indexHtml).toContain('property="og:locale" content="en_US"');
    expect(indexHtml).toContain('rel="canonical" href="https://kunlong-luo.github.io/resume-craft/"');
  });

  it('switches only fixed public metadata when UI language changes', () => {
    const metas = new Map<string, { content: string }>();
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:locale"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
    ]) metas.set(selector, { content: '' });

    const fakeDocument = {
      title: '',
      documentElement: { lang: '' },
      querySelector: (selector: string) => metas.get(selector) ?? null,
    };
    vi.stubGlobal('document', fakeDocument);
    updateSiteSeo('zh');
    expect(fakeDocument.title).toBe(SEO_COPY.zh.title);
    expect(fakeDocument.documentElement.lang).toBe('zh-CN');
    expect(metas.get('meta[property="og:locale"]')?.content).toBe('zh_CN');
    expect(metas.get('meta[name="description"]')?.content).toBe(SEO_COPY.zh.description);

    updateSiteSeo('en');
    expect(fakeDocument.title).toBe(SEO_COPY.en.title);
    expect(fakeDocument.documentElement.lang).toBe('en');
    expect(metas.get('meta[name="twitter:description"]')?.content).toBe(SEO_COPY.en.description);
  });

  it('never puts a resume, job description, or share payload into SEO text', () => {
    expect(JSON.stringify(SEO_COPY)).not.toContain('private-resume-payload');
    expect(JSON.stringify(SEO_COPY)).not.toContain('share=');
    expect(JSON.stringify(SEO_COPY)).not.toContain('?page=');
  });
});
