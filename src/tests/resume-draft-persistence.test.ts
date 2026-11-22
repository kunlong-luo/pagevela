import { describe, expect, it, vi } from 'vitest';
import type { ResumeDraft, ResumeSettings } from '../types';
import { createDraftHistoryPersistenceCoordinator } from '../lib/resume-draft-persistence';
import { preparePeriodicDraftHistory } from '../hooks/usePeriodicDraftHistory';

const settings = {
  themeColor: 'indigo', fontSize: 'standard', fontFamily: 'sans',
  margin: 'standard', layoutMode: 'split', h2Style: 'accent-line',
  topAccentLine: true, lineHeight: 1.6, blockGap: 1,
  letterSpacing: 0, showPageBreakLine: true, templateLayout: 'single',
} as const satisfies ResumeSettings;

const draft = (id: string, isAutoSave = false): ResumeDraft => ({
  id, title: id, markdown: id, settings, timestamp: '2026-11-22',
  isAutoSave,
});

function memoryCoordinator(initial: ResumeDraft[] = []) {
  let stored = [...initial];
  let lockCalls = 0;
  const withWriteLock = async <T>(work: () => Promise<T>): Promise<T> => {
    lockCalls += 1;
    return work();
  };
  const mutateDrafts = vi.fn(async (change: (current: ResumeDraft[]) => ResumeDraft[] | null) => {
    const next = change([...stored]);
    if (next) stored = next;
    return [...stored];
  });
  const coordinator = createDraftHistoryPersistenceCoordinator({
    mutateDrafts,
    readDrafts: async () => [...stored],
    withWriteLock,
  });
  return {
    coordinator, getLockCalls: () => lockCalls, mutateDrafts,
    stored: () => [...stored],
    restoreDirectly: (drafts: ResumeDraft[]) => { stored = [...drafts]; },
  };
}

describe('draft history persistence coordinator', () => {
  it('preserves a manual draft while a queued automatic snapshot rotates history', async () => {
    const { coordinator, stored, getLockCalls } = memoryCoordinator([draft('old-auto', true)]);
    const manual = coordinator.update(current => [draft('manual'), ...current]);
    const periodic = coordinator.update(current => preparePeriodicDraftHistory(current, {
      markdown: 'new-auto', settings, currentTemplateId: 'custom', uiLanguage: 'en',
    }, new Date('2026-11-22T00:00:00Z')));
    await Promise.all([manual, periodic]);
    expect(stored().map(d => d.markdown)).toEqual(['new-auto', 'old-auto', 'manual']);
    expect(getLockCalls()).toBe(2);
    expect((await coordinator.read()).map(d => d.id)).toEqual(stored().map(d => d.id));
  });

  it('does not resurrect deleted drafts or discard a rename during timer rotation', async () => {
    const { coordinator, stored } = memoryCoordinator([draft('one'), draft('two'), draft('old', true)]);
    await Promise.all([
      coordinator.update(current => current.map(d => d.id === 'one' ? { ...d, title: 'renamed' } : d)),
      coordinator.update(current => current.filter(d => d.id !== 'two')),
      coordinator.update(current => preparePeriodicDraftHistory(current, {
        markdown: 'new', settings, currentTemplateId: 'custom', uiLanguage: 'en',
      }, new Date('2026-11-22T00:00:00Z'))),
    ]);
    expect(stored().find(d => d.id === 'one')?.title).toBe('renamed');
    expect(stored().some(d => d.id === 'two')).toBe(false);
    expect(stored().map(d => d.markdown)).toEqual(['new', 'old', 'one']);
  });

  it('blocks periodic mutations until the imported workspace has been committed', async () => {
    const { coordinator, stored, restoreDirectly } = memoryCoordinator([draft('pre-import')]);
    let releaseRestore: (() => void) | undefined;
    let restoreStarted = false;
    const restore = coordinator.exclusive(async () => {
      restoreStarted = true;
      await new Promise<void>(resolve => { releaseRestore = resolve; });
      restoreDirectly([draft('restored')]);
    });
    const tick = coordinator.update(current => [draft('post-import-tick'), ...current]);
    await vi.waitFor(() => expect(restoreStarted).toBe(true));
    expect(stored().map(d => d.id)).toEqual(['pre-import']);
    releaseRestore?.();
    await Promise.all([restore, tick]);
    expect(stored().map(d => d.id)).toEqual(['post-import-tick', 'restored']);
  });

  it('does not notify a successful-save listener after a failed write, and later writes recover', async () => {
    let stored: ResumeDraft[] = [];
    let attempts = 0;
    const listener = vi.fn();
    const coordinator = createDraftHistoryPersistenceCoordinator({
      mutateDrafts: async (change) => {
        if (++attempts === 1) throw new Error('temporary failure');
        const next = change(stored);
        if (next) stored = next;
        return stored;
      },
      readDrafts: async () => stored,
      withWriteLock: async action => action(),
    });
    coordinator.subscribe(listener);
    await expect(coordinator.update(drafts => [draft('failed'), ...drafts])).rejects.toThrow('temporary failure');
    expect(listener).not.toHaveBeenCalled();
    await expect(coordinator.update(drafts => [draft('saved'), ...drafts])).resolves.toHaveLength(1);
    expect(stored.map(d => d.id)).toEqual(['saved']);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('queues reads after preceding commits and keeps manual changes unchanged on a no-op', async () => {
    const { coordinator, stored } = memoryCoordinator([draft('original')]);
    const first = coordinator.update(drafts => [draft('next'), ...drafts]);
    const read = coordinator.read();
    const noop = coordinator.update(() => null);
    expect((await read).map(d => d.id)).toEqual(['next', 'original']);
    await Promise.all([first, noop]);
    expect(stored().map(d => d.id)).toEqual(['next', 'original']);
  });
});
