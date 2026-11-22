import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'en');
  });
});

/**
 * A manual draft save used to be asynchronously queued only inside the
 * backup modal, while workspace export could read an older draft collection.
 * Both now share the same serial queue, including when tabs change mid-save.
 */
test('a newly submitted manual draft is included in immediate portable export', async ({ page }) => {
  await page.goto('/?page=editor');
  await expect(page.locator('#resume-main-toolbar')).toBeVisible();

  await page.evaluate(() => window.dispatchEvent(new Event('pagevela:open-backup')));
  const modal = page.getByRole('dialog', { name: 'Resume Management' });
  await expect(modal).toBeVisible();
  await modal.getByRole('button', { name: /^Drafts \(\d+\)$/ }).click();

  await modal.getByPlaceholder('Draft remark (optional)...').fill('Queued manual draft safety check');
  await modal.getByRole('button', { name: 'Save as Draft' }).click();

  // Do not wait for the success toast: test the save/export ordering contract.
  await modal.getByRole('button', { name: 'Backup', exact: true }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    modal.getByRole('button', { name: 'Export workspace .json' }).click(),
  ]);
  const backup = JSON.parse(await readFile(await download.path()!, 'utf8')) as {
    drafts: Array<{ title: string; markdown: string }>;
  };
  expect(backup.drafts.some(d => d.title === 'Queued manual draft safety check')).toBe(true);
  expect(backup.drafts.find(d => d.title === 'Queued manual draft safety check')?.markdown).toBeTruthy();

  await page.reload();
  await expect(page.locator('#resume-main-toolbar')).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('pagevela:open-backup')));
  const reopened = page.getByRole('dialog', { name: 'Resume Management' });
  await reopened.getByRole('button', { name: /^Drafts \(\d+\)$/ }).click();
  await expect(reopened.getByText('Queued manual draft safety check')).toBeVisible();
});
