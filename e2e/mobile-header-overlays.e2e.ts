import { expect, test, type Page } from '@playwright/test';

async function expectOverlayAboveMobileDock(page: Page, selector: string) {
  const nav = page.getByRole('navigation', { name: 'Mobile workspace actions' });
  await expect(nav).toBeVisible();
  await expect.poll(async () => page.evaluate((overlaySelector) => {
    const dock = document.querySelector('nav[aria-label="Mobile workspace actions"]');
    if (!dock) return false;
    const bounds = dock.getBoundingClientRect();
    const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
    return Boolean(hit?.closest(overlaySelector));
  }, selector)).toBe(true);
}

test('mobile header menus and template dialog stack over fixed Edit/Preview/Download dock', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');

  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  await expect(page.getByRole('dialog', { name: 'Download options' })).toBeVisible();
  await expectOverlayAboveMobileDock(page, '[role="dialog"][aria-label="Download options"]');
  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();

  await page.getByRole('button', { name: 'Open quick actions menu' }).click();
  await expect(page.locator('#mobile-quick-actions')).toBeVisible();
  await expectOverlayAboveMobileDock(page, '#mobile-quick-actions');
  await page.getByRole('button', { name: 'Close quick actions menu' }).click();

  await page.getByRole('button', { name: 'Open resume switcher' }).click();
  await expect(page.getByRole('dialog', { name: 'Resume switcher' })).toBeVisible();
  await expectOverlayAboveMobileDock(page, '#resume-profile-panel');
  await page.getByRole('button', { name: 'Open resume switcher' }).click();

  await page.getByRole('button', { name: 'Browse resume templates' }).click();
  const templateDialog = page.getByRole('dialog', { name: 'Choose a content template' });
  await expect(templateDialog).toBeVisible();
  await expectOverlayAboveMobileDock(page, '[role="dialog"][aria-modal="true"]');
});

test('mobile header menu overlays also cover the dock in Chinese at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'zh');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: '选择 PDF 下载方式' }).click();
  await expectOverlayAboveMobileDock(page, '[role="dialog"][aria-label="下载选项"]');
  await page.getByRole('button', { name: '选择 PDF 下载方式' }).click();

  await page.getByRole('button', { name: '打开快捷功能菜单' }).click();
  await expectOverlayAboveMobileDock(page, '#mobile-quick-actions');
  await page.getByRole('button', { name: '关闭快捷功能菜单' }).click();

  await page.getByRole('button', { name: '打开简历切换器' }).click();
  await expectOverlayAboveMobileDock(page, '#resume-profile-panel');
});
