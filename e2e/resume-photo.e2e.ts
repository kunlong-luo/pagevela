import { expect, test } from '@playwright/test';
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
