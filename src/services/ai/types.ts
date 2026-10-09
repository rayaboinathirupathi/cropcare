import { z } from 'zod';

export const ConditionTypeEnum = z.enum([
  'disease',
  'pest',
  'deficiency',
  'environmental',
  'healthy',
  'unknown'
]);

export const ConfidenceLevelEnum = z.enum(['high', 'medium', 'low']);

export const ImageQualityEnum = z.enum(['good', 'acceptable', 'poor', 'not_applicable']);

export const DiagnosisHypothesisSchema = z.object({
  condition: z.string().min(1),
  conditionType: ConditionTypeEnum,
  confidence: ConfidenceLevelEnum,
  confidenceScore: z.number().min(0).max(1).optional(),
  evidence: z.array(z.string()).min(1),
  alternatives: z.array(z.string()).default([]),
  affectedPart: z.enum(['leaf', 'stem', 'fruit', 'flower', 'root', 'whole_plant', 'unknown']).optional(),
  severity: z.enum(['mild', 'moderate', 'severe', 'unknown']).optional(),
});

export const ManagementRecommendationSchema = z.object({
  action: z.string().min(1),
  reason: z.string().min(1),
  category: z.enum(['cultural', 'biological', 'chemical', 'prevention']).default('cultural'),
  sourceIds: z.array(z.string()).default([]),
});

export const RawAIDiagnosisSchema = z.object({
  crop: z.object({
    name: z.string().nullable(),
    scientificName: z.string().nullable(),
  }),
  inputAssessment: z.object({
    isPlantImage: z.boolean().nullable(),
    imageQuality: ImageQualityEnum,
    suitabilityRemarks: z.string().optional(),
  }),
  diagnoses: z.array(DiagnosisHypothesisSchema).min(1),
  followUpQuestions: z.array(z.string()).default([]),
  managementRecommendations: z.array(ManagementRecommendationSchema).default([]),
  needsExpertReview: z.boolean().default(true),
  limitations: z.array(z.string()).default([]),
});

export type RawAIDiagnosis = z.infer<typeof RawAIDiagnosisSchema>;

export interface AIDiagnosisInput {
  imageBuffer?: Buffer | Uint8Array;
  mimeType?: string;
  textDescription?: string;
  language?: string;
  locationContext?: {
    district?: string;
    state?: string;
  };
}
