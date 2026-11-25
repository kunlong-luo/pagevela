import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('runtime crash reset clears IndexedDB and app data, not another app on the origin', async ({ page }) => {
  const original = '# Original private resume\n\n## Experience\n- Must be removed by explicit reset';
  await page.addInitScript((markdown) => {
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume-markdown', markdown);
  }, original);

  // Hydrate a real IndexedDB workspace and plant a recoverable draft sentinel.
  await page.goto('/');
  await expect(page.locator('#showcase')).toBeVisible();
  await expect.poll(() => readActiveMarkdown(page)).toContain('Original private resume');
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    localStorage.setItem('another-app:owned-key', 'keep-me');
    const request = indexedDB.open('resume-craft');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('drafts', 'readwrite');
      tx.objectStore('drafts').put({
        id: 'draft-reset-e2e',
        sortIndex: 0,
        title: 'private draft',
        markdown: '# Other sensitive draft',
        settings: {},
        timestamp: '2026-11-25',
      });
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => { db.close(); resolve(); };
    };
  }));

  // Force the real ErrorBoundary, not the pre-React startup error fallback.
  await page.route('**/src/components/EditorWorkspace.tsx*', route => route.abort('failed'));
  await page.goto('/?page=editor');
  await expect(page.getByRole('heading', { name: 'Unexpected Runtime Exception' })).toBeVisible();
  await page.unroute('**/src/components/EditorWorkspace.tsx*');

  await page.getByRole('button', { name: 'Reset Pagevela Local Data' }).click();
  const confirmation = page.getByRole('group', {
    name: /Clear Pagevela local resume data and reset the app/,
  });
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toContainText('every Pagevela resume, profile, draft');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    confirmation.getByRole('button', { name: 'Reset Pagevela Local Data' }).click(),
  ]);

  await expect(page.locator('#editor-pane')).toBeVisible();
  await expect.poll(() => page.evaluate(() => localStorage.getItem('another-app:owned-key')))
    .toBe('keep-me');
  await expect.poll(() => readActiveMarkdown(page)).not.toContain('Original private resume');
  const drafts = await page.evaluate(() => new Promise<string[]>((resolve, reject) => {
    const request = indexedDB.open('resume-craft');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('drafts', 'readonly');
      const query = tx.objectStore('drafts').getAll();
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => {
        resolve((query.result as Array<{ id: string }>).map(d => d.id));
        db.close();
      };
    };
  }));
  expect(drafts).not.toContain('draft-reset-e2e');
});
