import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Copy, RotateCcw, Check } from 'lucide-react';
import { storage, STORAGE_KEYS } from '../../lib/storage';
import { resumeRepository } from '../../lib/resume-repository';
import { clearPagevelaLocalData, ResumeResetError, type ResumeResetFailureStage } from '../../lib/resume-full-reset';
import { useResumeStore } from '../../store/useResumeStore';
import { trackAnalyticsEvent } from '../../lib/analytics';
import { en } from '../../i18n/locales/en';
import { zh } from '../../i18n/locales/zh';

function getErrorBoundaryTranslation(language: string) {
  return (language === 'en' ? en : zh).errorBoundary;
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
  confirmReset: boolean;
  resetBusy: boolean;
  resetError: ResumeResetFailureStage | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
    confirmReset: false,
    resetBusy: false,
    resetError: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, copied: false, confirmReset: false, resetBusy: false, resetError: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    trackAnalyticsEvent('runtime_error');
    this.setState({ errorInfo });
  }

  private handleCopyBackup = async () => {
    try {
      // Core draft content moved to IndexedDB. Legacy localStorage alone is
      // insufficient for emergency backup, especially after a successful migration.
      // Prefer the live in-memory editor state so recent unsaved edits are included.
      let markdown = useResumeStore.getState().markdown;
      if (!markdown) {
        try {
          markdown = (await resumeRepository.getActiveMarkdown()) ?? '';
        } catch (readError) {
          console.warn('IndexedDB unavailable while preparing emergency backup:', readError);
        }
      }
      const savedMarkdown = markdown || storage.getString(STORAGE_KEYS.MARKDOWN);
      if (savedMarkdown) {
        await navigator.clipboard.writeText(savedMarkdown);
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      }
    } catch (error) {
      console.error('Failed to copy backup:', error);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ confirmReset: true });
  };

  private confirmResetData = async () => {
    if (this.state.resetBusy) return;
    this.setState({ resetBusy: true, resetError: null });
    try {
      await clearPagevelaLocalData();
      trackAnalyticsEvent('local_data_cleared');
      window.location.reload();
    } catch (error) {
      console.error('[error-boundary-reset] Could not complete local data reset:', error);
      this.setState({
        resetBusy: false,
        resetError: error instanceof ResumeResetError ? error.stage : 'database',
      });
    }
  };

  public render() {
    if (this.state.hasError) {
      const uiLanguage = storage.getString(STORAGE_KEYS.UI_LANGUAGE, 'zh');
      const t = getErrorBoundaryTranslation(uiLanguage);
      return (
        <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
          <div className="max-w-xl w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
            {/* Header Icon */}
            <div className="flex items-center gap-3 border-b border-slate-700/60 pb-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-white">{t.title}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
              </div>
            </div>

            {/* Error detail */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-xs font-mono overflow-x-auto space-y-2 text-rose-300/90">
              <div className="font-bold text-rose-400">
                {this.state.error?.name || 'Error'}: {this.state.error?.message || t.title}
              </div>
              {this.state.errorInfo?.componentStack && (
                <div className="text-[10px] text-slate-500 max-h-28 overflow-y-auto workspace-scrollbar whitespace-pre-wrap font-mono">
                  {this.state.errorInfo.componentStack}
                </div>
              )}
            </div>

            {/* Emergency Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  disabled={this.state.resetBusy}
                  onClick={this.handleCopyBackup}
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20 active:translate-y-px"
                >
                  {this.state.copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{this.state.copied ? t.backupCopied : t.backupCopy}</span>
                </button>

                <button
                  disabled={this.state.resetBusy}
                  onClick={this.handleReload}
                  className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-650 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:translate-y-px"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t.reload}</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                {!this.state.confirmReset ? (
                  <button
                    type="button"
                    onClick={this.handleReset}
                    className="text-xs text-slate-400 hover:text-slate-200 underline inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.reset}</span>
                  </button>
                ) : (
                  <div role="group" aria-label={t.confirmReset} className="rounded-xl border border-amber-500/40 bg-amber-950/25 p-3">
                    <p className="text-xs text-amber-100">{t.confirmReset}</p>
                    <p className="mt-1 text-[11px] text-amber-200/90">
                      {uiLanguage === 'en'
                        ? 'This removes every Pagevela resume, profile, draft, and local preference. Other tabs should be closed first.'
                        : '此操作还会删除全部页帆简历、档案、草稿及偏好；建议先关闭其他页帆标签页。'}
                    </p>
                    {this.state.resetError && (
                      <p role="alert" className="mt-2 rounded-lg border border-rose-500/50 bg-rose-950/60 p-2 text-xs text-rose-100">
                        {this.state.resetError === 'preferences'
                          ? (uiLanguage === 'en'
                            ? 'Partial reset: IndexedDB may already be deleted, but some preferences remain. No success was reported. Reload to inspect storage before retrying.'
                            : '部分清除：IndexedDB 可能已删除，但仍有偏好未能清除。请重新加载并检查后重试。')
                          : this.state.resetError === 'suspend'
                            ? (uiLanguage === 'en'
                              ? 'Could not stop an ongoing save. No deletion was attempted. Reload and try again.'
                              : '无法结束正在进行的保存，本次未开始删除。请重新加载后重试。')
                            : (uiLanguage === 'en'
                              ? 'The browser could not delete the resume database. Preferences were kept. Reload and retry after closing other tabs.'
                              : '浏览器未能删除简历数据库；偏好设置未清除。请关闭其他标签页、重新加载后重试。')}
                      </p>
                    )}
                    <div className="mt-3 flex justify-center gap-2">
                      <button type="button" disabled={this.state.resetBusy} onClick={() => this.setState({ confirmReset: false })} className="rounded-lg border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 disabled:opacity-50">
                        {uiLanguage === 'en' ? 'Cancel' : '取消'}
                      </button>
                      <button type="button" disabled={this.state.resetBusy || this.state.resetError !== null} onClick={this.confirmResetData} className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white hover:bg-rose-500 disabled:opacity-50">
                        {this.state.resetBusy ? (uiLanguage === 'en' ? 'Deleting…' : '正在清除…') : t.reset}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
