import { expect, test, type Page } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

const initEditor = async (page: Page) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  await page.getByRole('button', { name: 'Markdown source editor' }).click();
  const editor = page.locator('#markdown-textarea');
  await expect(editor).toBeVisible();
  return editor;
};

const readConflictDrafts = (page: Page) => page.evaluate(() => new Promise<Array<{
  id: string; markdown: string; isAutoSave?: boolean;
  settings?: { margin?: string };
}>>((resolve, reject) => {
  const request = indexedDB.open('resume-craft');
  request.onerror = () => reject(request.error);
  request.onsuccess = () => {
    const db = request.result;
    const tx = db.transaction('drafts', 'readonly');
    const records = tx.objectStore('drafts').getAll();
    tx.onerror = () => reject(tx.error);
    tx.oncomplete = () => {
      db.close();
      resolve((records.result as Array<{
        id: string; markdown: string; isAutoSave?: boolean;
  settings?: { margin?: string };
      }>).filter(item => item.id.startsWith('draft_conflict_')));
    };
  };
}));

test('two tabs preserve the latest committed resume and the stale edits as manual drafts', async ({
  page, context, browserName,
}) => {
  test.skip(browserName !== 'chromium', 'Two-tab IndexedDB conflict regression runs in Chromium');
  test.setTimeout(120_000);
  const aEditor = await initEditor(page);
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  const initial = await readActiveMarkdown(page);
  await expect(aEditor).toHaveValue(initial!);

  // Opening a second tab reads the same on-disk baseline. The presence
  // warning alone cannot serialize changes made to stale in-memory state.
  const staleTab = await context.newPage();
  const bEditor = await initEditor(staleTab);
  await expect(bEditor).toHaveValue(initial!);
  await expect.poll(() => readConflictDrafts(staleTab)).toHaveLength(0);

  const latest = [
    '# Fictional Winner - Tab A', '', '## Work',
    '- Only synthetic data. The committed version must survive.',
  ].join('\n');
  await aEditor.fill(latest);
  await expect.poll(() => readActiveMarkdown(page), { timeout: 20000 }).toBe(latest);

  const stale = [
    '# Fictional Recovery - Tab B', '', '## Work',
    '- Only synthetic data. This tab must not erase the other one.',
  ].join('\n');
  await bEditor.fill(stale);
  // Also stage a compact layout through the real editor controls. The small
  // pending-settings journal must not replay this rejected layout on reload.
  await staleTab.locator('#resume-main-toolbar')
    .getByRole('button', { name: 'Open layout settings' }).click();
  const layout = staleTab.getByRole('dialog', { name: 'Layout' });
  await layout.getByRole('button', { name: 'Narrow', exact: true }).click();
  await expect(layout.getByRole('button', { name: 'Narrow', exact: true }))
    .toHaveAttribute('aria-pressed', 'true');
  await layout.getByRole('button', { name: 'Close Layout' }).click();

  // A conflict write is one atomic transaction: committed profile/document
  // stay as A, while B's unsaved markdown/layout becomes a manual draft.
  await expect.poll(async () => {
    const drafts = await readConflictDrafts(staleTab);
    return drafts.some(draft =>
      draft.markdown === stale &&
      draft.isAutoSave === false &&
      draft.settings?.margin === 'compact');
  }, { timeout: 20000 }).toBe(true);
  await expect.poll(() => readActiveMarkdown(page)).toBe(latest);
  await expect.poll(() => staleTab.evaluate(() =>
    localStorage.getItem('resume-profile-settings-pending-v1'))).toBeNull();
  await expect(staleTab.getByText('Another tab changed this resume')).toBeVisible();

  await staleTab.reload();
  await expect.poll(() => readActiveMarkdown(staleTab)).toBe(latest);
  await staleTab.getByRole('button', { name: 'Markdown source editor' }).click();
  await expect(staleTab.locator('#markdown-textarea')).toHaveValue(latest);
  await expect.poll(async () => (await readConflictDrafts(staleTab))
    .some(draft => draft.markdown === stale)).toBe(true);

  await staleTab.close();
});
