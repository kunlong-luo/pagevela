import { describe, expect, it } from 'vitest';
import {
  assertPdfPageCount,
  assertRasterCanvasDimensions,
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

  it('blocks empty/all-blank render paths and accepts only successful image pages', () => {
    for (const count of [0, -1, NaN, Infinity, 0.5]) {
      expect(() => assertPdfPageCount(count)).toThrow('no rendered content pages');
    }
    expect(() => assertPdfPageCount(1)).not.toThrow();
    expect(() => assertPdfPageCount(3)).not.toThrow();
  });
});
