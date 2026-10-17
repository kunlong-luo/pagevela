import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The npm package version drives the runtime version (via Vite) and all active
// release/marketing headings. Historical release notes intentionally keep
// references to their own older versions.
function read(path: string): string {
  return readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
}

describe('public version consistency', () => {
  const { version } = JSON.parse(read('package.json')) as { version: string };

  it('uses the package version for the runtime value instead of a hard-coded string', () => {
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(read('vite.config.ts')).toContain('__APP_VERSION__: JSON.stringify(packageJson.version)');
    expect(read('src/lib/app-version.ts')).toContain('APP_VERSION = __APP_VERSION__');
  });

  it('keeps all active English/Chinese release headings aligned', () => {
    expect(read('README.md')).toContain(`## 🆕 What's New in v${version}`);
    expect(read('README.zh-CN.md')).toContain(`## 🆕 v${version} 更新`);
    expect(read('RELEASE_NOTES.md')).toMatch(new RegExp(`^# Pagevela v${version.replaceAll('.', '\\.')}\\n`));
    expect(read('PROMOTION.md')).toContain('# Resume Craft v2.6.0 Promotion Playbook');
    expect(read('PROMOTION.md')).toContain('Historical planning document:');
    expect(read('RELEASE_NOTES.md')).toContain(`releases/tag/v${version}`);
  });
});
