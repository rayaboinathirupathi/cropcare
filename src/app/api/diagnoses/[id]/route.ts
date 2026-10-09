import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/services/supabase/client';
import { getFromMemory, deleteFromMemory } from '@/services/diagnosisStore';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('diagnosis_results')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      return NextResponse.json(data);
    }
  }

  const memoryResult = getFromMemory(id);
  if (memoryResult) {
    return NextResponse.json(memoryResult);
  }

  return NextResponse.json({ error: 'Diagnosis record not found' }, { status: 404 });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const supabase = getSupabaseClient();

  if (supabase) {
    await supabase.from('diagnosis_results').delete().eq('id', id);
  }

  deleteFromMemory(id);
  return NextResponse.json({ success: true, message: 'Diagnosis record deleted' });
}
