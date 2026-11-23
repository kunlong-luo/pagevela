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
      const currentState = useResumeStore.getState();
      smartAutoFit(currentState.settings, currentState.updateSetting);
      trackAnalyticsEvent('auto_fit_used');
      showToast?.({
        title: uiLanguage === 'en' ? 'Auto Fit applied' : '已触发一键贴合控页',
        message: uiLanguage === 'en'
          ? 'Adjusted line height and margins to better fit the resume on one page.'
          : '微调行高与边距以压缩适应单页',
        type: 'info',
        duration: 2500,
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
