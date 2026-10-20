import { expect, test } from '@playwright/test';

test('editor global language button matches welcome and sits beside Theme on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/');

  const welcomeLanguage = page.getByRole('button', { name: 'Toggle language' });
  await expect(welcomeLanguage).toHaveText('中文');
  const welcomeClass = await welcomeLanguage.getAttribute('class');
  await page.getByTestId('landing-hero-cta').click();
  await expect(page.locator('#editor-pane')).toBeVisible();

  const editorLanguage = page.getByRole('button', { name: 'Toggle language' });
  const theme = page.getByRole('button', { name: /^Theme:/ });
  await expect(editorLanguage).toBeVisible();
  await expect(theme).toBeVisible();
  await expect(editorLanguage).toHaveText('中文');
  expect((await editorLanguage.getAttribute('class'))?.trim()).toBe(welcomeClass?.trim());

  const languageBox = await editorLanguage.boundingBox();
  const themeBox = await theme.boundingBox();
  expect(languageBox).not.toBeNull();
  expect(themeBox).not.toBeNull();
  expect(themeBox!.x).toBeGreaterThanOrEqual(languageBox!.x + languageBox!.width - 1);
  expect(themeBox!.x - languageBox!.x - languageBox!.width).toBeLessThanOrEqual(16);

  await editorLanguage.click();
  await expect(editorLanguage).toHaveText('EN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('button', { name: /^主题:/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('resume_ui_language'))).toBe('zh');

  await page.getByRole('button', { name: /^返回首页$/ }).click();
  await expect(page.getByRole('button', { name: 'Toggle language' })).toHaveText('EN');
});

for (const width of [320, 390]) {
  test('mobile global language switch shares Quick Actions row with Theme at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.addInitScript(() => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', 'en');
    });
    await page.goto('/?page=editor');

    await page.getByRole('button', { name: 'Open quick actions menu' }).click();
    const panel = page.locator('#mobile-quick-actions');
    await expect(panel).toBeVisible();
    const language = panel.getByRole('button', { name: 'Toggle language' });
    const theme = panel.getByRole('button', { name: /^Theme:/ });
    await expect(language).toHaveText('中文');
    await expect(theme).toBeVisible();
    const boxA = await language.boundingBox();
    const boxB = await theme.boundingBox();
    expect(boxA).not.toBeNull();
    expect(boxB).not.toBeNull();
    expect(Math.abs(boxA!.y - boxB!.y)).toBeLessThanOrEqual(2);
    expect(boxB!.x).toBeGreaterThanOrEqual(boxA!.x + boxA!.width - 1);
    expect(boxB!.x + boxB!.width).toBeLessThanOrEqual(width + 1);

    await language.click();
    await expect(panel).toBeHidden();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
    await page.getByRole('button', { name: '打开快捷功能菜单' }).click();
    await expect(panel.getByRole('button', { name: 'Toggle language' })).toHaveText('EN');
    await expect(panel.getByRole('button', { name: /^主题:/ })).toBeVisible();
  });
}

for (const lang of ['zh', 'en'] as const) {
  test('preboot welcome skeleton uses real welcome layout and localized global controls: ' + lang, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 });
    await page.addInitScript(language => localStorage.setItem('resume_ui_language', language), lang);
    await page.route('**/src/main.tsx*', route => route.abort());
    await page.goto('/');

    await expect(page.locator('html')).toHaveAttribute('data-startup-route', 'landing');
    await expect(page.locator('.startup-welcome-heading')).toContainText(lang === 'zh' ? '打造专业求职简历' : 'Build Resumes with');
    await expect(page.locator('.startup-landing-actions')).toBeVisible();
    await expect(page.locator('.startup-landing-actions .startup-language-preview')).toHaveText(lang === 'zh' ? '◎EN' : '◎中文');
    await expect(page.locator('.startup-workspace')).toBeHidden();
    await expect(page.locator('.startup-toolbar')).toBeHidden();
    await expect(page.locator('.startup-welcome-cta')).toBeVisible();

    await page.goto('/?page=editor');
    await expect(page.locator('html')).toHaveAttribute('data-startup-route', 'editor');
    await expect(page.locator('.startup-welcome')).toBeHidden();
    await expect(page.locator('.startup-landing-actions')).toBeHidden();
    await expect(page.locator('.startup-workspace')).toBeVisible();
  });
}
