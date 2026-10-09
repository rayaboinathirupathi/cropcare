import { NextRequest, NextResponse } from 'next/server';
import { fetchLiveWeatherData } from '@/services/weatherService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const district = searchParams.get('district') || 'Current Field';

  // Default to Warangal, Telangana coordinates if none passed
  const lat = latStr ? parseFloat(latStr) : 17.9689;
  const lon = lonStr ? parseFloat(lonStr) : 79.5941;

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json(
      { error: 'Invalid geographic coordinates provided.' },
      { status: 400 }
    );
  }

  try {
    const weather = await fetchLiveWeatherData(lat, lon, district);
    return NextResponse.json(weather, { status: 200 });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      {
        error: 'Unable to retrieve meteorological data for this location.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
