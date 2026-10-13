import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { readActiveMarkdown, readProfiles } from './helpers/indexeddb';

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
    drafts: [], jdText: 'Local fixture job description',
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
});
