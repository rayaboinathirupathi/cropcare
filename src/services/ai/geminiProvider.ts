import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIDiagnosisInput, RawAIDiagnosis, RawAIDiagnosisSchema } from './types';

const SYSTEM_PROMPT = `You are CropCare AI, an expert agricultural plant pathologist and entomologist supporting farmers in India.
Your mission is to provide evidence-based, scientifically calibrated assessments for crop diseases, insect pests, nutrient deficiencies, or abiotic stresses.

CRITICAL INSTRUCTIONS & SAFETY RULES:
1. Return ONLY a single raw JSON object matching the requested schema. No markdown backticks, no markdown codeblocks, no commentary outside the JSON.
2. Never invent chemical pesticide names, dosages, dilution ratios, or brand formulations. Leave chemical dosage calculation to the verified label database.
3. If the input image is blurry, does not contain a plant, or is inadequate for identification, set isPlantImage to false or imageQuality to 'poor', and explain what photo the farmer should take instead.
4. If the plant looks completely healthy, set condition to "Healthy Crop", conditionType to "healthy", and confidence to "high".
5. Distinguish symptom observations from confirmed diagnosis. Present alternative plausible causes when symptoms are ambiguous.
6. Calibrate confidence honestly:
   - "high": Classic distinctive symptoms (e.g. Rice blast spindle lesions, Chilli leaf curl virus with vector presence).
   - "medium": Symptoms match multiple common conditions (e.g. generalized yellowing, early blight vs Septoria).
   - "low": Limited visibility or non-specific symptoms.

SCHEMA SPECIFICATION:
{
  "crop": {
    "name": "Crop Name (e.g., Paddy, Chilli, Cotton, Tomato, Wheat)",
    "scientificName": "Scientific Name (e.g., Oryza sativa, Capsicum annuum)"
  },
  "inputAssessment": {
    "isPlantImage": true or false,
    "imageQuality": "good" | "acceptable" | "poor" | "not_applicable",
    "suitabilityRemarks": "Brief remarks on image clarity"
  },
  "diagnoses": [
    {
      "condition": "Name of likely condition",
      "conditionType": "disease" | "pest" | "deficiency" | "environmental" | "healthy" | "unknown",
      "confidence": "high" | "medium" | "low",
      "confidenceScore": 0.85,
      "evidence": ["Visible symptom 1", "Visible symptom 2"],
      "alternatives": ["Plausible alternative cause 1"],
      "affectedPart": "leaf" | "stem" | "fruit" | "flower" | "root" | "whole_plant" | "unknown",
      "severity": "mild" | "moderate" | "severe" | "unknown"
    }
  ],
  "followUpQuestions": ["Clarification question if needed"],
  "managementRecommendations": [
    {
      "action": "Immediate non-chemical cultural or monitoring action",
      "reason": "Why this action prevents disease progression",
      "category": "cultural" | "biological" | "chemical" | "prevention",
      "sourceIds": ["ICAR"]
    }
  ],
  "needsExpertReview": true,
  "limitations": ["Assessment based on visual symptoms. Laboratory or field officer confirmation recommended."]
}`;

export class GeminiDiagnosisProvider {
  private apiKey: string;
  private modelName: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5 && !this.apiKey.includes('your_gemini'));
  }

  public async diagnose(input: AIDiagnosisInput): Promise<RawAIDiagnosis> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(this.apiKey);
    const model = genAI.getGenerativeModel({
      model: this.modelName,
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.1, // low temperature for consistent, factual output
        responseMimeType: 'application/json',
      },
    });

    const parts: any[] = [];

    // Attach image if present
    if (input.imageBuffer && input.mimeType) {
      const base64Data = Buffer.isBuffer(input.imageBuffer)
        ? input.imageBuffer.toString('base64')
        : Buffer.from(input.imageBuffer).toString('base64');

      parts.push({
        inlineData: {
          mimeType: input.mimeType,
          data: base64Data,
        },
      });
    }

    // Attach text description and prompt instructions
    let userPrompt = 'Please analyze this crop sample and diagnose any visible plant health issues.';
    if (input.textDescription) {
      userPrompt += `\nFarmer's description of symptoms: "${input.textDescription}"`;
    }
    if (input.locationContext?.district) {
      userPrompt += `\nFarmer's region: ${input.locationContext.district}, ${input.locationContext.state || 'India'}`;
    }
    if (input.language) {
      userPrompt += `\nTarget Language: ${input.language}`;
    }

    parts.push({ text: userPrompt });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out after 20 seconds')), 20000)
    );

    const apiCallPromise = model.generateContent(parts);
    const result: any = await Promise.race([apiCallPromise, timeoutPromise]);
    const responseText = result.response.text();

    try {
      // Strip any accidental markdown blocks
      const cleanJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanJson);
      return RawAIDiagnosisSchema.parse(parsed);
    } catch (parseError) {
      console.error('Failed to parse or validate Gemini response:', responseText);
      throw new Error(`AI output validation failed: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  }
}
