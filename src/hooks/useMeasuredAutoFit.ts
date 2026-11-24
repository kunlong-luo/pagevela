import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { Language, ResumeSettings } from '../types';
import { smartAutoFit } from '../lib/preview-utils';
import { evaluateMeasuredFitProgress } from '../lib/measured-auto-fit-policy';
import { useToast } from '../components/ui/Toast';

interface FitRun {
  markdown: string;
  profileId: string;
  target: 1 | 2 | 3;
  expectedSettings: string;
  steps: number;
  lastOverflowPixels: number | null;
  stalledSteps: number;
}

type FinishReason = 'fitted' | 'at-limit' | 'step-limit' | 'no-progress' | 'canceled';

interface Options {
  settings: ResumeSettings;
  markdown: string;
  profileId: string;
  target: 1 | 2 | 3;
  metrics: { isOver: boolean; overflowPixels: number; actualPages: number };
  unscaledHeight: number;
  elementRef: RefObject<HTMLDivElement | null>;
  onChangeSettings: <K extends keyof ResumeSettings>(key: K, value: ResumeSettings[K]) => void;
  uiLanguage: Language;
  disabled: boolean;
}

/**
 * Visible-preview Auto Fit. One click performs bounded monotonic adjustments,
 * checking actual paper overflow after every render. An invisible preview falls
 * back to the old single-step action; no resume text or storage schema changes.
 */
export function useMeasuredAutoFit({
  settings, markdown, profileId, target, metrics, unscaledHeight,
  elementRef, onChangeSettings, uiLanguage, disabled,
}: Options) {
  const { showToast } = useToast();
  const [isAutoFitting, setIsAutoFitting] = useState(false);
  const runRef = useRef<FitRun | null>(null);

  const finish = useCallback((reason: FinishReason) => {
    const run = runRef.current;
    if (!run) return;
    runRef.current = null;
    setIsAutoFitting(false);
    const en = uiLanguage === 'en';
    const targetLabel = en ? `${run.target} ${run.target === 1 ? 'page' : 'pages'}` : `${run.target} 页`;
    const fitted = reason === 'fitted';
    const canceled = reason === 'canceled';
    const title = fitted
      ? (en ? 'Fits within the page target' : '排版已符合目标页数')
      : canceled
        ? (en ? 'Auto Fit canceled' : '已停止自动排版')
        : (en ? 'Auto Fit reached a safe stopping point' : '自动排版已到安全停止点');
    const message = fitted
      ? (en
        ? `Estimated preview fits within ${targetLabel}. Browser print pagination can differ.`
        : `预览估计已符合 ${targetLabel}目标；浏览器打印分页可能有所不同。`)
      : canceled
        ? (en
          ? 'Document, profile, target or layout changed. Resume text was not modified.'
          : '简历内容、方案、目标或排版发生变化；未修改正文内容。')
        : (en
          ? `Still above the ${targetLabel} target after ${run.steps} adjustment(s). Review the preview or shorten the content.`
          : `调整 ${run.steps} 次后仍超出 ${targetLabel}目标，请检查预览或精简内容。`);
    showToast({ title, message, type: fitted ? 'success' : canceled ? 'info' : 'warning', duration: 5000 });
  }, [showToast, uiLanguage]);

  const startAutoFit = useCallback((): boolean => {
    const node = elementRef.current;
    if (disabled || !node || node.getClientRects().length === 0 || unscaledHeight <= 0) return false;
    if (runRef.current) return true;
    runRef.current = {
      markdown, profileId, target, expectedSettings: JSON.stringify(settings),
      steps: 0, lastOverflowPixels: null, stalledSteps: 0,
    };
    setIsAutoFitting(true);
    return true;
  }, [disabled, elementRef, markdown, profileId, settings, target, unscaledHeight]);

  useEffect(() => {
    if (!isAutoFitting) return;
    const run = runRef.current;
    if (!run) return;
    if (
      disabled || run.markdown !== markdown || run.profileId !== profileId ||
      run.target !== target || run.expectedSettings !== JSON.stringify(settings) ||
      !elementRef.current || elementRef.current.getClientRects().length === 0
    ) {
      finish('canceled');
      return;
    }

    const progress = evaluateMeasuredFitProgress({
      isOver: metrics.isOver, overflowPixels: metrics.overflowPixels,
      steps: run.steps, lastOverflowPixels: run.lastOverflowPixels,
      stalledSteps: run.stalledSteps,
    });
    run.stalledSteps = progress.stalledSteps;
    if (progress.decision !== 'continue') {
      finish(progress.decision);
      return;
    }

    const timer = setTimeout(() => {
      if (runRef.current !== run) return;
      const adjusted = smartAutoFit(settings, (key, value) => {
        run.expectedSettings = JSON.stringify({ ...settings, [key]: value });
        onChangeSettings(key, value);
      });
      if (!adjusted) {
        finish('at-limit');
        return;
      }
      run.steps++;
      run.lastOverflowPixels = metrics.overflowPixels;
    }, 150);
    return () => clearTimeout(timer);
  }, [
    disabled, elementRef, finish, isAutoFitting, markdown, profileId,
    target, settings, metrics.isOver, metrics.overflowPixels, onChangeSettings,
  ]);

  useEffect(() => () => { runRef.current = null; }, []);

  return { isAutoFitting, startAutoFit };
}
