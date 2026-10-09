import { NextRequest, NextResponse } from 'next/server';
import { validateImageBuffer } from '@/services/imageValidator';
import { aiDiagnosisService } from '@/services/ai/aiService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;
    const district = formData.get('district') as string | null;
    const state = formData.get('state') as string | null;
    const language = formData.get('language') as string | null;
    const optionalNotes = formData.get('notes') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file was provided. Please capture or upload a crop photo.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Strict magic bytes inspection (do not trust client MIME type or extension)
    const validation = validateImageBuffer(buffer);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.errorMessage || 'Invalid image file.' },
        { status: 400 }
      );
    }

    const diagnosis = await aiDiagnosisService.diagnoseCrop({
      imageBuffer: buffer,
      mimeType: validation.mimeType,
      textDescription: optionalNotes || undefined,
      language: language || 'en',
      locationContext: {
        district: district || undefined,
        state: state || undefined,
      },
    });

    return NextResponse.json(diagnosis, { status: 200 });
  } catch (error) {
    console.error('Error processing crop image diagnosis:', error);
    return NextResponse.json(
      {
        error: 'Failed to complete crop photo analysis. Please try again with a clear photo.',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
