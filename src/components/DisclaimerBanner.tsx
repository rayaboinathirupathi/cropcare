'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export function DisclaimerBanner({ compact = false }: DisclaimerBannerProps) {
  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 flex items-start space-x-2 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p>
          <strong className="font-semibold">Agricultural Safety Notice:</strong> AI assessments are advisory.
          Chemical applications must adhere strictly to the product container label approved by CIBRC and verified by local agricultural officers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 my-4">
      <div className="flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-emerald-900">
            Authoritative Agricultural Guidance Grounding
          </h4>
          <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
            CropCare AI diagnoses are checked against verified databases from the Indian Council of Agricultural Research (ICAR),
            Central Insecticides Board & Registration Committee (CIBRC), and State Agricultural Universities.
            Dosages and dilution rates are computed deterministically from official product labels. Never mix unauthorized chemical cocktails.
          </p>
        </div>
      </div>
    </div>
  );
}
