import { expect, test } from '@playwright/test';

for (const locale of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390]) {
    test('compact editor mode labels fit in one line: ' + locale + ' at ' + width + 'px', async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript((language) => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', language);
      }, locale);
      await page.goto('/?page=editor');
      const form = page.getByRole('button', { name: locale === 'zh' ? '表单编辑模式' : 'Form editor' });
      const markdown = page.getByRole('button', { name: locale === 'zh' ? 'Markdown 源码编辑模式' : 'Markdown source editor' });
      await expect(form).toBeVisible();
      await expect(markdown).toBeVisible();
      await expect(markdown.locator('span:visible')).toHaveText(locale === 'zh' ? '源码' : 'Code');
      const left = await form.boundingBox();
      const right = await markdown.boundingBox();
      expect(left).not.toBeNull();
      expect(right).not.toBeNull();
      expect(right!.x + right!.width).toBeLessThanOrEqual(width);
      expect(Math.abs(left!.y - right!.y)).toBeLessThan(2);
      await markdown.click();
      await expect(page.locator('#markdown-textarea')).toBeVisible();
      await form.click();
      await expect(form).toHaveAttribute('aria-label', locale === 'zh' ? '表单编辑模式' : 'Form editor');
    });
  }
}
