import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { readActiveMarkdown, readProfiles } from './helpers/indexeddb';

// Opt-in only. Never runs against production automatically. Both environments
// must be explicitly provided after a *separate* new HTTPS site exists.
const oldSite = process.env.REBRAND_OLD_URL;
const newSite = process.env.REBRAND_NEW_URL;
const enabled = Boolean(oldSite && newSite);

const portraitPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGMU2XKHARtgwio6aCUASycBtDR93bkAAAAASUVORK5CYII=',
  'base64',
);

function editorUrl(value: string): URL {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('Live migration requires both HTTPS origins');
  if (url.username || url.password || url.hash) {
    throw new Error('Migration origin URLs must not contain credentials or fragments');
  }
  url.search = '';
  url.searchParams.set('page', 'editor');
  return url;
}

async function openEditor(page: Page, url: URL): Promise<void> {
  await page.goto(url.href, { waitUntil: 'domcontentloaded' });
  // Redirecting the old host strands access to its original IndexedDB.
  const actual = new URL(page.url());
  expect(actual.origin, `A redirect changed the origin of ${url.origin}`).toBe(url.origin);
  expect(actual.pathname, 'Editor must remain reachable at the original path').toBe(url.pathname);
  await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
}

async function openBackup(page: Page) {
  await page.evaluate(() => dispatchEvent(new Event('pagevela:open-backup')));
  const modal = page.getByRole('dialog', { name: 'Resume Management' });
  await modal.getByRole('button', { name: 'Backup', exact: true }).click();
  return modal;
}

test('old HTTPS origin stays accessible and explicit complete-workspace transfer preserves portraits, drafts and JD', async ({ browser }) => {
  test.skip(!enabled, 'Set both REBRAND_OLD_URL and REBRAND_NEW_URL to opt in to a two-real-HTTPS-origin rehearsal');
  test.setTimeout(120_000);

  const sourceURL = editorUrl(oldSite!);
  const destinationURL = editorUrl(newSite!);
  expect(sourceURL.origin, 'Two different HTTPS origins are required').not.toBe(destinationURL.origin);
  // Same browser context is intentional: browser storage must still be isolated
  // by the two actual origins. This context is brand new and holds no real data.
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    await context.addInitScript(() => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', 'en');
      localStorage.setItem('resume-settings', JSON.stringify({
        lang: 'en', marketRegion: 'cn', paperSize: 'a4',
      }));
    });
    const source = await context.newPage();
    const destination = await context.newPage();
    await openEditor(source, sourceURL);
    await openEditor(destination, destinationURL);

    await source.locator('input[aria-label="Choose resume photo"]').setInputFiles({
      name: 'fictional-portrait.png', mimeType: 'image/png', buffer: portraitPng,
    });
    await expect(source.locator('img[alt="Resume portrait preview"]'))
      .toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await source.getByRole('button', { name: 'Apply 3:4 crop' }).click();
    const originalPhoto = source.locator('#resume-print-content img[alt="Resume portrait"]');
    await expect(originalPhoto).toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    const photoDataUrl = await originalPhoto.getAttribute('src');

    await source.getByRole('button', { name: /^(Markdown source editor|Markdown 源码编辑模式)$/ }).click();
    const fictionalMarkdown = '# Fictional Migration Candidate\n\n## Experience\nNo real personal data';
    await source.locator('#markdown-textarea').fill(fictionalMarkdown);
    await expect.poll(() => readActiveMarkdown(source)).toBe(fictionalMarkdown);
    await expect.poll(() => readActiveMarkdown(destination)).not.toBe(fictionalMarkdown);

    const originalDestination = await readActiveMarkdown(destination);
    const oldModal = await openBackup(source);
    const [download] = await Promise.all([
      source.waitForEvent('download'),
      oldModal.getByRole('button', { name: 'Export workspace .json' }).click(),
    ]);
    const backupText = await readFile(await download.path()!, 'utf8');
    const backup = JSON.parse(backupText);
    expect(backup.version).toBe('pagevela-workspace-v1');
    const photographed = backup.profiles.find((p: { id: string }) => p.id === backup.activeProfileId);
    expect(photographed.photoDataUrl).toBe(photoDataUrl);

    const second = {
      ...photographed, id: 'rebrand_test_plain', name: 'Second fictional resume',
      markdown: '# Second fictional profile', photoDataUrl: undefined,
      settings: { ...photographed.settings, showPhoto: false },
    };
    const importData = {
      ...backup,
      profiles: [...backup.profiles, second],
      drafts: [{
        id: 'rebrand_test_draft', title: 'Fictional history',
        markdown: '# Fictional saved draft', settings: photographed.settings,
        timestamp: '2026-10-15',
      }],
      jdText: 'Fictional engineering job description',
    };
    const destModal = await openBackup(destination);
    const input = destModal.locator('input[aria-label="Choose workspace backup file"]');
    const file = {
      name: 'fictional-rebrand-rehearsal.json', mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(importData)),
    };
    await input.setInputFiles(file);
    const approval = destination.getByRole('dialog', { name: 'Replace all local resumes?' });
    await approval.getByRole('button', { name: 'Cancel', exact: true }).last().click();
    expect(await readActiveMarkdown(destination)).toBe(originalDestination);

    await input.setInputFiles(file);
    await approval.getByRole('button', { name: 'Replace workspace' }).click();
    await expect.poll(() => readActiveMarkdown(destination)).toBe(fictionalMarkdown);
    await expect(destination.locator('#resume-print-content img[alt="Resume portrait"]'))
      .toHaveAttribute('src', photoDataUrl!);
    await destination.reload();
    await expect.poll(() => readActiveMarkdown(destination)).toBe(fictionalMarkdown);
    const restoredProfiles = await readProfiles(destination);
    expect(restoredProfiles.some(p => p.id === second.id)).toBe(true);
    expect(restoredProfiles.length).toBe(importData.profiles.length);

    // Prove that migration did not clear or redirect the old site's data.
    await source.reload();
    expect(new URL(source.url()).origin).toBe(sourceURL.origin);
    await expect.poll(() => readActiveMarkdown(source)).toBe(fictionalMarkdown);

    const restored = await destination.evaluate(() => new Promise<{
      jdText: string | null; draftMarkdown: string | null; secondPhoto?: string;
    }>((resolve, reject) => {
      const request = indexedDB.open('resume-craft');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(['documents', 'drafts', 'profiles'], 'readonly');
        const jd = tx.objectStore('documents').get('jd');
        const drafts = tx.objectStore('drafts').get('rebrand_test_draft');
        const secondProfile = tx.objectStore('profiles').get('rebrand_test_plain');
        tx.onerror = () => { db.close(); reject(tx.error); };
        tx.oncomplete = () => {
          db.close();
          resolve({
            jdText: (jd.result as { markdown?: string } | undefined)?.markdown ?? null,
            draftMarkdown: (drafts.result as { markdown?: string } | undefined)?.markdown ?? null,
            secondPhoto: (secondProfile.result as { photoDataUrl?: string } | undefined)?.photoDataUrl,
          });
        };
      };
    }));
    expect(restored.jdText).toBe('Fictional engineering job description');
    expect(restored.draftMarkdown).toBe('# Fictional saved draft');
    expect(restored.secondPhoto).toBeUndefined();
  } finally {
    await context.close();
  }
});
