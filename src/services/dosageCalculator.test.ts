import { describe, it, expect } from 'vitest';
import { 
  convertToAcres, 
  calculateVerifiedDosage, 
  DosageCalculationError,
  AREA_CONVERSIONS_TO_ACRES 
} from './dosageCalculator';
import { ChemicalTreatmentRecord } from '../types';

describe('Dosage Calculator Service', () => {
  const sampleTreatment: ChemicalTreatmentRecord = {
    activeIngredient: 'Tricyclazole 75% WP',
    formulation: '75% WP',
    approvedCrop: 'Paddy / Rice',
    targetCondition: 'Rice Blast',
    labelDoseRate: 120, // 120 g per acre
    rateUnit: 'g/acre',
    recommendedWaterVolumeLitresPerAcre: 200,
    applicationMethod: 'Foliar spray with knapsack sprayer',
    maxApplicationsPerSeason: 2,
    waitingPeriodDaysPHI: 30,
    toxicityColorCode: 'blue',
    protectiveEquipmentRequired: ['Gloves', 'Eye glasses', 'Mask'],
    cibrcRegistrationReference: 'CIBRC Registered for Paddy Blast'
  };

  describe('Area Unit Conversion to Acres', () => {
    it('accurately handles 1 Acre', () => {
      expect(convertToAcres(1, 'acre')).toBe(1.0);
    });

    it('accurately converts 1 Hectare to ~2.471 Acres', () => {
      const acres = convertToAcres(1, 'hectare');
      expect(acres).toBeCloseTo(2.471, 2);
    });

    it('accurately converts Indian Gunthas (1 Guntha = 0.025 Acre)', () => {
      expect(convertToAcres(40, 'guntha')).toBeCloseTo(1.0, 3);
      expect(convertToAcres(20, 'guntha')).toBeCloseTo(0.5, 3);
    });

    it('throws DosageCalculationError on negative or zero land area', () => {
      expect(() => convertToAcres(0, 'acre')).toThrow(DosageCalculationError);
      expect(() => convertToAcres(-5, 'acre')).toThrow(DosageCalculationError);
    });
  });

  describe('Deterministic Dosage Calculation', () => {
    it('calculates exact dosage for 1 acre with grams unit', () => {
      const result = calculateVerifiedDosage(sampleTreatment, 1, 'acre');
      expect(result.calculatedProductQuantity).toBe(120);
      expect(result.productQuantityUnit).toBe('grams');
      expect(result.totalWaterVolumeLitres).toBe(200);
      expect(result.phiDays).toBe(30);
    });

    it('converts to kilograms when total product is >= 1000g', () => {
      // 10 acres * 120g/acre = 1200g = 1.2 kg
      const result = calculateVerifiedDosage(sampleTreatment, 10, 'acre');
      expect(result.calculatedProductQuantity).toBe(1.2);
      expect(result.productQuantityUnit).toBe('kilograms');
      expect(result.totalWaterVolumeLitres).toBe(2000);
    });

    it('accurately computes knapsack sprayer tanks for 16-litre tank', () => {
      // 1 acre = 200L water. 200 / 16 = 12.5 tanks -> 13 tanks approx
      const result = calculateVerifiedDosage(sampleTreatment, 1, 'acre', 16);
      expect(result.numberOfTanksApprox.tankCount).toBe(13);
      expect(result.numberOfTanksApprox.tankSizeLitres).toBe(16);
      expect(result.numberOfTanksApprox.productPerTank).toBeCloseTo(9.6, 1);
    });

    it('correctly calculates dosage for liquid ml/acre formulation', () => {
      const liquidTreatment: ChemicalTreatmentRecord = {
        ...sampleTreatment,
        activeIngredient: 'Chlorantraniliprole 18.5% SC',
        labelDoseRate: 60,
        rateUnit: 'ml/acre',
      };
      const result = calculateVerifiedDosage(liquidTreatment, 2, 'acre');
      expect(result.calculatedProductQuantity).toBe(120);
      expect(result.productQuantityUnit).toBe('ml');
    });

    it('refuses calculation when treatment record has zero or invalid dose rate', () => {
      const invalidTreatment = { ...sampleTreatment, labelDoseRate: 0 };
      expect(() => calculateVerifiedDosage(invalidTreatment, 1, 'acre')).toThrow(
        'Treatment record lacks a verified non-zero label dose rate'
      );
    });
  });
});
