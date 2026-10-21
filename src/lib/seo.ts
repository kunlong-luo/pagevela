import { PRODUCT_NAME, getProductDisplayName } from './brand';
// Public product metadata only: never derive SEO content from resumes or share URLs.
/**
 * One canonical GitHub Pages URL serves both languages. Social crawlers may not
 * execute the runtime locale switch, so the static metadata must describe both
 * audiences. Locale-specific document metadata is applied after boot.
 */
export const STATIC_SEO_COPY = {
  title: `${PRODUCT_NAME}（${getProductDisplayName('zh')}）— Resume Builder / 中英简历编辑器`,
  description: 'Build resumes with forms or Markdown, preview A4/US Letter, and export PDF. 中英双语简历编辑、排版与 PDF 导出；内容默认保存在浏览器本地。',
  locale: 'en_US',
} as const;

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
