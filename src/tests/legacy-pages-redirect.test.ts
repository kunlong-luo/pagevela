import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const redirectSite = resolve(process.cwd(), 'docs/legacy-pages-redirect/site');

function redirectMarkup(name: 'resume-craft/index.html' | '404.html'): string {
  return readFileSync(resolve(redirectSite, name), 'utf8');
}

function runRedirect(markup: string, href: string): string | null {
  const script = markup.match(/<script id="legacy-pagevela-redirect">([\s\S]*?)<\/script>/)?.[1];
  if (!script) throw new Error('Missing inline redirect script');
  const source = new URL(href);
  let result: string | null = null;

  const location = {
    origin: source.origin,
    pathname: source.pathname,
    search: source.search,
    hash: source.hash,
    replace(next: string) {
      result = next;
    },
  };

  runInNewContext(script, { window: { location }, URL, URLSearchParams });
  return result;
}

describe('legacy GitHub Pages website redirect kit', () => {
  const entry = redirectMarkup('resume-craft/index.html');
  const notFound = redirectMarkup('404.html');

  it('keeps old and missing-route redirect scripts identical', () => {
    const extract = (markup: string) =>
      markup.match(/<script id="legacy-pagevela-redirect">([\s\S]*?)<\/script>/)?.[1];
    expect(extract(entry)).toBe(extract(notFound));
  });

  it('redirects the old homepage to the new Pagevela homepage', () => {
    expect(runRedirect(entry, 'https://kunlong-luo.github.io/resume-craft/'))
      .toBe('https://kunlong-luo.github.io/pagevela/');
  });

  it('preserves query strings and share payload fragments without decoding them', () => {
    const old = 'https://kunlong-luo.github.io/resume-craft/?share=YSUyQiUyRg%3D%3D#v3=opaque%2Bpayload';
    expect(runRedirect(entry, old))
      .toBe('https://kunlong-luo.github.io/pagevela/?share=YSUyQiUyRg%3D%3D#v3=opaque%2Bpayload');
  });

  it('keeps direct editor deep links and existing query parameters working', () => {
    expect(runRedirect(notFound, 'https://kunlong-luo.github.io/resume-craft/editor?template=backend#/editor'))
      .toBe('https://kunlong-luo.github.io/pagevela/?template=backend&page=editor#/editor');
    expect(runRedirect(entry, 'https://kunlong-luo.github.io/resume-craft/?page=editor&template=campus'))
      .toBe('https://kunlong-luo.github.io/pagevela/?page=editor&template=campus');
  });

  it('rewrites old static asset paths when the new site has corresponding files', () => {
    expect(runRedirect(notFound, 'https://kunlong-luo.github.io/resume-craft/og-card.png'))
      .toBe('https://kunlong-luo.github.io/pagevela/og-card.png');
    expect(runRedirect(notFound, 'https://kunlong-luo.github.io/resume-craft/sitemap.xml'))
      .toBe('https://kunlong-luo.github.io/pagevela/sitemap.xml');
  });

  it('does not intercept unrelated user-pages paths', () => {
    expect(runRedirect(notFound, 'https://kunlong-luo.github.io/not-this-site/')).toBeNull();
  });

  it('does not claim the site is a server-side 301 redirect', () => {
    expect(entry).toContain('noindex,follow');
    expect(entry).toContain('https://kunlong-luo.github.io/pagevela/');
    expect(entry).not.toContain('http-equiv="refresh"');
  });
});
