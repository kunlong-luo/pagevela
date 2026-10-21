import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const packageVersion = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf-8'),
).version as string;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume-settings', JSON.stringify({ lang: 'en' }));
  });
});

async function openHelp(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('button', { name: 'Help' }).click();
  const dialog = page.getByRole('dialog', { name: 'Help & Privacy' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test('help shows the package version and replay entry', async ({ page }) => {
  await page.goto('/?page=editor');
  const dialog = await openHelp(page);
  await expect(dialog).toContainText(`v${packageVersion}`);
  await expect(dialog.getByRole('button', { name: 'Replay the interface tour' })).toBeVisible();
});

test('clear local data is scoped and requires confirmation', async ({ page }) => {
  await page.goto('/?page=editor');
  await page.evaluate(() => {
    localStorage.setItem('resume-markdown', '# Sensitive resume');
    localStorage.setItem('resume-craft.support-prompt.v1', '{"nextPromptAt":1,"exportCount":2}');
    localStorage.setItem('resume-craft.support-prompt.v2', '{"prompted":true,"exportCount":1}');
    localStorage.setItem('another-app:key', 'keep-me');
  });

  const dialog = await openHelp(page);
  await dialog.getByRole('button', { name: 'Privacy' }).click();
  await dialog.getByRole('button', { name: 'Clear local data…' }).click();
  await expect(dialog.getByText('Delete all local Pagevela data?')).toBeVisible();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    dialog.getByRole('button', { name: 'Delete permanently' }).click(),
  ]);
  await expect(page.getByRole('button', { name: 'More actions' })).toBeVisible();

  const values = await page.evaluate(() => ({
    resume: localStorage.getItem('resume-markdown'),
    supportLegacy: localStorage.getItem('resume-craft.support-prompt.v1'),
    supportCurrent: localStorage.getItem('resume-craft.support-prompt.v2'),
    unrelated: localStorage.getItem('another-app:key'),
  }));
  expect(values.resume).toBeNull();
  expect(values.supportLegacy).toBeNull();
  expect(values.supportCurrent).toBeNull();
  expect(values.unrelated).toBe('keep-me');
});


for (const language of ['zh', 'en'] as const) {
  test(`help and privacy use the branded capsule scrollbar: ${language}`, async ({ page, browserName }) => {
    await page.setViewportSize({ width: 1280, height: 640 });
    await page.addInitScript(lang => localStorage.setItem('resume_ui_language', lang), language);
    await page.goto('/?page=editor');
    await page.getByRole('button', { name: language === 'en' ? 'More actions' : '更多操作' }).click();
    await page.getByRole('button', { name: language === 'en' ? 'Help' : '帮助' }).click();

    const dialog = page.getByRole('dialog', { name: language === 'en' ? 'Help & Privacy' : '帮助与隐私' });
    const scroller = dialog.getByTestId('help-dialog-scroller');
    await expect(scroller).toBeVisible();
    await expect(scroller).toHaveClass(/workspace-scrollbar/);
    const style = await scroller.evaluate(element => ({
      overflowY: getComputedStyle(element).overflowY,
      webkitWidth: getComputedStyle(element, '::-webkit-scrollbar').width,
      standardWidth: getComputedStyle(element).scrollbarWidth,
      scrollRange: element.scrollHeight - element.clientHeight,
    }));
    expect(style.overflowY).toBe('auto');
    expect(style.scrollRange).toBeGreaterThan(0);
    if (browserName === 'chromium') {
      expect(style.standardWidth).toBe('auto');
      expect(style.webkitWidth).toBe('5px');
    }
    if (browserName === 'firefox') {
      expect(style.standardWidth).toBe('thin');
    }
    await scroller.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect.poll(() => scroller.evaluate(element => Math.round(
      element.scrollTop + element.clientHeight - element.scrollHeight,
    ))).toBeGreaterThanOrEqual(-2);

    await dialog.getByRole('button', { name: language === 'en' ? 'Privacy' : '隐私与数据' }).click();
    await expect(scroller).toHaveClass(/workspace-scrollbar/);
    await dialog.getByRole('button', { name: language === 'en' ? 'Open Source' : '开源' }).click();
    await expect(scroller).toHaveClass(/workspace-scrollbar/);
  });
}
