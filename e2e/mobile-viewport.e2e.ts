import { expect, test } from '@playwright/test';

test('mobile editor fits the dynamic viewport and keeps primary actions reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');

  const nav = page.getByRole('navigation', { name: 'Mobile workspace actions' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Edit' })).toBeVisible();
  await expect(nav.getByRole('button', { name: /Preview/ })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Export ATS PDF' })).toBeVisible();

  const initial = await page.evaluate(() => ({
    appHeight: document.body.firstElementChild?.getBoundingClientRect().height,
    viewportHeight: window.innerHeight,
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(initial.appHeight).toBeLessThanOrEqual(initial.viewportHeight + 2);
  expect(initial.documentWidth).toBeLessThanOrEqual(initial.viewportWidth + 2);

  await page.setViewportSize({ width: 390, height: 560 });
  await expect.poll(async () => page.evaluate(() =>
    document.body.firstElementChild?.getBoundingClientRect().height ?? 0,
  )).toBeLessThanOrEqual(562);
  const navBottom = await nav.evaluate(node => node.getBoundingClientRect().bottom);
  expect(navBottom).toBeLessThanOrEqual(560);
  await nav.getByRole('button', { name: /Preview/ }).click();
  await expect(page.locator('#preview-pane')).toBeVisible();
});


test('compact 320px mobile workspace keeps its three primary actions in view', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');

  const nav = page.getByRole('navigation', { name: 'Mobile workspace actions' });
  await expect(nav).toBeVisible();
  const buttons = [
    nav.getByRole('button', { name: 'Edit' }),
    nav.getByRole('button', { name: /Preview/ }),
    nav.getByRole('button', { name: 'Export ATS PDF' }),
  ];
  for (const button of buttons) {
    await expect(button).toBeVisible();
    const bounds = await button.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(568);
  }

  await buttons[1].click();
  await expect(page.locator('#preview-pane')).toBeVisible();
  await buttons[0].click();
  await expect(page.locator('#editor-pane')).toBeVisible();
});
