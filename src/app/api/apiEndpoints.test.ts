import { describe, it, expect } from 'vitest';
import { GET as getHealth } from './health/route';
import { POST as postCalculate } from './treatments/calculate/route';
import { POST as postTextDiagnose } from './diagnose/text/route';
import { NextRequest } from 'next/server';

describe('API Route Handlers', () => {
  it('GET /api/health returns healthy status and service configurations', async () => {
    const response = await getHealth();
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('CropCare AI Engine');
    expect(data.integrations.weatherProvider.provider).toContain('Open-Meteo');
  });

  it('POST /api/treatments/calculate returns deterministic dosage calculation', async () => {
    const req = new NextRequest('http://localhost:3000/api/treatments/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        treatmentRecordId: 'Tricyclazole 75% WP',
        landArea: 2,
        landUnit: 'acre',
        tankSizeLitres: 16,
      }),
    });

    const response = await postCalculate(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.inputArea).toBe(2);
    expect(data.calculatedProductQuantity).toBe(240); // 120 * 2 = 240g
    expect(data.productQuantityUnit).toBe('grams');
    expect(data.totalWaterVolumeLitres).toBe(400); // 200 * 2 = 400L
  });

  it('POST /api/treatments/calculate rejects invalid land area', async () => {
    const req = new NextRequest('http://localhost:3000/api/treatments/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        treatmentRecordId: 'Tricyclazole 75% WP',
        landArea: -2,
        landUnit: 'acre',
      }),
    });

    const response = await postCalculate(req);
    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toContain('valid positive land area');
  });

  it('POST /api/diagnose/text processes symptom description and returns assessment', async () => {
    const req = new NextRequest('http://localhost:3000/api/diagnose/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'Rice blast spindle-shaped spots on paddy leaves with grey center',
        district: 'Warangal',
        state: 'Telangana',
        language: 'en',
      }),
    });

    const response = await postTextDiagnose(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.crop.name).toContain('Paddy');
    expect(data.diagnoses[0].condition).toContain('Blast');
    expect(data.verifiedKnowledgeMatch).toBeDefined();
  });
});
