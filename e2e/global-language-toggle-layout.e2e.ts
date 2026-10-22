import { expect, test } from '@playwright/test';

test('editor global language button matches welcome and sits beside Theme on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/');

  const welcomeLanguage = page.getByRole('button', { name: 'Switch interface to Chinese' });
  await expect(welcomeLanguage).toHaveText('中文');
  const welcomeClass = await welcomeLanguage.getAttribute('class');
  await page.getByTestId('landing-hero-cta').click();
  await expect(page.locator('#editor-pane')).toBeVisible();

  const editorLanguage = page.getByRole('button', { name: 'Switch interface to Chinese' });
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
  const chineseLanguageToggle = page.getByRole('button', { name: '切换界面为英文' });
  await expect(chineseLanguageToggle).toHaveText('EN');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('button', { name: /^主题:/ })).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('resume_ui_language'))).toBe('zh');

  await page.getByRole('button', { name: /^返回首页$/ }).click();
  await expect(page.getByRole('button', { name: '切换界面为英文' })).toHaveText('EN');
});

for (const width of [320, 390]) {
  test('mobile global language and Theme stay in header, not Quick Actions at ' + width + 'px', async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.addInitScript(() => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', 'en');
    });
    await page.goto('/?page=editor');

    const header = page.getByRole('banner');
    const headerLanguage = header.getByRole('button', { name: 'Switch interface to Chinese' });
    const headerTheme = header.getByRole('button', { name: /^Theme:/ });
    await expect(headerLanguage).toBeVisible();
    await expect(headerTheme).toBeVisible();
    const headerA = await headerLanguage.boundingBox();
    const headerB = await headerTheme.boundingBox();
    expect(headerA).not.toBeNull();
    expect(headerB).not.toBeNull();
    expect(headerB!.x).toBeGreaterThanOrEqual(headerA!.x + headerA!.width - 1);

    await page.getByRole('button', { name: 'Open quick actions menu' }).click();
    const panel = page.locator('#mobile-quick-actions');
    await expect(panel).toBeVisible();
    await expect(panel.getByRole('button', { name: 'Switch interface to Chinese' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: /^Theme:/ })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Auto Fit' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: 'Check' })).toHaveCount(0);
    await panel.getByRole('button', { name: 'Close quick actions menu' }).click();

    await headerLanguage.click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
    await expect(page.getByRole('banner').getByRole('button', { name: '切换界面为英文' })).toHaveText('EN');
    await expect(page.getByRole('banner').getByRole('button', { name: /^主题:/ })).toBeVisible();
    await page.getByRole('button', { name: '打开快捷功能菜单' }).click();
    await expect(panel.getByRole('button', { name: '切换界面为英文' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: /^主题:/ })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: '智能单页' })).toHaveCount(0);
    await expect(panel.getByRole('button', { name: '检查' })).toHaveCount(0);
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
    const previewLanguage = page.locator('.startup-landing-actions .startup-language-preview');
    const visibleLocale = previewLanguage.locator(lang === 'zh' ? '.startup-brand-zh' : '.startup-brand-en');
    const hiddenLocale = previewLanguage.locator(lang === 'zh' ? '.startup-brand-en' : '.startup-brand-zh');
    await expect(visibleLocale).toBeVisible();
    await expect(visibleLocale).toHaveText(lang === 'zh' ? 'EN' : '中文');
    await expect(hiddenLocale).toBeHidden();
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

for (const language of ['en', 'zh'] as const) {
  test('welcome theme and editor color palette are accessible in ' + language, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 720 });
    await page.addInitScript(lang => {
      localStorage.setItem('resume_ui_language', lang);
      localStorage.setItem('resume_theme_mode', 'light');
      localStorage.setItem('resume-onboarding-v1-complete', '1');
    }, language);
    await page.goto('/');

    const darkThemeLabel = language === 'en' ? 'Switch to dark theme' : '切换为深色主题';
    await expect(page.getByRole('banner').getByRole('button', { name: darkThemeLabel })).toBeVisible();
    await page.getByRole('banner').getByRole('button', { name: darkThemeLabel }).click();
    const lightThemeLabel = language === 'en' ? 'Switch to light theme' : '切换为浅色主题';
    await expect(page.getByRole('banner').getByRole('button', { name: lightThemeLabel })).toBeVisible();

    await page.goto('/?page=editor');
    await page.locator('#resume-main-toolbar').getByRole('button', {
      name: language === 'en' ? 'Open style settings' : '打开样式设置',
    }).click();
    const dialog = page.getByRole('dialog', { name: language === 'en' ? 'Style' : '样式' });
    await dialog.getByRole('button', {
      name: language === 'en' ? 'Custom accent color' : '自定义强调色',
    }).click();
    const trigger = dialog.getByRole('button', { name: /^#[0-9a-f]{6}$/i });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(page.getByText(language === 'en' ? 'Preset palette' : '预设调色板')).toBeVisible();
    const customHex = page.getByRole('textbox', {
      name: language === 'en' ? 'Custom hex color' : '自定义十六进制颜色',
    });
    const editHex = page.getByRole('button', {
      name: language === 'en' ? 'Edit custom hex color' : '编辑自定义十六进制颜色',
    });
    await expect(customHex).toBeVisible();
    await expect(editHex).toBeVisible();
    await editHex.click();
    await expect(customHex).toBeFocused();
  });
}
