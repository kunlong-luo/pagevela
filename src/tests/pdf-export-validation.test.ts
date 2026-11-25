import { describe, expect, it } from 'vitest';
import {
  assertPdfPageCount,
  assertRasterCanvasDimensions,
  assertQuickPdfRasterBudget,
  QUICK_PDF_MAX_RASTER_PIXELS,
  QUICK_PDF_MAX_RASTER_EDGE,
  requireRasterCanvasContext,
} from '../lib/pdf-export-validation';

describe('Quick PDF output safety', () => {
  it('rejects failed, zero-sized and non-finite source rasters before saving', () => {
    for (const [width, height] of [[0, 300], [300, 0], [-1, 100], [NaN, 400], [200, Infinity]]) {
      expect(() => assertRasterCanvasDimensions(width, height)).toThrow('invalid dimensions');
    }
    expect(() => assertRasterCanvasDimensions(794, 1123)).not.toThrow();
    expect(() => assertRasterCanvasDimensions(816, 1056)).not.toThrow();
  });

  it('fails for missing source or page contexts rather than saving a blank PDF', () => {
    expect(() => requireRasterCanvasContext(null, 'source')).toThrow('source canvas context');
    expect(() => requireRasterCanvasContext(null, 'page')).toThrow('page canvas context');
    const context = { drawImage: () => undefined };
    expect(requireRasterCanvasContext(context, 'page')).toBe(context);
  });

  it('estimates A4 and Letter raster memory before allocation without changing scale', () => {
    const a4 = assertQuickPdfRasterBudget(794, 1123, 2);
    expect(a4).toEqual({ width: 1588, height: 2246, estimatedBytes: 1588 * 2246 * 4 });
    const letter = assertQuickPdfRasterBudget(816, 1056, 1.5);
    expect(letter).toEqual({ width: 1224, height: 1584, estimatedBytes: 1224 * 1584 * 4 });
  });

  it('accepts exact raster boundaries and rejects the first unsafe pixel or edge', () => {
    expect(assertQuickPdfRasterBudget(6000, 6000, 1).estimatedBytes).toBe(QUICK_PDF_MAX_RASTER_PIXELS * 4);
    expect(() => assertQuickPdfRasterBudget(6000, 6001, 1)).toThrow('exceeds memory budget');
    expect(() => assertQuickPdfRasterBudget(QUICK_PDF_MAX_RASTER_EDGE, 1, 1)).not.toThrow();
    expect(() => assertQuickPdfRasterBudget(QUICK_PDF_MAX_RASTER_EDGE + 1, 1, 1)).toThrow('exceeds memory budget');
    expect(() => assertQuickPdfRasterBudget(1000, 16_400, 1)).toThrow('exceeds memory budget');
  });

  it('rejects invalid scale or overflowing raster dimensions instead of allocating', () => {
    for (const scale of [0, -1, NaN, Infinity]) {
      expect(() => assertQuickPdfRasterBudget(794, 1123, scale)).toThrow('scale is invalid');
    }
    expect(() => assertQuickPdfRasterBudget(NaN, 1000, 2)).toThrow('invalid dimensions');
    expect(() => assertQuickPdfRasterBudget(Number.MAX_SAFE_INTEGER, 2, 2)).toThrow('exceeds memory budget');
  });

  it('blocks empty/all-blank render paths and accepts only successful image pages', () => {
    for (const count of [0, -1, NaN, Infinity, 0.5]) {
      expect(() => assertPdfPageCount(count)).toThrow('no rendered content pages');
    }
    expect(() => assertPdfPageCount(1)).not.toThrow();
    expect(() => assertPdfPageCount(3)).not.toThrow();
  });
});
