import { describe, it, expect } from 'vitest';
import { en } from './dictionaries/en';
import { te } from './dictionaries/te';
import { hi } from './dictionaries/hi';
import { getDictionary, LANGUAGE_SPEECH_CODES } from './index';

describe('Internationalization (i18n) Engine', () => {
  it('has identical top-level structure across English, Telugu, and Hindi dictionaries', () => {
    const enKeys = Object.keys(en);
    const teKeys = Object.keys(te);
    const hiKeys = Object.keys(hi);

    expect(teKeys).toEqual(enKeys);
    expect(hiKeys).toEqual(enKeys);
  });

  it('provides matching navigation items in Telugu and Hindi', () => {
    expect(te.nav.home).toBe('పంటను పరీక్షించండి');
    expect(hi.nav.home).toBe('फसल जांचें');
    expect(en.nav.home).toBe('Scan Crop');
  });

  it('resolves correct dictionary via getDictionary helper', () => {
    expect(getDictionary('te').app.title).toContain('క్రాప్‌కేర్');
    expect(getDictionary('hi').app.title).toContain('क्रॉपकेयर');
    expect(getDictionary('en').app.title).toContain('CropCare');
  });

  it('maps correct Indian speech synthesis language codes', () => {
    expect(LANGUAGE_SPEECH_CODES.en).toBe('en-IN');
    expect(LANGUAGE_SPEECH_CODES.te).toBe('te-IN');
    expect(LANGUAGE_SPEECH_CODES.hi).toBe('hi-IN');
  });
});
