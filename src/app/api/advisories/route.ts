import { NextRequest, NextResponse } from 'next/server';
import { getAdvisoriesForRegion } from '@/services/weatherService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get('district') || 'Warangal';
  const state = searchParams.get('state') || 'Telangana';

  const advisories = getAdvisoriesForRegion(district, state);
  return NextResponse.json({
    region: `${district}, ${state}`,
    advisories,
    lastUpdated: new Date().toISOString(),
    source: 'ICAR Agromet & State Agricultural University Bulletin',
  });
}
