import { describe, expect, it, vi } from 'vitest';
import { installResumeLifecycleFlush } from '../lib/resume-lifecycle';
import { createResumePersistenceCoordinator } from '../lib/resume-persistence';

function lifecycleSignals() {
  const documentEvents = new EventTarget();
  const windowEvents = new EventTarget();
  let visibility: DocumentVisibilityState = 'visible';
  const documentRef = documentEvents as unknown as Document;
  Object.defineProperty(documentRef, 'visibilityState', {
    configurable: true,
    get: () => visibility,
  });

  return {
    documentRef,
    windowRef: windowEvents as unknown as Window,
    changeVisibility(next: DocumentVisibilityState) {
      visibility = next;
      documentEvents.dispatchEvent(new Event('visibilitychange'));
    },
    pageHide() {
      windowEvents.dispatchEvent(new Event('pagehide'));
    },
    beforeUnload() {
      windowEvents.dispatchEvent(new Event('beforeunload'));
    },
  };
}

describe('resume lifecycle persistence', () => {
  it('flushes a pending edit immediately when a mobile tab becomes hidden', async () => {
    const signals = lifecycleSignals();
    const written: string[] = [];
    const coordinator = createResumePersistenceCoordinator(30_000, {
      writeSnapshot: async value => { written.push(value.markdown); },
      acknowledgeProfiles: () => undefined,
    });
    const statuses: string[] = [];
    coordinator.subscribeProgress(status => statuses.push(status));
    const remove = installResumeLifecycleFlush(coordinator, signals.documentRef, signals.windowRef);

    coordinator.schedule({ markdown: '# Important edit', profiles: [], jdText: '' });
    signals.changeVisibility('hidden');
    await vi.waitFor(() => expect(written).toEqual(['# Important edit']));
    await coordinator.flush();
    expect(statuses).toEqual(['idle', 'saving', 'saved']);

    // pagehide after visibilitychange must not replay an already committed
    // pending snapshot, even when both browser events are fired.
    signals.pageHide();
    await coordinator.flush();
    expect(written).toHaveLength(1);
    remove();
  });

  it('does not flush on a visible tab or on beforeunload; pagehide remains a fallback', async () => {
    const signals = lifecycleSignals();
    const flush = vi.fn(async () => undefined);
    const remove = installResumeLifecycleFlush({ flush }, signals.documentRef, signals.windowRef);

    signals.changeVisibility('visible');
    signals.beforeUnload();
    expect(flush).not.toHaveBeenCalled();
    signals.pageHide();
    expect(flush).toHaveBeenCalledTimes(1);
    remove();
    signals.changeVisibility('hidden');
    signals.pageHide();
    expect(flush).toHaveBeenCalledTimes(1);
  });

  it('does not claim that saving succeeded before the IndexedDB write resolves', async () => {
    const signals = lifecycleSignals();
    let finishWrite: (() => void) | undefined;
    const coordinator = createResumePersistenceCoordinator(30_000, {
      writeSnapshot: () => new Promise<void>(resolve => { finishWrite = resolve; }),
      acknowledgeProfiles: () => undefined,
    });
    const statuses: string[] = [];
    coordinator.subscribeProgress(status => statuses.push(status));
    const remove = installResumeLifecycleFlush(coordinator, signals.documentRef, signals.windowRef);

    coordinator.schedule({ markdown: '# In flight', profiles: [], jdText: '' });
    signals.changeVisibility('hidden');
    await vi.waitFor(() => expect(finishWrite).toBeTypeOf('function'));
    expect(statuses.at(-1)).toBe('saving');
    finishWrite?.();
    await coordinator.flush();
    expect(statuses.at(-1)).toBe('saved');
    remove();
  });

  it('reports a rejected hidden flush instead of creating an unhandled Promise', async () => {
    const signals = lifecycleSignals();
    const report = vi.fn();
    const coordinator = createResumePersistenceCoordinator(30_000, {
      writeSnapshot: async () => { throw new Error('quota blocked'); },
      acknowledgeProfiles: () => undefined,
    });
    const statuses: string[] = [];
    coordinator.subscribeProgress(status => statuses.push(status));
    const remove = installResumeLifecycleFlush(
      coordinator,
      signals.documentRef,
      signals.windowRef,
      report,
    );
    coordinator.schedule({ markdown: '# Unsaved', profiles: [], jdText: '' });
    signals.changeVisibility('hidden');
    await vi.waitFor(() => expect(report).toHaveBeenCalledOnce());
    expect(report.mock.calls[0]?.[0]).toBeInstanceOf(Error);
    expect(statuses.at(-1)).toBe('failed');
    remove();
  });
});
