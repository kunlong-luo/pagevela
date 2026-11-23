// Verify the shipped Workbox service worker, not Vite's development server.
// This smoke intentionally uses the production build and a fresh browser profile.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const origin = 'http://127.0.0.1:4173';
const requiredFiles = ['dist/index.html', 'dist/manifest.webmanifest', 'dist/sw.js'];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    throw new Error(`Missing production PWA asset: ${file}; run pnpm build first`);
  }
}

const preview = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js',
  'preview',
  '--host', '127.0.0.1',
  '--port', '4173',
  '--strictPort',
], { stdio: ['ignore', 'pipe', 'pipe'] });

let previewOutput = '';
for (const stream of [preview.stdout, preview.stderr]) {
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    previewOutput += chunk;
  });
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (preview.exitCode !== null) {
      throw new Error(`Vite preview exited early: ${previewOutput}`);
    }
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // Preview process is still starting.
    }
    await delay(250);
  }
  throw new Error(`Vite preview did not start: ${previewOutput}`);
}

let browser;
try {
  await waitForPreview();
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ serviceWorkers: 'allow' });
  const page = await context.newPage();

  await page.goto(`${origin}/?page=editor`, { waitUntil: 'load' });
  await page.locator('#editor-pane').waitFor({ state: 'visible', timeout: 30_000 });

  await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers are unavailable in production preview');
    }
    await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(
        () => reject(new Error('Production service worker did not activate')),
        20_000,
      )),
    ]);
  });

  // After activation a second navigation must be controlled by the real SW.
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(
    () => navigator.serviceWorker.controller !== null,
    null,
    { timeout: 20_000 },
  );

  const precacheNames = await page.evaluate(() => caches.keys());
  if (!precacheNames.some((name) => name.includes('precache'))) {
    throw new Error(`No Workbox precache found: ${precacheNames.join(', ')}`);
  }

  // A new URL prevents a false positive from an already rendered offline page.
  await context.setOffline(true);
  await page.goto(`${origin}/?page=editor&pwa-offline-smoke=1`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await page.locator('#editor-pane').waitFor({ state: 'visible', timeout: 30_000 });

  console.log('PASS: production PWA worker controls the page and editor loads after an offline navigation');
  await context.close();
} finally {
  await browser?.close();
  preview.kill('SIGTERM');
}
