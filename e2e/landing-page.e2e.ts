import { expect, test } from '@playwright/test';

test.describe('landing-to-editor navigation', () => {
  test('opens the marketing page at root and returns from editor through browser history', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });

    await page.goto('/');
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();

    await page.getByRole('button', { name: /^(Open Editor|进入编辑器)$/ }).click();
    await expect(page).toHaveURL(/\?page=editor/);
    await expect(page.locator('#editor-pane')).toBeVisible();

    await page.reload();
    await expect(page.locator('#editor-pane')).toBeVisible();

    await page.goBack();
    await expect(page.locator('#showcase')).toBeVisible();
  });

  test('direct editor deep link remains usable', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/?page=editor');
    await expect(page.locator('#editor-pane')).toBeVisible();
  });
});
