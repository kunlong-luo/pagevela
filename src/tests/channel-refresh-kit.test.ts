import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../../docs/channel-refresh/', import.meta.url);
const app = 'https://kunlong-luo.github.io/pagevela/';
const repo = 'https://github.com/kunlong-luo/pagevela';
const read = (p: string) => readFileSync(new URL(p, root), 'utf8');

describe('Pagevela channel refresh kit', () => {
  it('provides one platform file per tracker row with current links and non-publication disclaimer', () => {
    const rows = read('TRACKER.csv').trim().split('\n').slice(1);
    const files = readdirSync(new URL('platforms/', root)).filter(x => x !== '99-other-platforms.md');
    expect(rows).toHaveLength(26);
    expect(files).toHaveLength(rows.length);
    for (const file of files) {
      const text = read('platforms/' + file);
      expect(text, file).toContain(app);
      expect(text, file).toContain(repo);
      expect(text, file).toContain('尚未发布到该平台');
      expect(text, file).toContain('## 可复制内容');
      expect(text, file).not.toContain('Live app: https://kunlong-luo.github.io/resume-craft/');
    }
  });

  it('clearly distinguishes verified pages from unknown account ownership', () => {
    const intro = read('README.md');
    expect(intro).toContain('作者账号归属待确认');
    expect(intro).toContain('第三方收录');
    expect(intro).toContain('未确认发布记录');
    expect(intro).toContain('ref=producthunt');
    expect(read('ASSETS.md')).toContain('真实产品截图');
    expect(read('FAQ_AND_REPLIES.md')).toContain('不保证');
  });

  it('includes a reusable fallback for unlisted platforms', () => {
    expect(read('platforms/99-other-platforms.md')).toContain(app);
    expect(read('platforms/99-other-platforms.md')).toContain(repo);
  });
});
