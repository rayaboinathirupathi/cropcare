'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { ChemicalTreatmentRecord, DosageCalculationResult, LandUnit } from '@/types';
import { Calculator, ShieldAlert, Clock, Droplets, CheckCircle2, Info } from 'lucide-react';

interface DosageCalculatorWidgetProps {
  treatments: ChemicalTreatmentRecord[];
  cropName?: string;
}

export function DosageCalculatorWidget({ treatments, cropName }: DosageCalculatorWidgetProps) {
  const { dict, formatNumber } = useI18n();

  const [selectedTreatmentIndex, setSelectedTreatmentIndex] = useState<number>(0);
  const [landArea, setLandArea] = useState<number>(1);
  const [landUnit, setLandUnit] = useState<LandUnit>('acre');
  const [tankSize, setTankSize] = useState<number>(16);
  const [result, setResult] = useState<DosageCalculationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeTreatment = treatments[selectedTreatmentIndex];

  const handleCalculate = async () => {
    if (!activeTreatment) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/treatments/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatmentRecordId: activeTreatment.activeIngredient,
          landArea,
          landUnit,
          tankSizeLitres: tankSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to calculate dosage');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating dosage');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTreatment) {
      handleCalculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTreatmentIndex, landArea, landUnit, tankSize]);

  if (!treatments || treatments.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-start gap-2">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p>
          No verified chemical treatments are officially registered for this condition in our database.
          Please prioritize non-chemical and biological practices or consult your local agricultural extension officer.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-agri-100 text-agri-700 rounded-lg">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">
            {dict.diagnosis.dosageCalculatorTitle}
          </h4>
          <p className="text-xs text-slate-500">
            {dict.diagnosis.dosageCalculatorDesc}
          </p>
        </div>
      </div>

      {/* Select Formulation */}
      <div className="mt-4 space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Approved Formulation & Active Ingredient:
          </label>
          <select
            value={selectedTreatmentIndex}
            onChange={(e) => setSelectedTreatmentIndex(parseInt(e.target.value, 10))}
            className="w-full text-xs font-medium border border-slate-300 rounded-xl px-3 py-2.5 bg-slate-50 focus:ring-2 focus:ring-agri-500"
          >
            {treatments.map((t, idx) => (
              <option key={idx} value={idx}>
                {t.activeIngredient} ({t.formulation}) — Label Rate: {t.labelDoseRate} {t.rateUnit}
              </option>
            ))}
          </select>
        </div>

        {/* Input Land Area and Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {dict.diagnosis.landAreaLabel}:
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={landArea}
                onChange={(e) => setLandArea(Math.max(0.01, parseFloat(e.target.value) || 0))}
                className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500 font-bold"
              />
              <select
                value={landUnit}
                onChange={(e) => setLandUnit(e.target.value as LandUnit)}
                className="w-1/2 px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-agri-500"
              >
                <option value="acre">{dict.diagnosis.acres} (1 Acre)</option>
                <option value="hectare">{dict.diagnosis.hectares} (2.47 Acres)</option>
                <option value="guntha">{dict.diagnosis.gunthas} (0.025 Acre)</option>
                <option value="sq_meter">Square Meters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sprayer Tank Size:
            </label>
            <select
              value={tankSize}
              onChange={(e) => setTankSize(parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-xs font-semibold border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-agri-500"
            >
              <option value="16">16 Litres (Standard Knapsack)</option>
              <option value="15">15 Litres (Knapsack)</option>
              <option value="20">20 Litres (Battery Sprayer)</option>
              <option value="50">50 Litres (Power Trolley)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2.5 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
          {error}
        </div>
      )}

      {/* Calculated Results Card */}
      {result && (
        <div className="mt-5 p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Exact Product Quantity */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                {dict.diagnosis.calculatedQuantity}
              </span>
              <div className="text-2xl font-black text-emerald-950 mt-1 flex items-baseline gap-1.5">
                <span>{formatNumber(result.calculatedProductQuantity)}</span>
                <span className="text-sm font-bold text-emerald-700">{result.productQuantityUnit}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                For {result.inputArea} {result.inputUnit} ({result.areaInAcres} acres)
              </p>
            </div>

            {/* Total Water & Tank breakdown */}
            <div className="bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-600" />
                {dict.diagnosis.dilutionWater}
              </span>
              <div className="text-2xl font-black text-blue-950 mt-1 flex items-baseline gap-1.5">
                <span>{formatNumber(result.totalWaterVolumeLitres)}</span>
                <span className="text-sm font-bold text-blue-700">Litres</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                ≈ <strong>{result.numberOfTanksApprox.tankCount} tanks</strong> ({result.numberOfTanksApprox.tankSizeLitres}L each) @ <strong>{result.numberOfTanksApprox.productPerTank} {result.numberOfTanksApprox.productPerTankUnit}/tank</strong>
              </p>
            </div>
          </div>

          {/* Critical Pre-Harvest Interval (PHI) & PPE Badges */}
          <div className="mt-3 pt-3 border-t border-emerald-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{dict.diagnosis.phiNotice}</strong>{' '}
                <span className="font-bold text-amber-700">{result.phiDays} {dict.diagnosis.days}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-800">
              <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>{dict.diagnosis.ppeNotice}</strong>{' '}
                {result.treatmentRecord.protectiveEquipmentRequired.join(', ')}
              </span>
            </div>
          </div>

          {/* Verbatim Label Reference */}
          <div className="mt-3 bg-white/80 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-700 block mb-0.5">
              {dict.diagnosis.labelSourceReference}
            </span>
            <p>{result.labelInstructionsVerbatim}</p>
          </div>
        </div>
      )}
    </div>
  );
}
