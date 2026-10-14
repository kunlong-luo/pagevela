import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

// A deliberately fictional Chinese resume. This proof never reads an actual user's data.
const SAMPLE_PORTRAIT = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGMU2XKHARtgwio6aCUASycBtDR93bkAAAAASUVORK5CYII=',
  'base64',
);

test('Chinese A4 portrait print preserves selectable PDF text and physical page size', async (
  { page, browserName }, testInfo,
) => {
  test.skip(browserName !== 'chromium', 'Playwright page.pdf supports Chromium');
  test.setTimeout(90_000);

  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'zh');
    localStorage.setItem('resume-settings', JSON.stringify({
      lang: 'zh', marketRegion: 'cn', paperSize: 'a4',
    }));
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();

  await page.getByRole('button', {
    name: /^(Markdown source editor|Markdown 源码编辑模式)$/,
  }).click();
  const sample = [
    '# 示例候选人',
    '软件工程师',
    '',
    '邮箱：demo@example.invalid',
    '',
    '## 个人简介',
    '这是一份用于自动化打印验收的虚构中文简历。',
    '',
    '## 专业技能',
    '- TypeScript 与 React',
  ].join('\n');
  await page.locator('#markdown-textarea').fill(sample);
  await expect(page.locator('#resume-print-content').getByRole('heading', {
    name: '示例候选人',
  })).toBeVisible();

  await page.locator('input[aria-label="选择简历证件照"]').setInputFiles({
    name: 'fictional-portrait.png', mimeType: 'image/png', buffer: SAMPLE_PORTRAIT,
  });
  await expect(page.locator('img[alt="简历证件照预览"]'))
    .toHaveAttribute('src', /^data:image\/jpeg;base64,/);
  await page.getByRole('button', { name: '应用 3:4 裁剪' }).click();
  const portrait = page.locator('#resume-print-content img[alt="简历证件照"]');
  await expect(portrait).toHaveCount(1);

  // Isolate the real preview DOM plus its CSS from editor controls. The app's
  // ATS PDF export uses react-to-print's analogous isolated print document.
  // This verifies the print layout and Chromium's vector/text PDF output,
  // not the native print dialog UI (which still needs manual acceptance).
  await page.evaluate(() => {
    const original = document.getElementById('resume-print-content');
    if (!original) throw new Error('No print content found');
    const printOnly = original.cloneNode(true);
    document.body.replaceChildren(printOnly);
    document.body.className = '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => { await document.fonts.ready; });

  const pdfBytes = await page.pdf({
    format: 'A4',
    preferCSSPageSize: true,
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  expect(pdfBytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');

  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const loadingTask = getDocument({ data: new Uint8Array(pdfBytes), useSystemFonts: true });
  const pdf = await loadingTask.promise;
  try {
    expect(pdf.numPages).toBe(1);
    const firstPage = await pdf.getPage(1);
    const [, , widthPt, heightPt] = firstPage.view;
    // 210 x 297 mm, measured in PDF points (72 / 25.4 per millimetre).
    expect(widthPt).toBeGreaterThan(594);
    expect(widthPt).toBeLessThan(597);
    expect(heightPt).toBeGreaterThan(840);
    expect(heightPt).toBeLessThan(843);

    const content = await firstPage.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join('')
      .replace(/\s+/g, '');
    expect(text).toContain('示例候选人');
    expect(text).toContain('TypeScript');
  } finally {
    await loadingTask.destroy();
  }

  // Uploadable CI artifact: fictional test data only, never user's resumes.
  await writeFile(testInfo.outputPath('chinese-a4-print-proof.pdf'), pdfBytes);
});
