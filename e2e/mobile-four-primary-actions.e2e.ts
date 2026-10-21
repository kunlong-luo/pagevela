import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390]) {
    test('mobile form, code, preview and editing tools remain reachable: ' + language + ' at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/?page=editor');

      const dock = page.getByRole('navigation', {
        name: language === 'en' ? 'Mobile workspace actions' : '移动端工作区操作',
      });
      const tabs = [
        dock.getByRole('button', { name: language === 'en' ? 'Form editor' : '表单编辑模式' }),
        dock.getByRole('button', { name: language === 'en' ? 'Markdown source editor' : 'Markdown 源码编辑模式' }),
        dock.getByRole('button', { name: language === 'en' ? 'Preview' : '预览' }),
      ];
      const labels = language === 'en' ? ['Form', 'Code', 'Preview'] : ['表单', '源码', '预览'];
      const bounds = [];
      for (const [index, button] of tabs.entries()) {
        await expect(button).toBeVisible();
        await expect(button.locator('span')).toHaveText(labels[index]);
        const rect = await button.boundingBox();
        expect(rect).not.toBeNull();
        expect(rect!.height).toBeGreaterThanOrEqual(44);
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 0.5);
        bounds.push(rect!);
      }
      for (const rect of bounds) expect(Math.abs(rect.y - bounds[0].y)).toBeLessThan(3);
      expect(bounds[0].x + bounds[0].width).toBeLessThanOrEqual(bounds[1].x + 1);
      expect(bounds[1].x + bounds[1].width).toBeLessThanOrEqual(bounds[2].x + 1);
      expect(await dock.evaluate(el => getComputedStyle(el).position)).not.toBe('fixed');

      const actions = page.getByTestId('mobile-editor-primary-actions');
      const fit = actions.getByRole('button', { name: language === 'en' ? 'Auto fit to single page' : '单页自动适配' });
      const check = actions.getByRole('button', { name: language === 'en' ? 'Check resume ATS' : 'ATS 简历检查' });
      await expect(fit).toBeVisible();
      await expect(check).toBeVisible();
      await expect(actions.getByRole('button')).toHaveCount(2);
      await expect(page.locator('#preview-pane')).toBeHidden();

      await tabs[1].click();
      await expect(page.locator('#markdown-textarea')).toBeVisible();
      await expect(tabs[1]).toHaveAttribute('aria-pressed', 'true');
      await tabs[2].click();
      await expect(page.locator('#resume-preview-wrapper')).toBeVisible();
      await expect(tabs[2]).toHaveAttribute('aria-pressed', 'true');
      await tabs[0].click();
      await expect(page.locator('#editor-pane')).toBeVisible();
      await expect(tabs[0]).toHaveAttribute('aria-pressed', 'true');
      await fit.click();
      await expect(fit).toBeEnabled();
      await check.click();
      await expect(page.getByRole('dialog', { name: language === 'en' ? 'Resume Check' : '简历检查' })).toBeVisible();
    });
  }
}

test('desktop retains source mode and auto fit in its toolbar', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  const source = page.getByRole('button', { name: 'Markdown source editor' });
  await expect(source.locator('span:visible')).toHaveText('Markdown');
  await expect(page.getByRole('button', { name: 'Auto fit to single page' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Check resume ATS' })).toBeHidden();
});
