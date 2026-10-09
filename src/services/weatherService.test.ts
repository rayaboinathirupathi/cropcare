import { describe, it, expect } from 'vitest';
import { interpretWmoCode, getFallbackAgriculturalWeather, getAdvisoriesForRegion } from './weatherService';

describe('Weather and Agricultural Risk Service', () => {
  it('correctly maps WMO weather codes to farmer-understandable text', () => {
    expect(interpretWmoCode(0)).toBe('Clear Sky');
    expect(interpretWmoCode(45)).toBe('Fog / Morning Dew');
    expect(interpretWmoCode(61)).toBe('Rain Showers');
    expect(interpretWmoCode(95)).toBe('Thunderstorm');
  });

  it('generates calibrated fallback agricultural weather when offline', () => {
    const fallback = getFallbackAgriculturalWeather(17.9689, 79.5941, 'Warangal');
    expect(fallback.locationName).toBe('Warangal');
    expect(fallback.temperatureC).toBeGreaterThan(0);
    expect(fallback.humidityPercent).toBeGreaterThan(0);
    expect(fallback.agriculturalIndices.fungalDiseaseRisk).toBeDefined();
    expect(fallback.agriculturalIndices.sprayingCondition).toBeDefined();
    expect(fallback.forecastDaily.length).toBe(7);
  });

  it('provides agricultural advisories for specific Indian districts', () => {
    const advs = getAdvisoriesForRegion('Guntur', 'Andhra Pradesh');
    expect(advs.length).toBeGreaterThan(0);
    expect(advs[0].applicableRegion).toContain('Guntur');
    expect(advs[0].issuedBy).toContain('ICAR');
  });
});
