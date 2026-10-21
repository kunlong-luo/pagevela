import { expect, test } from '@playwright/test';

for (const locale of ['zh', 'en'] as const) {
  for (const width of [320, 375, 390, 640, 767]) {
    test('mobile toolbar shows all three controls without hidden overflow: ' + locale + ' ' + width, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 });
      await page.addInitScript(lang => {
        localStorage.setItem('resume_ui_language', lang);
        localStorage.setItem('resume-onboarding-v1-complete', '1');
      }, locale);
      await page.goto('/?page=editor');

      const toolbar = page.locator('#resume-main-toolbar');
      const template = toolbar.getByRole('button', { name: locale === 'en' ? 'Browse resume templates' : '浏览与切换简历模板' });
      const layout = toolbar.getByRole('button', { name: locale === 'en' ? 'Open layout settings' : '打开排版设置' });
      const style = toolbar.getByRole('button', { name: locale === 'en' ? 'Open style settings' : '打开样式设置' });
      const labels = locale === 'en' ? ['Tpl', 'Layout', 'Style'] : ['模板', '排版', '样式'];
      const bounds = [];

      await expect(toolbar.getByRole('group', { name: locale === 'en' ? 'Interface language' : '界面语言' })).toHaveCount(0);
      await expect(toolbar.getByRole('button', { name: locale === 'en' ? 'Switch interface to Chinese' : '切换界面为英文' })).toHaveCount(0);
      for (const [index, button] of [template, layout, style].entries()) {
        await expect(button).toBeVisible();
        await expect(button.locator('span:visible')).toHaveText(labels[index]);
        const rect = await button.boundingBox();
        expect(rect).not.toBeNull();
        expect(rect!.x).toBeGreaterThanOrEqual(0);
        expect(rect!.x + rect!.width).toBeLessThanOrEqual(width + 1);
        expect(rect!.height).toBeGreaterThanOrEqual(40);
        bounds.push(rect!);
      }
      expect(bounds[1].x).toBeGreaterThanOrEqual(bounds[0].x + bounds[0].width - 1);
      expect(bounds[2].x).toBeGreaterThanOrEqual(bounds[1].x + bounds[1].width - 1);
      expect(await toolbar.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      // Desktop view modes are replaced by the mobile top three-view switch.
      await expect(toolbar.getByRole('radiogroup', { name: locale === 'en' ? 'View layout mode' : '视图分栏切换' })).toBeHidden();
      await expect(page.getByRole('navigation', { name: locale === 'en' ? 'Mobile workspace actions' : '移动端工作区操作' })).toBeVisible();

      await layout.click();
      await expect(page.getByRole('dialog', { name: locale === 'en' ? 'Layout' : '排版' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: locale === 'en' ? 'Layout' : '排版' })).toBeHidden();

      await style.click();
      await expect(page.getByRole('dialog', { name: locale === 'en' ? 'Style' : '样式' })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: locale === 'en' ? 'Style' : '样式' })).toBeHidden();

      await expect(toolbar.getByRole('button', { name: locale === 'en' ? 'More editing tools' : '更多编辑工具' })).toBeVisible();
      const viewNav = page.getByRole('navigation', { name: locale === 'en' ? 'Mobile workspace actions' : '移动端工作区操作' });
      await viewNav.getByRole('button', { name: locale === 'en' ? 'Markdown source editor' : 'Markdown 源码编辑模式' }).click();
      await expect(toolbar).toBeHidden();
      await expect(page.locator('.mobile-editor-format-toolbar')).toBeVisible();
      await viewNav.getByRole('button', { name: locale === 'en' ? 'Form editor' : '表单编辑模式' }).click();
      await expect(toolbar).toBeVisible();

      await page.getByRole('button', { name: locale === 'en' ? 'Open quick actions menu' : '打开快捷功能菜单' }).click();
      const quickActions = page.locator('#mobile-quick-actions');
      const languageButton = quickActions.getByRole('button', { name: locale === 'en' ? 'Switch interface to Chinese' : '切换界面为英文' });
      const themeButton = quickActions.getByRole('button', { name: /^(Theme|主题):/ });
      await expect(languageButton).toBeVisible();
      await expect(themeButton).toBeVisible();
      const alignment = await page.evaluate(() => {
        const language = document.querySelector('#mobile-quick-actions button[aria-label="Switch interface to Chinese"], #mobile-quick-actions button[aria-label="切换界面为英文"]');
        const theme = document.querySelector('#mobile-quick-actions button[aria-label^="Theme:"], #mobile-quick-actions button[aria-label^="主题:"]');
        if (!language || !theme) throw new Error('Missing global buttons');
        return [language, theme].map(button => {
          const box = button.getBoundingClientRect();
          const icon = button.querySelector('svg')!.getBoundingClientRect();
          return { iconLeft: icon.left - box.left, iconCenterY: icon.top + icon.height / 2 - (box.top + box.height / 2), height: box.height };
        });
      });
      for (const button of alignment) {
        expect(button.height).toBeGreaterThanOrEqual(44);
        expect(button.iconLeft).toBeGreaterThanOrEqual(8);
        expect(button.iconLeft).toBeLessThanOrEqual(20);
        expect(Math.abs(button.iconCenterY)).toBeLessThanOrEqual(2);
      }
    });
  }
}

test('desktop language remains beside Theme and Edit/Split/Preview controls remain after Style', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
  });
  await page.goto('/?page=editor');

  const toolbar = page.locator('#resume-main-toolbar');
  const header = page.getByRole('banner');
  await expect(toolbar.getByRole('group', { name: 'Interface language' })).toHaveCount(0);
  const language = header.getByRole('button', { name: 'Switch interface to Chinese' });
  const theme = header.getByRole('button', { name: /^Theme:/ });
  await expect(language).toBeVisible();
  await expect(theme).toBeVisible();
  await expect(page.getByRole('button', { name: 'Switch interface to Chinese' })).toHaveCount(1);
  const style = toolbar.getByRole('button', { name: 'Open style settings' });
  const modes = toolbar.getByRole('radiogroup', { name: 'View layout mode' });
  await expect(style).toBeVisible();
  await expect(modes).toBeVisible();
  await expect(modes.getByRole('radio')).toHaveCount(3);
  const rectA = await style.boundingBox();
  const rectB = await modes.boundingBox();
  expect(rectA).not.toBeNull();
  expect(rectB).not.toBeNull();
  expect(rectB!.x).toBeGreaterThan(rectA!.x + rectA!.width);
});
