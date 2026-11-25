import React, { useMemo, useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { useResumeStore } from './store/useResumeStore';
import { getSharePayloadFromLocation, parseSharePayload } from './lib/share-utils';
import { getRouteFromLocation, buildRouteUrl, type AppRoute } from './lib/router';
import { LandingPage } from './components/landing/LandingPage';
// Keep the editor's larger component tree out of the welcome-page JavaScript.
// Loading it only on the editor route also avoids eagerly evaluating its vendors.
const EditorWorkspace = lazy(() => import('./components/EditorWorkspace').then(m => ({ default: m.EditorWorkspace })));
import { storage, STORAGE_KEYS } from './lib/storage';
import { trackAnalyticsEvent } from './lib/analytics';
import { updateSiteSeo } from './lib/seo';
import { hasExistingResumeWork } from './lib/resume-content-protection';
import { useConfirm } from './context/ConfirmContext';

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
  const uiLanguage = useResumeStore((state) => state.uiLanguage);
  const { confirm } = useConfirm();

  // Update only fixed product metadata, never any resume or shared-link content.
  useEffect(() => {
    if (!sharePayload) updateSiteSeo(uiLanguage === 'zh' ? 'zh' : 'en');
  }, [uiLanguage, sharePayload]);

  // Includes deep links and reloads; analytics de-duplicates within a page load.
  useEffect(() => {
    if (!sharePayload && currentRoute === 'editor') trackAnalyticsEvent('editor_opened');
  }, [currentRoute, sharePayload]);

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

  // A template deep-link is a one-time *request*, not persistent state.
  // Remove it before asking for confirmation so reload/StrictMode/back cannot
  // silently apply a template again to an edited IndexedDB resume.
  useEffect(() => {
    if (typeof window === 'undefined' || sharePayload || getRouteFromLocation() !== 'editor') return;
    const url = new URL(window.location.href);
    const templateId = url.searchParams.get('template');
    if (!templateId) return;
    url.searchParams.delete('template');
    window.history.replaceState(window.history.state, '', url.toString());

    const openRequestedTemplate = async () => {
      const current = useResumeStore.getState();
      if (hasExistingResumeWork(current.markdown, current.profiles)) {
        const isEn = current.uiLanguage === 'en';
        const approved = await confirm({
          title: isEn ? 'Replace active resume?' : '替换当前简历？',
          message: isEn
            ? 'This link requests a different resume template. Replacing the current resume cannot be undone. Export a backup first if needed.'
            : '此链接请求载入另一份简历模板，将覆盖当前活动简历内容。建议先导出备份。',
          confirmText: isEn ? 'Replace resume' : '确认替换简历',
          cancelText: isEn ? 'Keep current resume' : '保留当前简历',
          type: 'warning',
        });
        if (!approved) return;
      }
      if (useResumeStore.getState().applyTemplate(templateId)) {
        storage.set(STORAGE_KEYS.ONBOARDING_COMPLETE, '1');
        storage.remove(STORAGE_KEYS.ONBOARDING_FIRST_VISIT);
      }
    };
    void openRequestedTemplate();
  }, [confirm, sharePayload]);

  const navigateTo = useCallback((route: AppRoute, options?: { templateId?: string }) => {
    setCurrentRoute(route);
    if (options?.templateId) {
      // The user already chose a complete starting template on the welcome page.
      // Enter editing directly rather than showing a second start chooser.
      useResumeStore.getState().applyTemplate(options.templateId);
      storage.set(STORAGE_KEYS.ONBOARDING_COMPLETE, '1');
      storage.remove(STORAGE_KEYS.ONBOARDING_FIRST_VISIT);
    }
    // Explicit selections are applied above; never leave a destructive template
    // action in the browser URL where reload would repeat it.
    const nextUrl = buildRouteUrl(route);
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

  const state = useResumeStore.getState();
  const hasPendingTemplateLink = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('template');
  const isFirstTimeOnboarding =
    storage.getString(STORAGE_KEYS.ONBOARDING_COMPLETE) !== '1' &&
    !hasExistingResumeWork(state.markdown, state.profiles) &&
    !hasPendingTemplateLink;

  return (
    <div className="animate-fadeIn transition-opacity duration-300">
      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="flex min-h-[100dvh] items-center justify-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300"
          >
            {uiLanguage === 'zh' ? '正在打开编辑器…' : 'Opening editor…'}
          </div>
        }
      >
        <EditorWorkspace
          onNavigateToLanding={() => navigateTo('landing')}
          initialOpenOnboarding={isFirstTimeOnboarding}
        />
      </Suspense>
    </div>
  );
}