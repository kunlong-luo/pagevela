import React from 'react';
import { trackAnalyticsEvent } from '../../lib/analytics';
import { GithubIcon } from './LandingNavbar';
import { Zap, ArrowRight, CheckCircle2, Layout, ShieldCheck, Lock, Download } from 'lucide-react';

interface LandingHeroProps {
  isEn: boolean;
  hasExistingResume: boolean;
  lastSaved: string | null;
  onOpenEditor: () => void;
}

export function LandingHero({
  isEn,
  hasExistingResume,
  lastSaved,
  onOpenEditor
}: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[320px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow kicker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 shadow-2xs mb-6">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span>
            {isEn
              ? 'No sign-up · Local-first editing · Watermark-free PDF'
              : '无需注册 · 本地优先编辑 · PDF 无水印'}
          </span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.18] text-balance">
          {isEn ? (
            <>
              Build Resumes with <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">Flexible Editing & Live Preview</span>.
            </>
          ) : (
            <>
              打造专业求职简历，从未如此
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">纯粹高效</span>。
            </>
          )}
        </h1>

        {/* Crisp, focused subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed text-balance">
          {isEn
            ? 'Edit with forms or Markdown, preview A4 / US Letter pages, reduce overflow with Auto Fit, and save a text-selectable PDF through browser printing when supported.'
            : '表单直观填写与 Markdown 自由录入双模协同，内置 Auto Fit 智能单页排版与 ATS 规范体检，一键导出清晰无损的矢量 PDF。'}
        </p>

        {/* Primary Call-to-actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            data-testid="landing-hero-cta"
            onClick={() => {
              if (!hasExistingResume) trackAnalyticsEvent('start_building_clicked');
              onOpenEditor();
            }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            {hasExistingResume ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Zap className="w-4 h-4" />}
            <span>{hasExistingResume
              ? (isEn ? 'Continue Editing' : '继续编辑简历')
              : (isEn ? 'Start Building (Free)' : '免费开始制作')}</span>
            <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          {hasExistingResume && lastSaved && (
            <span className="text-xs text-slate-500 dark:text-slate-400 sm:self-center">
              {isEn ? `Last saved: ${lastSaved}` : `上次保存：${lastSaved}`}
            </span>
          )}

          <a
            href="#templates"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all flex items-center justify-center gap-2"
          >
            <Layout className="w-4 h-4 text-indigo-500" />
            <span>{isEn ? 'Browse Templates' : '浏览内置模板'}</span>
          </a>
        </div>

        {/* Small tertiary action: support the open-source project without displacing the resume CTA. */}
        <div className="mt-4 flex justify-center">
          <a
            href="https://github.com/kunlong-luo/pagevela"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="landing-github-star"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            <span>{isEn ? 'Star on GitHub' : '在 GitHub 点个 Star'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Clean, de-duplicated trust markers */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            {isEn ? 'Browser-local resume storage' : '简历正文保存在浏览器本地'}
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
            {isEn ? 'Free & Open Source · No Watermark' : '永久免费开源 · 无任何平台水印'}
          </span>
          <span className="flex items-center gap-1.5">
            <Download className="w-4 h-4 text-blue-500 shrink-0" />
            {isEn ? 'Text-selectable PDF via browser print' : '浏览器打印可保留可选择文字的 PDF'}
          </span>
        </div>
      </div>
    </section>
  );
}
