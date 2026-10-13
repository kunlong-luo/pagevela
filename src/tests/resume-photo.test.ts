import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  cropResumePhoto,
  isSafeResumePhotoDataUrl,
  validateResumePhotoFile,
  RESUME_PHOTO_MAX_INPUT_BYTES,
  RESUME_PHOTO_WIDTH,
  RESUME_PHOTO_HEIGHT,
} from '../lib/resume-photo';

afterEach(() => vi.unstubAllGlobals());

describe('local image decoding and crop', () => {
  it('uses ImageBitmap and closes it without assigning the uploaded Blob to a DOM image URL', async () => {
    const close = vi.fn();
    const drawImage = vi.fn();
    const bitmap = { width: 600, height: 800, close } as unknown as ImageBitmap;
    const decode = vi.fn(async () => bitmap);
    vi.stubGlobal('createImageBitmap', decode);
    const canvas = {
      width: 0,
      height: 0,
      getContext: () => ({ fillStyle: '', fillRect: vi.fn(), drawImage }),
      toDataURL: () => 'data:image/jpeg;base64,aGVsbG8=',
    };
    vi.stubGlobal('document', { createElement: () => canvas });

    const file = { type: 'image/png', size: 100 } as File;
    const result = await cropResumePhoto(file);

    expect(result).toBe('data:image/jpeg;base64,aGVsbG8=');
    expect(decode).toHaveBeenCalledWith(file);
    expect(drawImage).toHaveBeenCalledOnce();
    expect(drawImage.mock.calls[0][0]).toBe(bitmap);
    expect(canvas.width).toBe(RESUME_PHOTO_WIDTH);
    expect(canvas.height).toBe(RESUME_PHOTO_HEIGHT);
    expect(close).toHaveBeenCalledOnce();
  });

  it('releases decoded image memory even when output is too large', async () => {
    const close = vi.fn();
    vi.stubGlobal('createImageBitmap', async () => ({ width: 500, height: 600, close }));
    vi.stubGlobal('document', {
      createElement: () => ({
        getContext: () => ({ fillStyle: '', fillRect: vi.fn(), drawImage: vi.fn() }),
        toDataURL: () => 'data:image/jpeg;base64,' + 'a'.repeat(500_000),
      }),
    });

    await expect(cropResumePhoto({ type: 'image/jpeg', size: 100 } as File))
      .rejects.toThrow('output-too-large');
    expect(close).toHaveBeenCalledOnce();
  });
});

describe('local resume photo privacy', () => {
  it('accepts only bounded local JPEG data URLs in profiles', () => {
    expect(isSafeResumePhotoDataUrl('data:image/jpeg;base64,aGVsbG8=')).toBe(true);
    expect(isSafeResumePhotoDataUrl('https://example.com/portrait.jpg')).toBe(false);
    expect(isSafeResumePhotoDataUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false);
    expect(isSafeResumePhotoDataUrl('data:text/html;base64,PHNjcmlwdD4=')).toBe(false);
    expect(isSafeResumePhotoDataUrl('data:image/jpeg;base64,' + 'a'.repeat(500_000))).toBe(false);
    expect(isSafeResumePhotoDataUrl(null)).toBe(false);
  });

  it('rejects unsupported image file types and giant inputs', () => {
    expect(validateResumePhotoFile({ type: 'image/jpeg', size: 1000 })).toBeNull();
    expect(validateResumePhotoFile({ type: 'image/png', size: 1000 })).toBeNull();
    expect(validateResumePhotoFile({ type: 'image/webp', size: 1000 })).toBeNull();
    expect(validateResumePhotoFile({ type: 'image/svg+xml', size: 1000 })).toBe('unsupported');
    expect(validateResumePhotoFile({ type: 'image/jpeg', size: RESUME_PHOTO_MAX_INPUT_BYTES + 1 })).toBe('too-large');
  });

  it('uses a stable passport photo crop ratio', () => {
    expect(RESUME_PHOTO_WIDTH / RESUME_PHOTO_HEIGHT).toBe(0.75);
  });
});
