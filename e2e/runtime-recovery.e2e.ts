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

test('does not present an editable starter when IndexedDB is unavailable', async ({ page }) => {
  const resume = '# Unique original resume\n\n## Experience\n- Do not discard me';
  await page.addInitScript((markdown) => {
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume-markdown', markdown);
    // Simulate a browser policy rejecting actual IndexedDB operations. Some
    // WebKit environments do not let an init script shadow window.indexedDB;
    // override IDBFactory.open instead so Dexie gets a rejected open request
    // in Chromium, Firefox and WebKit alike.
    Object.defineProperty(window.indexedDB, 'open', {
      configurable: true,
      value: () => {
        throw new DOMException('IndexedDB blocked by browser policy', 'SecurityError');
      },
    });
  }, resume);

  await page.goto('/?page=editor');
  // Prove the policy stub took effect rather than passing because the editor
  // happened to fail for an unrelated reason.
  await expect(page.evaluate(() => {
    try {
      indexedDB.open('pagevela-storage-denial-fixture');
      return false;
    } catch (error) {
      return error instanceof DOMException && error.name === 'SecurityError';
    }
  })).resolves.toBe(true);
  const recovery = page.getByRole('alert');
  await expect(recovery.getByRole('heading', { name: 'Pagevela could not start' })).toBeVisible();
  await expect(recovery).toContainText('Saved resumes could not be read from this browser');
  await expect(recovery).toContainText('No data was cleared');
  await expect(recovery.getByRole('button', { name: 'Reload Pagevela' })).toBeVisible();
  await expect(page.locator('#editor-pane')).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('resume-markdown'))).toBe(resume);
});
