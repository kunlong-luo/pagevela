import React from 'react';
import { Globe2, Sun, Moon, ArrowRight } from 'lucide-react';
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
  hasExistingResume: boolean;
  themeMode: ThemeMode;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onOpenEditor: () => void;
}

export function LandingNavbar({
  isEn,
  hasExistingResume,
  themeMode,
  onToggleLanguage,
  onToggleTheme,
  onOpenEditor
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-[#070a13]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 rounded-xl text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
            RC
          </div>
          <div className="flex items-baseline gap-2">
            <span className="hidden sm:inline font-black text-base tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              {isEn ? 'Resume Craft' : '简匠 Resume Craft'}
            </span>
            <span className="text-[11px] font-medium text-slate-400 hidden lg:inline whitespace-nowrap">
              {isEn ? 'Private, Professional Resume Builder' : '本地私密 · 结构化简历构建工具'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Features' : '核心功能'}
          </a>
          <a href="#showcase" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Interactive Demo' : '界面预览'}
          </a>
          <a href="#templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Templates' : '精选模板'}
          </a>
          <a href="#privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'Privacy' : '隐私与安全'}
          </a>
          <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap">
            {isEn ? 'FAQ' : '常见问题'}
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language toggle */}
          <button
            type="button"
            onClick={onToggleLanguage}
            aria-label="Toggle language"
            className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>{isEn ? '中文' : 'EN'}</span>
          </button>

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

          {/* GitHub link (Icon only with custom Tooltip, no native title) */}
          <Tooltip content="GitHub" side="bottom">
            <a
              href="https://github.com/kunlong-luo/resume-craft"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="hidden sm:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all items-center justify-center cursor-pointer"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </Tooltip>

          {/* Enter Editor CTA */}
          <button
            type="button"
            data-testid="landing-nav-cta"
            onClick={onOpenEditor}
            className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>{hasExistingResume
              ? (isEn ? 'Continue Editing' : '继续编辑')
              : (isEn ? 'Start Building' : '开始制作')}</span>
            <ArrowRight className="hidden sm:block w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
