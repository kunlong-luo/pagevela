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

/**
 * Bound the full-document raster before html2canvas allocates its bitmap.
 * It is an explicit stop/fallback boundary, not a resolution reduction.
 *
 * A 36-megapixel RGBA bitmap alone holds ~144MB before render buffers,
 * serialized JPEGs, the PDF document and the original DOM are considered.
 * Browser/GPU limits vary; these are conservative product-level caps,
 * never an assurance that an allocation below the cap will succeed.
 */
export const QUICK_PDF_MAX_RASTER_PIXELS = 36_000_000;
export const QUICK_PDF_MAX_RASTER_EDGE = 16_384;

/**
 * Use CSS layout dimensions before capture (scale > 1) and actual raster
 * dimensions after capture (scale = 1). Fail fast and let the existing
 * text-preserving browser Print / Save as PDF fallback handle long documents.
 */
export function assertQuickPdfRasterBudget(
  cssWidth: number,
  cssHeight: number,
  scale: number,
): { width: number; height: number; estimatedBytes: number } {
  assertRasterCanvasDimensions(cssWidth, cssHeight);
  if (!Number.isFinite(scale) || scale <= 0) {
    throw new Error('Quick PDF raster scale is invalid');
  }

  const width = Math.ceil(cssWidth * scale);
  const height = Math.ceil(cssHeight * scale);
  const pixels = width * height;
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    !Number.isSafeInteger(pixels) ||
    width > QUICK_PDF_MAX_RASTER_EDGE ||
    height > QUICK_PDF_MAX_RASTER_EDGE ||
    pixels > QUICK_PDF_MAX_RASTER_PIXELS
  ) {
    throw new Error('Quick PDF raster exceeds memory budget; use browser Print / Save as PDF');
  }

  return { width, height, estimatedBytes: pixels * 4 };
}
