import { expect, test } from '@playwright/test';

test('mobile view navigation remains available while editing and switches to preview', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  const dock = page.getByRole('navigation', { name: 'Mobile workspace actions' });
  await expect(dock).toBeVisible();
  await dock.getByRole('button', { name: 'Markdown source editor' }).click();
  const textarea = page.locator('#markdown-textarea');
  await textarea.focus();
  // Focusing a source/form input must not remove the only Preview entry point.
  await expect(dock).toBeVisible();
  await dock.getByRole('button', { name: 'Preview' }).click();
  await expect(page.locator('#resume-preview-wrapper')).toBeVisible();
  await dock.getByRole('button', { name: 'Markdown source editor' }).click();
  await expect(page.locator('#markdown-textarea')).toBeVisible();
});
