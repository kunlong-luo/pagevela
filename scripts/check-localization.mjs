/**
 * Protect new UI strings from silently bypassing the language switch.
 *
 * This is intentionally a *static-literal* guard, not a completeness score.
 * Contextual JSX expressions (e.g. isEn ? ... : ...) and user-supplied resume
 * content cannot be judged from source text alone. Those are covered by i18n
 * contract tests and bilingual E2E scenarios.
 *
 * Run: pnpm i18n:audit
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';

const names = new Set(['aria-label', 'aria-description', 'placeholder', 'title', 'alt']);
const uiRoot = 'src/components';
const allowedNeutralText = new Set([
  'ATS PDF', 'PDF', 'A4', 'US Letter', 'Pagevela', 'GitHub', 'Markdown',
  'JSON', 'STAR', 'HEX', 'URL', 'QR', 'OK', 'X',
]);

function uiFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? uiFiles(full) : entry.name.endsWith('.tsx') ? [full] : [];
  });
}

function isHumanLanguageText(value) {
  const trimmed = value.trim();
  if (!trimmed || allowedNeutralText.has(trimmed)) return false;
  if (/^(?:https?:\/\/|mailto:|data:|#|\/)/i.test(trimmed)) return false;
  if (/^[\d\s+@.\-/:*_()[\]{}%|]+$/.test(trimmed)) return false;
  // Includes CJK and readable words, but not symbols or numeric placeholders.
  return /[\p{Script=Han}]|[A-Za-z]{3,}/u.test(trimmed);
}

const errors = [];
let inspected = 0;
for (const filename of uiFiles(uiRoot)) {
  const text = readFileSync(filename, 'utf8');
  const root = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  inspected += 1;
  const visit = node => {
    if (ts.isJsxAttribute(node) && names.has(node.name.getText(root)) &&
        node.initializer && ts.isStringLiteral(node.initializer) &&
        isHumanLanguageText(node.initializer.text)) {
      const pos = root.getLineAndCharacterOfPosition(node.getStart(root));
      errors.push(`${relative('.', filename)}:${pos.line + 1}: ${node.name.getText(root)}="${node.initializer.text}" is not locale-aware`);
    }
    ts.forEachChild(node, visit);
  };
  visit(root);
}

if (errors.length) {
  console.error('Localization audit failed: hard-coded visible/accessibility attributes:');
  for (const error of errors) console.error('  ' + error);
  console.error('Use a locale-dependent JSX expression or a language dictionary key. Do not remove the control.');
  process.exitCode = 1;
} else {
  console.log(`Localization audit OK: scanned ${inspected} UI components for literal labels, tooltips and placeholders.`);
}
