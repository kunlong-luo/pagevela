import { describe, expect, it, vi } from 'vitest';
import {
  performResumeFullReset,
  ResumeResetError,
  type ResumeResetDependencies,
} from '../lib/resume-full-reset';

function dependencies(): ResumeResetDependencies {
  return {
    suspendActiveWrites: vi.fn(async () => undefined),
    suspendDraftWrites: vi.fn(async () => undefined),
    deleteDatabase: vi.fn(async () => undefined),
    clearPreferences: vi.fn(() => true),
  };
}

describe('confirmed Pagevela local data reset', () => {
  it('stops both write coordinators before removing the database and app preferences', async () => {
    let releaseActive: (() => void) | undefined;
    let releaseDrafts: (() => void) | undefined;
    const steps: string[] = [];
    const deps: ResumeResetDependencies = {
      suspendActiveWrites: () => new Promise(resolve => {
        steps.push('active-stopping');
        releaseActive = resolve;
      }),
      suspendDraftWrites: () => new Promise(resolve => {
        steps.push('drafts-stopping');
        releaseDrafts = resolve;
      }),
      deleteDatabase: async () => { steps.push('database-deleted'); },
      clearPreferences: () => { steps.push('app-preferences-deleted'); return true; },
    };
    const wipe = performResumeFullReset(deps);
    expect(steps).toEqual(['active-stopping', 'drafts-stopping']);
    releaseActive?.();
    await Promise.resolve();
    expect(steps).not.toContain('database-deleted');
    releaseDrafts?.();
    await wipe;
    expect(steps).toEqual([
      'active-stopping', 'drafts-stopping', 'database-deleted', 'app-preferences-deleted',
    ]);
  });

  it('does not erase IndexedDB or preferences if a write queue cannot drain', async () => {
    const deps = dependencies();
    deps.suspendDraftWrites = vi.fn(async () => { throw new Error('busy'); });
    await expect(performResumeFullReset(deps)).rejects.toMatchObject({
      stage: 'suspend',
    } satisfies Partial<ResumeResetError>);
    expect(deps.deleteDatabase).not.toHaveBeenCalled();
    expect(deps.clearPreferences).not.toHaveBeenCalled();
  });

  it('keeps local preferences if IndexedDB deletion fails', async () => {
    const deps = dependencies();
    deps.deleteDatabase = vi.fn(async () => { throw new Error('blocked by another tab'); });
    await expect(performResumeFullReset(deps)).rejects.toMatchObject({ stage: 'database' });
    expect(deps.clearPreferences).not.toHaveBeenCalled();
  });

  it('reports a partial reset if IndexedDB is deleted but localStorage refuses writes', async () => {
    const deps = dependencies();
    deps.clearPreferences = vi.fn(() => false);
    await expect(performResumeFullReset(deps)).rejects.toMatchObject({ stage: 'preferences' });
    expect(deps.deleteDatabase).toHaveBeenCalledTimes(1);
    expect(deps.clearPreferences).toHaveBeenCalledTimes(1);
  });

  it('does not claim success if removing local preferences throws', async () => {
    const deps = dependencies();
    deps.clearPreferences = vi.fn(() => { throw new Error('SecurityError'); });
    await expect(performResumeFullReset(deps)).rejects.toMatchObject({ stage: 'preferences' });
  });
});
