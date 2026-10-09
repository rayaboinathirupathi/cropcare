import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/services/supabase/client';
import { getAllFromMemory, saveToMemory } from '@/services/diagnosisStore';
import { CropDiagnosisResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('diagnosis_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

  // Fallback to memory store
  const results = getAllFromMemory();
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  try {
    const body: CropDiagnosisResponse = await req.json();

    if (!body || !body.id) {
      return NextResponse.json({ error: 'Diagnosis record must have an ID' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('diagnosis_results').insert({
        id: body.id,
        detected_crop: body.crop?.name,
        likely_condition: body.diagnoses[0]?.condition || 'Unknown',
        condition_type: body.diagnoses[0]?.conditionType || 'unknown',
        confidence_level: body.diagnoses[0]?.confidence || 'low',
        confidence_score: body.diagnoses[0]?.confidenceScore || 0.5,
        evidence_json: body.diagnoses[0]?.evidence || [],
        alternatives_json: body.diagnoses[0]?.alternatives || [],
        ai_provider_used: body.aiProviderUsed,
      });
    }

    saveToMemory(body);
    return NextResponse.json({ success: true, savedId: body.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving diagnosis session:', error);
    return NextResponse.json({ error: 'Failed to save diagnosis' }, { status: 500 });
  }
}
