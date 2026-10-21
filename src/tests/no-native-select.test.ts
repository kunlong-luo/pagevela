import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import ts from 'typescript';

function sourceFiles(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const path = join(root, entry.name);
    return entry.isDirectory()
      ? sourceFiles(path)
      : entry.name.endsWith('.tsx') ? [path] : [];
  });
}

describe('design system: no native HTML select dropdowns', () => {
  it('uses the branded CustomSelect component instead of the browser dropdown', () => {
    const offending: string[] = [];
    const files = sourceFiles('src/components');
    for (const path of files) {
      const source = ts.createSourceFile(
        path, readFileSync(path, 'utf8'),
        ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX,
      );
      const visit = (node: ts.Node) => {
        if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
            node.tagName.getText(source) === 'select') {
          const location = source.getLineAndCharacterOfPosition(node.getStart(source));
          offending.push(`${relative('.', path)}:${location.line + 1}`);
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    expect(files.length).toBeGreaterThan(30);
    expect(offending, 'Replace native <select> with CustomSelect without removing options').toEqual([]);
  });
});
