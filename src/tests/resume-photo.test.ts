import { describe, expect, it } from 'vitest';
import {
  isSafeResumePhotoDataUrl,
  validateResumePhotoFile,
  RESUME_PHOTO_MAX_INPUT_BYTES,
  RESUME_PHOTO_WIDTH,
  RESUME_PHOTO_HEIGHT,
} from '../lib/resume-photo';

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
