import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390]) {
    test('mobile primary actions have four concise visible labels: ' + language + ' at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/?page=editor');

      const actions = page.getByTestId('mobile-editor-primary-actions');
      const buttons = [
        actions.getByRole('button', { name: language === 'en' ? 'Form editor' : '表单编辑模式' }),
        actions.getByRole('button', { name: language === 'en' ? 'Markdown source editor' : 'Markdown 源码编辑模式' }),
        actions.getByRole('button', { name: language === 'en' ? 'Auto fit to single page' : '单页自动适配' }),
        actions.getByRole('button', { name: language === 'en' ? 'Check resume ATS' : 'ATS 简历检查' }),
      ];
      const expectedLabels = language === 'en' ? ['Form', 'Code', 'Fit', 'Check'] : ['表单', '源码', '单页', '检查'];
      const coordinates = [];
      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        await expect(button).toBeVisible();
        await expect(button.locator('span:visible')).toHaveText(expectedLabels[i]);
        expect(await button.evaluate(el => getComputedStyle(el).whiteSpace)).toBe('nowrap');
        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThanOrEqual(40);
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 0.5);
        coordinates.push(box!);
      }

      const firstY = coordinates[0].y;
      for (const box of coordinates) {
        expect(Math.abs(box.y - firstY)).toBeLessThanOrEqual(3);
      }
      expect(coordinates[0].x + coordinates[0].width).toBeLessThanOrEqual(coordinates[1].x + 1);
      expect(coordinates[1].x + coordinates[1].width).toBeLessThanOrEqual(coordinates[2].x + 1);
      expect(coordinates[2].x + coordinates[2].width).toBeLessThanOrEqual(coordinates[3].x + 1);

      // The one-line toolbar is usable, not merely within the viewport.
      await buttons[1].click();
      await expect(page.locator('#markdown-textarea')).toBeVisible();
      await buttons[0].click();
      await buttons[2].click();
      await expect(buttons[2]).toBeEnabled();
      await buttons[3].click();
      await expect(page.getByRole('dialog', { name: language === 'en' ? 'Resume Check' : '简历检查' })).toBeVisible();
    });
  }
}

test('desktop keeps descriptive Markdown editor label and existing auto-fit toolbar action', async ({ page }) => {
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
