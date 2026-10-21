import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  for (const width of [375, 1280]) {
    test(`welcome QR opens scannable official link: ${language} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 780 });
      await page.addInitScript(lang => localStorage.setItem('resume_ui_language', lang), language);
      await page.goto('/');

      const qrButton = page.getByTestId('landing-qr-trigger');
      const startButton = page.getByTestId('landing-navbar-start');
      const heroStart = page.getByTestId('landing-hero-cta');
      await expect(qrButton).toBeVisible();
      await expect(startButton).toBeVisible();
      await expect(heroStart).toBeVisible();
      await expect(qrButton.locator('xpath=ancestor::header')).toBeVisible();
      await expect(page.locator('main [data-testid="landing-qr-trigger"]')).toHaveCount(0);
      const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(pageOverflow).toBeLessThanOrEqual(1);
      const qrPosition = await qrButton.boundingBox();
      const startPosition = await startButton.boundingBox();
      expect(qrPosition).not.toBeNull();
      expect(startPosition).not.toBeNull();
      expect(qrPosition!.x + qrPosition!.width).toBeLessThanOrEqual(startPosition!.x + 1);
      expect(qrPosition!.y).toBe(startPosition!.y);

      await qrButton.click();
      const dialog = page.getByTestId('landing-qr-dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText('https://kunlong-luo.github.io/pagevela/');
      await expect(dialog).toContainText(language === 'zh' ? '微信扫一扫' : 'WeChat');
      const svg = dialog.getByTestId('landing-home-qr');
      await expect(svg).toBeVisible();
      await expect(svg).toHaveAttribute('viewBox', '0 0 37 37');
      const qrPath = await svg.locator('path').getAttribute('d');
      expect(qrPath?.length).toBeGreaterThan(1000);
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);

      await qrButton.click();
      await dialog.getByRole('button', { name: language === 'zh' ? '关闭二维码' : 'Close QR code' }).last().click();
      await expect(dialog).toHaveCount(0);
      await startButton.click();
      await expect(page).toHaveURL(/\?page=editor/);
    });
  }
}
