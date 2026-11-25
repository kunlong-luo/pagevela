/**
 * Make a best-effort IndexedDB flush at the earliest useful lifecycle signal.
 *
 * Mobile browsers may freeze a background tab without firing pagehide, so a
 * hidden visibility state starts the flush before the final page transition.
 * Both signals use the existing FIFO coordinator; neither can guarantee that
 * an asynchronous database transaction finishes after a process is killed.
 */
export function installResumeLifecycleFlush(
  persistence: { flush: () => Promise<void> },
  documentRef: Pick<Document, 'visibilityState' | 'addEventListener' | 'removeEventListener'> = document,
  windowRef: Pick<Window, 'addEventListener' | 'removeEventListener'> = window,
  reportFailure: (error: unknown) => void = (error) => {
    console.error('[resume-lifecycle] Background IndexedDB flush failed:', error);
  },
): () => void {
  const flush = () => {
    // Do not await an exit event: its dispatch and browser lifecycle cannot be
    // extended by a Promise. The coordinator emits truthful progress/failures.
    try {
      void persistence.flush().catch(reportFailure);
    } catch (error) {
      reportFailure(error);
    }
  };

  const onVisibilityChange = () => {
    if (documentRef.visibilityState === 'hidden') flush();
  };

  documentRef.addEventListener('visibilitychange', onVisibilityChange);
  windowRef.addEventListener('pagehide', flush);

  // Keep the application eligible for BFCache by avoiding beforeunload.
  // Removing these listeners is useful for tests and future app disposal.
  return () => {
    documentRef.removeEventListener('visibilitychange', onVisibilityChange);
    windowRef.removeEventListener('pagehide', flush);
  };
}
