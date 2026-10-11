export type AppRoute = 'landing' | 'editor';

export interface RouteState {
  route: AppRoute;
  templateId?: string;
}

export interface LocationLike {
  search?: string;
  hash?: string;
  pathname?: string;
}

/**
 * Parses the route from the browser URL (search params, hash, or pathname).
 * Supports an optional locationLike argument for unit testing and SSR environments.
 */
export function getRouteFromLocation(locationOverride?: LocationLike): AppRoute {
  const search = locationOverride?.search ?? (typeof window !== 'undefined' ? window.location.search : '');
  const hash = (locationOverride?.hash ?? (typeof window !== 'undefined' ? window.location.hash : '')).toLowerCase();
  const pathname = (locationOverride?.pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '')).replace(/\/$/, '');

  const searchParams = new URLSearchParams(search);
  const pageParam = searchParams.get('page') || searchParams.get('view') || searchParams.get('route');

  if (pageParam === 'editor') return 'editor';
  if (pageParam === 'landing' || pageParam === 'home') return 'landing';

  // Check hash
  if (hash.includes('#/editor') || hash === '#editor') return 'editor';
  if (hash.includes('#/landing') || hash === '#landing' || hash === '#home') return 'landing';

  // Check pathname (e.g. /editor or /resume-craft/editor)
  if (pathname.endsWith('/editor')) return 'editor';
  if (pathname.endsWith('/landing')) return 'landing';

  // Default to landing page when visiting root / base
  return 'landing';
}

/**
 * Creates the URL for a specific route while preserving base path.
 */
export function buildRouteUrl(route: AppRoute, options?: { templateId?: string }, baseHref?: string): string {
  const currentHref = baseHref ?? (typeof window !== 'undefined' ? window.location.href : 'https://kunlong-luo.github.io/resume-craft/');
  const url = new URL(currentHref);
  
  if (route === 'editor') {
    url.searchParams.set('page', 'editor');
    if (options?.templateId) {
      url.searchParams.set('template', options.templateId);
    } else {
      url.searchParams.delete('template');
    }
  } else {
    url.searchParams.delete('page');
    url.searchParams.delete('template');
    url.searchParams.delete('view');
    if (url.hash.includes('editor')) {
      url.hash = '';
    }
  }

  return url.toString();
}
