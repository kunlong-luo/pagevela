import { useEffect } from 'react';
import type { Language } from '../types';
import type { ToastItem } from '../components/ui/Toast';
import { useResumeStore } from '../store/useResumeStore';
import { activeResumePersistence } from '../lib/resume-persistence';
import { smartAutoFit } from '../lib/preview-utils';
import { trackAnalyticsEvent } from '../lib/analytics';

type ShowToast = (toast: Omit<ToastItem, 'id'>) => void;

interface EditorKeyboardShortcutsOptions {
  uiLanguage: Language;
  setLastSaved: (timestamp: string) => void;
  setStorageHealth: (status: 'ok' | 'error', isQuotaExceeded?: boolean) => void;
  showToast?: ShowToast;
  onExportVectorPrint: () => void;
}

export type EditorShortcutEvent = Pick<
  KeyboardEvent,
  'key' | 'ctrlKey' | 'metaKey' | 'shiftKey' | 'preventDefault'
>;

export interface EditorShortcutActions {
  save: () => void;
  print: () => void;
  autoFit: () => void;
}

/**
 * Pure shortcut routing. Preserve the existing page-level behavior:
 * Cmd/Ctrl+S saves even with Shift, Cmd/Ctrl+P only prints without Shift,
 * and Cmd/Ctrl+Shift+F invokes Auto Fit. Other keys are untouched.
 */
export function dispatchEditorKeyboardShortcut(
  event: EditorShortcutEvent,
  actions: EditorShortcutActions,
): boolean {
  if (!event.metaKey && !event.ctrlKey) return false;

  if (event.key === 's' || event.key === 'S') {
    event.preventDefault();
    actions.save();
    return true;
  }

  if (!event.shiftKey && (event.key === 'p' || event.key === 'P')) {
    event.preventDefault();
    actions.print();
    return true;
  }

  if (event.shiftKey && (event.key === 'f' || event.key === 'F')) {
    event.preventDefault();
    actions.autoFit();
    return true;
  }

  return false;
}

/** Own the editor's global shortcut lifecycle without changing save/export semantics. */
export function useEditorKeyboardShortcuts({
  uiLanguage,
  setLastSaved,
  setStorageHealth,
  showToast,
  onExportVectorPrint,
}: EditorKeyboardShortcutsOptions): void {
  useEffect(() => {
    const save = () => {
      // Read the live store at keydown time, not a stale React render snapshot.
      const currentState = useResumeStore.getState();
      void activeResumePersistence.saveNow({
        markdown: currentState.markdown,
        profiles: currentState.profiles,
        jdText: currentState.jdText,
      }).then(() => {
        const now = new Date();
        const pad = (num: number) => String(num).padStart(2, '0');
        setLastSaved([pad(now.getHours()), pad(now.getMinutes()), pad(now.getSeconds())].join(':'));
        showToast?.({
          title: uiLanguage === 'en' ? 'Resume saved locally' : '简历草稿已手动保存',
          message: uiLanguage === 'en'
            ? 'The current resume content was saved to local browser storage.'
            : '核心简历数据已保存到浏览器本地。',
          type: 'success',
          duration: 2505,
        });
      }).catch((error) => {
        console.error('[manual-save] Failed to save resume to IndexedDB:', error);
        setStorageHealth('error');
        showToast?.({
          title: uiLanguage === 'en' ? 'Local save failed' : '本地保存失败',
          message: uiLanguage === 'en'
            ? 'The browser rejected the local save. Export a backup before closing this page.'
            : '浏览器拒绝本地保存。关闭页面前请先导出备份。',
          type: 'error',
          duration: 8000,
        });
      });
    };

    const autoFit = () => {
      const request = new Event('pagevela:auto-fit', { cancelable: true });
      window.dispatchEvent(request);
      trackAnalyticsEvent('auto_fit_used');
      if (request.defaultPrevented) return; // Visible preview reports its own measured result.
      const currentState = useResumeStore.getState();
      const adjusted = smartAutoFit(currentState.settings, currentState.updateSetting);
      showToast?.({
        title: adjusted
          ? (uiLanguage === 'en' ? 'Auto Fit adjusted' : '已收紧排版')
          : (uiLanguage === 'en' ? 'Auto Fit reached its limit' : '已到自动压缩下限'),
        message: adjusted
          ? (uiLanguage === 'en'
            ? 'Tightened one layout setting. Check the preview and repeat if needed.'
            : '已收紧一项排版参数；请检查预览，如仍超页可继续调整。')
          : (uiLanguage === 'en'
            ? 'No further automatic spacing reduction is available. Shorten the content or adjust the layout manually.'
            : '无法继续自动压缩间距。请精简内容或手动调整排版。'),
        type: adjusted ? 'info' : 'warning',
        duration: 3000,
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      dispatchEditorKeyboardShortcut(event, {
        save,
        print: onExportVectorPrint,
        autoFit,
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExportVectorPrint, setLastSaved, setStorageHealth, showToast, uiLanguage]);
}
