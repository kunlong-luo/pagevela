import { describe, expect, it } from 'vitest';
import type { ResumeSettings } from '../types';
import { createMatrixSeedVersions } from '../lib/matrix-seeds';

const settings = (lang: 'zh' | 'en'): ResumeSettings =>
  ({ lang, themeColor: 'slate' } as ResumeSettings);

describe('resume matrix bilingual demo versions', () => {
  it.each([
    {
      ui: 'en', resume: 'en', heading: '# Your Name',
      expectedFrontend: '# Your Name | Frontend Engineer',
      expectedFullstack: '# Your Name | Fullstack Engineer',
      expectedTitle: 'Frontend Engineer Version',
    },
    {
      ui: 'zh', resume: 'en', heading: '# Your Name',
      expectedFrontend: '# Your Name | Frontend Engineer',
      expectedFullstack: '# Your Name | Fullstack Engineer',
      expectedTitle: '前端开发岗位版',
    },
    {
      ui: 'en', resume: 'zh', heading: '# 姓名',
      expectedFrontend: '# 姓名 ｜ 前端研发工程师',
      expectedFullstack: '# 姓名 ｜ 全栈技术负责人',
      expectedTitle: 'Frontend Engineer Version',
    },
    {
      ui: 'zh', resume: 'zh', heading: '# 姓名',
      expectedFrontend: '# 姓名 ｜ 前端研发工程师',
      expectedFullstack: '# 姓名 ｜ 全栈技术负责人',
      expectedTitle: '前端开发岗位版',
    },
  ] as const)(
    'localizes version titles to $ui and seed content to $resume',
    ({ ui, resume, heading, expectedFrontend, expectedFullstack, expectedTitle }) => {
      const source = `${heading}\n\n## Experience\n- Preserve existing resume text`;
      const originalSettings = settings(resume);
      const versions = createMatrixSeedVersions(source, originalSettings, ui, '2026-10-21');

      expect(versions).toHaveLength(2);
      expect(versions[0].title).toBe(expectedTitle);
      expect(versions[0].markdown).toContain(expectedFrontend);
      expect(versions[1].markdown).toContain(expectedFullstack);
      expect(versions.every(v => v.markdown.includes('Preserve existing resume text'))).toBe(true);
      expect(versions[0].settings.lang).toBe(resume);
      expect(versions[0].settings.themeColor).toBe('blue');
      expect(versions[1].settings.themeColor).toBe('indigo');
      expect(originalSettings.themeColor).toBe('slate');
      expect(source).toContain(heading);
    },
  );

  it('does not rewrite real names, existing job titles, or original drafts', () => {
    const inputs = [
      '# Alex Morgan\n\n## Work Experience\n- Shipped features',
      '# 张三 ｜ 后端工程师\n\n## 工作经历\n- 持续维护',
      '## Summary\nNo name header',
    ];
    for (const source of inputs) {
      const versions = createMatrixSeedVersions(source, settings('en'), 'zh', 'today');
      expect(versions[0].markdown).toBe(source);
      expect(versions[1].markdown).toBe(source);
    }
  });
});
