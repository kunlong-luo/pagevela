import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('Quick PDF creates a real downloadable PDF from fictional resume data', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Launch smoke test validates the direct download path in Chromium');
  test.setTimeout(120_000);

  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');

  await page.getByRole('button', { name: 'Markdown source editor' }).click();
  const editor = page.locator('#markdown-textarea');
  await expect(editor).toBeVisible();
  const fictionalResume = [
    '# Launch Test Candidate',
    'Example Software Engineer',
    '',
    '## Summary',
    'A fictional sample resume for launch testing only.',
    '',
    '## Skills',
    '- React and TypeScript',
  ].join('\n');
  await editor.fill(fictionalResume);
  await expect.poll(() => readActiveMarkdown(page)).toBe(fictionalResume);
  await expect(page.getByRole('heading', { name: 'Launch Test Candidate' })).toBeVisible();

  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 90_000 }),
    page.getByRole('button', { name: 'Quick PDF', exact: true }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  expect(await download.failure()).toBeNull();
  const filePath = await download.path();
  expect(filePath).toBeTruthy();
  const bytes = await readFile(filePath!);
  expect(bytes.length).toBeGreaterThan(2_000);
  expect(bytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');
});
