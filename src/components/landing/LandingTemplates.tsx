import React from 'react';
import { ArrowRight, Cpu, GraduationCap, TrendingUp, Briefcase } from 'lucide-react';
import { TEMPLATES } from '../../data';
import { getTemplatePresentation } from '../../lib/template-presentation';

interface LandingTemplatesProps {
  isEn: boolean;
  uiLanguage: 'zh' | 'en';
  onSelectTemplate: (templateId: string) => void;
}

export function LandingTemplates({
  isEn,
  uiLanguage,
  onSelectTemplate
}: LandingTemplatesProps) {
  const templatesToShow = TEMPLATES.filter((template) => template.suggestedLang === uiLanguage).slice(0, 4);

  return (
    <section id="templates" className="py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isEn ? 'Industry Proven Styles' : '精选开箱即用模板'}
          </span>
          <h2 className="mt-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {isEn ? 'Real-World Production Templates' : '一线企业与名企成熟排版模版'}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
            {isEn
              ? 'Choose a style to jump straight into the editor. Clean Markdown starter ready.'
              : '涵盖国内校招、社招技术骨干、运营增长及欧美外企标准，点击即可直接载入编辑。'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templatesToShow.map((tmpl) => {
            const isTech = tmpl.id.includes('swe') || tmpl.id === 'backend' || tmpl.id === 'custom';
            const isCampus = tmpl.id === 'campus' || tmpl.id === 'us_new_grad';
            const Icon = isCampus ? GraduationCap : isTech ? Cpu : tmpl.id === 'operations' ? TrendingUp : Briefcase;
            const presentation = getTemplatePresentation(tmpl, uiLanguage);

            return (
              <div
                key={tmpl.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 flex flex-col justify-between hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-2xs group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {presentation.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1 mb-2 line-clamp-1">
                    {presentation.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {presentation.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {tmpl.defaultPaperSize === 'letter' ? 'US Letter' : 'A4'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectTemplate(tmpl.id)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEn ? 'Use Template' : '使用该模板'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
