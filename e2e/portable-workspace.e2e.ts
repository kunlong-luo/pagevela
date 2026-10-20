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
  // IndexedDB can become readable before the lazy editor/header has mounted
  // and registered the backup custom-event listener. Await the real editor.
  await expect(page.locator('#editor-pane')).toBeVisible();
  await expect(page.locator('#resume-main-toolbar')).toBeVisible();
  await page.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
  const modal = page.getByRole('dialog', { name: 'Resume Management' });
  await expect(modal).toBeVisible();
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
  // A pending setting from the destination's old profile must never leak
  // into a newly imported workspace (even when profile IDs are reused).
  await page.evaluate(() => {
    const id = localStorage.getItem('resume-active-profile-id');
    const settings = JSON.parse(localStorage.getItem('resume-settings') || '{}');
    if (!id) throw new Error('Missing source active profile');
    localStorage.setItem('resume-profile-settings-pending-v1', JSON.stringify({
      [id]: { settings: { ...settings, marketRegion: 'uk', paperSize: 'letter' },
        updatedAt: new Date(Date.now() + 60_000).toISOString() },
    }));
  });
  await picker.setInputFiles(fixture);
  const confirmation = page.getByRole('dialog', { name: 'Replace all local resumes?' });
  await confirmation.getByRole('button', { name: 'Cancel', exact: true }).last().click();
  expect((await readProfiles(page)).length).toBe(count);
  expect(await page.evaluate(() => localStorage.getItem('resume-profile-settings-pending-v1')))
    .not.toBeNull();

  await picker.setInputFiles(fixture);
  await confirmation.getByRole('button', { name: 'Replace workspace' }).click();
  await expect.poll(() => readActiveMarkdown(page)).toBe('# Restored workspace');
  expect(await page.evaluate(() => localStorage.getItem('resume-profile-settings-pending-v1')))
    .toBeNull();
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


const TRANSFER_PHOTO_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAFElEQVR4nGMU2XKHARtgwio6aCUASycBtDR93bkAAAAASUVORK5CYII=',
  'base64',
);

test('locally cropped portrait stays on its own profile across a workspace transfer', async ({ browser }) => {
  test.setTimeout(60_000);
  const oldContext = await browser.newContext({ acceptDownloads: true });
  const newContext = await browser.newContext({ acceptDownloads: true });
  try {
    const source = await oldContext.newPage();
    const destination = await newContext.newPage();
    for (const page of [source, destination]) {
      await page.addInitScript(() => {
        localStorage.setItem('resume-onboarding-v1-complete', '1');
        localStorage.setItem('resume_ui_language', 'zh');
        localStorage.setItem('resume-settings', JSON.stringify({
          lang: 'zh',
          marketRegion: 'cn',
          paperSize: 'a4',
        }));
      });
      await page.goto('http://127.0.0.1:3000/?page=editor');
      await expect.poll(() => readActiveMarkdown(page)).not.toBeNull();
    }

    await source.locator('input[aria-label="选择简历证件照"]').setInputFiles({
      name: 'portrait.png', mimeType: 'image/png', buffer: TRANSFER_PHOTO_PNG,
    });
    await expect(source.locator('img[alt="简历证件照预览"]'))
      .toHaveAttribute('src', /^data:image\/jpeg;base64,/);
    await source.getByRole('button', { name: '应用 3:4 裁剪' }).click();
    const originalPortrait = source.locator('#resume-print-content img[alt="简历证件照"]');
    await expect(originalPortrait).toHaveCount(1);
    const portraitSrc = await originalPortrait.getAttribute('src');

    await source.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
    const oldModal = source.getByRole('dialog', { name: '简历管理' });
    await oldModal.getByRole('button', { name: '备份', exact: true }).click();
    const [download] = await Promise.all([
      source.waitForEvent('download'),
      oldModal.getByRole('button', { name: '导出工作区 .json' }).click(),
    ]);
    const backup = JSON.parse(await readFile(await download.path()!, 'utf8'));
    const photographedProfile = backup.profiles.find((p: { id: string }) => p.id === backup.activeProfileId);
    expect(photographedProfile.photoDataUrl).toBe(portraitSrc);
    expect(backup.profiles.filter((p: { photoDataUrl?: string }) => Boolean(p.photoDataUrl)))
      .toHaveLength(1);

    // A second profile must remain photo-free after replacing the destination workspace.
    const plainProfile = {
      ...photographedProfile,
      id: 'portable_profile_without_photo',
      name: 'No portrait profile',
      photoDataUrl: undefined,
      settings: { ...photographedProfile.settings, showPhoto: false },
    };
    const transfer = { ...backup, profiles: [...backup.profiles, plainProfile] };

    await destination.evaluate(() => window.dispatchEvent(new Event('resume-craft:open-backup')));
    const newModal = destination.getByRole('dialog', { name: '简历管理' });
    await newModal.getByRole('button', { name: '备份', exact: true }).click();
    await newModal.locator('input[aria-label="选择工作区备份文件"]').setInputFiles({
      name: 'photo-transfer.json', mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(transfer)),
    });
    const approve = destination.getByRole('dialog', { name: '覆盖全部本地简历？' });
    await approve.getByRole('button', { name: '确认覆盖工作区' }).click();

    const restoredPortrait = destination.locator('#resume-print-content img[alt="简历证件照"]');
    await expect(restoredPortrait).toHaveAttribute('src', portraitSrc!);
    await destination.reload();
    await expect(restoredPortrait).toHaveAttribute('src', portraitSrc!);
    expect((await readProfiles(destination)).length).toBe(transfer.profiles.length);
    const restored = await destination.evaluate(() => new Promise<Array<{ id: string; photoDataUrl?: string }>>((resolve, reject) => {
      const request = indexedDB.open('resume-craft');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction('profiles', 'readonly');
        const getAll = transaction.objectStore('profiles').getAll();
        transaction.onerror = () => { db.close(); reject(transaction.error); };
        transaction.oncomplete = () => {
          db.close();
          resolve((getAll.result ?? []) as Array<{ id: string; photoDataUrl?: string }>);
        };
      };
    }));
    expect(restored.find(profile => profile.id === backup.activeProfileId)?.photoDataUrl).toBe(portraitSrc);
    expect(restored.find(profile => profile.id === plainProfile.id)?.photoDataUrl).toBeUndefined();
    expect(restored.filter(profile => Boolean(profile.photoDataUrl))).toHaveLength(1);
  } finally {
    await oldContext.close();
    await newContext.close();
  }
});


