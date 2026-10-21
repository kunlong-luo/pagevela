import { expect, test, type Page } from '@playwright/test';

async function expectOverlayUsableAboveWorkspace(page: Page, selector: string) {
  const nav = page.getByRole('navigation', { name: /Mobile workspace actions|移动端工作区操作/ });
  await expect(nav).toBeVisible();
  const dialog = page.locator(selector).first();
  await expect(dialog).toBeVisible();

  // Bottom sheets no longer need to cover the (now top) navigation. Verify that
  // the sheet itself is above its backdrop and can receive input instead.
  await expect.poll(async () => page.evaluate((sel) => {
    const element = document.querySelector(sel);
    if (!element) return false;
    const box = element.getBoundingClientRect();
    if (box.width < 40 || box.height < 40) return false;
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return Boolean(hit && (hit === element || element.contains(hit)));
  }, selector)).toBe(true);
}

test('mobile header menus and template dialog stay interactive above the top workspace navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');

  await page.getByRole('button', { name: 'Choose PDF export mode' }).click();
  await expect(page.getByRole('dialog', { name: 'Download options' })).toBeVisible();
  await expectOverlayUsableAboveWorkspace(page, '[role="dialog"][aria-label="Download options"]');
  await page.getByTestId('mobile-sheet-backdrop').click({ position: { x: 8, y: 8 } });

  await page.getByRole('button', { name: 'Open quick actions menu' }).click();
  await expect(page.locator('#mobile-quick-actions')).toBeVisible();
  await expectOverlayUsableAboveWorkspace(page, '#mobile-quick-actions');
  await page.getByRole('button', { name: 'Close quick actions menu' }).click();

  await page.getByRole('button', { name: 'Open resume switcher' }).click();
  await expect(page.getByRole('dialog', { name: 'Resume switcher' })).toBeVisible();
  await expectOverlayUsableAboveWorkspace(page, '#resume-profile-panel');
  await page.getByTestId('mobile-sheet-backdrop').click({ position: { x: 8, y: 8 } });

  await page.getByRole('button', { name: 'Browse resume templates' }).click();
  const templateDialog = page.getByRole('dialog', { name: 'Choose a content template' });
  await expect(templateDialog).toBeVisible();
  await expectOverlayUsableAboveWorkspace(page, '[role="dialog"][aria-modal="true"]');
});

test('mobile header menus remain usable on narrow Chinese mobile screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'zh');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: '选择 PDF 下载方式' }).click();
  await expectOverlayUsableAboveWorkspace(page, '[role="dialog"][aria-label="下载选项"]');
  await page.getByTestId('mobile-sheet-backdrop').click({ position: { x: 8, y: 8 } });

  await page.getByRole('button', { name: '打开快捷功能菜单' }).click();
  await expectOverlayUsableAboveWorkspace(page, '#mobile-quick-actions');
  await page.getByRole('button', { name: '关闭快捷功能菜单' }).click();

  await page.getByRole('button', { name: '打开简历切换器' }).click();
  await expectOverlayUsableAboveWorkspace(page, '#resume-profile-panel');
});
