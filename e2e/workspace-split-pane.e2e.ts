import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'en');
  });
});

test.describe('split-pane drag persistence', () => {
  test('stores the final pointer position, restores it, and persists reset', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/?page=editor');
    const handle = page.getByTestId('workspace-split-handle');
    await expect(handle).toBeVisible();
    const bounds = await handle.boundingBox();
    expect(bounds).not.toBeNull();
    if (!bounds) throw new Error('Expected a visible split-pane handle');

    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 140, y, { steps: 5 });
    await page.mouse.up();

    await expect.poll(() => page.evaluate(() =>
      Number(window.localStorage.getItem('resume-split-ratio')),
    )).toBeGreaterThan(50);
    const saved = await page.evaluate(() => Number(window.localStorage.getItem('resume-split-ratio')));
    expect(saved).toBeLessThanOrEqual(72);

    await page.reload();
    await expect(page.getByTestId('workspace-split-handle')).toBeVisible();
    await expect.poll(() => page.locator('#editor-pane').evaluate(
      (el) => Number.parseFloat((el as HTMLElement).style.width),
    )).toBeCloseTo(saved, 0);

    await page.getByTestId('workspace-split-handle').dblclick();
    await expect.poll(() => page.evaluate(
      () => window.localStorage.getItem('resume-split-ratio'),
    )).toBe('50');
    await page.reload();
    await expect.poll(() => page.locator('#editor-pane').evaluate(
      (el) => Number.parseFloat((el as HTMLElement).style.width),
    )).toBe(50);
  });
});
