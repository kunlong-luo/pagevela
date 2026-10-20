import React from 'react';
import { getProductDisplayName } from '../../lib/brand';
import { Sun, Moon } from 'lucide-react';
import { LanguageToggle } from '../ui/LanguageToggle';
import { ThemeMode } from '../../types';
import { Tooltip } from '../ui/Tooltip';

export function GithubIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

interface LandingNavbarProps {
  isEn: boolean;
  themeMode: ThemeMode;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}

export function LandingNavbar({
  isEn,
  themeMode,
  onToggleLanguage,
  onToggleTheme
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#070a13]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
            P
          </div>
          <div className="flex items-baseline gap-2">
            <span className="hidden sm:inline font-black text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              {getProductDisplayName(isEn ? 'en' : 'zh')}
            </span>
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline whitespace-nowrap">
              {isEn ? 'Private, Professional Resume Builder' : '本地私密 · 结构化简历构建工具'}
            </span>
          </div>
        </div>

        {/* Navigation follows the landing sections from top to bottom. */}
        <nav aria-label={isEn ? 'Page sections' : '页面章节'} className="hidden md:flex items-center gap-4 lg:gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Interactive Demo' : '界面预览'}
          </a>
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Features' : '核心功能'}
          </a>
          <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Privacy' : '隐私与安全'}
          </a>
          <a href="#templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Templates' : '精选模板'}
          </a>
          <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'FAQ' : '常见问题'}
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global language toggle, shared with the editor beside Theme. */}
          <LanguageToggle isEn={isEn} onToggle={onToggleLanguage} />

          {/* Theme toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Low-friction GitHub Star link, also accessible on mobile. */}
          <Tooltip content={isEn ? 'Star Pagevela on GitHub' : '在 GitHub 上为 Pagevela 点 Star'} side="bottom">
            <a
              href="https://github.com/kunlong-luo/pagevela"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={isEn ? 'Star Pagevela on GitHub' : '在 GitHub 上为 Pagevela 点 Star'}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold">Star</span>
            </a>
          </Tooltip>


        </div>
      </div>
    </header>
  );
}
