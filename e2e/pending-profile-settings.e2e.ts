import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

const JOURNAL = 'resume-profile-settings-pending-v1';
const openLayout = async (page: import('@playwright/test').Page) => {
  await page.locator('#resume-main-toolbar')
    .getByRole('button', { name: /Open layout settings|打开排版设置/ }).click();
  return page.getByRole('dialog', { name: /Layout|排版/ });
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
});

test('market selection survives an immediate reload before debounced IndexedDB commit', async ({ page }) => {
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  const layout = await openLayout(page);
  await layout.getByRole('button', { name: 'UK', exact: true }).click();
  await expect(layout.getByRole('button', { name: 'UK', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');

  // Deliberately reload without waiting for a 350-ms IndexedDB debounce.
  await page.reload();
  const after = await openLayout(page);
  await expect(after.getByRole('button', { name: 'UK', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
});

test('bootstrap repairs a stale IndexedDB profile from a newer settings journal', async ({ page }) => {
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  await page.evaluate((key) => {
    const activeId = localStorage.getItem('resume-active-profile-id');
    if (!activeId) throw new Error('No active profile');
    const settings = JSON.parse(localStorage.getItem('resume-settings') || '{}');
    localStorage.setItem(key, JSON.stringify({
      [activeId]: {
        settings: { ...settings, marketRegion: 'uk', paperSize: 'letter', dateStyle: 'month-long' },
        updatedAt: new Date(Date.now() + 5000).toISOString(),
      },
    }));
  }, JOURNAL);
  await page.reload();
  const layout = await openLayout(page);
  await expect(layout.getByRole('button', { name: 'UK', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
  await expect(layout.getByRole('button', { name: /US Letter/ }))
    .toHaveAttribute('aria-pressed', 'true');

  // Once the recovered snapshot commits, the write-ahead marker is removed.
  await expect.poll(() => page.evaluate((key) => localStorage.getItem(key), JOURNAL))
    .toBeNull();
});
