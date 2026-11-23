// Fail the build gate when Workbox silently emits an empty app-shell precache.
// Vite/Workbox may return success with only icon entries when glob semantics regress.
import { readFileSync } from 'node:fs';

const sw = readFileSync('dist/sw.js', 'utf8');
const hasIndex = sw.includes('index.html');
const assetMatches = [...sw.matchAll(/(?:\.?\/)?assets\/[^"'\s,)}]+\.(?:js|css)/g)].map(([match]) => match);
const uniqueAssets = [...new Set(assetMatches)];

if (!hasIndex || uniqueAssets.length < 2) {
  throw new Error(
    'Production PWA precache is missing index.html or compiled app assets. ' +
    'Workbox may have matched zero files. Do not publish an offline-broken worker. ' +
    `index.html=${hasIndex}; assetMatches=${uniqueAssets.length}`,
  );
}

console.log(`PASS: Workbox precaches index.html and ${uniqueAssets.length} compiled app assets`);
