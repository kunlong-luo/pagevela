import React, { useState } from 'react';
import { Minimize2, CheckCircle2, Check } from 'lucide-react';
import { SHOWCASE_DATA } from './showcaseData';

interface LandingShowcaseProps {
  isEn: boolean;
}

export function LandingShowcase({ isEn }: LandingShowcaseProps) {
  const [tab, setTab] = useState<'markdown' | 'form' | 'autofit' | 'ats'>('form');
  const sample = isEn ? SHOWCASE_DATA.en : SHOWCASE_DATA.zh;

  return (
    <section id="showcase" className="scroll-mt-20 py-12 sm:py-16 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200/70 dark:border-slate-800/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Designed for High-Impact Job Applications' : '告别繁琐排版，专注核心经历'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {isEn
              ? 'Split workspace with real-time bidirectional sync, layout auto-fit, and instant ATS audit.'
              : '左右分栏所见即所得，表单与 Markdown 无缝双向协同，即时呈现专业排版效果。'}
          </p>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {isEn ? 'Illustrative preview with fictional resume content; scores and page measurements are examples.' : '以下为虚构简历的演示预览，评分与页数数值均为示例。'}
          </p>

          {/* Interactive Mode Tabs */}
          <div className="mt-6 inline-flex p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 border border-slate-300/50 dark:border-slate-700 max-w-full overflow-x-auto">
            <button
              type="button"
              aria-pressed={tab === 'form'}
              onClick={() => setTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'form'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'Form' : '表单'}
            </button>
            <button
              type="button"
              aria-pressed={tab === 'markdown'}
              onClick={() => setTab('markdown')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'markdown'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'Markdown' : 'Markdown'}
            </button>
            <button
              type="button"
              aria-pressed={tab === 'autofit'}
              onClick={() => setTab('autofit')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'autofit'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'Smart Auto Fit' : '智能单页 (Auto Fit)'}
            </button>
            <button
              type="button"
              aria-pressed={tab === 'ats'}
              onClick={() => setTab('ats')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tab === 'ats'
                  ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isEn ? 'ATS Audit' : 'ATS 体检'}
            </button>
          </div>
        </div>

        {/* Mock Preview Window */}
        <div className="rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xl overflow-hidden">
          {/* Top Window Bar */}
          <div className="h-10 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-medium text-[11px] text-slate-500 dark:text-slate-400">
                {isEn ? 'Resume Draft' : '个人求职简历.pdf'} · {tab === 'form' ? (isEn ? 'Form' : '表单') : tab === 'markdown' ? 'Markdown' : tab === 'autofit' ? (isEn ? 'Auto Fit' : '智能单页') : (isEn ? 'ATS Audit' : 'ATS 体检')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/50 dark:border-emerald-800/50">
                {isEn ? 'Auto-saved locally' : '已自动同步保存'}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                A4 · 1 Page
              </span>
            </div>
          </div>

          {/* Split Screen Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 min-h-[400px]">
            {/* Left Pane: Editor Preview */}
            <div className="p-5 font-mono text-xs bg-slate-50/70 dark:bg-slate-900/60 flex flex-col justify-between overflow-hidden">
              {tab === 'markdown' && (
                <div className="space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed overflow-hidden">
                  <p className="text-indigo-600 dark:text-indigo-400 font-bold"># {sample.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{sample.headline}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">{sample.contacts}</p>
                  <div className="pt-2 text-indigo-600 dark:text-indigo-400 font-bold">## {sample.summaryTitle}</div>
                  {sample.summaryItems.map((item, idx) => (
                    <p key={idx}>- {item}</p>
                  ))}
                  <div className="pt-2 text-indigo-600 dark:text-indigo-400 font-bold">## {sample.experienceTitle}</div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">### {sample.companyRoleDate}</p>
                  {sample.experienceItems.map((item, idx) => (
                    <p key={idx}>- {item}</p>
                  ))}
                </div>
              )}

              {tab === 'form' && (
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      {isEn ? 'Basic Info' : '基本信息'}
                    </span>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                        {sample.name}
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 truncate">
                        {sample.headline}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                        {sample.experienceTitle}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">
                        {isEn ? 'STAR Format Ready' : 'STAR 法则规范'}
                      </span>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300">
                      {sample.companyRoleDate}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'autofit' && (
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200">
                    <div className="flex items-center gap-2 font-bold mb-1">
                      <Minimize2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <span>{isEn ? 'Auto Fit layout adjustment (example)' : 'Auto Fit 智能单页排版'}</span>
                    </div>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-300">
                      {isEn
                        ? 'Example: adjust line height and spacing to help content fit, without guaranteeing one page for every resume.'
                        : '动态精细调整段落边距与行高，消除多出两行挤出空白页的排版难题。'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isEn ? 'Before Auto Fit' : '优化前高度'}</span>
                      <span className="font-bold text-rose-500 font-mono">108% (2 Pages)</span>
                    </div>
                    <div className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[10px]">{isEn ? 'After Auto Fit' : 'Auto Fit 锁定后'}</span>
                      <span className="font-bold text-emerald-500 font-mono">99.4% (1 Page)</span>
                    </div>
                  </div>
                </div>
              )}

              {tab === 'ats' && (
                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3.5 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {isEn ? 'ATS rule check (example)' : 'ATS 规则检查（示例）'}
                      </span>
                      <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded font-mono font-bold">100 / 100</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      {isEn
                        ? 'Illustrative checks for formatting, dates, and heading hierarchy; not an ATS compatibility guarantee.'
                        : '示例：检查字符、日期和标题层级，不保证所有招聘系统的解析结果。'}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? 'Valid contact syntax & links' : '联系方式格式规范齐全'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? 'Consistent standard date ranges' : '所有经历均具备完整起止年月'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{isEn ? 'Clean heading hierarchy for parsers' : '清晰的标题与经历层级'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* The interactive preview stays focused on the demo; the sticky nav has the editor CTA. */}
              <p className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 font-sans">
                {isEn ? 'Preview: Markdown and forms stay in sync' : '演示：Markdown 与表单双向同步'}
              </p>
            </div>

            {/* Right Pane: A4 Preview Sheet */}
            <div className="p-6 bg-slate-200/50 dark:bg-slate-900/90 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-[340px] bg-white text-slate-900 rounded-sm shadow-xl p-5 text-[10px] leading-snug border border-slate-300/80">
                {/* Header */}
                <div className="border-b border-indigo-600 pb-2 mb-2.5">
                  <h3 className="text-base font-black text-slate-900 tracking-tight">{sample.name}</h3>
                  <p className="text-[11px] font-bold text-indigo-600 mt-0.5">{sample.headline}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{sample.contacts}</p>
                </div>

                {/* Summary */}
                <div className="mb-2.5">
                  <h4 className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-xs inline-block" />
                    {sample.summaryTitle}
                  </h4>
                  <ul className="text-[9px] text-slate-700 leading-normal space-y-0.5">
                    {sample.summaryItems.map((item, idx) => (
                      <li key={idx}>· {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Experience */}
                <div className="mb-2">
                  <h4 className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider mb-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-xs inline-block" />
                    {sample.experienceTitle}
                  </h4>
                  <p className="text-[9.5px] font-bold text-slate-900 mb-0.5">{sample.companyRoleDate}</p>
                  <ul className="text-[8.5px] text-slate-700 space-y-0.5">
                    {sample.experienceItems.map((item, idx) => (
                      <li key={idx}>· {item}</li>
                    ))}
                  </ul>
                </div>

                {/* Paper spec bottom note */}
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400">
                  <span>A4 Standard (210 × 297 mm)</span>
                  <span className="text-emerald-600 font-bold">{isEn ? 'Preview Sample' : '排版示例'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