test('same browser keeps data isolated across hostnames until an explicit workspace import', async ({ browser }) => {
  test.setTimeout(60_000);
  const context = await browser.newContext({ acceptDownloads: true });
  try {
    await context.addInitScript(() => {
      localStorage.setItem('resume-onboarding-v1-complete', '1');
      localStorage.setItem('resume_ui_language', 'en');
    });
    // Both hostnames resolve to the same test server, but browsers assign
    // separate IndexedDB/localStorage namespaces based on the origin hostname.
    const oldSite = await context.newPage();
    const newSite = await context.newPage();
    await oldSite.goto('http://127.0.0.1:3000/?page=editor');
    await newSite.goto('http://localhost:3000/?page=editor');
    await expect.poll(() => readActiveMarkdown(oldSite)).not.toBeNull();
    await expect.poll(() => readActiveMarkdown(newSite)).not.toBeNull();

    const oldOrigin = await oldSite.evaluate(() => location.origin);
    const newOrigin = await newSite.evaluate(() => location.origin);
    expect(oldOrigin).not.toBe(newOrigin);

    await oldSite.getByRole('button', { name: /^(Markdown source editor|Markdown 源码编辑模式)$/ }).click();
    await oldSite.locator('#markdown-textarea').fill('# Source isolated by hostname');
    await expect.poll(() => readActiveMarkdown(oldSite)).toBe('# Source isolated by hostname');
    await expect.poll(() => readActiveMarkdown(newSite)).not.toBe('# Source isolated by hostname');

    await oldSite.evaluate(() => dispatchEvent(new Event('resume-craft:open-backup')));
    const sourceHub = oldSite.getByRole('dialog', { name: 'Resume Management' });
    await sourceHub.getByRole('button', { name: 'Backup', exact: true }).click();
    const [download] = await Promise.all([
      oldSite.waitForEvent('download'),
      sourceHub.getByRole('button', { name: 'Export workspace .json' }).click(),
    ]);
    const backup = await readFile(await download.path()!, 'utf8');
    expect(JSON.parse(backup).version).toBe('resume-craft-workspace-v1');

    await newSite.evaluate(() => dispatchEvent(new Event('resume-craft:open-backup')));
    const destinationHub = newSite.getByRole('dialog', { name: 'Resume Management' });
    await destinationHub.getByRole('button', { name: 'Backup', exact: true }).click();
    await destinationHub.locator('input[aria-label="Choose workspace backup file"]').setInputFiles({
      name: 'cross-origin-backup.json', mimeType: 'application/json',
      buffer: Buffer.from(backup),
    });
    const approval = newSite.getByRole('dialog', { name: 'Replace all local resumes?' });
    await approval.getByRole('button', { name: 'Replace workspace' }).click();
    await expect.poll(() => readActiveMarkdown(newSite)).toBe('# Source isolated by hostname');

    await newSite.reload();
    await expect.poll(() => readActiveMarkdown(newSite)).toBe('# Source isolated by hostname');
    await oldSite.reload();
    await expect.poll(() => readActiveMarkdown(oldSite)).toBe('# Source isolated by hostname');
  } finally {
    await context.close();
  }
});
