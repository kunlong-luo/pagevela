import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('visible-preview Auto Fit honors a two-page target without dropping the original draft', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Measured layout acceptance runs in Chromium');
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

  const content = [
    '# Fictional Layout Candidate',
    'Example QA Specialist',
    '',
    '## Experience',
    ...Array.from({ length: 64 }, (_, i) =>
      `- 202${i % 5}: Illustrated result ${i + 1} with example text about testing complex resume page layouts across devices.`),
  ].join('\n');
  await editor.fill(content);
  await expect.poll(() => readActiveMarkdown(page)).toBe(content);
  await expect(page.getByRole('heading', { name: 'Fictional Layout Candidate' })).toBeVisible();

  const twoPageTarget = page.getByRole('button', { name: 'Target 2 pages' });
  await expect(twoPageTarget).toBeVisible();
  await twoPageTarget.click();
  await expect(twoPageTarget).toHaveAttribute('aria-pressed', 'true');

  // A single toolbar click must reach the same target-aware measured loop as
  // the preview's own button, rather than applying one unrelated layout step.
  await expect(page.getByText('Auto-Fit to Target (2 pages)')).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Fit to selected page target' }).click();
  await expect(page.getByText(/Fits within the page target|Auto Fit reached a safe stopping point/))
    .toBeVisible({ timeout: 30000 });
  await expect(twoPageTarget).toHaveAttribute('aria-pressed', 'true');

  // Fitting adjusts profile layout settings only; never delete resume text.
  await expect.poll(() => readActiveMarkdown(page)).toBe(content);
  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toBe(content);
});
