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


test('portable file moves a resume between isolated browser profiles', async ({ browser }) => {
  test.setTimeout(45_000);
  const sourceContext = await browser.newContext({ acceptDownloads: true });
  const destinationContext = await browser.newContext({ acceptDownloads: true });
  try {
    const oldSite = await sourceContext.newPage();
    const newSite = await destinationContext.newPage();
    for (const page of [oldSite, newSite]) {
      await page.addInitScript(() => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', 'en');
      });
      await page.goto('http://127.0.0.1:3000/?page=editor');
      await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
    }

    await oldSite.getByRole('button', { name: /^(Markdown source editor|Markdown 源码编辑模式)$/ }).click();
    await oldSite.locator('#markdown-textarea').fill('# Source browser only');
    await expect.poll(() => readActiveMarkdown(oldSite)).toBe('# Source browser only');
    await expect.poll(() => readActiveMarkdown(newSite)).not.toBe('# Source browser only');

    await oldSite.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
    const sourceModal = oldSite.getByRole('dialog', { name: 'Resume Management' });
    await sourceModal.getByRole('button', { name: 'Backup', exact: true }).click();
    const [download] = await Promise.all([
      oldSite.waitForEvent('download'),
      sourceModal.getByRole('button', { name: 'Export workspace .json' }).click(),
    ]);
    const json = await readFile(await download.path()!, 'utf8');

    await newSite.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
    const destinationModal = newSite.getByRole('dialog', { name: 'Resume Management' });
    await destinationModal.getByRole('button', { name: 'Backup', exact: true }).click();
    await destinationModal.locator('input[aria-label="Choose workspace backup file"]').setInputFiles({
      name: 'transfer.json',
      mimeType: 'application/json',
      buffer: Buffer.from(json),
    });
    const approval = newSite.getByRole('dialog', { name: 'Replace all local resumes?' });
    await approval.getByRole('button', { name: 'Replace workspace' }).click();
    await expect.poll(() => readActiveMarkdown(newSite)).toBe('# Source browser only');

    await newSite.reload();
    await expect.poll(() => readActiveMarkdown(newSite)).toBe('# Source browser only');
    await oldSite.reload();
    await expect.poll(() => readActiveMarkdown(oldSite)).toBe('# Source browser only');
  } finally {
    await sourceContext.close();
    await destinationContext.close();
  }
});
