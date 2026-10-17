import { PRODUCT_NAME, getProductDisplayName } from './brand';
// Public product metadata only: never derive SEO content from resumes or share URLs.
export type SeoLanguage = 'en' | 'zh';

export const SEO_COPY = {
  en: {
    title: `${PRODUCT_NAME} — Local-First Resume Builder`,
    description: 'Create and edit resumes with forms or Markdown. Preview A4 and US Letter pages, then export. Your resume content stays in your browser by default.',
    locale: 'en_US',
    documentLanguage: 'en',
  },
  zh: {
    title: `${getProductDisplayName('zh')}（${PRODUCT_NAME}） — 本地优先的简历编辑器`,
    description: '使用表单或 Markdown 制作简历，预览 A4 与 US Letter 排版并导出。简历内容默认保存在浏览器本地。',
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
