import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initAnalyticsPageview } from './lib/analytics';
import { migrateLegacyStorageToIndexedDb } from './lib/storage-migration';
import { activeResumePersistence } from './lib/resume-persistence';
import { resumeRepository } from './lib/resume-repository';
import { setResumeBootstrapSnapshot } from './lib/resume-bootstrap-state';

// Treat a failed IndexedDB hydration as a protected stop, not an empty resume.
// The user may still have all their real profiles in the unavailable database.
class ResumeStorageUnavailableError extends Error {
  constructor() {
    super('resume-storage-unavailable');
    this.name = 'ResumeStorageUnavailableError';
  }
}

// Suppress benign ResizeObserver loop notification messages that can occur during layout/zoom updates
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message &&
      (event.message.includes('ResizeObserver loop completed with undelivered notifications') ||
        event.message.includes('ResizeObserver loop limit exceeded'))
    ) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

async function bootstrap() {
  // Complete and verify the v2.2 -> v2.3 copy before the store module initializes.
  // Verified legacy core keys are removed after migration; lightweight UI/bootstrap preferences remain in localStorage.
  try {
    await migrateLegacyStorageToIndexedDb();
    const [markdown, profiles, jdText] = await Promise.all([
      resumeRepository.getActiveMarkdown(),
      resumeRepository.getProfiles(),
      resumeRepository.getJdText(),
    ]);
    // Capture the exact IndexedDB revision *before* Zustand normalizes it.
    // Later writes are compared atomically against this cross-tab baseline.
    activeResumePersistence.setBaseline({ markdown, profiles, jdText });
    setResumeBootstrapSnapshot({ markdown, profiles, jdText });
  } catch (error) {
    setResumeBootstrapSnapshot(null);
    console.error('[bootstrap] IndexedDB migration or read failed; refusing to render a replacement workspace:', error);
    throw new ResumeStorageUnavailableError();
  }

  // Import Store consumers only AFTER the IndexedDB snapshot is available.
  // In particular, ToastProvider and ConfirmProvider now depend on the Store.
  // Static imports here would initialize Zustand before bootstrap and discard
  // the persisted resume on every reload.
  const [
    { default: App },
    { useResumeStore },
    { ConfirmProvider },
    { ToastProvider },
    { ErrorBoundary },
  ] = await Promise.all([
    import('./App.tsx'),
    import('./store/useResumeStore.ts'),
    import('./context/ConfirmContext.tsx'),
    import('./components/ui/Toast.tsx'),
    import('./components/ui/ErrorBoundary.tsx'),
  ]);

  const persistence = activeResumePersistence;
  let previous = useResumeStore.getState();

  // Persist sanitized/default bootstrap state too, including first-run profiles.
  persistence.schedule({
    markdown: previous.markdown,
    profiles: previous.profiles,
    jdText: previous.jdText,
  });

  const unsubscribe = useResumeStore.subscribe((state) => {
    if (
      state.markdown === previous.markdown &&
      state.profiles === previous.profiles &&
      state.jdText === previous.jdText
    ) {
      previous = state;
      return;
    }
    previous = state;
    persistence.schedule({
      markdown: state.markdown,
      profiles: state.profiles,
      jdText: state.jdText,
    });
  });

  const flushBeforeExit = () => {
    void persistence.flush();
  };
  window.addEventListener('pagehide', flushBeforeExit);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <ConfirmProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ConfirmProvider>
      </ErrorBoundary>
    </StrictMode>,
  );

  // Keep references reachable for the lifetime of the page.
  window.addEventListener('beforeunload', () => {
    unsubscribe();
    flushBeforeExit();
  }, { once: true });
}

// Recover from failures before React and ErrorBoundary can mount (for example,
// a missing/stale dynamically imported chunk). Do not touch any saved resume data.
function showStartupRecovery(error: unknown) {
  console.error('[bootstrap] Pagevela could not start:', error);
  const root = document.getElementById('root');
  if (!root) return;

  let isEnglish = !navigator.language.toLowerCase().startsWith('zh');
  try {
    const savedLanguage = window.localStorage.getItem('resume_ui_language');
    if (savedLanguage === 'en' || savedLanguage === 'zh') {
      isEnglish = savedLanguage === 'en';
    }
  } catch {
    // Private browsing and blocked storage can reject access to localStorage.
  }

  const screen = document.createElement('main');
  screen.setAttribute('role', 'alert');
  screen.className = 'min-h-[100dvh] flex items-center justify-center bg-slate-50 p-5 text-slate-900 dark:bg-slate-950 dark:text-white';

  const panel = document.createElement('div');
  panel.className = 'w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900';

  const title = document.createElement('h1');
  title.className = 'text-lg font-bold';
  title.textContent = isEnglish ? 'Pagevela could not start' : 'Pagevela 启动失败';

  const description = document.createElement('p');
  description.className = 'mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300';
  const storageUnavailable = error instanceof ResumeStorageUnavailableError;
  description.textContent = storageUnavailable
    ? (isEnglish
      ? 'Saved resumes could not be read from this browser. Editing is paused to avoid showing an empty or outdated resume. No data was cleared. Check browser storage permissions and reload to retry.'
      : '浏览器无法读取已保存的简历。为避免显示空白或过期简历，编辑功能已暂停。没有清除任何数据；请检查浏览器存储权限，然后重新加载。')
    : (isEnglish
      ? 'A required module failed to load. Your saved resume data has not been cleared. Check your connection and reload to try again.'
      : '必要的程序模块加载失败。已保存的简历数据没有被清除。请检查网络后重新加载。');

  const retry = document.createElement('button');
  retry.type = 'button';
  retry.className = 'mt-5 min-h-11 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-500';
  retry.textContent = isEnglish ? 'Reload Pagevela' : '重新加载 Pagevela';
  retry.addEventListener('click', () => window.location.reload());

  panel.append(title, description, retry);
  screen.append(panel);
  root.replaceChildren(screen);
}

// Record the first page view before IndexedDB migration and lazy UI imports.
// Analytics remains DNT-gated, official-host-only, and query/hash sanitized.
initAnalyticsPageview();

void bootstrap().catch(showStartupRecovery);
