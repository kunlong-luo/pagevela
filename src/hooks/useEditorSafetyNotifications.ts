import { useEffect } from 'react';
import type { Language } from '../types';
import type { ToastItem } from '../components/ui/Toast';
import { getProductDisplayName } from '../lib/brand';
import { STORAGE_HEALTH_EVENT, type StorageHealthDetail } from '../lib/storage';
import { RESUME_TABS_CHANNEL_NAME } from '../lib/resume-storage-contract';

type ShowToast = (toast: Omit<ToastItem, 'id'>) => void;

interface EditorSafetyNotificationOptions {
  uiLanguage: Language;
  showToast?: ShowToast;
  setStorageHealth: (status: 'ok' | 'error', isQuotaExceeded?: boolean) => void;
}

/** Keep the existing hello/presence handshake; ignore our own or unknown messages. */
export function classifyResumeTabMessage(message: unknown, sourceId: string): 'hello' | 'presence' | null {
  if (!message || typeof message !== 'object') return null;
  const candidate = message as { type?: unknown; sourceId?: unknown };
  if (candidate.sourceId === sourceId) return null;
  return candidate.type === 'hello' || candidate.type === 'presence' ? candidate.type : null;
}

/** Pure copy/status mapping so quota and recovery warnings can be tested without DOM listeners. */
export function describeStorageHealth(
  detail: StorageHealthDetail,
  uiLanguage: Language,
): { status: 'ok' | 'error'; quotaExceeded: boolean; toast: Omit<ToastItem, 'id'> } {
  const isEn = uiLanguage === 'en';
  if (detail.status === 'recovered') {
    return {
      status: 'ok',
      quotaExceeded: false,
      toast: {
        title: isEn ? 'Local saving restored' : '本地保存已恢复',
        message: isEn
          ? 'Resume changes can be saved to this browser again.'
          : '浏览器本地存储已恢复，可以继续自动保存简历修改。',
        type: 'success',
        duration: 3500,
      },
    };
  }

  if (detail.key === 'indexeddb-conflict') {
    return {
      status: 'error',
      quotaExceeded: false,
      toast: {
        title: isEn ? 'Another tab changed this resume' : '另一标签页已修改此简历',
        message: isEn
          ? 'This tab did not overwrite the newer saved version. Its text and layout were copied to local Drafts (Backup → Drafts). Review both copies and reopen this tab before editing.'
          : '本标签页没有覆盖其他标签页已保存的版本。当前文字和排版已复制到本地草稿（备份 → 草稿）；请核对两份内容，重新打开标签页后再继续编辑。',
        type: 'error',
        duration: 12000,
      },
    };
  }

  const quotaExceeded = detail.quotaExceeded === true;
  return {
    status: 'error',
    quotaExceeded,
    toast: {
      title: isEn ? 'Local save failed' : '本地保存失败',
      message: quotaExceeded
        ? (isEn
          ? 'Browser storage is full. Export a JSON backup before closing this page, then free storage space.'
          : '浏览器本地存储空间不足。关闭页面前请先导出 JSON 备份，再清理存储空间。')
        : (isEn
          ? 'The browser rejected a local storage write. Export a JSON backup before closing this page.'
          : '浏览器拒绝写入本地存储。关闭页面前请先导出 JSON 备份。'),
      type: 'error',
      duration: 8000,
    },
  };
}

/**
 * Own local-data safety notifications without changing the legacy channel/event names.
 * Tab warnings are one-shot per channel subscription. Re-subscription follows the
 * same language/toast dependencies as the workspace's original effects.
 */
export function useEditorSafetyNotifications({
  uiLanguage,
  showToast,
  setStorageHealth,
}: EditorSafetyNotificationOptions): void {
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const sourceId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : 'tab_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const channel = new BroadcastChannel(RESUME_TABS_CHANNEL_NAME);
    let warned = false;

    const warnAboutAnotherTab = () => {
      if (warned) return;
      warned = true;
      showToast?.({
        title: uiLanguage === 'en'
          ? getProductDisplayName('en') + ' is open in another tab'
          : '检测到另一个 ' + getProductDisplayName('zh') + ' 标签页',
        message: uiLanguage === 'en'
          ? 'Avoid editing the same resume in multiple tabs at once. Local writes are serialized, but the latest edit can still replace older state.'
          : '请避免在多个标签页同时编辑同一份简历。写入会串行处理，但较新的编辑仍可能覆盖较旧状态。',
        type: 'info',
        duration: 7000,
      });
    };

    channel.onmessage = (event) => {
      const messageType = classifyResumeTabMessage(event.data, sourceId);
      if (messageType === null) return;
      warnAboutAnotherTab();
      if (messageType === 'hello') {
        channel.postMessage({ type: 'presence', sourceId });
      }
    };

    channel.postMessage({ type: 'hello', sourceId });
    return () => channel.close();
  }, [uiLanguage, showToast]);

  useEffect(() => {
    const handleStorageHealth = (event: Event) => {
      const detail = (event as CustomEvent<StorageHealthDetail>).detail;
      if (!detail) return;
      const response = describeStorageHealth(detail, uiLanguage);
      if (response.status === 'ok') {
        setStorageHealth('ok');
      } else {
        setStorageHealth('error', response.quotaExceeded);
      }
      showToast?.(response.toast);
    };
    window.addEventListener(STORAGE_HEALTH_EVENT, handleStorageHealth);
    return () => window.removeEventListener(STORAGE_HEALTH_EVENT, handleStorageHealth);
  }, [setStorageHealth, uiLanguage, showToast]);
}
