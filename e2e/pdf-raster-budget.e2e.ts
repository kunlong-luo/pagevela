import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('Quick PDF refuses an oversized raster before allocating it and retains the active resume', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Synthetic raster-allocation guard is validated in Chromium');
  test.setTimeout(120_000);

  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: 'Markdown source editor' }).click();
  const editor = page.locator('#markdown-textarea');
  await expect(editor).toBeVisible();

  const sample = '# Raster Budget Candidate\n\n## Summary\nAn entirely fictional resume to verify export memory safety.';
  await editor.fill(sample);
  await expect.poll(() => readActiveMarkdown(page)).toBe(sample);

  // Simulate a huge document *only at the clone preflight*. We must not
  // allocate gigabyte-scale canvas memory in CI to reproduce the failure.
  // Keep every other DOM element's scrollHeight unchanged.
  await page.evaluate(() => {
    const own = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollHeight');
    if (!own?.get) throw new Error('Expected native Element.scrollHeight getter');
    Object.defineProperty(Element.prototype, 'scrollHeight', {
      configurable: true,
      get(this: Element) {
        if (this.id === 'resume-temp-pdf-export-clone') return 50_000;
        return own.get!.call(this) as number;
      },
    });
  });

  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  await page.getByRole('button', { name: 'Quick PDF', exact: true }).click();
  await expect(page.getByText('Quick PDF could not be generated')).toBeVisible({ timeout: 90_000 });
  await expect(page.getByText(/text-preserving browser print option/)).toBeVisible();
  await expect.poll(() => readActiveMarkdown(page)).toBe(sample);

  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toBe(sample);
});
