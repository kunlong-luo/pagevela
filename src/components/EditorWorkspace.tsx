import { useRef, useEffect, useState, useCallback, Suspense, lazy } from 'react';
import { Editor, type EditorMode } from './Editor';
import { Preview } from './preview/Preview';
import { Header } from './layout/Header';
import { Toolbar } from './layout/Toolbar';
import { useResumeStore } from '../store/useResumeStore';
import { useShallow } from 'zustand/react/shallow';
import { useResumeActions } from '../hooks/useResumeActions';
import { useToast } from './ui/Toast';
import { Layers, Code, Eye } from 'lucide-react';
import { PdfExportMenu } from './header/PdfExportMenu';
import { Tooltip } from './ui/Tooltip';
import { markSupportPrompt, recordCompletedPdfExportFlowAndShouldPrompt } from '../lib/support-prompt';
import { trackAnalyticsEvent } from '../lib/analytics';
import { useResizableSplitPane } from '../hooks/useResizableSplitPane';
import { usePeriodicDraftHistory } from '../hooks/usePeriodicDraftHistory';
import { useEditorKeyboardShortcuts } from '../hooks/useEditorKeyboardShortcuts';
import { useEditorSafetyNotifications } from '../hooks/useEditorSafetyNotifications';
import { storage, STORAGE_KEYS } from '../lib/storage';

const ResumeChecker = lazy(() => import('./resume-checker/ResumeChecker').then(m => ({ default: m.ResumeChecker })));
const IframeWarningModal = lazy(() => import('./IframeWarningModal').then(m => ({ default: m.IframeWarningModal })));
const BackupDraftModal = lazy(() => import('./backup/BackupDraftModal').then(m => ({ default: m.BackupDraftModal })));
const HelpLegalModal = lazy(() => import('./layout/HelpLegalModal').then(m => ({ default: m.HelpLegalModal })));
const SupportProjectModal = lazy(() => import('./modals/SupportProjectModal').then(m => ({ default: m.SupportProjectModal })));
const OnboardingTour = lazy(() => import('./onboarding/OnboardingTour').then(m => ({ default: m.OnboardingTour })));

interface EditorWorkspaceProps {
  onNavigateToLanding?: () => void;
  initialOpenOnboarding?: boolean;
}

