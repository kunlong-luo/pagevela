import { expect, test } from '@playwright/test';

test.describe('landing-to-editor navigation', () => {
  test('opens the marketing page at root and returns from editor through browser history', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });

    await page.goto('/');
    await expect(page.locator('#showcase')).toBeVisible();
    await expect(page.locator('#features')).toBeVisible();

    await page.getByTestId('landing-hero-cta').click();
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


  test('navigation links follow the section order and target the correct sections', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'zh'));
    await page.goto('/');

    const nav = page.getByRole('navigation', { name: '页面章节' });
    const sectionIds = ['showcase', 'features', 'privacy', 'templates', 'faq'];

    await expect(nav.locator('a')).toHaveCount(sectionIds.length);
    await expect(nav.locator('a')).toHaveText(['界面预览', '核心功能', '隐私与安全', '精选模板', '常见问题']);
    expect(await nav.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
      .toEqual(sectionIds.map((id) => `#${id}`));

    const actualPageOrder = await page.evaluate((ids) =>
      ids.map((id) => {
        const element = document.getElementById(id);
        if (!element) throw new Error(`Missing section #${id}`);
        return element.getBoundingClientRect().top + window.scrollY;
      }), sectionIds);
    expect(actualPageOrder).toEqual([...actualPageOrder].sort((a, b) => a - b));

    for (const id of sectionIds) {
      await nav.locator(`a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('English navigation labels match the same section order', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'en'));
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Page sections' }).locator('a'))
      .toHaveText(['Interactive Demo', 'Features', 'Privacy', 'Templates', 'FAQ']);
  });

  test('only the Hero offers a generic editor CTA', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'en'));
    await page.goto('/');

    await expect(page.getByTestId('landing-nav-cta')).toHaveCount(0);
    await expect(page.getByRole('navigation', { name: 'Page sections' }).getByRole('button')).toHaveCount(0);
    const heroCta = page.getByTestId('landing-hero-cta');
    await expect(heroCta).toContainText('Start Building (Free)');
    await expect(page.locator('#showcase').getByRole('button', { name: /Open in editor/i })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Open Resume Craft Editor' })).toHaveCount(0);

    await heroCta.click();
    await expect(page).toHaveURL(/\?page=editor/);
    await expect(page.locator('#editor-pane')).toBeVisible();
  });

  test('returning users see Continue Editing in the Hero only', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('resume_ui_language', 'en');
      window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    });
    await page.goto('/');

    await expect(page.getByTestId('landing-nav-cta')).toHaveCount(0);
    await expect(page.getByTestId('landing-hero-cta')).toContainText('Continue Editing');
    await expect(page.getByRole('button', { name: 'Open Editor' })).toHaveCount(0);
  });

  test('mobile header remains usable without an editor button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'en'));
    await page.goto('/');

    await expect(page.getByTestId('landing-nav-cta')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Toggle language' })).toBeVisible();
    const heroCta = page.getByTestId('landing-hero-cta');
    await expect(heroCta).toBeVisible();
    const box = await heroCta.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
    await heroCta.click();
    await expect(page).toHaveURL(/\?page=editor/);
  });

  test('Chinese Hero CTA keeps its localized copy and editor route', async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem('resume_ui_language', 'zh'));
    await page.goto('/');
    await expect(page.getByTestId('landing-nav-cta')).toHaveCount(0);
    await expect(page.getByTestId('landing-hero-cta')).toContainText('免费开始制作');
    await page.getByTestId('landing-hero-cta').click();
    await expect(page).toHaveURL(/\?page=editor/);
  });

});
