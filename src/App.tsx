import React, { useMemo, useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useResumeStore } from './store/useResumeStore';
import { getSharePayloadFromLocation, parseSharePayload } from './lib/share-utils';
import { getRouteFromLocation, buildRouteUrl, type AppRoute } from './lib/router';
import { LandingPage } from './components/landing/LandingPage';
import { EditorWorkspace } from './components/EditorWorkspace';
import { storage, STORAGE_KEYS } from './lib/storage';

const SharedResumePage = lazy(() => import('./components/share/SharedResumePage').then(m => ({ default: m.SharedResumePage })));

export default function App() {
  const sharePayload = useMemo(() => {
    try {
      const payload = getSharePayloadFromLocation(
        window.location.search,
        window.location.hash,
      );
      if (payload) {
        return parseSharePayload(payload);
      }
    } catch (e) {
      console.error('Failed to parse share payload', e);
    }
    return null;
  }, []);

  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => getRouteFromLocation());
  const themeMode = useResumeStore((state) => state.themeMode);

  // Sync theme (Light / Dark / System)
  useEffect(() => {
    const applyTheme = () => {
      const mode = themeMode || 'light';
      let isDark = false;
      if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'system') {
        isDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark', isDark);
      }
    };

    applyTheme();

    if (themeMode === 'system' && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [themeMode]);

  // Sync browser back/forward history navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getRouteFromLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Check URL template query parameter on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const templateParam = searchParams.get('template');
      if (templateParam) {
        useResumeStore.getState().applyTemplate(templateParam);
      }
    } catch (e) {
      console.error('Failed to read template parameter', e);
    }
  }, []);

  const navigateTo = useCallback((route: AppRoute, options?: { templateId?: string }) => {
    setCurrentRoute(route);
    if (options?.templateId) {
      useResumeStore.getState().applyTemplate(options.templateId);
    }
    const nextUrl = buildRouteUrl(route, options);
    if (typeof window !== 'undefined' && nextUrl && window.location.href !== nextUrl) {
      window.history.pushState(null, '', nextUrl);
    }
  }, []);

  if (sharePayload) {
    const shareLanguage =
      sharePayload.kind === 'plain'
        ? sharePayload.state.settings.lang
        : sharePayload.payload.lang;
    const loadingLabel = shareLanguage === 'en' ? 'Loading...' : '正在加载...';

    return (
      <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-bold">{loadingLabel}</div>}>
        <SharedResumePage sharePayload={sharePayload} />
      </Suspense>
    );
  }

  if (currentRoute === 'landing') {
    return (
      <div className="animate-fadeIn transition-opacity duration-300">
        <LandingPage
          onOpenEditor={() => navigateTo('editor')}
          onSelectTemplate={(templateId) => navigateTo('editor', { templateId })}
        />
      </div>
    );
  }

  const isFirstTimeOnboarding = storage.getString(STORAGE_KEYS.ONBOARDING_COMPLETE) !== '1';

  return (
    <div className="animate-fadeIn transition-opacity duration-300">
      <EditorWorkspace
        onNavigateToLanding={() => navigateTo('landing')}
        initialOpenOnboarding={isFirstTimeOnboarding}
      />
    </div>
  );
}