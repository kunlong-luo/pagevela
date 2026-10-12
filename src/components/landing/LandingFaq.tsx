import React from 'react';
import { FAQS } from './showcaseData';

interface LandingFaqProps {
  isEn: boolean;
}

export function LandingFaq({ isEn }: LandingFaqProps) {
  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20 bg-white/60 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Frequently Asked Questions' : '常见问题解答'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
            {isEn ? 'Clear answers to privacy, compatibility, and export questions.' : '快速了解数据安全、格式兼容与导出细节。'}
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs"
            >
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white mb-1.5">
                {isEn ? faq.qEn : faq.qZh}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isEn ? faq.aEn : faq.aZh}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
