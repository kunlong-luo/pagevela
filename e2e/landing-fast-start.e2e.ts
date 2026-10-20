import { expect, test } from '@playwright/test';

for (const language of ['zh', 'en'] as const) {
  test('welcome provides useful readable HTML before JavaScript boot: ' + language, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 700 });
    await page.addInitScript(lang => localStorage.setItem('resume_ui_language', lang), language);
    await page.route('**/src/main.tsx', route => route.abort());
    await page.goto('/');

    const shell = page.locator('.startup-shell');
    await expect(shell).toBeVisible();
    const heading = shell.getByRole('heading', { level: 1 });
    await expect(heading).toContainText(language === 'en' ? 'Build Resumes with' : '打造专业求职简历');
    const link = shell.getByRole('link', { name: language === 'en' ? 'Start Building (Free)' : '免费开始制作' });
    await expect(link).toHaveAttribute('href', './?page=editor');
    await expect(link).toBeVisible();
  });
}

test('welcome never fetches editor workspace code before opening the editor', async ({ page }) => {
  const requestedEditorModules: string[] = [];
  page.on('request', request => {
    if (/\/src\/components\/EditorWorkspace\.tsx(?:\?|$)/.test(request.url())) {
      requestedEditorModules.push(request.url());
    }
  });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/');
  const cta = page.getByTestId('landing-hero-cta');
  await expect(cta).toBeVisible();
  expect(requestedEditorModules).toHaveLength(0);
  await cta.click();
  await expect(page.locator('#editor-pane')).toBeVisible();
  expect(requestedEditorModules).toHaveLength(1);
});
