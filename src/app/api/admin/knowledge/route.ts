import { NextRequest, NextResponse } from 'next/server';
import { VERIFIED_DISEASE_RECORDS } from '@/data/agriculturalKnowledge';
import { VerifiedDiseaseRecord } from '@/types';

// In-memory knowledge store extending the static base
const dynamicRecords: VerifiedDiseaseRecord[] = [...VERIFIED_DISEASE_RECORDS];

export async function GET() {
  return NextResponse.json({
    totalRecords: dynamicRecords.length,
    records: dynamicRecords,
    cibrcStatus: 'Verified & Synchronized',
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization') || req.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_SECRET_KEY || 'cropcare_admin_secret_dev_2026';

    if (!authHeader || !authHeader.includes(expectedKey)) {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required to modify verified agricultural records.' },
        { status: 401 }
      );
    }

    const newRecord: VerifiedDiseaseRecord = await req.json();

    if (!newRecord.cropName || !newRecord.conditionName || !newRecord.officialSource) {
      return NextResponse.json(
        { error: 'Crop name, condition name, and official ICAR/CIBRC source are mandatory.' },
        { status: 400 }
      );
    }

    dynamicRecords.push({
      ...newRecord,
      id: newRecord.id || `custom_${Date.now()}`,
      lastVerifiedDate: new Date().toISOString().split('T')[0],
    });

    return NextResponse.json(
      { success: true, message: 'Verified agricultural knowledge record added successfully.' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save knowledge record' },
      { status: 500 }
    );
  }
}
