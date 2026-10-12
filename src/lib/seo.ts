// Public product metadata only: never derive SEO content from resumes or share URLs.
export type SeoLanguage = 'en' | 'zh';

export const SEO_COPY = {
  en: {
    title: 'Resume Craft — Free Markdown Resume Builder | Local-First',
    description: 'Build resumes with Markdown or forms, live A4/US Letter previews, basic ATS-oriented checks, Auto Fit and PDF export. Free, open source and local-first.',
    locale: 'en_US',
    documentLanguage: 'en',
  },
  zh: {
    title: 'Resume Craft 简匠 — 免费开源 Markdown 简历编辑器',
    description: '简匠是一款免费开源、本地优先的简历编辑器，支持 Markdown 与表单双向编辑、A4 / US Letter 实时预览、ATS 规则检查、Auto Fit 和 PDF 导出。',
    locale: 'zh_CN',
    documentLanguage: 'zh-CN',
  },
} as const;

export function updateSiteSeo(language: SeoLanguage) {
  if (typeof document === 'undefined') return;
  const copy = SEO_COPY[language];
  document.title = copy.title;
  document.documentElement.lang = copy.documentLanguage;

  const setMeta = (selector: string, value: string) => {
    const element = document.querySelector<HTMLMetaElement>(selector);
    if (element) element.content = value;
  };

  setMeta('meta[name="description"]', copy.description);
  setMeta('meta[property="og:title"]', copy.title);
  setMeta('meta[property="og:description"]', copy.description);
  setMeta('meta[property="og:locale"]', copy.locale);
  setMeta('meta[name="twitter:title"]', copy.title);
  setMeta('meta[name="twitter:description"]', copy.description);
}
