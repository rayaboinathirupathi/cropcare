import { NextRequest, NextResponse } from 'next/server';
import { calculateVerifiedDosage, DosageCalculationError } from '@/services/dosageCalculator';
import { VERIFIED_DISEASE_RECORDS } from '@/data/agriculturalKnowledge';
import { LandUnit } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { treatmentRecordId, landArea, landUnit, tankSizeLitres } = body;

    if (!treatmentRecordId) {
      return NextResponse.json(
        { error: 'Treatment record ID is required to calculate label-compliant dosage.' },
        { status: 400 }
      );
    }

    const areaNum = parseFloat(landArea);
    if (isNaN(areaNum) || areaNum <= 0) {
      return NextResponse.json(
        { error: 'Please enter a valid positive land area.' },
        { status: 400 }
      );
    }

    const validUnits: LandUnit[] = ['acre', 'hectare', 'guntha', 'sq_meter'];
    if (!validUnits.includes(landUnit)) {
      return NextResponse.json(
        { error: `Invalid land unit. Allowed units: ${validUnits.join(', ')}` },
        { status: 400 }
      );
    }

    // Locate verified treatment record
    let foundTreatment = null;
    for (const disease of VERIFIED_DISEASE_RECORDS) {
      for (const chem of disease.chemicalTreatments) {
        if (chem.activeIngredient === treatmentRecordId || chem.cibrcRegistrationReference.includes(treatmentRecordId)) {
          foundTreatment = chem;
          break;
        }
      }
      if (foundTreatment) break;
    }

    // If not found by exact string, search by active ingredient prefix
    if (!foundTreatment) {
      for (const disease of VERIFIED_DISEASE_RECORDS) {
        for (const chem of disease.chemicalTreatments) {
          if (chem.activeIngredient.toLowerCase().includes(treatmentRecordId.toLowerCase())) {
            foundTreatment = chem;
            break;
          }
        }
        if (foundTreatment) break;
      }
    }

    if (!foundTreatment) {
      return NextResponse.json(
        {
          error: 'Treatment formulation not found in verified CIBRC registry. Dosage cannot be safely extrapolated without approved label.',
          code: 'UNVERIFIED_PRODUCT'
        },
        { status: 404 }
      );
    }

    const tankSize = tankSizeLitres ? parseFloat(tankSizeLitres) : 16;
    const result = calculateVerifiedDosage(foundTreatment, areaNum, landUnit, tankSize);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof DosageCalculationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }
    console.error('Error calculating dosage:', error);
    return NextResponse.json(
      { error: 'Calculation failed due to an unexpected error.' },
      { status: 500 }
    );
  }
}
