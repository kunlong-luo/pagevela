import { useDialogFocus } from '../../hooks/useDialogFocus';
import { MobileSheetBackdrop } from '../ui/MobileSheetBackdrop';
import React, { useEffect, useRef, useState } from 'react';
import { 
  ClipboardCheck, 
  Database, 
  Upload, 
  Loader2, 
  Moon, 
  Sun, 
  Laptop, 
  HelpCircle, 
  DownloadCloud,
  Menu,
  X,
  Share2,
  Home,
  LayoutTemplate,
  SlidersHorizontal,
  Palette,
  Wrench,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useShallow } from 'zustand/react/shallow';
import { ThemeMode } from '../../types';
import { ProfileDropdown } from '../profile/ProfileDropdown';
import { Tooltip } from '../ui';
import { LanguageToggle } from '../ui/LanguageToggle';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { trackAnalyticsEvent } from '../../lib/analytics';
import { PdfExportMenu } from '../header/PdfExportMenu';
import { MoreActionsMenu } from '../header/MoreActionsMenu';

const RawTextImportModal = React.lazy(() => import('../modals/RawTextImportModal').then(m => ({ default: m.RawTextImportModal })));
const ShareResumeModal = React.lazy(() => import('../share/ShareResumeModal').then(m => ({ default: m.ShareResumeModal })));

interface HeaderProps {
  handleExportPDF: () => void;
  handleExportDirectPDF?: () => void;
  handleExportVectorPrint?: () => void;
  onNavigateToLanding?: () => void;
}

