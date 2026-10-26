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

describe('legacy browser storage contract', () => {
  it('pins the existing IndexedDB name, cross-tab channel and shared write lock', () => {
    expect(RESUME_DB_NAME).toBe('resume-craft');
    expect(RESUME_DB_WRITE_LOCK_NAME).toBe('resume-craft:indexeddb-write');
    expect(RESUME_TABS_CHANNEL_NAME).toBe('resume-craft:tabs:v1');
  });
});
