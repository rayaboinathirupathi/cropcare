import { AIDiagnosisInput } from './types';
import { GeminiDiagnosisProvider } from './geminiProvider';
import { FallbackAgriculturalProvider } from './fallbackProvider';
import { CropDiagnosisResponse } from '../../types';
import { findVerifiedRecordByCropAndCondition } from '../../data/agriculturalKnowledge';

export class CropCareAIService {
  private geminiProvider: GeminiDiagnosisProvider;
  private fallbackProvider: FallbackAgriculturalProvider;

  constructor() {
    this.geminiProvider = new GeminiDiagnosisProvider();
    this.fallbackProvider = new FallbackAgriculturalProvider();
  }

  public async diagnoseCrop(input: AIDiagnosisInput): Promise<CropDiagnosisResponse> {
    const timestamp = new Date().toISOString();
    const id = `diag_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    let rawDiagnosis;
    let providerUsed = 'Verified ICAR Knowledge Matching Engine';

    // Try Gemini if API key is present
    if (this.geminiProvider.isConfigured()) {
      try {
        rawDiagnosis = await this.geminiProvider.diagnose(input);
        providerUsed = 'Google Gemini (Multimodal AI) + ICAR Verified Knowledge Grounding';
      } catch (geminiError) {
        console.warn('Gemini diagnosis encountered error; safely falling back to ICAR knowledge engine:', geminiError);
        rawDiagnosis = await this.fallbackProvider.diagnose(input);
        providerUsed = 'Verified ICAR Knowledge Engine (Fallback Mode)';
      }
    } else {
      rawDiagnosis = await this.fallbackProvider.diagnose(input);
    }

    const primaryDiagnosis = rawDiagnosis.diagnoses[0];
    const cropName = rawDiagnosis.crop.name || 'Field Crop';
    const conditionName = primaryDiagnosis ? primaryDiagnosis.condition : 'Uncertain Condition';

    // Correlate with verified official agricultural records for treatments & label compliance
    const verifiedMatch = findVerifiedRecordByCropAndCondition(cropName, conditionName);

    // Weather risk context
    let weatherRiskContext: string | undefined;
    if (input.locationContext?.district) {
      weatherRiskContext = `Regional advisory for ${input.locationContext.district}: Moderate humidity may influence foliar spore activity. Inspect upper leaf surfaces.`;
    }

    return {
      id,
      timestamp,
      crop: {
        name: rawDiagnosis.crop.name,
        scientificName: rawDiagnosis.crop.scientificName || verifiedMatch?.cropScientificName || null,
      },
      inputAssessment: rawDiagnosis.inputAssessment,
      diagnoses: rawDiagnosis.diagnoses.map(d => ({
        condition: d.condition,
        conditionType: d.conditionType,
        confidence: d.confidence,
        confidenceScore: d.confidenceScore,
        evidence: d.evidence,
        alternatives: d.alternatives,
        affectedPart: d.affectedPart,
        severity: d.severity,
      })),
      followUpQuestions: rawDiagnosis.followUpQuestions,
      managementRecommendations: rawDiagnosis.managementRecommendations.map(r => ({
        action: r.action,
        reason: r.reason,
        category: r.category,
        sourceIds: r.sourceIds,
      })),
      needsExpertReview: rawDiagnosis.needsExpertReview,
      limitations: rawDiagnosis.limitations,
      verifiedKnowledgeMatch: verifiedMatch,
      weatherRiskContext,
      aiProviderUsed: providerUsed,
    };
  }
}

export const aiDiagnosisService = new CropCareAIService();
