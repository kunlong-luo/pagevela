import type { ResumeDraft, ResumeSettings } from '../types';

/**
 * Seed examples are copies only. Localize their role text using the RESUME
 * language (not the UI language), and never rewrite an existing user's title.
 */
export function createMatrixSeedVersions(
  markdown: string,
  settings: ResumeSettings,
  uiLanguage: 'zh' | 'en',
  timestamp: string,
): ResumeDraft[] {
  const resumeIsEn = settings.lang === 'en';

  const withRole = (englishRole: string, chineseRole: string): string => {
    const role = resumeIsEn ? englishRole : chineseRole;
    return markdown.replace(/^#\s+([^\r\n]+)$/m, (full, heading: string) => {
      const name = heading.trim();
      // Placeholders are safe to customize. Preserve real names/headlines
      // and any pre-existing job title in the resume content.
      if (!/^(?:姓名|你的姓名|Your Name|Name)$/i.test(name)) return full;
      return `# ${name}${resumeIsEn ? ' | ' : ' ｜ '}${role}`;
    });
  };

  return [
    {
      id: 'matrix_seed_frontend',
      title: uiLanguage === 'en' ? 'Frontend Engineer Version' : '前端开发岗位版',
      markdown: withRole('Frontend Engineer', '前端研发工程师'),
      settings: { ...settings, themeColor: 'blue' },
      timestamp,
      isAutoSave: false,
    },
    {
      id: 'matrix_seed_fullstack',
      title: uiLanguage === 'en' ? 'Fullstack Dev Version' : '全栈工程师岗位版',
      markdown: withRole('Fullstack Engineer', '全栈技术负责人'),
      settings: { ...settings, themeColor: 'indigo' },
      timestamp,
      isAutoSave: false,
    },
  ];
}