export function Header({
  handleExportPDF,
  handleExportDirectPDF,
  handleExportVectorPrint,
  onNavigateToLanding,
}: HeaderProps) {
  const {
    lastSaved,
    isSaving,
    saveStatus,
    storageStatus,
    storageErrorIsQuota,
    isCheckerOpen,
    isExportingPDF,
    pdfExportProgress,
    setIsCheckerOpen,
    setIsBackupHubOpen,
    setIsHelpLegalOpen,
    replaceDocument,
    settings,
    uiLanguage,
    themeMode,
    setThemeMode,
    setUiLanguage,
  } = useResumeStore(
    useShallow((state) => ({
      lastSaved: state.lastSaved,
      isSaving: state.isSaving,
      saveStatus: state.saveStatus,
      storageStatus: state.storageStatus,
      storageErrorIsQuota: state.storageErrorIsQuota,
      isCheckerOpen: state.isCheckerOpen,
      isExportingPDF: state.isExportingPDF,
      pdfExportProgress: state.pdfExportProgress,
      setIsCheckerOpen: state.setIsCheckerOpen,
      setIsBackupHubOpen: state.setIsBackupHubOpen,
      setIsHelpLegalOpen: state.setIsHelpLegalOpen,
      replaceDocument: state.replaceDocument,
      settings: state.settings,
      uiLanguage: state.uiLanguage,
      themeMode: state.themeMode,
      setThemeMode: state.setThemeMode,
      setUiLanguage: state.setUiLanguage,
    })),
  );

  const lang = uiLanguage;
  const isEn = lang === 'en';
  const [isRawTextModalOpen, setIsRawTextModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const quickActionsDialogRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { isInstallable, triggerInstall } = usePWAInstall();

  useDialogFocus({
    isOpen: isMobileMenuOpen,
    dialogRef: quickActionsDialogRef,
    onClose: () => setIsMobileMenuOpen(false),
  });

  useEffect(() => {
    const openImport = () => setIsRawTextModalOpen(true);
    const openResumeCheck = () => setIsCheckerOpen(true);
    const openBackup = () => setIsBackupHubOpen(true);
    const openShare = () => setIsShareModalOpen(true);

    window.addEventListener('resume-craft:open-import', openImport);
    window.addEventListener('resume-craft:open-resume-check', openResumeCheck);
    window.addEventListener('resume-craft:open-backup', openBackup);
    window.addEventListener('resume-craft:open-share', openShare);

    return () => {
      window.removeEventListener('resume-craft:open-import', openImport);
      window.removeEventListener('resume-craft:open-resume-check', openResumeCheck);
      window.removeEventListener('resume-craft:open-backup', openBackup);
      window.removeEventListener('resume-craft:open-share', openShare);
    };
  }, [setIsBackupHubOpen, setIsCheckerOpen]);


  const handleTriggerExport = () => {
    if (handleExportVectorPrint) {
      handleExportVectorPrint();
    } else {
      handleExportPDF();
    }
  };

  const handleQuickPdfExport = () => {
    if (handleExportDirectPDF) {
      handleExportDirectPDF();
    }
  };

  const handleInstallApp = async () => {
    const installed = await triggerInstall();
    if (installed) {
      trackAnalyticsEvent('pwa_install');
    }
  };

  const toggleThemeMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Cycle between light -> dark -> system
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';

    const syncThemeClass = () => {
      if (typeof document === 'undefined') return;
      const shouldUseDark =
        nextMode === 'dark' ||
        (nextMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', shouldUseDark);
    };

    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const usesWebKitEngine =
      /AppleWebKit/i.test(userAgent) &&
      !/(Chrome|Chromium|Edg\/|OPR\/)/i.test(userAgent);

    // WebKit currently exposes View Transitions in environments where the
    // transition lifecycle can stall and leave temporary root classes behind.
    // Prefer a reliable instant theme switch there; keep the radial transition
    // for engines with a stable implementation.
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      !usesWebKitEngine &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      const root = document.documentElement;
      const cleanupTransitionClass = () => {
        root.classList.remove('view-transition-active');
      };

      // Disable CSS element transitions during view transition capture to prevent double-rendering lag
      root.classList.add('view-transition-active');

      try {
        const transition = (document as any).startViewTransition(() => {
          // Apply the visible theme synchronously. React state remains the source of truth,
          // but the DOM must not wait on a browser-specific View Transition lifecycle.
          syncThemeClass();
          setThemeMode(nextMode);
        });

        // WebKit can expose startViewTransition while failing to finish the custom animation
        // lifecycle reliably. Always clean up through the native transition lifecycle as well.
        void Promise.resolve(transition.finished)
          .catch(() => undefined)
          .finally(cleanupTransitionClass);

        void Promise.resolve(transition.ready)
          .then(() => {
            const clipPath = [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            const animation = root.animate(
              {
                clipPath: clipPath
              },
              {
                duration: 420,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
              }
            );

            void animation.finished
              .catch(() => undefined)
              .finally(cleanupTransitionClass);
          })
          .catch(cleanupTransitionClass);

        // Last-resort guard for partially implemented browser transitions.
        window.setTimeout(() => {
          syncThemeClass();
          cleanupTransitionClass();
        }, 1000);
      } catch {
        syncThemeClass();
        cleanupTransitionClass();
        setThemeMode(nextMode);
      }
    } else {
      syncThemeClass();
      setThemeMode(nextMode);
    }
  };

  const themeLabel = themeMode === 'dark' 
    ? (isEn ? 'Dark' : '深色') 
    : themeMode === 'system' 
      ? (isEn ? 'System' : '系统') 
      : (isEn ? 'Light' : '浅色');

  // These are feature shortcuts, not duplicates of the global header controls
  // or the Fit/Check actions already available in the mobile editing-tools panel.
  const mobileQuickActions = [
    {
      id: 'templates',
      label: isEn ? 'Templates' : '模板',
      Icon: LayoutTemplate,
      fullWidth: false,
      onSelect: () => window.dispatchEvent(new Event('resume-craft:open-template-center')),
    },
    {
      id: 'layout',
      label: isEn ? 'Layout' : '排版',
      Icon: SlidersHorizontal,
      fullWidth: false,
      onSelect: () => window.dispatchEvent(new Event('resume-craft:open-layout')),
    },
    {
      id: 'style',
      label: isEn ? 'Style' : '样式',
      Icon: Palette,
      fullWidth: false,
      onSelect: () => window.dispatchEvent(new Event('resume-craft:open-style')),
    },
    {
      id: 'editing-tools',
      label: isEn ? 'Editing tools' : '编辑工具',
      Icon: Wrench,
      fullWidth: false,
      onSelect: () => window.dispatchEvent(new Event('resume-craft:open-editor-tools')),
    },
    {
      id: 'management',
      label: isEn ? 'Resume management' : '简历管理',
      Icon: Database,
      fullWidth: false,
      onSelect: () => setIsBackupHubOpen(true),
    },
    {
      id: 'import',
      label: isEn ? 'Import' : '导入',
      Icon: Upload,
      fullWidth: false,
      onSelect: () => setIsRawTextModalOpen(true),
    },
    {
      id: 'share',
      label: isEn ? 'Share' : '分享简历',
      Icon: Share2,
      fullWidth: false,
      onSelect: () => setIsShareModalOpen(true),
    },
    {
      id: 'help',
      label: isEn ? 'Help' : '帮助',
      Icon: HelpCircle,
      fullWidth: false,
      onSelect: () => setIsHelpLegalOpen(true),
    },
    ...(isInstallable ? [{
      id: 'install',
      label: isEn ? 'Install' : '安装应用',
      Icon: DownloadCloud,
      fullWidth: true,
      onSelect: () => { void handleInstallApp(); },
    }] : []),
  ];

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 md:bg-white/90 md:dark:bg-slate-900/90 md:backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/90 relative z-50 shadow-[0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-colors duration-200">
      {/* Mobile Top Bar (< md) */}
      <div className="flex md:hidden items-center justify-between px-2.5 min-[390px]:px-3.5 h-12 w-full gap-2">
        <div className="flex min-w-0 items-center gap-1.5 min-[390px]:gap-2 shrink-0">
          <Tooltip content={isEn ? 'Return to Home' : '返回首页'} side="bottom">
            <button 
              type="button"
              onClick={onNavigateToLanding}
              className="inline-flex items-center justify-center w-9 h-10 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 dark:border-slate-800 shadow-2xs shrink-0"
              aria-label={isEn ? 'Return to Home' : '返回首页'}
            >
              <Home className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
          <ProfileDropdown lang={uiLanguage} />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <LanguageToggle
            isEn={isEn}
            onToggle={() => setUiLanguage(isEn ? 'zh' : 'en')}
            className="!min-h-10 !px-2 !py-1.5 !gap-1"
          />
          <button
            type="button"
            onClick={(event) => toggleThemeMode(event)}
            aria-label={`${isEn ? 'Theme' : '主题'}: ${themeLabel}`}
            className="min-h-10 min-w-10 inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {themeMode === 'dark' ? <Moon className="w-4 h-4 text-indigo-400" /> :
              themeMode === 'system' ? <Laptop className="w-4 h-4 text-indigo-500" /> :
              <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="min-h-10 min-w-10 inline-flex items-center justify-center p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer active:scale-95"
            aria-label={isEn ? 'Open quick actions menu' : '打开快捷功能菜单'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-quick-actions"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-indigo-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Desktop Top Bar (>= md) */}
      <div className="hidden md:flex items-center justify-between px-6 py-2 w-full">
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="flex items-center gap-2">
            <Tooltip content={isEn ? 'Return to Home' : '返回首页'} side="bottom">
              <button 
                type="button"
                onClick={onNavigateToLanding}
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-95 border border-slate-200/80 dark:border-slate-800 shadow-2xs shrink-0"
                aria-label={isEn ? 'Return to Home' : '返回首页'}
              >
                <Home className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>

          <div className="w-px h-5 bg-slate-200/90 dark:bg-slate-800 mx-1 shrink-0" />

          {/* Multi-Profile Archive Selector */}
          <ProfileDropdown lang={uiLanguage} />

          {/* Real-time save and storage health indicator */}
          {storageStatus === 'error' ? (
            <Tooltip
              content={storageErrorIsQuota
                ? (isEn
                  ? 'Local storage is full. Export a JSON backup and free browser storage before continuing.'
                  : '浏览器本地存储空间不足。请先导出 JSON 备份并清理浏览器存储空间。')
                : (isEn
                  ? 'The browser rejected local storage writes. Export a JSON backup before closing this page.'
                  : '浏览器拒绝写入本地存储。关闭页面前请先导出 JSON 备份。')}
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800/70 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                <span>{isEn ? 'Save failed' : '保存失败'}</span>
              </div>
            </Tooltip>
          ) : saveStatus === 'editing' ? (
            <Tooltip
              content={isEn ? 'Editing document...' : '正在实时编辑简历内容...'}
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping shrink-0" />
                <span>{isEn ? 'Editing' : '正在编辑'}</span>
              </div>
            </Tooltip>
          ) : saveStatus === 'saving' || isSaving ? (
            <Tooltip
              content={isEn ? 'Syncing changes to local storage...' : '正在自动保存修改到本地浏览器...'}
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-amber-500 shrink-0" />
                <span>{isEn ? 'Saving...' : '保存中...'}</span>
              </div>
            </Tooltip>
          ) : (
            <Tooltip 
              content={
                lastSaved 
                  ? `${isEn ? 'Saved at' : '保存于'} ${lastSaved} (${isEn ? 'Local Storage' : '已自动同步至本地'})`
                  : (isEn ? 'All changes automatically saved to local storage' : '已自动同步保存至本地浏览器')
              }
              side="bottom"
            >
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/60 rounded-lg text-[11px] font-semibold shadow-2xs whitespace-nowrap cursor-default">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>{isEn ? 'Saved' : '已保存'}</span>
              </div>
            </Tooltip>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 justify-end shrink-0">
          <LanguageToggle
            isEn={isEn}
            onToggle={() => setUiLanguage(isEn ? 'zh' : 'en')}
          />
          <Tooltip content={`${isEn ? 'Theme' : '主题'}: ${themeLabel}`} side="bottom">
            <button
              type="button"
              onClick={(e) => toggleThemeMode(e)}
              aria-label={`${isEn ? 'Theme' : '主题'}: ${themeLabel}`}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 ${
                themeMode === 'dark'
                  ? 'border-indigo-700/60 bg-indigo-950/60 text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {themeMode === 'dark' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : themeMode === 'system' ? (
                <Laptop className="w-3.5 h-3.5 text-indigo-500" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
            </button>
          </Tooltip>

          <Tooltip content={isEn ? 'Share resume' : '分享简历'} side="bottom">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              aria-label={isEn ? 'Share resume' : '分享简历'}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
            </button>
          </Tooltip>

          <Tooltip
            content={
              isEn
                ? 'Check structure, wording, and ATS readability'
                : '检查简历结构、表达和 ATS 可读性'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => setIsCheckerOpen(!isCheckerOpen)}
              className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition ${
                isCheckerOpen
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isEn ? 'Check' : '检查'}</span>
            </button>
          </Tooltip>

          <PdfExportMenu
            isEn={isEn}
            isExporting={isExportingPDF}
            progress={pdfExportProgress}
            onExportAts={handleTriggerExport}
            onExportQuick={handleExportDirectPDF ? handleQuickPdfExport : undefined}
          />

          <MoreActionsMenu
            isEn={isEn}
            isInstallable={isInstallable}
            onImport={() => setIsRawTextModalOpen(true)}
            onOpenGuide={() => setIsHelpLegalOpen(true)}
            onInstall={() => {
              void handleInstallApp();
            }}
          />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-in fade-in duration-200"
        >
          <MobileSheetBackdrop
            onClose={() => setIsMobileMenuOpen(false)}
            label={isEn ? 'Close quick actions backdrop' : '关闭快捷操作遮罩'}
            breakpoint="md"
          />
          <div
            ref={quickActionsDialogRef}
            id="mobile-quick-actions"
            role="dialog"
            aria-modal="true"
            aria-label={isEn ? 'Quick Actions' : '快捷功能菜单'}
            className="relative z-[100] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-3 shadow-2xl max-h-[82dvh] overflow-y-auto workspace-scrollbar overscroll-contain"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">{isEn ? 'Quick Actions' : '快捷功能菜单'}</span>
              <button 
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={isEn ? 'Close quick actions menu' : '关闭快捷功能菜单'}
                className="min-h-10 min-w-10 inline-flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-xl active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2" data-testid="mobile-quick-actions-grid">
              {mobileQuickActions.map(({ id, label, Icon, fullWidth, onSelect }) => (
                <button
                  key={id}
                  type="button"
                  data-testid={`mobile-quick-action-${id}`}
                  onClick={() => {
                    onSelect();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`min-h-12 min-w-0 inline-flex items-center justify-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs font-bold text-slate-800 transition-colors hover:border-indigo-200 hover:bg-indigo-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-800 ${fullWidth ? 'col-span-2' : ''}`}
                >
                  <Icon className="h-4 w-4 shrink-0 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
                  <span className="min-w-0 leading-snug">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <React.Suspense fallback={null}>
          <ShareResumeModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
          />
        </React.Suspense>
      )}

      {/* Smart Raw Text / File Import Modal */}
      {isRawTextModalOpen && (
        <React.Suspense fallback={null}>
          <RawTextImportModal
            isOpen={isRawTextModalOpen}
            onClose={() => setIsRawTextModalOpen(false)}
            onImport={(newMd, settingsPatch, templateId) => {
              replaceDocument(
                newMd,
                { ...settings, ...settingsPatch },
                templateId ?? 'custom',
              );
            }}
            lang={lang}
          />
        </React.Suspense>
      )}
    </header>
  );
}

