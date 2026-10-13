import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { readActiveMarkdown, readProfiles } from './helpers/indexeddb';

async function readSavedDraftsAndJd(page: import('@playwright/test').Page) {
  return page.evaluate(() => new Promise<{ drafts: Array<{ id: string; markdown: string }>; jdText: string | null }>((resolve, reject) => {
    const request = indexedDB.open('resume-craft');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(['drafts', 'documents'], 'readonly');
      const draftsRequest = tx.objectStore('drafts').getAll();
      const jdRequest = tx.objectStore('documents').get('jd');
      tx.onerror = () => { db.close(); reject(tx.error); };
      tx.oncomplete = () => {
        const drafts = (draftsRequest.result ?? []) as Array<{ id: string; markdown: string }>;
        const jd = jdRequest.result as { markdown?: string } | undefined;
        db.close();
        resolve({ drafts: drafts.map(({ id, markdown }) => ({ id, markdown })), jdText: jd?.markdown ?? null });
      };
    };
  }));
}

test('portable workspace export and confirmed restore survive reload', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('resume-onboarding-v1-complete', '1');
    window.localStorage.setItem('resume_ui_language', 'en');
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
  await page.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
  const modal = page.getByRole('dialog', { name: 'Resume Management' });
  await modal.getByRole('button', { name: 'Backup', exact: true }).click();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    modal.getByRole('button', { name: 'Export workspace .json' }).click(),
  ]);
  const backup = JSON.parse(await readFile(await download.path()!, 'utf8'));
  expect(backup.version).toBe('resume-craft-workspace-v1');
  const imported = { ...backup.profiles[0], id: 'portable_fixture', name: 'Portable fixture',
    markdown: '# Restored workspace' };
  const modified = {
    ...backup, activeProfileId: imported.id, profiles: [...backup.profiles, imported],
    drafts: [{ id: 'portable_saved_draft', title: 'Previous version',
      markdown: '# Saved prior version', settings: imported.settings, timestamp: '2026-10-13',
    }], jdText: 'Local fixture job description',
  };
  const picker = modal.locator('input[aria-label="Choose workspace backup file"]');
  const fixture = { name: 'workspace.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(modified)) };
  const count = (await readProfiles(page)).length;
  await picker.setInputFiles(fixture);
  const confirmation = page.getByRole('dialog', { name: 'Replace all local resumes?' });
  await confirmation.getByRole('button', { name: 'Cancel', exact: true }).last().click();
  expect((await readProfiles(page)).length).toBe(count);

  await picker.setInputFiles(fixture);
  await confirmation.getByRole('button', { name: 'Replace workspace' }).click();
  await expect.poll(() => readActiveMarkdown(page)).toBe('# Restored workspace');
  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toBe('# Restored workspace');
  expect((await readProfiles(page)).some(p => p.id === 'portable_fixture')).toBe(true);
  const persisted = await readSavedDraftsAndJd(page);
  expect(persisted.jdText).toBe('Local fixture job description');
  expect(persisted.drafts).toContainEqual({
    id: 'portable_saved_draft',
    markdown: '# Saved prior version',
  });
});
