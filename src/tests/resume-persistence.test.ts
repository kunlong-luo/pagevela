import { afterEach, describe, expect, it, vi } from 'vitest';
import { createResumePersistenceCoordinator, type PersistedResumeSnapshot } from '../lib/resume-persistence';
import { RESUME_DB_NAME, RESUME_DB_WRITE_LOCK_NAME, RESUME_TABS_CHANNEL_NAME } from '../lib/resume-storage-contract';

const snapshot = (markdown: string): PersistedResumeSnapshot => ({
  markdown,
  profiles: [],
  jdText: '',
});

afterEach(() => {
  vi.useRealTimers();
});

describe('resume persistence write coordinator', () => {
  it('commits an immediate manual save once instead of replaying a pending autosave', async () => {
    vi.useFakeTimers();
    const committed: string[] = [];
    const acknowledged = vi.fn();
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async (value) => { committed.push(value.markdown); },
      acknowledgeProfiles: acknowledged,
    });

    coordinator.schedule(snapshot('older draft'));
    await coordinator.saveNow(snapshot('latest manual draft'));
    await vi.advanceTimersByTimeAsync(1000);

    expect(committed).toEqual(['latest manual draft']);
    expect(acknowledged).toHaveBeenCalledTimes(1);
  });

  it('serializes concurrent manual saves instead of letting the later write be overwritten', async () => {
    let finishFirst: (() => void) | undefined;
    const committed: string[] = [];
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async (value) => {
        if (value.markdown === 'first') {
          await new Promise<void>(resolve => { finishFirst = resolve; });
        }
        committed.push(value.markdown);
      },
      acknowledgeProfiles: () => undefined,
    });
    const first = coordinator.saveNow(snapshot('first'));
    const second = coordinator.saveNow(snapshot('second'));
    await vi.waitFor(() => expect(finishFirst).toBeTypeOf('function'));
    expect(committed).toEqual([]);
    finishFirst?.();
    await Promise.all([first, second]);
    expect(committed).toEqual(['first', 'second']);
  });

  it('drains pending autosave after queued manual saves in the correct order', async () => {
    vi.useFakeTimers();
    const committed: string[] = [];
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async value => { committed.push(value.markdown); },
      acknowledgeProfiles: () => undefined,
    });
    const immediate = coordinator.saveNow(snapshot('manual'));
    coordinator.schedule(snapshot('subsequent'));
    await Promise.all([immediate, coordinator.flush()]);
    expect(committed).toEqual(['manual', 'subsequent']);
    await vi.advanceTimersByTimeAsync(1000);
    expect(committed).toHaveLength(2);
  });

  it('recovers the write queue after a rejected save without acknowledging failed data', async () => {
    const acknowledged = vi.fn();
    let attempts = 0;
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async () => {
        if (++attempts === 1) throw new Error('database temporarily unavailable');
      },
      acknowledgeProfiles: acknowledged,
    });
    await expect(coordinator.saveNow(snapshot('failed'))).rejects.toThrow('database temporarily unavailable');
    expect(acknowledged).not.toHaveBeenCalled();
    await expect(coordinator.saveNow(snapshot('recovered'))).resolves.toBeUndefined();
    expect(attempts).toBe(2);
    expect(acknowledged).toHaveBeenCalledTimes(1);
  });
});

describe('truthful IndexedDB save acknowledgement', () => {
  it('does not show saved until the asynchronous IndexedDB write completes', async () => {
    let resolveWrite: (() => void) | undefined;
    const statuses: string[] = [];
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: () => new Promise<void>(resolve => { resolveWrite = resolve; }),
      acknowledgeProfiles: () => undefined,
    });
    const unsubscribe = coordinator.subscribeProgress(status => statuses.push(status));
    const saving = coordinator.saveNow(snapshot('unfinished revision'));
    expect(statuses).toEqual(['idle', 'saving']);
    await vi.waitFor(() => expect(resolveWrite).toBeTypeOf('function'));
    expect(statuses.at(-1)).toBe('saving');
    resolveWrite?.();
    await saving;
    expect(statuses).toEqual(['idle', 'saving', 'saved']);
    unsubscribe();
  });

  it('ignores an old commit while a newer edited revision remains pending', async () => {
    let releaseFirst: (() => void) | undefined;
    let releaseSecond: (() => void) | undefined;
    const statuses: string[] = [];
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: value => new Promise<void>(resolve => {
        if (value.markdown === 'first') releaseFirst = resolve;
        else releaseSecond = resolve;
      }),
      acknowledgeProfiles: () => undefined,
    });
    coordinator.subscribeProgress(status => statuses.push(status));
    const first = coordinator.saveNow(snapshot('first'));
    await vi.waitFor(() => expect(releaseFirst).toBeTypeOf('function'));
    const second = coordinator.saveNow(snapshot('second'));
    releaseFirst?.();
    await first;
    await vi.waitFor(() => expect(releaseSecond).toBeTypeOf('function'));
    expect(statuses).toEqual(['idle', 'saving', 'saving']);
    releaseSecond?.();
    await second;
    expect(statuses).toEqual(['idle', 'saving', 'saving', 'saved']);
  });

  it('reports a rejected write as failed, then saved only after a new successful commit', async () => {
    const statuses: string[] = [];
    let attempts = 0;
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async () => {
        if (++attempts === 1) throw new Error('quota/rejected');
      },
      acknowledgeProfiles: () => undefined,
    });
    coordinator.subscribeProgress(status => statuses.push(status));
    await expect(coordinator.saveNow(snapshot('failure'))).rejects.toThrow('quota/rejected');
    expect(statuses.at(-1)).toBe('failed');
    await expect(coordinator.saveNow(snapshot('recovered'))).resolves.toBeUndefined();
    expect(statuses).toEqual(['idle', 'saving', 'failed', 'saving', 'saved']);
  });

  it('late subscribers observe the actual latest pending or committed state', async () => {
    vi.useFakeTimers();
    const coordinator = createResumePersistenceCoordinator(350, {
      writeSnapshot: async () => undefined,
      acknowledgeProfiles: () => undefined,
    });
    coordinator.schedule(snapshot('latest'));
    const lateStatuses: string[] = [];
    coordinator.subscribeProgress(status => lateStatuses.push(status));
    expect(lateStatuses).toEqual(['saving']);
    await coordinator.flush();
    expect(lateStatuses).toEqual(['saving', 'saved']);
    await vi.advanceTimersByTimeAsync(500);
    expect(lateStatuses).toHaveLength(2);
  });
});

describe('legacy browser storage contract', () => {
  it('pins the existing IndexedDB name, cross-tab channel and shared write lock', () => {
    expect(RESUME_DB_NAME).toBe('resume-craft');
    expect(RESUME_DB_WRITE_LOCK_NAME).toBe('resume-craft:indexeddb-write');
    expect(RESUME_TABS_CHANNEL_NAME).toBe('resume-craft:tabs:v1');
  });
});
