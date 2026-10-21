import { expect, test, type Page } from '@playwright/test';

async function expectFooterOutsideScrollableContent(page: Page) {
  const dock = page.locator('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]');
  const scroller = page.locator('#resume-preview-wrapper');
  const paper = page.locator('#resume-print-content');

  await expect(dock).toBeVisible();
  await expect(scroller).toBeVisible();
  await expect(paper).toBeVisible();

  const initial = await page.evaluate(() => {
    const dock = document.querySelector('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]');
    const scroller = document.querySelector('#resume-preview-wrapper');
    if (!dock || !scroller) throw new Error('Missing preview viewport or mobile actions');
    const navRect = dock.getBoundingClientRect();
    const scrollRect = scroller.getBoundingClientRect();
    return {
      dockPosition: getComputedStyle(dock).position,
      dockTop: navRect.top,
      dockBottom: navRect.bottom,
      viewportHeight: innerHeight,
      scrollBottom: scrollRect.bottom,
      scrollHeight: scroller.scrollHeight,
      scrollClientHeight: scroller.clientHeight,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
    };
  });

  expect(initial.dockPosition).not.toBe('fixed');
  expect(initial.dockTop).toBeGreaterThanOrEqual(initial.scrollBottom - 1);
  expect(initial.dockBottom).toBeLessThanOrEqual(initial.viewportHeight + 1);
  expect(initial.documentWidth).toBeLessThanOrEqual(initial.viewportWidth + 1);
  expect(initial.scrollClientHeight).toBeGreaterThan(0);

  // The preview's own scroller, not the document, reaches the paper's bottom.
  await scroller.evaluate(element => { element.scrollTop = element.scrollHeight; });
  await expect.poll(() => scroller.evaluate(element =>
    Math.round(element.scrollTop + element.clientHeight - element.scrollHeight)
  )).toBeGreaterThanOrEqual(-2);
  const bounds = await page.evaluate(() => {
    const viewport = document.querySelector('#resume-preview-wrapper')!.getBoundingClientRect();
    const paper = document.querySelector('#resume-print-content')!.getBoundingClientRect();
    const dock = document.querySelector('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]')!.getBoundingClientRect();
    return {
      paperBottom: paper.bottom,
      viewportBottom: viewport.bottom,
      dockTop: dock.top,
      viewportTop: viewport.top,
      paperTop: paper.top,
    };
  });
  expect(bounds.paperBottom).toBeLessThanOrEqual(bounds.viewportBottom + 4);
  expect(bounds.viewportBottom).toBeLessThanOrEqual(bounds.dockTop + 1);
  expect(bounds.paperBottom).toBeLessThanOrEqual(bounds.dockTop + 4);
}

for (const language of ['zh', 'en'] as const) {
  for (const size of [{ width: 320, height: 568 }, { width: 390, height: 700 }, { width: 390, height: 560 }]) {
    test('mobile preview bottom stays above actions at ' + language + ' ' + size.width + 'x' + size.height, async ({ page }) => {
      await page.setViewportSize(size);
      await page.addInitScript(lang => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', lang);
      }, language);
      await page.goto('/?page=editor');

      const dock = page.getByRole('navigation', {
        name: language === 'en' ? 'Mobile workspace actions' : '移动端工作区操作',
      });
      await dock.getByRole('button', { name: language === 'en' ? 'Preview' : '预览' }).click();
      await expectFooterOutsideScrollableContent(page);
      // Toggling tabs does not return the footer to a floating overlay.
      await dock.getByRole('button', { name: language === 'en' ? 'Form editor' : '表单编辑模式' }).click();
      await expect(page.locator('#editor-pane')).toBeVisible();
      await dock.getByRole('button', { name: language === 'en' ? 'Preview' : '预览' }).click();
      await expectFooterOutsideScrollableContent(page);
    });
  }
}

test('desktop workspace remains split and has no mobile footer', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => localStorage.setItem('resume-onboarding-v1-complete', '1'));
  await page.goto('/?page=editor');
  await expect(page.locator('#resume-preview-wrapper')).toBeVisible();
  await expect(page.locator('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]')).toHaveCount(0);
});
