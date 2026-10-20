import { expect, test, type Locator, type Page } from '@playwright/test';

async function expectDimmedScrim(scrim: Locator, page: Page) {
  await expect(scrim).toBeVisible();
  const dimmed = await scrim.evaluate(element => {
    const style = getComputedStyle(element);
    return {
      hasBlur: style.backdropFilter !== 'none' || style.webkitBackdropFilter !== 'none',
      transparent: style.backgroundColor === 'rgba(0, 0, 0, 0)' || style.backgroundColor === 'transparent',
      rect: element.getBoundingClientRect().toJSON(),
    };
  });
  expect(dimmed.transparent).toBe(false);
  expect(dimmed.hasBlur).toBe(true);
  expect(dimmed.rect.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 2);
  expect(dimmed.rect.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 2);
}

for (const language of ['zh', 'en'] as const) {
  test('mobile bottom menus share a dismissible focus backdrop: ' + language, async ({ page }) => {
    await page.setViewportSize({ width: language === 'en' ? 390 : 320, height: 700 });
    await page.addInitScript(lang => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', lang);
    }, language);
    await page.goto('/?page=editor');

    await page.getByRole('button', {
      name: language === 'en' ? 'Choose PDF export mode' : '选择 PDF 下载方式',
    }).click();
    const pdfPanel = page.getByRole('dialog', { name: language === 'en' ? 'Download options' : '下载选项' });
    await expect(pdfPanel).toBeVisible();
    let scrim = page.getByTestId('mobile-sheet-backdrop');
    await expectDimmedScrim(scrim, page);
    await scrim.click({ position: { x: 8, y: 8 } });
    await expect(pdfPanel).not.toBeVisible();

    await page.getByRole('button', {
      name: language === 'en' ? 'Open resume switcher' : '打开简历切换器',
    }).click();
    const profile = page.getByRole('dialog', { name: language === 'en' ? 'Resume switcher' : '简历切换器' });
    await expect(profile).toBeVisible();
    scrim = page.getByTestId('mobile-sheet-backdrop');
    await expectDimmedScrim(scrim, page);
    await page.keyboard.press('Escape');
    await expect(profile).not.toBeVisible();

    await page.getByRole('button', {
      name: language === 'en' ? 'Open quick actions menu' : '打开快捷功能菜单',
    }).click();
    const quickActions = page.locator('#mobile-quick-actions');
    await expect(quickActions).toBeVisible();
    scrim = page.getByTestId('mobile-sheet-backdrop');
    await expectDimmedScrim(scrim, page);
    await scrim.click({ position: { x: 8, y: 8 } });
    await expect(quickActions).not.toBeVisible();

    const layout = page.getByRole('button', { name: language === 'en' ? 'Open layout settings' : '打开排版设置' });
    await layout.click();
    const layoutDialog = page.getByRole('dialog', { name: language === 'en' ? 'Layout' : '排版' });
    await expect(layoutDialog).toBeVisible();
    const settingsScrim = page.getByRole('button', { name: 'Close settings panel' });
    await expectDimmedScrim(settingsScrim, page);
    await settingsScrim.click({ position: { x: 8, y: 8 } });
    await expect(layoutDialog).not.toBeVisible();

    const style = page.getByRole('button', { name: language === 'en' ? 'Open style settings' : '打开样式设置' });
    await style.click();
    const styleDialog = page.getByRole('dialog', { name: language === 'en' ? 'Style' : '样式' });
    await expect(styleDialog).toBeVisible();
    await expectDimmedScrim(page.getByRole('button', { name: 'Close settings panel' }), page);
    await page.keyboard.press('Escape');
    await expect(styleDialog).not.toBeVisible();
  });
}

test('desktop PDF and profile dropdowns do not acquire mobile-only dimmers', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => localStorage.setItem('resume-onboarding-v1-complete', '1'));
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  await expect(page.getByRole('dialog', { name: 'Download options' })).toBeVisible();
  await expect(page.getByTestId('mobile-sheet-backdrop')).toBeHidden();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Open resume switcher' }).click();
  await expect(page.getByRole('dialog', { name: 'Resume switcher' })).toBeVisible();
  await expect(page.getByTestId('mobile-sheet-backdrop')).toBeHidden();
});
