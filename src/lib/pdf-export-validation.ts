/**
 * Guards before triggering the browser save request. A canvas allocation that
 * succeeded but has zero pixels cannot produce a usable Quick PDF page.
 */
export function assertRasterCanvasDimensions(width: number, height: number): void {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Quick PDF raster canvas has invalid dimensions');
  }
}

/** Canvas creation may fail under memory or device limits (especially mobile). */
export function requireRasterCanvasContext<T>(context: T | null, kind: 'source' | 'page'): T {
  if (context === null) {
    throw new Error(`Quick PDF ${kind} canvas context is unavailable`);
  }
  return context;
}

/** Every saved raster PDF must contain at least one successfully added image page. */
export function assertPdfPageCount(renderedPages: number): void {
  if (!Number.isInteger(renderedPages) || renderedPages < 1) {
    throw new Error('Quick PDF has no rendered content pages');
  }
}
