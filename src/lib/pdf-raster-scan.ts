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
