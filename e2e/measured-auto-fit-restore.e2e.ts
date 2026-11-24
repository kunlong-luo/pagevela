import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('restore pre-fit layout atomically while preserving the original draft', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Measured restore acceptance runs in Chromium');
  test.setTimeout(120_000);

  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('height-guard-collapsed', 'false');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: 'Markdown source editor' }).click();
  const editor = page.locator('#markdown-textarea');
  await expect(editor).toBeVisible();

  const markdown = [
    '# Fictional Layout Recovery', 'Sample QA candidate', '', '## Experience',
    ...Array.from({ length: 140 }, (_, i) =>
      `- 202${i % 5}: Illustrated result ${i + 1} with fictional text about validating layout recovery and persistence.`),
  ].join('\n');
  await editor.fill(markdown);
  await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
  await expect(page.getByRole('heading', { name: 'Fictional Layout Recovery' })).toBeVisible();

  const layout = () => page.evaluate(() => {
    const settings = JSON.parse(localStorage.getItem('resume-settings') || '{}') as Record<string, unknown>;
    return {
      margin: settings.margin, fontSize: settings.fontSize,
      blockGap: settings.blockGap, lineHeight: settings.lineHeight,
    };
  });
  const before = await layout();
  const twoPageTarget = page.getByRole('button', { name: 'Target 2 pages' });
  await twoPageTarget.click();
  await expect(twoPageTarget).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#resume-main-toolbar').getByRole('button', {
    name: 'Fit to selected page target',
  }).click();

  const restore = page.getByRole('button', { name: 'Restore layout before Auto Fit' });
  await expect(restore).toBeVisible({ timeout: 40000 });
  await expect.poll(layout).not.toEqual(before);
  await restore.click();
  await expect.poll(layout).toEqual(before);
  await expect(restore).toHaveCount(0);
  await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
  await expect(twoPageTarget).toHaveAttribute('aria-pressed', 'true');

  // The one-time snapshot itself is not stored; only the restored profile
  // settings persist via the existing atomic profile-settings journal.
  await page.reload();
  await expect.poll(layout).toEqual(before);
  await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
  await expect(page.getByRole('button', { name: 'Restore layout before Auto Fit' })).toHaveCount(0);
});
