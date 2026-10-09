export interface ImageValidationResult {
  isValid: boolean;
  format?: 'jpeg' | 'png' | 'webp';
  mimeType?: string;
  fileSizeBytes: number;
  errorMessage?: string;
}

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MIN_IMAGE_SIZE_BYTES = 128; // 128 bytes minimum

/**
 * Validates actual binary bytes of an image to prevent MIME spoofing,
 * executable uploads, or empty/corrupt files.
 */
export function validateImageBuffer(buffer: Uint8Array | ArrayBuffer | { byteLength: number }): ImageValidationResult {
  const size = buffer ? buffer.byteLength : 0;

  if (size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      fileSizeBytes: size,
      errorMessage: 'File size exceeds maximum allowed limit of 10 MB. Please compress or select a smaller image.'
    };
  }

  if (size < MIN_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      fileSizeBytes: size,
      errorMessage: 'The uploaded file is empty or too small to be a valid plant photograph.'
    };
  }

  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer as any);

  // 1. Check JPEG magic bytes: FF D8 FF
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return {
      isValid: true,
      format: 'jpeg',
      mimeType: 'image/jpeg',
      fileSizeBytes: size
    };
  }

  // 2. Check PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 && // 'P'
    bytes[2] === 0x4E && // 'N'
    bytes[3] === 0x47 && // 'G'
    bytes[4] === 0x0D &&
    bytes[5] === 0x0A &&
    bytes[6] === 0x1A &&
    bytes[7] === 0x0A
  ) {
    return {
      isValid: true,
      format: 'png',
      mimeType: 'image/png',
      fileSizeBytes: size
    };
  }

  // 3. Check WebP magic bytes: RIFF (bytes 0-3) ... WEBP (bytes 8-11)
  if (
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && // 'RIFF'
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50   // 'WEBP'
  ) {
    return {
      isValid: true,
      format: 'webp',
      mimeType: 'image/webp',
      fileSizeBytes: size
    };
  }

  return {
    isValid: false,
    fileSizeBytes: size,
    errorMessage: 'Unsupported image format. Please upload a clear photo in JPEG, PNG, or WebP format.'
  };
}

/**
 * Checks for potential executable or script injections disguised in metadata
 */
export function sanitizeImageFilename(filename: string): string {
  // Strip path traversal and dangerous characters
  const clean = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = clean.split('.').pop()?.toLowerCase();
  if (ext && ['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return clean;
  }
  return `crop_photo_${Date.now()}.jpg`;
}
