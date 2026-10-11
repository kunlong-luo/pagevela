import { expect, test } from '@playwright/test';

test.describe('landing-to-editor navigation', () => {
  test('opens the marketing page at root and returns from editor through browser history', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });

    await page.goto('/');
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();

    await page.getByTestId('landing-nav-cta').click();
    await expect(page).toHaveURL(/\?page=editor/);
    await expect(page.locator('#editor-pane')).toBeVisible();

    await page.reload();
    await expect(page.locator('#editor-pane')).toBeVisible();

    await page.goBack();
    await expect(page.locator('#showcase')).toBeVisible();
  });

  test('direct editor deep link remains usable', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/?page=editor');
    await expect(page.locator('#editor-pane')).toBeVisible();
  });

  test('fresh visitors are not told they already have a saved resume', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Resume where you left off' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Start Building (Free)' })).toBeVisible();
  });

  test('English marketing copy uses English demo and template descriptions', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume_ui_language', 'en');
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Markdown', exact: true }).click();
    await expect(page.getByText('# Alex Morgan')).toBeVisible();
    await expect(page.getByText('US Software Engineer (Resume)', { exact: true })).toBeVisible();
    await expect(page.getByText('Chinese General Demo', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Form', exact: true }).click();
    await expect(page.getByText('Basic Info', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'ATS Audit' }).click();
    await expect(page.getByText('ATS rule check (example)')).toBeVisible();
  });

  test('using a template asks before replacing an existing resume', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume_ui_language', 'en');
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Use Template' }).first().click();
    const confirmation = page.getByRole('dialog', { name: 'Replace active resume?' });
    await expect(confirmation).toBeVisible();
    await confirmation.getByRole('button', { name: 'Cancel' }).last().click();
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page).not.toHaveURL(/page=editor/);
  });


  test('only the sticky navigation and Hero show generic editor CTAs', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'en'));
    await page.goto('/');

    const navCta = page.getByTestId('landing-nav-cta');
    const heroCta = page.getByTestId('landing-hero-cta');
    await expect(navCta).toHaveText('Start Building');
    await expect(heroCta).toContainText('Start Building (Free)');

    await expect(page.locator('#showcase').getByRole('button', { name: /Open in editor/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open Resume Craft Editor' })).toHaveCount(0);
    await expect(page.locator('footer').getByRole('button', { name: 'Editor', exact: true })).toHaveCount(0);

    await heroCta.click();
    await expect(page).toHaveURL(/\?page=editor/);
    await expect(page.locator('#editor-pane')).toBeVisible();
  });

  test('existing drafts show one Continue Editing action in both CTA positions', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume_ui_language', 'en');
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/');

    await expect(page.getByTestId('landing-nav-cta')).toHaveText('Continue Editing');
    await expect(page.getByTestId('landing-hero-cta')).toContainText('Continue Editing');
    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(0);
  });

  test('mobile navigation CTA stays visible without overflowing the viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'en'));
    await page.goto('/');

    const navCta = page.getByTestId('landing-nav-cta');
    await expect(navCta).toBeVisible();
    const box = await navCta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await navCta.click();
    await expect(page).toHaveURL(/\?page=editor/);
  });

  test('Chinese CTAs use localized copy and the same editor route', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'zh'));
    await page.goto('/');
    await expect(page.getByTestId('landing-nav-cta')).toHaveText('开始制作');
    await expect(page.getByTestId('landing-hero-cta')).toContainText('免费开始制作');
    await page.getByTestId('landing-hero-cta').click();
    await expect(page).toHaveURL(/\?page=editor/);
  });

});
