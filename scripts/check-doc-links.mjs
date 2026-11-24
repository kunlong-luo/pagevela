#!/usr/bin/env node
/**
 * Verify local Markdown/HTML file links without network requests.
 * Intentionally skips remote URLs, fragment-only links and fenced examples.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const entryPoints = [
  'README.md', 'README.zh-CN.md', 'CHANGELOG.md', 'RELEASE_NOTES.md',
  'RELEASING.md', 'CONTRIBUTING.md', 'PROMOTION.md',
  'SECURITY.md', 'SUPPORT.md', 'CODE_OF_CONDUCT.md',
];
function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(path);
    return entry.isFile() && path.endsWith('.md') ? [path] : [];
  });
}
const files = [...entryPoints.map((p) => resolve(root, p)), ...markdownFiles(resolve(root, 'docs'))];
const failures = [];
let checked = 0;

function check(source, line, rawHref) {
  const href = rawHref.trim().replace(/^<|>$/g, '');
  if (!href || href.startsWith('#') || href.startsWith('//') ||
      /^[a-z][a-z\d+.-]*:/i.test(href)) return;
  const location = href.split(/[?#]/, 1)[0];
  if (!location) return;
  let target;
  try {
    target = resolve(dirname(source), decodeURIComponent(location));
  } catch {
    failures.push(`${relative(root, source)}:${line}: malformed encoded link ${href}`);
    return;
  }
  checked++;
  const rel = relative(root, target);
  if (rel === '..' || rel.startsWith(`..${sep}`) || !existsSync(target)) {
    failures.push(`${relative(root, source)}:${line}: missing link target ${href}`);
  }
}
for (const file of files) {
  if (!existsSync(file)) {
    failures.push(`missing entry point ${relative(root, file)}`);
    continue;
  }
  let fence = null;
  for (const [index, line] of readFileSync(file, 'utf8').split(/\r?\n/).entries()) {
    const marker = line.match(/^\s*(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1][0];
      else if (fence === marker[1][0]) fence = null;
      continue;
    }
    if (fence) continue;
    const markdownLinks = /!?\[[^\]\n]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/g;
    for (const match of line.matchAll(markdownLinks)) check(file, index + 1, match[1] ?? match[2]);
    const htmlLinks = /\b(?:href|src)=["']([^"']+)["']/g;
    for (const match of line.matchAll(htmlLinks)) check(file, index + 1, match[1]);
  }
}
if (failures.length) {
  console.error(`Documentation links FAILED: ${failures.length} missing of ${checked} local links.`);
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Documentation links OK: ${files.length} Markdown documents, ${checked} local links.`);
}
