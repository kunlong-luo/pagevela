import { describe, expect, it, vi } from 'vitest';
import { isRasterSliceBlank } from '../lib/pdf-raster-scan';

function makeRaster(
  marker?: { x: number; y: number; red?: number; alpha?: number },
) {
  const getImageData = vi.fn((_x: number, top: number, width: number, rows: number) => {
    const data = new Uint8ClampedArray(width * rows * 4);
    data.fill(255);
    if (marker && marker.y >= top && marker.y < top + rows && marker.x < width) {
      const offset = ((marker.y - top) * width + marker.x) * 4;
      data[offset] = marker.red ?? 0;
      data[offset + 3] = marker.alpha ?? 255;
    }
    return { data } as ImageData;
  });
  return {
    context: { getImageData } as unknown as Pick<CanvasRenderingContext2D, 'getImageData'>,
    getImageData,
  };
}

describe('Quick PDF trailing raster preservation', () => {
  it('proves a tall white region is blank by reading every pixel in small bands', () => {
    const { context, getImageData } = makeRaster();
    expect(isRasterSliceBlank(context, 1600, 0, 1800)).toBe(true);
    expect(getImageData.mock.calls.length).toBeGreaterThan(50);
    expect(getImageData.mock.calls.every(([, , w, rows]) => w * rows <= 32_768)).toBe(true);
    expect(getImageData.mock.calls.reduce((total, [, , , rows]) => total + rows, 0)).toBe(1800);
  });

  it('preserves a single faint pixel at the edge of a long otherwise-white tail', () => {
    // Old 80-row sampling with 3–97% horizontal crop missed this mark.
    const { context } = makeRaster({ x: 0, y: 1997, red: 254 });
    expect(isRasterSliceBlank(context, 1600, 0, 2002)).toBe(false);
  });

  it('preserves one-pixel content even for very thin remaining slices', () => {
    const { context } = makeRaster({ x: 15, y: 8 });
    expect(isRasterSliceBlank(context, 16, 8, 9)).toBe(false);
  });

  it('treats fully transparent dark pixels as blank over the white PDF background', () => {
    const { context } = makeRaster({ x: 7, y: 3, red: 0, alpha: 0 });
    expect(isRasterSliceBlank(context, 16, 0, 8)).toBe(true);
  });

  it('does not discard content when the canvas read fails, is incomplete or dimensions are invalid', () => {
    const getImageData = vi.fn(() => { throw new Error('readback blocked'); });
    const context = { getImageData } as unknown as Pick<CanvasRenderingContext2D, 'getImageData'>;
    expect(isRasterSliceBlank(context, 500, 0, 4000)).toBe(false);
    expect(isRasterSliceBlank(context, NaN, 0, 30)).toBe(false);
    expect(isRasterSliceBlank(context, 500, 10, 5)).toBe(false);
    expect(isRasterSliceBlank(context, 500, 5, 5)).toBe(true);

    const incomplete = { getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(3) })) } as unknown as Pick<CanvasRenderingContext2D, 'getImageData'>;
    expect(isRasterSliceBlank(incomplete, 10, 0, 1)).toBe(false);
  });
});
