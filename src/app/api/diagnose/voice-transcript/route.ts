import { NextRequest, NextResponse } from 'next/server';
import { validateSymptomInput } from '@/services/promptSanitizer';
import { aiDiagnosisService } from '@/services/ai/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, district, state, language, speechProvider } = body;

    const validation = validateSymptomInput(transcript);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Speech transcript was too brief or empty. Please speak your crop symptoms clearly or type them.' },
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

    return NextResponse.json({
      ...diagnosis,
      voiceTranscriptMetadata: {
        rawTranscriptLength: transcript.length,
        speechEngineUsed: speechProvider || 'Web Speech API Client Transcription',
        note: 'Transcript text was processed through agricultural reasoning engine.',
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in voice-transcript diagnosis route:', error);
    return NextResponse.json(
      {
        error: 'Failed to process voice transcript. Please retry or enter symptoms using keyboard.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
