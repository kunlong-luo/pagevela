import { expect, test } from '@playwright/test';

for (const language of ['en', 'zh'] as const) {
  for (const width of [320, 390, 767]) {
    test(`mobile quick action tiles have icons, matching geometry and no duplicated Fit/Check: ${language} ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/?page=editor');

      const toolbarTools = page.locator('#resume-main-toolbar').getByRole('button', {
        name: language === 'en' ? 'More editing tools' : '更多编辑工具',
      });
      await expect(toolbarTools).toBeVisible();
      await expect(toolbarTools.locator('svg')).toHaveCount(1);
      await expect(toolbarTools.locator('span')).toHaveText(language === 'en' ? 'Tools' : '工具');

      await page.getByRole('button', {
        name: language === 'en' ? 'Open quick actions menu' : '打开快捷功能菜单',
      }).click();
      const panel = page.locator('#mobile-quick-actions');
      const grid = panel.getByTestId('mobile-quick-actions-grid');
      await expect(panel).toBeVisible();

      const ids = ['templates', 'layout', 'style', 'editing-tools', 'management', 'import', 'share', 'help'];
      for (const id of ids) {
        const button = grid.getByTestId(`mobile-quick-action-${id}`);
        await expect(button).toBeVisible();
        await expect(button.locator(':scope > svg')).toHaveCount(1);
        await expect(button.locator(':scope > span')).toHaveCount(1);
        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBe(56);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
      }

      const duplicateLabels = language === 'en'
        ? [/^Auto Fit$/, /^Check$/, /^Theme:/, /^Switch interface to Chinese$/]
        : [/^智能单页$/, /^检查$/, /^主题:/, /^切换界面为英文$/];
      for (const label of duplicateLabels) {
        await expect(panel.getByRole('button', { name: label })).toHaveCount(0);
      }
      const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(pageOverflow).toBeLessThanOrEqual(1);

      await grid.getByTestId('mobile-quick-action-editing-tools').click();
      await expect(panel).toHaveCount(0);
      await expect(page.getByRole('button', {
        name: language === 'en' ? 'Auto fit to single page' : '单页自动适配',
      })).toBeVisible();
      await expect(page.getByRole('button', {
        name: language === 'en' ? 'Check resume ATS' : 'ATS 简历检查',
      })).toBeVisible();
    });
  }
}
