import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import type { MarketRegion } from '../../types';
import { cropResumePhoto, isSafeResumePhotoDataUrl, validateResumePhotoFile } from '../../lib/resume-photo';
import { useResumeStore } from '../../store/useResumeStore';
import { activeResumePersistence } from '../../lib/resume-persistence';
import { CustomSlider } from '../ui/CustomSlider';
import { CustomSwitch } from '../ui/CustomSwitch';

interface ResumePhotoEditorProps {
  lang: 'zh' | 'en';
  marketRegion?: MarketRegion;
}

export function ResumePhotoEditor({ lang, marketRegion }: ResumePhotoEditorProps) {
  const isEn = lang === 'en';
  const activeProfileId = useResumeStore((state) => state.activeProfileId);
  const savedPhoto = useResumeStore((state) => {
    const candidate = state.profiles.find((profile) => profile.id === state.activeProfileId)?.photoDataUrl;
    return isSafeResumePhotoDataUrl(candidate) ? candidate : undefined;
  });
  const showPhotoSetting = useResumeStore((state) => state.settings.showPhoto);
  const setPhoto = useResumeStore((state) => state.setActiveProfilePhoto);
  const updateSetting = useResumeStore((state) => state.updateSetting);
  const fileInput = useRef<HTMLInputElement>(null);
  // Invalidate in-flight image processing after a profile switch or another selection.
  const selectionVersion = useRef(0);

  const [pendingFile, setPendingFile] = useState<File | null>(null);
  // Preview only re-encoded JPEG data, never a raw upload blob URL.
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [horizontal, setHorizontal] = useState(50);
  const [vertical, setVertical] = useState(50);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isChina = (marketRegion ?? 'cn') === 'cn';
  const visible = showPhotoSetting ?? isChina;

  useEffect(() => {
    selectionVersion.current += 1;
    setPendingFile(null);
    setPreviewPhoto('');
    setError('');
  }, [activeProfileId]);

  useEffect(() => {
    if (!pendingFile) {
      setPreviewPhoto('');
      return;
    }

    let cancelled = false;
    // Debounce range dragging: decoding the uploaded source on every pointer move is expensive.
    const timer = window.setTimeout(() => {
      void cropResumePhoto(pendingFile, horizontal / 100, vertical / 100)
        .then((jpeg) => {
          if (!cancelled) setPreviewPhoto(jpeg);
        })
        .catch(() => {
          if (!cancelled) {
            setPreviewPhoto('');
            setError(isEn
              ? 'This photo could not be processed. Try a different photo.'
              : '无法处理这张图片，请换一张照片重试。');
          }
        });
    }, 120);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pendingFile, horizontal, vertical, isEn]);

  const pickPhoto = (file: File | undefined) => {
    if (!file) return;
    selectionVersion.current += 1;
    const invalid = validateResumePhotoFile(file);
    if (invalid) {
      // A rejected replacement must not leave a previously queued upload actionable.
      setPendingFile(null);
      setPreviewPhoto('');
      setError(invalid === 'unsupported'
        ? (isEn ? 'Choose a PNG, JPEG, or WebP photo.' : '请上传 PNG、JPEG 或 WebP 图片。')
        : (isEn ? 'Photo must be smaller than 5 MB.' : '照片须小于 5 MB。'));
      return;
    }
    setPendingFile(file);
    setPreviewPhoto('');
    setHorizontal(50);
    setVertical(50);
    setError('');
  };

  const savePhoto = async () => {
    if (!pendingFile || saving) return;
    const startedForProfile = activeProfileId;
    const startedVersion = selectionVersion.current;
    setSaving(true);
    setError('');
    try {
      const dataUrl = await cropResumePhoto(pendingFile, horizontal / 100, vertical / 100);
      // Async decoding may outlast a profile switch. Never attach to the wrong profile.
      if (useResumeStore.getState().activeProfileId !== startedForProfile ||
          selectionVersion.current !== startedVersion) return;
      setPhoto(dataUrl);
      updateSetting('showPhoto', true);
      // The preview updates synchronously, but IndexedDB autosave is debounced.
      // Do not report completion until the portrait survives an immediate reload.
      await activeResumePersistence.flush();
      if (useResumeStore.getState().activeProfileId !== startedForProfile ||
          selectionVersion.current !== startedVersion) return;
      setPendingFile(null);
      setPreviewPhoto('');
    } catch {
      if (selectionVersion.current !== startedVersion ||
          useResumeStore.getState().activeProfileId !== startedForProfile) return;
      setError(isEn
        ? 'This photo could not be processed or saved. Please try again.'
        : '照片处理或本地保存失败，请重试。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-3.5 dark:border-slate-700 dark:bg-slate-900/50 md:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {isEn ? 'Resume photo (optional)' : '简历证件照（可选）'}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
            {isEn
              ? 'Processed locally and stored in your browser. Full JSON backups include the photo; Markdown and share links do not.'
              : '照片在本地处理并保存在浏览器；完整 JSON 备份会包含照片，但 Markdown 和分享链接不会包含。'}
          </p>
        </div>
        {savedPhoto && !pendingFile && (
          <CustomSwitch
            checked={visible}
            onChange={(checked) => updateSetting('showPhoto', checked)}
            label={isEn ? 'Show on resume' : '在简历中显示'}
            size="sm"
          />
        )}
      </div>
      {!isChina && (
        <p className="mt-2 text-[10px] text-amber-700 dark:text-amber-300">
          {isEn
            ? 'Photos are not typically recommended for regular applications in the US, Canada or UK. Leave it hidden unless you need it.'
            : '美国、加拿大、英国等常规求职简历通常不建议附照片；如无特殊要求，建议隐藏。'}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-start gap-4">
        {(pendingFile ? previewPhoto : savedPhoto) && (
          <img
            src={pendingFile ? previewPhoto : savedPhoto}
            alt={isEn ? 'Resume portrait preview' : '简历证件照预览'}
            className="h-[112px] w-[84px] shrink-0 rounded-md border border-slate-200 bg-slate-100 object-cover"
            style={{ objectPosition: `${horizontal}% ${vertical}%` }}
          />
        )}
        <div className="min-w-[180px] flex-1 space-y-2">
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-label={isEn ? 'Choose resume photo' : '选择简历证件照'}
            onChange={(event) => {
              pickPhoto(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              {savedPhoto ? (isEn ? 'Replace photo' : '替换照片') : (isEn ? 'Upload photo' : '上传证件照')}
            </button>
            {savedPhoto && (
              <button
                type="button"
                onClick={() => { selectionVersion.current += 1; setPhoto(null); setPendingFile(null); setPreviewPhoto(''); }}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isEn ? 'Remove' : '删除'}
              </button>
            )}
          </div>
          {pendingFile && (
            <div className="space-y-1.5">
              <CustomSlider
                label={isEn ? 'Horizontal crop position' : '水平裁剪位置'}
                value={horizontal}
                onChange={setHorizontal}
                valueDisplay={(v) => `${v}%`}
                size="sm"
              />
              <CustomSlider
                label={isEn ? 'Vertical crop position' : '垂直裁剪位置'}
                value={vertical}
                onChange={setVertical}
                valueDisplay={(v) => `${v}%`}
                size="sm"
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => void savePhoto()}
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? (isEn ? 'Processing...' : '处理中…')
                  : (isEn ? 'Apply 3:4 crop' : '应用 3:4 裁剪')}
              </button>
            </div>
          )}
          {!pendingFile && (
            <p className="text-[10px] text-slate-400">
              {isEn ? 'PNG / JPEG / WebP, up to 5 MB; auto-cropped to 3:4.' : 'PNG / JPEG / WebP，最多 5 MB；本地裁剪为 3:4。'}
            </p>
          )}
          {error && <p role="alert" className="text-[11px] text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
