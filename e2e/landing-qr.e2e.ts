import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  for (const width of [320, 375, 768, 1024, 1280]) {
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

      // All navbar actions have one shared height, radius and outlined shape.
      const actions = page.getByTestId('landing-navbar-actions');
      const languageToggle = actions.getByRole('button', {
        name: language === 'en' ? 'Switch interface to Chinese' : '切换界面为英文',
      });
      const themeToggle = actions.getByRole('button', {
        name: language === 'en' ? /Switch to (dark|light) theme/ : /切换为(浅色|深色)主题/,
      });
      const topActions = [languageToggle, themeToggle, qrButton, startButton];
      if (width >= 640) {
        topActions.push(actions.getByRole('link', { name: language === 'en' ? 'Star Pagevela on GitHub' : '在 GitHub 上为 Pagevela 点 Star' }));
      }
      for (const action of topActions) {
        await expect(action).toBeVisible();
        const geometry = await action.evaluate(element => {
          const style = getComputedStyle(element);
          return { height: element.getBoundingClientRect().height, radius: style.borderTopLeftRadius, border: style.borderTopWidth };
        });
        expect(geometry.height).toBe(36);
        expect(geometry.radius).toBe('8px');
        expect(geometry.border).toBe('1px');
      }
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
