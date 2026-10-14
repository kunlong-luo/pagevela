import React, { useRef } from 'react';
import { Archive, Download, Upload } from 'lucide-react';

interface WorkspaceTransferCardProps {
  isEn: boolean;
  busy: boolean;
  onExport: () => void;
  onImport: (file: File) => void;
}

/** Explicit, file-based transfer between browser origins. No network upload. */
export function WorkspaceTransferCard({
  isEn, busy, onExport, onImport,
}: WorkspaceTransferCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <section aria-label={isEn ? 'Transfer entire workspace' : '迁移完整工作区'}
      className="rounded-xl border border-indigo-200 dark:border-indigo-800 p-4 sm:p-5 space-y-3 bg-indigo-50/30 dark:bg-indigo-950/20">
      <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
        <Archive className="h-4 w-4 shrink-0" />
        <h4 className="text-sm font-extrabold">
          {isEn ? 'Move your complete workspace' : '迁移完整简历工作区'}
        </h4>
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        {isEn
          ? 'Unlike the single-resume backup above, this file includes every resume profile, saved draft and job description. Export it on your old website, then import it on the new website.'
          : '与上面的单份简历备份不同，此文件包含所有简历档案、已保存草稿和职位描述。在旧网站导出，再到新网站导入。'}
      </p>
      <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
        {isEn
          ? 'Sensitive, unencrypted JSON: it may include names, contact details, job descriptions and any saved resume photos. Keep this file private. Import replaces all existing local profiles and drafts on this browser. Close other editor tabs before restoring.'
          : '重要：此 JSON 未加密，可能包含姓名、联系方式、职位描述和已保存的证件照。请妥善保管。导入将覆盖当前浏览器全部简历档案和草稿。恢复前请关闭其他正在编辑的标签页。'}
      </p>
      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={onExport}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
          <Download className="h-3.5 w-3.5" />
          {isEn ? 'Export workspace .json' : '导出工作区 .json'}
        </button>
        <button type="button" disabled={busy} onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-300 px-3 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 dark:border-indigo-700 disabled:opacity-50">
          <Upload className="h-3.5 w-3.5" />
          {isEn ? 'Import workspace .json' : '导入工作区 .json'}
        </button>
        <input ref={inputRef} type="file" accept=".json,application/json" disabled={busy}
          aria-label={isEn ? 'Choose workspace backup file' : '选择工作区备份文件'} className="sr-only"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            event.currentTarget.value = '';
            if (file) onImport(file);
          }} />
      </div>
    </section>
  );
}
