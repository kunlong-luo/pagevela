import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390]) {
    test('welcome showcase has four concise one-line tabs: ' + language + ' ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/');

      const tabs = page.getByTestId('landing-showcase-tabs');
      await expect(tabs).toBeVisible();
      const buttons = tabs.getByRole('button');
      await expect(buttons).toHaveCount(4);

      const labels = language === 'en'
        ? ['Form', 'Code', 'Fit', 'Check']
        : ['表单', '源码', '单页', '检查'];
      const positions = [];

      for (let i = 0; i < 4; i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        await expect(button.locator('span:visible')).toHaveText(labels[i]);
        const bounds = await button.boundingBox();
        expect(bounds).not.toBeNull();
        expect(bounds!.height).toBeGreaterThanOrEqual(40);
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        positions.push(bounds!);
      }
      for (const bounds of positions) {
        expect(Math.abs(bounds.y - positions[0].y)).toBeLessThanOrEqual(1);
      }
      for (let i = 1; i < positions.length; i++) {
        expect(positions[i - 1].x + positions[i - 1].width).toBeLessThanOrEqual(positions[i].x + 1);
      }
      const overflow = await tabs.evaluate(element => element.scrollWidth - element.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);

      for (let i = 0; i < 4; i++) {
        await buttons.nth(i).click();
        await expect(buttons.nth(i)).toHaveAttribute('aria-pressed', 'true');
      }
      await expect(page.getByText(language === 'en' ? 'ATS rule check (example)' : 'ATS 规则检查（示例）')).toBeVisible();
    });
  }
}

test('wide welcome showcase retains legible descriptive tabs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/');
  const tabs = page.getByTestId('landing-showcase-tabs');
  await expect(tabs.getByRole('button')).toHaveCount(4);
  for (const label of ['Form', 'Markdown', 'Auto Fit', 'ATS Check']) {
    await expect(tabs.getByRole('button', { name: label, exact: true }).locator('span:visible')).toHaveText(label);
  }
  await tabs.getByRole('button', { name: 'Auto Fit' }).click();
  await expect(page.getByText('Auto Fit layout adjustment (example)')).toBeVisible();
});
