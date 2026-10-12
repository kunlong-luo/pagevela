import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ScriptHandler = () => void;

function installAnalyticsBrowser(options: {
  hostname?: string;
  pathname?: string;
  search?: string;
  hash?: string;
  doNotTrack?: string | null;
  scriptOutcome?: 'load' | 'error';
} = {}) {
  const handlers = new Map<string, ScriptHandler>();
  const pageview = vi.fn();
  const event = vi.fn();
  const script = {
    id: '',
    async: false,
    src: '',
    dataset: {} as Record<string, string>,
    referrerPolicy: '',
    addEventListener: (name: string, handler: ScriptHandler) => {
      handlers.set(name, handler);
    },
  };
  const appendChild = vi.fn(() => {
    // Simulate a vendor script that provides the documented API on load.
    queueMicrotask(() => {
      if (options.scriptOutcome === 'error') {
        handlers.get('error')?.();
      } else {
        handlers.get('load')?.();
      }
    });
    return script;
  });
  vi.stubGlobal('window', {
    location: {
      hostname: options.hostname ?? 'kunlong-luo.github.io',
      pathname: options.pathname ?? '/resume-craft/',
      search: options.search ?? '',
      hash: options.hash ?? '',
    },
    sa_pageview: pageview,
    sa_event: event,
  });
  vi.stubGlobal('navigator', { doNotTrack: options.doNotTrack ?? '0' });
  vi.stubGlobal('document', {
    getElementById: () => null,
    createElement: () => script,
    head: { appendChild },
  });
  return { pageview, event, script, appendChild };
}

describe('analytics pageview boot contract', () => {
  it('starts the pageview before storage migration and app initialization', () => {
    const main = readFileSync(new URL('../main.tsx', import.meta.url), 'utf8');
    const calls = main.match(/^initAnalyticsPageview\(\);$/gm) ?? [];
    expect(calls).toHaveLength(1);
    expect(main.indexOf('initAnalyticsPageview();')).toBeLessThan(
      main.indexOf('void bootstrap();'),
    );
  });

  beforeEach(() => vi.resetModules());
  afterEach(() => vi.unstubAllGlobals());

  it('manually sends exactly one path-only pageview after the vendor loads', async () => {
    const browser = installAnalyticsBrowser({
      search: '?page=editor&utm_source=producthunt',
      hash: '#unrelated-fragment',
    });
    const { initAnalyticsPageview } = await import('../lib/analytics');
    initAnalyticsPageview();

    await vi.waitFor(() => expect(browser.pageview).toHaveBeenCalledTimes(1));
    expect(browser.pageview).toHaveBeenCalledWith('/resume-craft/');
    expect(browser.script.dataset.autoCollect).toBe('false');
    expect(browser.script.dataset.collectDnt).toBe('false');
    expect(browser.appendChild).toHaveBeenCalledTimes(1);
  });

  it('never puts legacy or fragment share payloads in pageviews', async () => {
    for (const location of [
      { search: '?share=private-resume-data&utm_source=producthunt', hash: '' },
      { search: '', hash: '#share=private-resume-data' },
    ]) {
      vi.resetModules();
      const browser = installAnalyticsBrowser(location);
      const { initAnalyticsPageview } = await import('../lib/analytics');
      initAnalyticsPageview();
      await vi.waitFor(() => expect(browser.pageview).toHaveBeenCalledTimes(1));
      expect(browser.pageview).toHaveBeenCalledWith('/resume-craft/shared');
      expect(JSON.stringify(browser.pageview.mock.calls)).not.toContain('private-resume-data');
    }
  });

  it('does not load analytics on other domains or when Do Not Track is enabled', async () => {
    for (const options of [
      { hostname: 'localhost' },
      { doNotTrack: '1' },
    ]) {
      vi.resetModules();
      const browser = installAnalyticsBrowser(options);
      const { initAnalyticsPageview } = await import('../lib/analytics');
      initAnalyticsPageview();
      await Promise.resolve();
      expect(browser.appendChild).not.toHaveBeenCalled();
      expect(browser.pageview).not.toHaveBeenCalled();
    }
  });

  it('does not emit pageviews or crash when the tracking script is blocked', async () => {
    const browser = installAnalyticsBrowser({ scriptOutcome: 'error' });
    const { initAnalyticsPageview } = await import('../lib/analytics');
    initAnalyticsPageview();
    await vi.waitFor(() => expect(browser.appendChild).toHaveBeenCalledTimes(1));
    await Promise.resolve();
    expect(browser.pageview).not.toHaveBeenCalled();
  });
});
