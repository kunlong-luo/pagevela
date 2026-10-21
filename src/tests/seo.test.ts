import { readFileSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SEO_COPY, STATIC_SEO_COPY, updateSiteSeo } from '../lib/seo';

const indexHtml = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');

afterEach(() => vi.unstubAllGlobals());

describe('public product metadata', () => {
  it('serves a bilingual single-URL fallback to no-JavaScript search and social crawlers', () => {
    expect(STATIC_SEO_COPY.title).toContain('Resume Builder');
    expect(STATIC_SEO_COPY.title).toContain('中英简历编辑器');
    expect(STATIC_SEO_COPY.description).toContain('forms or Markdown');
    expect(STATIC_SEO_COPY.description).toContain('简历');
    expect(indexHtml).toContain(`<title>${STATIC_SEO_COPY.title}</title>`);
    expect(indexHtml).toContain(`name="description" content="${STATIC_SEO_COPY.description}"`);
    expect(indexHtml).toContain(`property="og:title" content="${STATIC_SEO_COPY.title}"`);
    expect(indexHtml).toContain(`property="og:description" content="${STATIC_SEO_COPY.description}"`);
    expect(indexHtml).toContain(`name="twitter:title" content="${STATIC_SEO_COPY.title}"`);
    expect(indexHtml).toContain(`name="twitter:description" content="${STATIC_SEO_COPY.description}"`);
    expect(indexHtml).toContain('property="og:locale" content="en_US"');
    expect(indexHtml).toContain('property="og:locale:alternate" content="zh_CN"');
    expect(indexHtml).toContain('rel="canonical" href="https://kunlong-luo.github.io/pagevela/"');
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
    expect(JSON.stringify({ SEO_COPY, STATIC_SEO_COPY })).not.toContain('private-resume-payload');
    expect(JSON.stringify(SEO_COPY)).not.toContain('share=');
    expect(JSON.stringify(SEO_COPY)).not.toContain('?page=');
  });
});
