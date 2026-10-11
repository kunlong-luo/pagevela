import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { GithubIcon } from './LandingNavbar';

interface LandingBottomCtaProps {
  isEn: boolean;
  onOpenEditor: () => void;
}

export function LandingBottomCta({ isEn, onOpenEditor }: LandingBottomCtaProps) {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
          {isEn ? 'Ready to Build Your Winning Resume?' : '开启你的全新求职里程'}
        </h2>
        <p className="text-sm sm:text-base text-indigo-200/90 max-w-xl mx-auto mb-8">
          {isEn
            ? 'Open source, local-first, zero sign-up. Start crafting your high-impact resume in seconds.'
            : '无需注册，直接进入编辑器，用最纯粹的 Markdown 与实时排版打造完美简历。'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onOpenEditor}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-indigo-950 hover:bg-slate-100 shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>{isEn ? 'Open Resume Craft Editor' : '立即进入简历编辑器'}</span>
            <ArrowRight className="w-4 h-4 ml-0.5 text-indigo-600" />
          </button>
          <a
            href="https://github.com/kunlong-luo/resume-craft"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-all flex items-center justify-center gap-2"
          >
            <GithubIcon className="w-4 h-4" />
            <span>{isEn ? 'Star on GitHub' : '在 GitHub 给我们一颗 Star'}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
