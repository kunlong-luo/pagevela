import { describe, expect, it } from 'vitest';
import { zh } from '../i18n/locales/zh';
import { en } from '../i18n/locales/en';

function leafPaths(value: unknown, prefix = ''): Array<{ path: string; kind: string; value: unknown }> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, next]) =>
      leafPaths(next, prefix ? `${prefix}.${key}` : key));
  }
  return [{ path: prefix, kind: typeof value, value }];
}

describe('complete bilingual dictionary contract', () => {
  it('contains exactly the same leaf keys and value types for both UI languages', () => {
    const zhLeaves = leafPaths(zh).map(({ path, kind }) => `${path}:${kind}`).sort();
    const enLeaves = leafPaths(en).map(({ path, kind }) => `${path}:${kind}`).sort();
    expect(enLeaves).toEqual(zhLeaves);
  });

  it.each([['Chinese', zh], ['English', en]] as const)(
    '%s dictionary has no missing, undefined, or blank messages',
    (_name, dictionary) => {
      const leaves = leafPaths(dictionary);
      expect(leaves.length).toBeGreaterThan(50);
      const bad = leaves.filter(({ kind, value }) =>
        kind === 'undefined' || kind === 'object' ||
        (kind === 'string' && !(value as string).trim()));
      expect(bad.map(x => x.path)).toEqual([]);
    },
  );

  it('generates language-specific messages for dynamic confirmation copy', () => {
    expect(en.form.dialogs.deleteSecMsg('Projects')).toContain('Projects');
    expect(zh.form.dialogs.deleteSecMsg('项目经历')).toContain('项目经历');
    expect(en.form.dialogs.deleteItemMsg('Example')).toContain('Example');
    expect(zh.form.dialogs.deleteItemMsg('示例')).toContain('示例');
    expect(en.form.dialogs.deleteSecMsg('Section')).not.toMatch(/[\u3400-\u9fff]/u);
  });
});
