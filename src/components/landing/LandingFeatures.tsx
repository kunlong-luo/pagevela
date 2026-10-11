import React from 'react';
import {
  FileText,
  Minimize2,
  FileCheck,
  Download,
  Layers,
  Share2
} from 'lucide-react';
import { CORE_FEATURES } from './showcaseData';

const iconMap = {
  FileText,
  Minimize2,
  FileCheck,
  Download,
  Layers,
  Share2
};

interface LandingFeaturesProps {
  isEn: boolean;
}

export function LandingFeatures({ isEn }: LandingFeaturesProps) {
  return (
    <section id="features" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isEn ? 'Engineered for Perfection' : '专为求职者量身打造'}
          </span>
          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Six Core Pillars of Resume Craft' : '六大核心特色，告别排版焦虑'}
          </h2>
          <p className="mt-2.5 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            {isEn
              ? 'Minimalist, fast, and local-first. Crafted to eliminate formatting hassle and highlight your achievements.'
              : '消除格式障碍，专注呈现最具说服力的专业经历与技能。'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_FEATURES.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || FileText;

            return (
              <div
                key={feature.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">
                    {isEn ? feature.titleEn : feature.titleZh}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isEn ? feature.descEn : feature.descZh}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
