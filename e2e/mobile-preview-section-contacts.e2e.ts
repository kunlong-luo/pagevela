import { expect, test } from '@playwright/test';
import { DEFAULT_MARKDOWN } from '../src/data';

for (const lang of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390]) {
    test('mobile preview action stays one-line in ' + lang + ' at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(language => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', language);
      }, lang);
      await page.goto('/?page=editor');

      const dock = page.getByRole('navigation', {
        name: lang === 'en' ? 'Mobile workspace actions' : '移动端工作区操作',
      });
      await expect(dock).toBeVisible();
      const preview = dock.getByRole('button', { name: lang === 'en' ? 'Preview' : '预览' });
      await expect(preview).toHaveText(lang === 'en' ? 'Preview' : '预览');
      await expect(dock.getByText('A4', { exact: true })).toHaveCount(0);
      await expect(dock.getByText('Letter', { exact: true })).toHaveCount(0);
      const label = preview.locator('span');
      expect(await label.evaluate(el => getComputedStyle(el).whiteSpace)).toBe('nowrap');
      const box = await preview.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      await preview.click();
      await expect(page.locator('#preview-pane')).toBeVisible();
    });
  }
}

for (const width of [320, 375, 390]) {
  test('long Work Experience heading never covers section action icons at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.addInitScript(() => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', 'en');
    });
    await page.goto('/?page=editor');
    const header = page.getByTestId('resume-section-header').first();
    await expect(header).toBeVisible();
    const title = header.getByTestId('resume-section-title');
    await title.fill('Work Experience');
    await title.blur();
    const actions = header.getByTestId('resume-section-actions');
    const spacing = actions.getByRole('button', { name: 'Format Spacing' });
    await expect(spacing).toBeVisible();
    const inputBounds = await title.boundingBox();
    const actionsBounds = await actions.boundingBox();
    const buttonBounds = await spacing.boundingBox();
    expect(inputBounds).not.toBeNull();
    expect(actionsBounds).not.toBeNull();
    expect(buttonBounds).not.toBeNull();
    expect(inputBounds!.y + inputBounds!.height).toBeLessThanOrEqual(actionsBounds!.y + 2);
    expect(buttonBounds!.x).toBeGreaterThanOrEqual(0);
    expect(buttonBounds!.x + buttonBounds!.width).toBeLessThanOrEqual(width);
    expect((await header.boundingBox())!.width).toBeLessThanOrEqual(width);
  });
}

test('template GitHub contact is a full clickable HTTPS URL in preview', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'zh');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: 'Markdown 源码编辑模式' }).click();
  await page.locator('#markdown-textarea').fill(DEFAULT_MARKDOWN);
  const github = page.locator('#resume-print-content a[href="https://github.com/your-username"]').first();
  await expect(github).toBeVisible();
  await expect(github).toHaveText('https://github.com/your-username');
});
