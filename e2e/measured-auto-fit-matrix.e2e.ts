import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

const scenarios = [
  {
    name: 'A4 English, one-page target and default layout',
    language: 'en',
    paper: 'a4',
    target: 1,
    template: 'single',
    heading: 'Fictional One Page Resume',
    entries: 4,
  },
  {
    name: 'US Letter Chinese, three-page target and two-column layout',
    language: 'zh',
    paper: 'letter',
    target: 3,
    template: 'two-column',
    heading: '虚构中文多页简历',
    entries: 90,
  },
] as const;

/**
 * A small, deterministic browser matrix complements the existing English A4
 * two-page measured-fit E2E without claiming to validate OS print pagination.
 * It uses synthetic resume content only and checks the persisted source.
 */
for (const scenario of scenarios) {
  test(`measured Auto Fit matrix: ${scenario.name}`, async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Extended measured-fit matrix is a Chromium smoke regression');
    test.setTimeout(120_000);

    await page.addInitScript(({ language }) => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', language);
      localStorage.setItem('height-guard-collapsed', 'false');
    }, { language: scenario.language });

    await page.goto('/?page=editor');
    const toolbar = page.locator('#resume-main-toolbar');
    const isEnglish = scenario.language === 'en';
    const layoutName = isEnglish ? 'Layout' : '排版';

    await toolbar.getByRole('button', {
      name: isEnglish ? 'Open layout settings' : '打开排版设置',
    }).click();
    const layoutDialog = page.getByRole('dialog', { name: layoutName });
    await expect(layoutDialog).toBeVisible();
    await layoutDialog.getByRole('button', {
      name: scenario.paper === 'a4' ? /^A4 / : /US Letter/,
    }).click();
    const preview = page.locator('#resume-print-content');
    await expect(preview).toHaveAttribute('data-paper-size', scenario.paper);
    await layoutDialog.getByRole('button', { name: `Close ${layoutName}` }).click();
    await expect(layoutDialog).toBeHidden();

    if (scenario.template === 'two-column') {
      await toolbar.getByRole('button', { name: '打开样式设置' }).click();
      const styleDialog = page.getByRole('dialog', { name: '样式' });
      const preset = styleDialog.getByRole('button', { name: /现代双栏/ });
      await preset.click();
      await expect(preset).toHaveAttribute('aria-pressed', 'true');
      await styleDialog.getByRole('button', { name: 'Close 样式' }).click();
      await expect(styleDialog).toBeHidden();
    }

    await page.getByRole('button', {
      name: isEnglish ? 'Markdown source editor' : 'Markdown 源码编辑模式',
    }).click();
    const editor = page.locator('#markdown-textarea');
    await expect(editor).toBeVisible();

    const markdown = [
      `# ${scenario.heading}`,
      isEnglish ? 'Imaginary QA engineer' : '虚构质量工程师',
      '',
      isEnglish ? '## Experience' : '## 工作经历',
      ...Array.from({ length: scenario.entries }, (_, index) =>
        isEnglish
          ? `- Example project ${index + 1}: Validated a fictional document layout with accessible readable text.`
          : `- 虚构项目 ${index + 1}：验证中文简历分页、模板样式及正文持久化，不包含真实个人信息。`),
    ].join('\n');
    await editor.fill(markdown);
    await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
    await expect(page.getByRole('heading', { name: scenario.heading })).toBeVisible();

    const readLayout = () => page.evaluate(() => {
      const settings = JSON.parse(localStorage.getItem('resume-settings') || '{}') as Record<string, string>;
      return {
        paper: settings.paperSize ?? 'a4',
        template: settings.templateLayout ?? 'single',
      };
    });
    const expectedLayout = { paper: scenario.paper, template: scenario.template };
    await expect.poll(readLayout).toEqual(expectedLayout);

    const target = page.getByRole('button', {
      name: isEnglish ? `Target ${scenario.target} pages` : `目标 ${scenario.target} 页`,
    });
    await target.click();
    await expect(target).toHaveAttribute('aria-pressed', 'true');

    await toolbar.getByRole('button', {
      name: isEnglish ? 'Fit to selected page target' : '按目标页数自动适配',
    }).click();
    // Either honest outcome is valid: a bounded fit cannot guarantee that
    // arbitrary content fits the requested page count.
    await expect(page.getByText(isEnglish
      ? /Fits within the page target|Auto Fit reached a safe stopping point/
      : /排版已符合目标页数|自动排版已到安全停止点/))
      .toBeVisible({ timeout: 45_000 });

    await expect(target).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(readLayout).toEqual(expectedLayout);
    await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);

    await page.reload();
    await expect.poll(readLayout).toEqual(expectedLayout);
    await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
  });
}
