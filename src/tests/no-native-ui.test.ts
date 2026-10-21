import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import ts from 'typescript';

function components(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = join(dir, entry.name);
    return entry.isDirectory() ? components(file) : entry.name.endsWith('.tsx') ? [file] : [];
  });
}

describe('design system: no browser-native visible controls or tooltip bubbles', () => {
  it('enforces branded tooltips, dialogs, dropdowns, range controls and scrollbars', () => {
    const errors: string[] = [];
    const paths = components('src/components');
    for (const path of paths) {
      const code = readFileSync(path, 'utf8');
      const source = ts.createSourceFile(path, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const error = (node: ts.Node, reason: string) => {
        const pos = source.getLineAndCharacterOfPosition(node.getStart(source));
        errors.push(`${relative('.', path)}:${pos.line + 1} ${reason}`);
      };
      const visit = (node: ts.Node) => {
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tag = node.tagName.getText(source);
          if (['select', 'details', 'summary'].includes(tag)) {
            error(node, `replace native <${tag}> with a project component`);
          }
          const attrs = node.attributes.properties.filter(ts.isJsxAttribute);
          const attr = (name: string) => attrs.find(item => item.name.getText(source) === name);
          if (/^[a-z]/.test(tag) && attr('title')) {
            error(attr('title')!, 'replace browser title tooltip with Tooltip or aria-label');
          }
          if (tag === 'input') {
            const type = attr('type')?.initializer;
            if (type && ts.isStringLiteral(type) && ['color', 'range', 'checkbox'].includes(type.text)) {
              error(node, `replace native ${type.text} with branded control`);
            }
          }
          const classes = attr('className')?.initializer?.getText(source) ?? '';
          if (/\b(?:overflow-y-auto|overflow-y-scroll|overflow-auto)\b/.test(classes) &&
              !/(?:workspace-scrollbar|scrollbar-thin|scrollbar-capsule|scrollbar-none)/.test(classes)) {
            error(node, 'scrollable UI missing branded scrollbar class');
          }
        }
        if (ts.isCallExpression(node)) {
          const target = node.expression.getText(source);
          if (/^(?:window\.|globalThis\.)?(?:alert|prompt|confirm)$/.test(target) &&
              !(target === 'confirm' && /useConfirm\s*\(/.test(code))) {
            error(node, 'replace native dialog with project confirmation UI');
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    expect(paths.length).toBeGreaterThan(50);
    expect(errors, 'Do not introduce browser-native popups, dropdowns, sliders or default scrollbars').toEqual([]);
  });
});
