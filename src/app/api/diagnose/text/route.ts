import { NextRequest, NextResponse } from 'next/server';
import { validateSymptomInput } from '@/services/promptSanitizer';
import { aiDiagnosisService } from '@/services/ai/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, district, state, language } = body;

    const validation = validateSymptomInput(text);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error || 'Please provide a valid symptom description.' },
        { status: 400 }
      );
    }

    const diagnosis = await aiDiagnosisService.diagnoseCrop({
      textDescription: validation.sanitizedText,
      language: language || 'en',
      locationContext: {
        district: district || undefined,
        state: state || undefined,
      },
    });

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error) {
    console.error('Error in text diagnosis endpoint:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete symptom diagnosis. Please check your text and retry.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
