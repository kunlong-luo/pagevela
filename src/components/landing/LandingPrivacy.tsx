import React from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { PRIVACY_COMPARISONS } from './showcaseData';

interface LandingPrivacyProps {
  isEn: boolean;
}

export function LandingPrivacy({ isEn }: LandingPrivacyProps) {
  return (
    <section id="privacy" className="scroll-mt-20 py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex p-2 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Your Resume Data Belongs Exclusively to You' : '本地优先：简历由你管理'}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {isEn
              ? 'Resume drafts are stored in this browser. No account required; privacy-conscious aggregate analytics help us improve the app.'
              : '简历草稿主要保存在当前浏览器，无需注册。我们使用尊重隐私的汇总使用统计；可自行导出备份。'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional cloud platforms */}
          <div className="p-6 rounded-2xl bg-white/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">
              {isEn ? 'Traditional Cloud Resume Tools' : '常见商业在线简历平台'}
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {PRIVACY_COMPARISONS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">
                    <X className="w-4 h-4" />
                  </span>
                  <span>{isEn ? item.enTraditional : item.zhTraditional}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Resume Craft Local-First */}
          <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
              {isEn ? 'Resume Craft (Local-First Design)' : 'Resume Craft 简匠架构'}
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              {PRIVACY_COMPARISONS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-500 font-bold shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>{isEn ? item.enCraft : item.zhCraft}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
