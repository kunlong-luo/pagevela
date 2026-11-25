import { expect, test } from '@playwright/test';
import { readActiveMarkdown } from './helpers/indexeddb';

test('template deep links are consumed once and editing survives reload', async ({ page }) => {
  await page.goto('/?page=editor&template=ai_backend');
  await expect(page).not.toHaveURL(/template=/);
  await expect(page.locator('#editor-pane')).toBeVisible();
  await expect.poll(() => readActiveMarkdown(page)).toContain('钟晨杰');

  await page.getByRole('button', {
    name: /Markdown source editor|Markdown 源码编辑模式/,
  }).click();
  await page.locator('#markdown-textarea').fill(
    '# My Carefully Edited Resume\n\n## Projects\n\n- Keep this after reload.',
  );
  await expect.poll(() => readActiveMarkdown(page)).toContain('Keep this after reload.');
  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toContain('Keep this after reload.');
  await expect(page).not.toHaveURL(/template=/);
});

test('a template link cannot overwrite an existing resume without consent', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume-markdown', '# Saved User Resume\n\nUnique professional history.');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
  });
  await page.goto('/?page=editor&template=ai_backend');

  const dialog = page.getByRole('dialog', {
    name: /Replace active resume\?|替换当前简历？/,
  });
  await expect(dialog).toBeVisible();
  await expect(page).not.toHaveURL(/template=/);
  await expect.poll(() => readActiveMarkdown(page)).toContain('Unique professional history.');
  await dialog.getByRole('button', { name: /Keep current resume|保留当前简历/ }).last().click();
  await expect.poll(() => readActiveMarkdown(page)).toContain('Unique professional history.');
  await page.reload();
  await expect.poll(() => readActiveMarkdown(page)).toContain('Unique professional history.');
});

test('importing a new resume requires consent and saves a recovery draft first', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('resume_ui_language', 'en');
    localStorage.setItem('resume-onboarding-v1-complete', '1');
    localStorage.setItem('resume-markdown', '# Prior Resume\n\nKeep these hard-earned results.');
  });
  await page.goto('/?page=editor');
  await expect.poll(() => readActiveMarkdown(page)).toContain('Keep these hard-earned results.');

  await page.getByRole('button', { name: 'More actions' }).click();
  await page.getByRole('button', { name: 'Import', exact: true }).click();
  const modal = page.getByRole('dialog', { name: /Import Resume/ });
  await modal.getByRole('button', { name: /Smart Paste Text/ }).click();
  await modal.locator('textarea').fill(
    'Jane Doe\njane@example.com\nSoftware Engineer\nExperience\nCompany A 2024\n- Built new APIs.',
  );
  await modal.getByRole('button', { name: /Parse & Apply/ }).click();

  const confirm = page.getByRole('dialog', { name: 'Replace active resume?' });
  await expect(confirm).toBeVisible();
  await expect.poll(() => readActiveMarkdown(page)).toContain('Keep these hard-earned results.');
  await confirm.getByRole('button', { name: 'Save recovery draft and import' }).click();

  await expect.poll(() => readActiveMarkdown(page)).toContain('Jane Doe');
  await expect.poll(() => page.evaluate(() => new Promise<string[]>((resolve, reject) => {
    const request = indexedDB.open('resume-craft');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('drafts', 'readonly');
      const drafts = tx.objectStore('drafts').getAll();
      tx.onerror = () => reject(tx.error);
      tx.oncomplete = () => {
        resolve((drafts.result as Array<{ markdown: string }>).map(draft => draft.markdown));
        db.close();
      };
    };
  }))).toEqual(expect.arrayContaining([expect.stringContaining('Keep these hard-earned results.')]));
});
