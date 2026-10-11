import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LandingFooterProps {
  isEn: boolean;
  onOpenEditor: () => void;
}

export function LandingFooter({ isEn, onOpenEditor }: LandingFooterProps) {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-lg text-white flex items-center justify-center font-black text-[10px]">
            RC
          </div>
          <span className="font-bold text-slate-200">Resume Craft 简匠</span>
          <span>· MIT License · Open Source</span>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <button
            type="button"
            onClick={onOpenEditor}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isEn ? 'Editor' : '简历编辑器'}
          </button>
          <a
            href="https://github.com/kunlong-luo/resume-craft"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://github.com/kunlong-luo/resume-craft/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {isEn ? 'Issues & Feedback' : '反馈建议'}
          </a>
        </div>
      </div>
    </footer>
  );
}
