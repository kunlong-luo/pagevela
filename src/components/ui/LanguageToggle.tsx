import React from 'react';
import { Globe2 } from 'lucide-react';

interface LanguageToggleProps {
  isEn: boolean;
  onToggle: () => void;
  className?: string;
}

/** Shared global UI language switch used by welcome and editor headers. */
export function LanguageToggle({ isEn, onToggle, className = '' }: LanguageToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isEn ? 'Switch interface to Chinese' : '切换界面为英文'}
      className={`h-9 min-h-9 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${className}`}
    >
      <Globe2 aria-hidden="true" className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
      <span>{isEn ? '中文' : 'EN'}</span>
    </button>
  );
}
