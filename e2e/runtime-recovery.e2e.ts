import { expect, test } from '@playwright/test';

test('runtime crash screen copies active IndexedDB-backed resume rather than stale localStorage', async ({ page }) => {
  const resume = '# Emergency backup from editor\n\n## Experience\n- Keep this draft';
  await page.addInitScript((markdown) => {
    localStorage.setItem('resume_ui_language', 'zh');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume-markdown', markdown);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          sessionStorage.setItem('pagevela-e2e-copied-draft', text);
        },
      },
    });
  }, resume);

  // Fail a lazily loaded editor chunk after the store bootstrap, so the
  // application's existing ErrorBoundary catches it.
  await page.route('**/src/components/EditorWorkspace.tsx*', (route) => route.abort('failed'));
  await page.goto('/?page=editor');

  await expect(page.getByRole('heading', {
    name: '遇到未预期的运行时异常',
  })).toBeVisible();

  // Legacy markdown is migrated out of localStorage when IndexedDB works.
  await expect.poll(() => page.evaluate(() => localStorage.getItem('resume-markdown'))).toBeNull();

  await page.getByRole('button', { name: '复制简历文本备份' }).click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem('pagevela-e2e-copied-draft'))).toBe(resume);
  await expect(page.getByRole('button', { name: '已复制简历文本备份' })).toBeVisible();
});
