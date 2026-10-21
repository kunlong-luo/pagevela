import { expect, test, type Page } from '@playwright/test';

async function assertTopNavigationAndBottomClear(page: Page) {
  const nav = page.locator('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]');
  const scroller = page.locator('#resume-preview-wrapper');
  const paper = page.locator('#resume-print-content');

  await expect(nav).toBeVisible();
  await expect(scroller).toBeVisible();
  await expect(paper).toBeVisible();

  const { navBottom, scrollTop, viewportBottom, viewportHeight, horizontalOverflow } = await page.evaluate(() => {
    const n = document.querySelector('nav[aria-label="Mobile workspace actions"], nav[aria-label="移动端工作区操作"]')!;
    const scroller = document.querySelector('#resume-preview-wrapper')!;
    return {
      navBottom: n.getBoundingClientRect().bottom,
      scrollTop: scroller.getBoundingClientRect().top,
      viewportBottom: scroller.getBoundingClientRect().bottom,
      viewportHeight: innerHeight,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  expect(navBottom).toBeLessThanOrEqual(scrollTop + 1);
  expect(viewportBottom).toBeLessThanOrEqual(viewportHeight + 1);
  expect(horizontalOverflow).toBeLessThanOrEqual(1);

  // Paper dimensions are recalculated when the hidden preview is first shown.
  // Re-issue the user's scroll-to-bottom gesture while that layout settles,
  // rather than expecting the initial scroll position to stay pinned during updates.
  await expect.poll(() => scroller.evaluate(element => {
    element.scrollTop = element.scrollHeight;
    return Math.round(element.scrollTop + element.clientHeight - element.scrollHeight);
  }), { timeout: 8_000 }).toBeGreaterThanOrEqual(-2);
  // Check the actual paper, not just the scrollbar's last position. WebKit
  // may update the hidden pane's paper dimensions in a following animation
  // frame, so keep the gesture active until both agree.
  await expect.poll(() => scroller.evaluate(element => {
    element.scrollTop = element.scrollHeight;
    const paper = element.querySelector('#resume-print-content');
    if (!paper) return Infinity;
    return paper.getBoundingClientRect().bottom - element.getBoundingClientRect().bottom;
  }), { timeout: 10_000 }).toBeLessThanOrEqual(4);

  // No permanent height card floats over the mobile preview.
  await expect(page.getByRole('button', { name: /Page count and Auto Fit settings|页数与智能单页设置/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Collapse A4 Height Guard|收起 A4 高度提醒/ })).toBeHidden();
}

for (const lang of ['zh', 'en'] as const) {
  for (const size of [{ width: 320, height: 568 }, { width: 390, height: 700 }, { width: 390, height: 560 }, { width: 640, height: 700 }, { width: 767, height: 700 }]) {
    test('top nav does not overlap preview bottom: ' + lang + ' ' + size.width + 'x' + size.height, async ({ page }) => {
      await page.setViewportSize(size);
      await page.addInitScript(language => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', language);
      }, lang);
      await page.goto('/?page=editor');

      const nav = page.getByRole('navigation', {
        name: lang === 'en' ? 'Mobile workspace actions' : '移动端工作区操作',
      });
      await nav.getByRole('button', { name: lang === 'en' ? 'Preview' : '预览' }).click();
      await assertTopNavigationAndBottomClear(page);
      await nav.getByRole('button', { name: lang === 'en' ? 'Form editor' : '表单编辑模式' }).click();
      await expect(page.locator('#editor-pane')).toBeVisible();
      await nav.getByRole('button', { name: lang === 'en' ? 'Preview' : '预览' }).click();
      await assertTopNavigationAndBottomClear(page);

      await page.getByRole('button', { name: lang === 'en' ? 'Page count and Auto Fit settings' : '页数与智能单页设置' }).click();
      const sheet = page.getByRole('dialog', { name: lang === 'en' ? 'Page count and Auto Fit settings' : '页数与智能单页设置' });
      await expect(sheet).toBeVisible();
      await expect(sheet.getByRole('button', { name: /Auto-Fit to Page|自动缩合至一页|Smart Optimize Spacing|优化排版间距/ })).toBeVisible();
      await sheet.getByRole('button', { name: lang === 'en' ? 'Done' : '完成' }).click();
      await expect(sheet).toBeHidden();
    });
  }
}

test('desktop remains split and has no mobile view navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => localStorage.setItem('resume-onboarding-v1-complete', '1'));
  await page.goto('/?page=editor');
  await expect(page.locator('#resume-preview-wrapper')).toBeVisible();
  await expect(page.getByRole('navigation', { name: /Mobile workspace actions|移动端工作区操作/ })).toHaveCount(0);
});
