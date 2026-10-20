import { expect, test, type Locator } from '@playwright/test';

async function expectUnifiedScrollbar(surface: Locator) {
  await expect(surface).toBeVisible();
  const style = await surface.evaluate(element => ({
    overflow: getComputedStyle(element).overflowY,
    standardWidth: getComputedStyle(element).scrollbarWidth,
    webkitWidth: getComputedStyle(element, '::-webkit-scrollbar').width,
    trackColor: getComputedStyle(element, '::-webkit-scrollbar-track').backgroundColor,
  }));
  expect(['auto', 'scroll']).toContain(style.overflow);
  expect(style.standardWidth).toBe('auto'); // Let the Chromium-specific 5px rail win.
  expect(style.webkitWidth).toBe('5px');
  expect(style.trackColor).toBe('rgba(0, 0, 0, 0)');
}

for (const language of ['zh', 'en'] as const) {
  for (const width of [390, 1280]) {
    test('form, source and preview have the same 5px scrollbars: ' + language + ' at ' + width + 'px', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'WebKit-specific width is measured in Chromium');
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/?page=editor');

      const form = page.locator('#editor-pane .workspace-scrollbar').first();
      await expectUnifiedScrollbar(form);

      await page.getByRole('button', {
        name: language === 'en' ? 'Markdown source editor' : 'Markdown 源码编辑模式',
      }).click();
      await expectUnifiedScrollbar(page.locator('#markdown-textarea.workspace-scrollbar'));

      if (width < 768) {
        await page.getByRole('navigation', {
          name: language === 'en' ? 'Mobile workspace actions' : '移动端工作区操作',
        }).getByRole('button', { name: language === 'en' ? 'Preview' : '预览' }).click();
      }
      await expectUnifiedScrollbar(page.locator('#resume-preview-wrapper.workspace-scrollbar'));
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(horizontalOverflow).toBeLessThanOrEqual(1);
    });
  }
}
