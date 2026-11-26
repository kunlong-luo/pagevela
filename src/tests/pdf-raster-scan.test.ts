import { describe, expect, it, vi } from 'vitest';
import { isRasterSliceBlank, findSmartRasterSplitY } from '../lib/pdf-raster-scan';

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


function makeSplitScan(
  pageWidth: number,
  whiteBands: Array<[number, number]>,
  faintEdge?: { x: number; y: number },
) {
  const getImageData = vi.fn((_x: number, top: number, width: number, height: number) => {
    const data = new Uint8ClampedArray(width * height * 4);
    data.fill(255);
    for (let row = 0; row < height; row++) {
      const y = top + row;
      const isWhiteBand = whiteBands.some(([first, last]) => y >= first && y <= last);
      if (!isWhiteBand) data[row * width * 4] = 0;
      if (faintEdge?.y === y && faintEdge.x < width) {
        data[(row * width + faintEdge.x) * 4] = 254;
      }
    }
    return { data } as ImageData;
  });
  return {
    context: { getImageData } as unknown as Pick<CanvasRenderingContext2D, 'getImageData'>,
    getImageData,
    width: pageWidth,
  };
}

describe('Quick PDF smart page-boundary gap safety', () => {
  it('selects the longest real white band within the existing 180px/65% look-back', () => {
    const { context, getImageData, width } = makeSplitScan(1600, [
      [1100, 1107],
      [1180, 1190],
    ]);
    expect(findSmartRasterSplitY(context, width, 2400, 0, 1200)).toBe(1185);
    expect(getImageData).toHaveBeenCalled();
    expect(getImageData.mock.calls.every(([, , w, rows]) => w * rows <= 32_768)).toBe(true);
    expect(getImageData.mock.calls.every(([x, , w]) => x === 0 && w === width)).toBe(true);
    expect(getImageData.mock.calls.reduce((total, [, , , rows]) => total + rows, 0)).toBe(181);
  });

  it('does not treat a single faint edge pixel as a gap crossing a text stroke', () => {
    const { context, width } = makeSplitScan(
      1600,
      [[1100, 1107], [1180, 1190]],
      { x: 1599, y: 1185, },
    );
    // Old sampled-column and near-white checks would still choose 1185.
    // The exact-pixel scan rejects that gap and picks the earlier clean one.
    expect(findSmartRasterSplitY(context, width, 2400, 0, 1200)).toBe(1103);
  });

  it('does not shrink the page for a white gap shorter than five rows', () => {
    const { context } = makeSplitScan(816, [[1150, 1153]]);
    expect(findSmartRasterSplitY(context, 816, 2400, 0, 1200)).toBe(1200);
  });

  it('keeps the ideal boundary when reading pixels fails or returns malformed data', () => {
    const unavailable = { getImageData: vi.fn(() => { throw new Error('readback blocked'); }) };
    expect(findSmartRasterSplitY(unavailable, 800, 2400, 0, 1200)).toBe(1200);
    const malformed = { getImageData: vi.fn(() => ({ data: new Uint8ClampedArray(2) as Uint8ClampedArray })) } as unknown as Pick<CanvasRenderingContext2D, 'getImageData'>;
    expect(findSmartRasterSplitY(malformed, 800, 2400, 0, 1200)).toBe(1200);
  });

  it('preserves last-page clipping, layout limits and rejects invalid dimensions', () => {
    const context = makeSplitScan(1600, [[1180, 1190]]).context;
    expect(findSmartRasterSplitY(context, 1600, 1200, 0, 1200)).toBe(1200);
    expect(findSmartRasterSplitY(context, 1600, 1800, 900, 1000)).toBe(1800);
    expect(() => findSmartRasterSplitY(context, 0, 2000, 0, 1200)).toThrow('invalid dimensions');
    expect(() => findSmartRasterSplitY(context, 800, 2000, -1, 1200)).toThrow('invalid dimensions');
    expect(() => findSmartRasterSplitY(context, 800, 2000, 0, 0)).toThrow('invalid dimensions');
  });
});
