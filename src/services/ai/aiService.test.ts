import { describe, it, expect } from 'vitest';
import { aiDiagnosisService } from './aiService';
import { RawAIDiagnosisSchema } from './types';

describe('AI Diagnosis Service & ICAR Knowledge Grounding', () => {
  it('validates a schema-compliant diagnosis response structure', () => {
    const validData = {
      crop: { name: 'Paddy / Rice', scientificName: 'Oryza sativa' },
      inputAssessment: { isPlantImage: true, imageQuality: 'good' },
      diagnoses: [
        {
          condition: 'Rice Blast',
          conditionType: 'disease',
          confidence: 'high',
          confidenceScore: 0.9,
          evidence: ['Spindle-shaped lesions with grey center'],
          alternatives: ['Brown spot'],
        }
      ],
      followUpQuestions: ['Are symptoms present on panicle neck?'],
      managementRecommendations: [
        {
          action: 'Avoid excessive nitrogen fertilization',
          reason: 'Reduces tissue susceptibility',
          category: 'cultural',
          sourceIds: ['ICAR-IIRR']
        }
      ],
      needsExpertReview: true,
      limitations: ['Visual hypothesis only']
    };

    const parsed = RawAIDiagnosisSchema.parse(validData);
    expect(parsed.crop.name).toBe('Paddy / Rice');
    expect(parsed.diagnoses[0].confidence).toBe('high');
  });

  it('correctly handles healthy crop assessment', async () => {
    const result = await aiDiagnosisService.diagnoseCrop({
      textDescription: 'My chilli plants look healthy and vigorous with deep green leaves.',
    });

    expect(result.diagnoses[0].conditionType).toBe('healthy');
    expect(result.diagnoses[0].confidence).toBe('high');
    expect(result.diagnoses[0].condition).toContain('Healthy');
  });

  it('handles non-plant image or text descriptions gracefully', async () => {
    const result = await aiDiagnosisService.diagnoseCrop({
      textDescription: 'This is a photo of a car and not a plant.',
    });

    expect(result.inputAssessment.isPlantImage).toBe(false);
    expect(result.diagnoses[0].conditionType).toBe('unknown');
  });

  it('diagnoses Chilli Leaf Curl and grounds with CIBRC registered treatments', async () => {
    const result = await aiDiagnosisService.diagnoseCrop({
      textDescription: 'Chilli leaves curled upwards with tiny whiteflies underneath.',
      locationContext: { district: 'Guntur', state: 'Andhra Pradesh' },
    });

    expect(result.crop.name).toBe('Chilli');
    expect(result.diagnoses[0].condition).toContain('Chilli Leaf Curl');
    expect(result.verifiedKnowledgeMatch).toBeDefined();
    expect(result.verifiedKnowledgeMatch?.officialSource).toContain('ICAR');
    expect(result.verifiedKnowledgeMatch?.chemicalTreatments.length).toBeGreaterThan(0);
  });
});
