import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { readActiveMarkdown } from './helpers/indexeddb';

const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGMU2XKHARtgwio6aCUASycBtDR93bkAAAAASUVORK5CYII=',
  'base64',
);

test('Chinese resume photo is cropped locally, printed at upper right, and survives reload', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'zh');
    window.localStorage.setItem('resume-settings', JSON.stringify({
      lang: 'zh',
      marketRegion: 'cn',
    }));
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  const markdown = await readActiveMarkdown(page);
  const picker = page.locator('input[aria-label="选择简历证件照"]');
  await expect(picker).toHaveCount(1);
  await picker.setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: TINY_PNG });

  // A raw object URL must never be passed to a live preview DOM element.
  const cropPreview = page.locator('img[alt="简历证件照预览"]');
  await expect(cropPreview).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
  await expect(cropPreview).not.toHaveAttribute('src', /^blob:/);

  await page.getByRole('button', { name: '应用 3:4 裁剪' }).click();
  const printedPortrait = page.locator('#resume-print-content img[alt="简历证件照"]');
  await expect(printedPortrait).toHaveCount(1);
  await expect(printedPortrait).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
  await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);

  await page.reload();
  await expect(page.locator('#resume-print-content img[alt="简历证件照"]')).toHaveCount(1);
  await expect.poll(() => readActiveMarkdown(page)).toBe(markdown);
});

test('invalid SVG image is rejected without adding a portrait', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'zh');
  });
  await page.goto('/?page=editor');
  const picker = page.locator('input[aria-label="选择简历证件照"]');
  await picker.setInputFiles({
    name: 'photo.svg',
    mimeType: 'image/svg+xml',
    buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'),
  });
  await expect(page.getByRole('alert')).toContainText('请上传 PNG、JPEG 或 WebP');
  await expect(page.locator('#resume-print-content img[alt="简历证件照"]')).toHaveCount(0);
});


test('rejected replacement clears a previously queued valid photo', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'zh');
  });
  await page.goto('/?page=editor');
  const picker = page.locator('input[aria-label="选择简历证件照"]');
  await picker.setInputFiles({ name: 'valid.png', mimeType: 'image/png', buffer: TINY_PNG });
  await expect(page.getByRole('button', { name: '应用 3:4 裁剪' })).toBeVisible();
  await picker.setInputFiles({ name: 'invalid.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
  await expect(page.getByRole('alert')).toContainText('请上传 PNG、JPEG 或 WebP');
  await expect(page.getByRole('button', { name: '应用 3:4 裁剪' })).toHaveCount(0);
  await expect(page.locator('#resume-print-content img[alt="简历证件照"]')).toHaveCount(0);
});


test('China-market portrait stays inside the A4 page and Quick PDF is downloadable', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Direct PDF download is validated in Chromium');
  test.setTimeout(120_000);
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'zh');
    localStorage.setItem('resume-settings', JSON.stringify({
      lang: 'zh',
      marketRegion: 'cn',
      paperSize: 'a4',
    }));
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  await page.locator('input[aria-label="选择简历证件照"]').setInputFiles({
    name: 'portrait.png', mimeType: 'image/png', buffer: TINY_PNG,
  });
  await expect(page.locator('img[alt="简历证件照预览"]'))
    .toHaveAttribute('src', /^data:image\/jpeg;base64,/);
  await page.getByRole('button', { name: '应用 3:4 裁剪' }).click();

  const portrait = page.locator('#resume-print-content img[alt="简历证件照"]');
  await expect(portrait).toHaveCount(1);
  const portraitBox = await portrait.boundingBox();
  const pageBox = await page.locator('#resume-print-content').boundingBox();
  expect(portraitBox).not.toBeNull();
  expect(pageBox).not.toBeNull();
  expect(portraitBox!.x).toBeGreaterThan(pageBox!.x + pageBox!.width * 0.5);
  expect(portraitBox!.x + portraitBox!.width).toBeLessThanOrEqual(pageBox!.x + pageBox!.width + 2);
  expect(portraitBox!.y).toBeGreaterThanOrEqual(pageBox!.y - 2);

  await page.getByRole('button', { name: '选择 PDF 下载方式' }).click();
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 90_000 }),
    page.getByRole('button', { name: '快速 PDF', exact: true }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  expect(await download.failure()).toBeNull();
  const path = await download.path();
  expect(path).toBeTruthy();
  const pdfBytes = await readFile(path!);
  expect(pdfBytes.length).toBeGreaterThan(5_000);
  expect(pdfBytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');
});


test('US market defaults to no portrait and allows explicitly hiding or showing a saved photo', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('resume-settings', JSON.stringify({ lang: 'en', marketRegion: 'us' }));
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();

  const printedPhoto = page.locator('#resume-print-content img[alt="Resume portrait"]');
  await expect(printedPhoto).toHaveCount(0);
  await expect(page.getByText('Photos are not typically recommended', { exact: false })).toBeVisible();

  await page.locator('input[aria-label="Choose resume photo"]').setInputFiles({
    name: 'photo.png', mimeType: 'image/png', buffer: TINY_PNG,
  });
  await expect(page.locator('img[alt="Resume portrait preview"]'))
    .toHaveAttribute('src', /^data:image\\/jpeg;base64,/);
  await page.getByRole('button', { name: 'Apply 3:4 crop' }).click();
  await expect(printedPhoto).toHaveCount(1);

  const visibility = page.getByRole('checkbox', { name: 'Show photo on resume' });
  await visibility.uncheck();
  await expect(printedPhoto).toHaveCount(0);
  await expect(page.locator('img[alt="Resume portrait preview"]')).toHaveCount(1);

  await page.reload();
  await expect(printedPhoto).toHaveCount(0);
  await visibility.check();
  await expect(printedPhoto).toHaveCount(1);
});
