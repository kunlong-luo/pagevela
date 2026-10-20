import { expect, test } from '@playwright/test';

test('mobile action dock yields to text editing and returns on blur', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  const dock = page.getByRole('navigation', { name: 'Mobile workspace actions' });
  await expect(dock).toBeVisible();
  await page.getByRole('button', { name: 'Markdown source editor' }).click();
  const textarea = page.locator('#markdown-textarea');
  await textarea.focus();
  await expect(dock).toHaveCount(0);
  await textarea.blur();
  await expect(dock).toBeVisible();
  await dock.getByRole('button', { name: /Preview/ }).click();
  await expect(page.locator('#preview-pane')).toBeVisible();
});
