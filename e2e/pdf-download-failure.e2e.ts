import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('Quick PDF encoder failure shows a branded warning without losing the resume', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Controlled raster failure regression runs in Chromium');
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
    '# Export Recovery Candidate',
    'Fictional QA Engineer',
    '',
    '## Summary',
    'A synthetic resume that remains locally stored after an export failure.',
    '',
    '## Skills',
    '- Browser testing and PDF validation',
  ].join('\n');
  await editor.fill(fictionalResume);
  await expect.poll(() => readActiveMarkdown(page)).toBe(fictionalResume);

  // Fail only JPEG encoding, at the PDF page-image stage; do not rely on an
  // actual browser/device allocation failure to exercise the recovery path.
  await page.evaluate(() => {
    const encode = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
      if (type === 'image/jpeg') throw new Error('Injected JPEG encoding failure');
      return encode.call(this, type, quality);
    };
  });

  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  await page.getByRole('button', { name: 'Quick PDF', exact: true }).click();

  // The fallback uses Pagevela's custom UI; it must not silently mark the
  // failed raster export successful or replace the user's active draft.
  await expect(page.getByText('Quick PDF could not be generated')).toBeVisible({ timeout: 90_000 });
  await expect(page.getByText(/Opening the text-preserving browser print option instead/)).toBeVisible();
  await expect.poll(() => readActiveMarkdown(page)).toBe(fictionalResume);
  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toBe(fictionalResume);
});