export function EditorWorkspace({ onNavigateToLanding, initialOpenOnboarding }: EditorWorkspaceProps) {
  const [mobileTab, setMobileTab] = useState<'form' | 'markdown' | 'preview'>('form');
  const [editorMode, setEditorMode] = useState<EditorMode>('form');

  useEffect(() => {
    const showEditingTools = () => {
      if (window.innerWidth >= 768 || mobileTab !== 'preview') return;
      setEditorMode('form');
      setMobileTab('form');
    };
    window.addEventListener('pagevela:open-editor-tools', showEditingTools);
    return () => window.removeEventListener('pagevela:open-editor-tools', showEditingTools);
  }, [mobileTab]);

  const {
    uiLanguage,
    layoutMode,
    setLastSaved,
    isHelpLegalOpen,
    setIsHelpLegalOpen,
    setStorageHealth,
    isExportingPDF,
    pdfExportProgress,
  } = useResumeStore(
    useShallow((state) => ({
      uiLanguage: state.uiLanguage,
      layoutMode: state.settings.layoutMode,
      setLastSaved: state.setLastSaved,
      isHelpLegalOpen: state.isHelpLegalOpen,
      setIsHelpLegalOpen: state.setIsHelpLegalOpen,
      setStorageHealth: state.setStorageHealth,
      isExportingPDF: state.isExportingPDF,
      pdfExportProgress: state.pdfExportProgress,
    })),
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [isSupportProjectOpen, setIsSupportProjectOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    if (initialOpenOnboarding !== undefined) return initialOpenOnboarding;
    return storage.getString(STORAGE_KEYS.ONBOARDING_COMPLETE) !== '1';
  });

  useEffect(() => {
    if (initialOpenOnboarding) {
      setIsOnboardingOpen(true);
    }
  }, [initialOpenOnboarding]);

  useEffect(() => {
    const startOnboarding = () => setIsOnboardingOpen(true);
    window.addEventListener('pagevela:start-onboarding', startOnboarding);
    return () => window.removeEventListener('pagevela:start-onboarding', startOnboarding);
  }, []);

  const hasTrackedEditingRef = useRef(false);

  useEffect(() => {
    const initialMarkdown = useResumeStore.getState().markdown;
    return useResumeStore.subscribe((state) => {
      if (hasTrackedEditingRef.current || state.markdown === initialMarkdown) return;
      hasTrackedEditingRef.current = true;
      trackAnalyticsEvent('editing_started');
    });
  }, []);

  const { splitRatio, isDragging, handleMouseDown, handleTouchStart, resetSplitRatio } =
    useResizableSplitPane(containerRef);

  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePdfExportComplete = useCallback(() => {
    if (recordCompletedPdfExportFlowAndShouldPrompt()) {
      setIsSupportProjectOpen(true);
    }
  }, []);

  const {
    handleExportPDF,
    handleExportDirectPDF,
    handleExportVectorPrint,
  } = useResumeActions({
    contentRef,
    onPdfExportComplete: handlePdfExportComplete,
  });

  const handleSupportProject = useCallback(() => {
    markSupportPrompt('supported');
    setIsSupportProjectOpen(false);
  }, []);

  const handleDismissSupportPrompt = useCallback(() => {
    markSupportPrompt('dismissed');
    setIsSupportProjectOpen(false);
  }, []);

  usePeriodicDraftHistory();

  const { showToast } = useToast() || {};

  useEditorSafetyNotifications({
    uiLanguage,
    showToast,
    setStorageHealth,
  });

  useEditorKeyboardShortcuts({
    uiLanguage,
    setLastSaved,
    setStorageHealth,
    showToast,
    onExportVectorPrint: handleExportVectorPrint,
  });

  return (
    <div className="flex flex-col h-screen h-[100dvh] w-full overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 md:backdrop-blur-md shrink-0 shadow-2xs">
          <Header 
            handleExportPDF={handleExportPDF}
            handleExportDirectPDF={handleExportDirectPDF}
            handleExportVectorPrint={handleExportVectorPrint}
            onNavigateToLanding={onNavigateToLanding}
          />
          <div className="md:hidden flex items-center gap-2 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800">
          <nav
            aria-label={uiLanguage === 'en' ? 'Mobile workspace actions' : '移动端工作区操作'}
            className="flex-1 min-w-0 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 grid grid-cols-3 gap-1 text-xs font-bold"
          >
            <button
              type="button"
              onClick={() => { setEditorMode('form'); setMobileTab('form'); window.dispatchEvent(new Event('pagevela:close-editor-tools')); }}
              aria-label={uiLanguage === 'en' ? 'Form editor' : '表单编辑模式'}
              aria-pressed={mobileTab === 'form'}
              className={`min-h-11 flex items-center justify-center gap-1 min-[390px]:gap-1.5 px-0.5 min-[390px]:px-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                mobileTab === 'form'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Layers className="hidden min-[360px]:block w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{uiLanguage === 'en' ? 'Form' : '表单'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditorMode('markdown'); setMobileTab('markdown'); window.dispatchEvent(new Event('pagevela:close-editor-tools')); }}
              aria-label={uiLanguage === 'en' ? 'Markdown source editor' : 'Markdown 源码编辑模式'}
              aria-pressed={mobileTab === 'markdown'}
              className={`min-h-11 flex items-center justify-center gap-1 min-[390px]:gap-1.5 px-0.5 min-[390px]:px-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                mobileTab === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Code className="hidden min-[360px]:block w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{uiLanguage === 'en' ? 'Code' : '源码'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setMobileTab('preview'); window.dispatchEvent(new Event('pagevela:close-editor-tools')); }}
              aria-label={uiLanguage === 'en' ? 'Preview' : '预览'}
              aria-pressed={mobileTab === 'preview'}
              className={`min-h-11 flex items-center justify-center gap-1 min-[390px]:gap-1.5 px-0.5 min-[390px]:px-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 ${
                mobileTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
            >
              <Eye className="hidden min-[360px]:block w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{uiLanguage === 'en' ? 'Preview' : '预览'}</span>
            </button>
          </nav>
            <PdfExportMenu
              isEn={uiLanguage === 'en'}
              isExporting={isExportingPDF}
              progress={pdfExportProgress}
              onExportAts={handleExportVectorPrint}
              onExportQuick={handleExportDirectPDF}
              compact
            />
          </div>
          <Toolbar mobileMode={mobileTab} />
        </div>

        <main 
          ref={containerRef}
          className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden relative"
        >
          <section 
              id="editor-pane" 
              style={{
                width: !isMobile ? (layoutMode === 'split' ? `${splitRatio}%` : layoutMode === 'editor' ? '100%' : '0%') : '100%'
              }}
              className={`z-10 relative h-full ${
                isDragging ? 'transition-none' : 'transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]'
              } ${
                (!isMobile && layoutMode === 'preview') || (isMobile && mobileTab === 'preview') ? 'hidden' : 'w-full'
              } border-r border-slate-200/90 dark:border-slate-800`}
            >
              <Editor activeMode={editorMode} onModeChange={setEditorMode} />
            </section>

          {!isMobile && layoutMode === 'split' && (
            <Tooltip
              content={uiLanguage === 'en' ? 'Drag to resize (Double click to reset 50%)' : '拖拽调节左右宽度（双击复位 50%）'}
              side="top"
              delay={400}
              disabled={isDragging}
              preserveWrapper
              wrapperClassName="hidden md:flex h-full items-center justify-center z-30"
            >
              <div 
                data-testid="workspace-split-handle"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="flex items-center justify-center w-3 h-full -mx-1.5 cursor-col-resize group hover:w-3.5 transition-all select-none relative"
                onDoubleClick={resetSplitRatio}
              >
                <div className={`w-1 h-8 rounded-full transition-all duration-200 ${isDragging ? 'bg-indigo-600 scale-y-125' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-400 group-hover:scale-y-110'}`} />
                {isDragging && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 dark:bg-slate-800/95 text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-full shadow-lg border border-slate-700/80 whitespace-nowrap pointer-events-none animate-in fade-in duration-150 flex items-center gap-1 z-50">
                    <span>{Math.round(splitRatio)}%</span>
                    <span className="text-slate-400">:</span>
                    <span>{Math.round(100 - splitRatio)}%</span>
                  </div>
                )}
              </div>
            </Tooltip>
          )}

          <section 
              id="preview-pane" 
              style={{
                width: !isMobile ? (layoutMode === 'split' ? `${100 - splitRatio}%` : layoutMode === 'preview' ? '100%' : '0%') : '100%'
              }}
              className={`h-full min-w-0 flex-col bg-slate-100/70 dark:bg-slate-950/70 relative z-0 ${
                (isMobile ? mobileTab !== 'preview' : layoutMode === 'editor')
                  ? 'hidden'
                  : 'flex flex-1'
              }`}
            >
              <Preview 
                ref={contentRef} 
              />
            </section>

          <Suspense fallback={null}>
            <ResumeChecker />
          </Suspense>
        </main>

        <Suspense fallback={null}>
          <IframeWarningModal />
          <BackupDraftModal />
          <HelpLegalModal isOpen={isHelpLegalOpen} onClose={() => setIsHelpLegalOpen(false)} />
          <SupportProjectModal
            isOpen={isSupportProjectOpen}
            lang={uiLanguage}
            onClose={handleDismissSupportPrompt}
            onSupportClick={handleSupportProject}
          />
          <OnboardingTour
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
          />
        </Suspense>
      </div>
    </div>
  );
}
