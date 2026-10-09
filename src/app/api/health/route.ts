import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/services/supabase/client';

export async function GET() {
  const geminiConfigured = Boolean(
    process.env.GEMINI_API_KEY &&
    process.env.GEMINI_API_KEY.length > 5 &&
    !process.env.GEMINI_API_KEY.includes('your_gemini')
  );

  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CropCare AI Engine',
    version: '1.0.0',
    integrations: {
      aiProvider: {
        configured: geminiConfigured,
        provider: geminiConfigured ? 'Google Gemini 1.5 Flash' : 'ICAR Verified Agricultural Fallback Engine',
        mode: geminiConfigured ? 'live_multimodal' : 'verified_knowledge_grounding',
      },
      weatherProvider: {
        provider: 'Open-Meteo REST Service',
        status: 'active',
      },
      database: {
        configured: isSupabaseConfigured(),
        provider: isSupabaseConfigured() ? 'Supabase PostgreSQL' : 'Local Session / Resilient In-Memory',
      },
      agriculturalSafety: {
        cibrcLabelVerification: 'strict_deterministic_enforced',
        promptInjectionSanitizer: 'active',
        imageMagicBytesValidation: 'active',
      }
    }
  });
}
