import { describe, it, expect } from 'vitest';
import { validateImageBuffer, sanitizeImageFilename, MAX_IMAGE_SIZE_BYTES } from './imageValidator';

describe('Image Validator Service', () => {
  it('validates a correct JPEG file via magic bytes (FF D8 FF)', () => {
    const jpegBuffer = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, ...new Array(200).fill(0x00)]);
    const result = validateImageBuffer(jpegBuffer);
    expect(result.isValid).toBe(true);
    expect(result.format).toBe('jpeg');
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('validates a correct PNG file via magic bytes (89 50 4E 47 0D 0A 1A 0A)', () => {
    const pngBuffer = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, ...new Array(200).fill(0x00)]);
    const result = validateImageBuffer(pngBuffer);
    expect(result.isValid).toBe(true);
    expect(result.format).toBe('png');
    expect(result.mimeType).toBe('image/png');
  });

  it('validates a correct WebP file via magic bytes (RIFF...WEBP)', () => {
    const webpBuffer = new Uint8Array(200);
    // RIFF at 0..3
    webpBuffer[0] = 0x52; webpBuffer[1] = 0x49; webpBuffer[2] = 0x46; webpBuffer[3] = 0x46;
    // WEBP at 8..11
    webpBuffer[8] = 0x57; webpBuffer[9] = 0x45; webpBuffer[10] = 0x42; webpBuffer[11] = 0x50;

    const result = validateImageBuffer(webpBuffer);
    expect(result.isValid).toBe(true);
    expect(result.format).toBe('webp');
    expect(result.mimeType).toBe('image/webp');
  });

  it('rejects an executable disguised as an image (.exe or ELF binary)', () => {
    // MZ header for DOS/PE executable: 4D 5A
    const exeBuffer = new Uint8Array([0x4D, 0x5A, 0x90, 0x00, ...new Array(200).fill(0x00)]);
    const result = validateImageBuffer(exeBuffer);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Unsupported image format');
  });

  it('rejects an empty or too small buffer (<128 bytes)', () => {
    const tinyBuffer = new Uint8Array([0xFF, 0xD8, 0xFF]);
    const result = validateImageBuffer(tinyBuffer);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('empty or too small');
  });

  it('rejects an image exceeding MAX_IMAGE_SIZE_BYTES (10MB)', () => {
    // Mock buffer with size exceeding 10MB
    const oversized = { byteLength: MAX_IMAGE_SIZE_BYTES + 500 } as any;
    const result = validateImageBuffer(oversized);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('exceeds maximum allowed limit');
  });

  it('sanitizes unsafe filenames with path traversal attacks', () => {
    const dirty = '../../etc/passwd.jpg';
    const clean = sanitizeImageFilename(dirty);
    expect(clean).not.toContain('../');
    expect(clean.endsWith('.jpg')).toBe(true);
  });
});
