/**
 * Conservative, bounded-memory scan for completely blank PDF raster tails.
 *
 * A sparse ~80-row sample could miss a one-pixel text stroke or divider and
 * stop the PDF page loop, silently dropping the remaining content. Inspect
 * every pixel instead, but only a small band at a time so getImageData does
 * not allocate a second full-height RGBA buffer.
 *
 * An unreadable raster is NOT safely blank: keep the PDF page rather than
 * discard user content on a canvas readback failure.
 */
const MAX_PROBE_PIXELS = 32_768;

export function isRasterSliceBlank(
  context: Pick<CanvasRenderingContext2D, 'getImageData'>,
  width: number,
  startY: number,
  endY: number,
): boolean {
  if (
    !Number.isSafeInteger(width) || width <= 0 ||
    !Number.isSafeInteger(startY) || startY < 0 ||
    !Number.isSafeInteger(endY) || endY < startY
  ) {
    return false;
  }
  if (startY === endY) return true;

  const rowsPerChunk = Math.max(1, Math.floor(MAX_PROBE_PIXELS / width));

  try {
    for (let y = startY; y < endY; y += rowsPerChunk) {
      const rows = Math.min(rowsPerChunk, endY - y);
      const { data } = context.getImageData(0, y, width, rows);
      if (data.length !== width * rows * 4) return false;

      // White + transparent are empty on the export's white background.
      // Be conservative: any visible pixel not exactly white could be a
      // thin/light-gray line, emoji edge or the final antialiased text glyph.
      for (let offset = 0; offset < data.length; offset += 4) {
        if (
          data[offset + 3] > 0 &&
          (data[offset] !== 255 || data[offset + 1] !== 255 || data[offset + 2] !== 255)
        ) {
          return false;
        }
      }
    }
  } catch {
    // Reading canvases with tainted pixels or unavailable 2D contexts must
    // never be interpreted as proof that the remaining resume is blank.
    return false;
  }

  return true;
}

/**
 * Find a genuine white band near the intended PDF page boundary.
 *
 * The historical smart split only checked one of every ~20 horizontal pixels,
 * ignored the outer 4% of the page, and treated nearly-white text as blank.
 * That could choose a gap through a faint glyph, line or icon. Instead, scan
 * every pixel in the existing 180px look-back window using bounded readbacks.
 *
 * A failed readback returns the original page boundary; it is never treated as
 * proof that a row is blank. Manual page breaks are handled by the caller.
 */
export function findSmartRasterSplitY(
  context: Pick<CanvasRenderingContext2D, 'getImageData'>,
  canvasWidth: number,
  canvasHeight: number,
  startY: number,
  idealPageCanvasHeight: number,
): number {
  if (
    !Number.isSafeInteger(canvasWidth) || canvasWidth <= 0 ||
    !Number.isSafeInteger(canvasHeight) || canvasHeight <= 0 ||
    !Number.isSafeInteger(startY) || startY < 0 || startY >= canvasHeight ||
    !Number.isSafeInteger(idealPageCanvasHeight) || idealPageCanvasHeight <= 0
  ) {
    throw new Error('Quick PDF smart split has invalid dimensions');
  }

  const idealY = startY + idealPageCanvasHeight;
  if (!Number.isSafeInteger(idealY)) {
    throw new Error('Quick PDF smart split has invalid dimensions');
  }
  if (idealY >= canvasHeight) return canvasHeight;

  // Preserve the old maximum 180px / minimum 65%-page look-back window;
  // only the unreliable sparse row/column sampling changes.
  const minSearchY = Math.max(
    startY + Math.floor(idealPageCanvasHeight * 0.65),
    idealY - 180,
  );
  const rowCount = idealY - minSearchY + 1;
  const whiteRows = new Uint8Array(rowCount);
  const rowsPerRead = Math.max(1, Math.floor(MAX_PROBE_PIXELS / canvasWidth));

  try {
    for (let topY = minSearchY; topY <= idealY;) {
      const rows = Math.min(rowsPerRead, idealY - topY + 1);
      const data = context.getImageData(0, topY, canvasWidth, rows).data;
      if (data.length !== canvasWidth * rows * 4) return idealY;

      for (let row = 0; row < rows; row++) {
        const rowStart = row * canvasWidth * 4;
        const rowEnd = rowStart + canvasWidth * 4;
        let white = true;
        for (let pixel = rowStart; pixel < rowEnd; pixel += 4) {
          if (
            data[pixel + 3] > 0 &&
            (data[pixel] !== 255 || data[pixel + 1] !== 255 || data[pixel + 2] !== 255)
          ) {
            white = false;
            break;
          }
        }
        whiteRows[topY + row - minSearchY] = white ? 1 : 0;
      }
      topY += rows;
    }
  } catch {
    return idealY;
  }

  // Preserve the largest white band preference. A four-row gap is the same
  // minimum as before; the old gap-size variable counted index differences,
  // so require at least five consecutive blank rows for equivalent behavior.
  let bestY = idealY;
  let bestLength = 0;
  let runBottom = -1;
  let runTop = -1;
  const considerRun = () => {
    if (runBottom < 0) return;
    const length = runBottom - runTop + 1;
    if (length >= 5 && length > bestLength) {
      bestLength = length;
      bestY = Math.floor((runBottom + runTop) / 2);
    }
    runBottom = -1;
    runTop = -1;
  };

  for (let y = idealY; y >= minSearchY; y--) {
    if (whiteRows[y - minSearchY] === 1) {
      if (runBottom < 0) runBottom = y;
      runTop = y;
    } else {
      considerRun();
    }
  }
  considerRun();

  return bestY;
}
