/**
 * Resume photographs stay in the local profile snapshot. Only compressed JPEG data
 * produced by our canvas cropper is accepted; SVG and external URLs are rejected.
 */
export const RESUME_PHOTO_MAX_INPUT_BYTES = 5 * 1024 * 1024;
export const RESUME_PHOTO_MAX_DATA_URL_LENGTH = 500_000;
export const RESUME_PHOTO_WIDTH = 360;
export const RESUME_PHOTO_HEIGHT = 480;

const ACCEPTED_INPUT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const JPEG_DATA_URL = /^data:image\/jpeg;base64,[a-z0-9+/]+={0,2}$/i;

export function isSafeResumePhotoDataUrl(value: unknown): value is string {
  return typeof value === 'string' &&
    value.length < RESUME_PHOTO_MAX_DATA_URL_LENGTH &&
    JPEG_DATA_URL.test(value);
}

export function validateResumePhotoFile(file: Pick<File, 'type' | 'size'>): string | null {
  if (!ACCEPTED_INPUT_TYPES.includes(file.type as (typeof ACCEPTED_INPUT_TYPES)[number])) {
    return 'unsupported';
  }
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > RESUME_PHOTO_MAX_INPUT_BYTES) {
    return 'too-large';
  }
  return null;
}

/** Crop an image to 3:4, strip image metadata, and downscale it before local persistence. */
export async function cropResumePhoto(file: File, panX = 0.5, panY = 0.5): Promise<string> {
  const invalid = validateResumePhotoFile(file);
  if (invalid) throw new Error(invalid);

  const url = URL.createObjectURL(file);
  try {
    const photo = new Image();
    photo.decoding = 'async';
    photo.src = url;
    await photo.decode();
    const width = photo.naturalWidth;
    const height = photo.naturalHeight;
    if (width < 1 || height < 1 || width * height > 50_000_000) {
      throw new Error('invalid-dimensions');
    }

    const canvas = document.createElement('canvas');
    canvas.width = RESUME_PHOTO_WIDTH;
    canvas.height = RESUME_PHOTO_HEIGHT;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas-unavailable');

    const targetRatio = RESUME_PHOTO_WIDTH / RESUME_PHOTO_HEIGHT;
    const sourceRatio = width / height;
    const cropWidth = sourceRatio > targetRatio ? height * targetRatio : width;
    const cropHeight = sourceRatio > targetRatio ? height : width / targetRatio;
    const x = (width - cropWidth) * Math.min(1, Math.max(0, panX));
    const y = (height - cropHeight) * Math.min(1, Math.max(0, panY));
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photo, x, y, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

    const result = canvas.toDataURL('image/jpeg', 0.8);
    if (!isSafeResumePhotoDataUrl(result)) throw new Error('output-too-large');
    return result;
  } finally {
    URL.revokeObjectURL(url);
  }
}
