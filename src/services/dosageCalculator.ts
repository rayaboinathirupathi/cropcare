import { ChemicalTreatmentRecord, DosageCalculationResult, LandUnit } from '../types';

/**
 * Standard agricultural area conversion factors to Acres:
 * - 1 Acre = 1.0 Acre
 * - 1 Hectare = 2.47105 Acres
 * - 1 Guntha (or Gunta) = 1/40 Acre = 0.025 Acres (standard in AP, Telangana, Maharashtra, Karnataka)
 * - 1 Square Meter = 0.000247105 Acres
 */
export const AREA_CONVERSIONS_TO_ACRES: Record<LandUnit, number> = {
  acre: 1.0,
  hectare: 2.4710538,
  guntha: 0.025,
  sq_meter: 0.000247105,
};

export class DosageCalculationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DosageCalculationError';
  }
}

export function convertToAcres(area: number, unit: LandUnit): number {
  if (area <= 0 || !Number.isFinite(area)) {
    throw new DosageCalculationError('Land area must be a positive number', 'INVALID_AREA');
  }
  const factor = AREA_CONVERSIONS_TO_ACRES[unit];
  if (!factor) {
    throw new DosageCalculationError(`Unsupported land unit: ${unit}`, 'UNSUPPORTED_UNIT');
  }
  return area * factor;
}

export function calculateVerifiedDosage(
  treatment: ChemicalTreatmentRecord,
  area: number,
  unit: LandUnit,
  tankSizeLitres: number = 16
): DosageCalculationResult {
  if (!treatment) {
    throw new DosageCalculationError('Missing verified treatment record', 'MISSING_TREATMENT');
  }

  if (!treatment.labelDoseRate || treatment.labelDoseRate <= 0) {
    throw new DosageCalculationError(
      'Treatment record lacks a verified non-zero label dose rate. Consult local agricultural extension.',
      'INVALID_LABEL_RATE'
    );
  }

  const areaInAcres = convertToAcres(area, unit);

  let rawCalculatedProduct: number;
  let productUnit: 'grams' | 'ml' | 'kilograms' | 'litres';
  let perTankUnit: 'grams' | 'ml';

  switch (treatment.rateUnit) {
    case 'g/acre':
      rawCalculatedProduct = treatment.labelDoseRate * areaInAcres;
      productUnit = rawCalculatedProduct >= 1000 ? 'kilograms' : 'grams';
      perTankUnit = 'grams';
      break;

    case 'ml/acre':
      rawCalculatedProduct = treatment.labelDoseRate * areaInAcres;
      productUnit = rawCalculatedProduct >= 1000 ? 'litres' : 'ml';
      perTankUnit = 'ml';
      break;

    case 'kg/ha': {
      // 1 ha = 2.47105 acres -> rate per acre = (kg * 1000) / 2.47105
      const gPerAcre = (treatment.labelDoseRate * 1000) / AREA_CONVERSIONS_TO_ACRES.hectare;
      rawCalculatedProduct = gPerAcre * areaInAcres;
      productUnit = rawCalculatedProduct >= 1000 ? 'kilograms' : 'grams';
      perTankUnit = 'grams';
      break;
    }

    case 'l/ha': {
      const mlPerAcre = (treatment.labelDoseRate * 1000) / AREA_CONVERSIONS_TO_ACRES.hectare;
      rawCalculatedProduct = mlPerAcre * areaInAcres;
      productUnit = rawCalculatedProduct >= 1000 ? 'litres' : 'ml';
      perTankUnit = 'ml';
      break;
    }

    default:
      throw new DosageCalculationError(
        `Rate unit '${treatment.rateUnit}' requires manual dilution verification. Do not estimate.`,
        'UNVERIFIED_RATE_UNIT'
      );
  }

  const waterLitresPerAcre = treatment.recommendedWaterVolumeLitresPerAcre || 200;
  const totalWaterLitres = Math.round(waterLitresPerAcre * areaInAcres * 10) / 10;

  // Approximate tanks needed
  const exactTanks = totalWaterLitres / tankSizeLitres;
  const tankCount = Math.max(1, Math.ceil(exactTanks));
  const rawProductInBaseUnit = (treatment.rateUnit.startsWith('g') || treatment.rateUnit.startsWith('kg'))
    ? (productUnit === 'kilograms' ? rawCalculatedProduct : rawCalculatedProduct)
    : (productUnit === 'litres' ? rawCalculatedProduct : rawCalculatedProduct);

  const productPerTank = Math.round((rawProductInBaseUnit / exactTanks) * 100) / 100;

  // Output formatting:
  const displayQuantity = productUnit === 'kilograms' || productUnit === 'litres'
    ? Math.round((rawCalculatedProduct / 1000) * 100) / 100
    : Math.round(rawCalculatedProduct * 10) / 10;

  const safetyWarning = `PRECAUTION: Wear required PPE (${treatment.protectiveEquipmentRequired.join(', ')}). ` +
    `Pre-Harvest Interval (PHI) is ${treatment.waitingPeriodDaysPHI} days. Do not exceed ${treatment.maxApplicationsPerSeason} spray(s) per season. ` +
    `Never spray in windy conditions or during peak afternoon sunlight.`;

  const labelInstructionsVerbatim = `Approved Label Rate: ${treatment.labelDoseRate} ${treatment.rateUnit} ` +
    `in ${treatment.recommendedWaterVolumeLitresPerAcre}L water/acre for ${treatment.approvedCrop} against ${treatment.targetCondition}. ` +
    `Reference: ${treatment.cibrcRegistrationReference}.`;

  return {
    treatmentRecord: treatment,
    inputArea: area,
    inputUnit: unit,
    areaInAcres: Math.round(areaInAcres * 1000) / 1000,
    calculatedProductQuantity: displayQuantity,
    productQuantityUnit: productUnit,
    totalWaterVolumeLitres: totalWaterLitres,
    numberOfTanksApprox: {
      tankSizeLitres,
      tankCount,
      productPerTank,
      productPerTankUnit: perTankUnit,
    },
    safetyWarning,
    labelInstructionsVerbatim,
    phiDays: treatment.waitingPeriodDaysPHI,
  };
}
