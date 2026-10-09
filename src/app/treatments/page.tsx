'use client';

import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { VERIFIED_DISEASE_RECORDS } from '@/data/agriculturalKnowledge';
import { DosageCalculatorWidget } from '@/components/DosageCalculatorWidget';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Search, FlaskConical, Leaf, ShieldAlert, BookOpen } from 'lucide-react';

export default function TreatmentsPage() {
  const { dict } = useI18n();
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRecordId, setActiveRecordId] = useState<string>(VERIFIED_DISEASE_RECORDS[0].id);

  const crops = ['All', 'Paddy / Rice', 'Chilli', 'Cotton', 'Tomato', 'Wheat', 'Maize / Corn', 'Groundnut / Peanut'];

  const filteredRecords = VERIFIED_DISEASE_RECORDS.filter((rec) => {
    const matchesCrop = selectedCrop === 'All' || rec.cropName.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesQuery = !searchQuery.trim() ||
      rec.conditionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.symptoms.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCrop && matchesQuery;
  });

  const selectedRecord = VERIFIED_DISEASE_RECORDS.find(r => r.id === activeRecordId) || filteredRecords[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-agri-600" />
          {dict.nav.treatments}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore officially approved pest & disease management protocols from ICAR institutes and CIBRC registrations.
        </p>
      </div>

      <DisclaimerBanner />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Crop Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedCrop === c
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search disease, crop, symptom..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-agri-500"
          />
        </div>
      </div>

      {/* Main Grid: Disease Selector List & Detailed Protocol View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disease list */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Verified Knowledge Records ({filteredRecords.length})
          </h2>
          {filteredRecords.map((r) => (
            <button
              key={r.id}
              onClick={() => setActiveRecordId(r.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                selectedRecord?.id === r.id
                  ? 'bg-agri-50 border-agri-600 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center text-[11px] font-bold text-agri-800 mb-0.5">
                <span>{r.cropName}</span>
                <span className="text-[10px] text-slate-400 uppercase">{r.conditionType}</span>
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                {r.conditionName}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {r.symptoms[0]}
              </p>
            </button>
          ))}
        </div>

        {/* Selected Record Protocol Details */}
        {selectedRecord && (
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <span className="font-bold text-agri-800 bg-agri-50 px-2.5 py-1 rounded-lg">
                  {selectedRecord.cropName} ({selectedRecord.cropScientificName})
                </span>
                <span className="text-slate-400 text-[11px]">
                  Verified: {selectedRecord.lastVerifiedDate}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mt-2">
                {selectedRecord.conditionName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Source: {selectedRecord.officialSource}
              </p>

              {/* Symptoms */}
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Diagnostic Symptoms:
                </h3>
                <ul className="space-y-1 text-xs text-slate-700">
                  {selectedRecord.symptoms.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-agri-600 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cultural & Biological Options */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                    <Leaf className="w-4 h-4 text-agri-600" />
                    Cultural / IPM Sanitation:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {selectedRecord.culturalPractices.map((c, idx) => (
                      <li key={idx}>• {c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Biological Controls:
                  </h4>
                  {selectedRecord.biologicalControls.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRecord.biologicalControls.map((b, idx) => (
                        <div key={idx} className="text-xs">
                          <strong className="text-emerald-900 font-semibold">{b.agentName}</strong>
                          <p className="text-slate-600 text-[11px] mt-0.5">{b.applicationMethod}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No specific bio-agents registered for this condition. Prioritize cultural sanitation.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Deterministic Unit-Aware Dosage Calculator */}
            <DosageCalculatorWidget
              treatments={selectedRecord.chemicalTreatments}
              cropName={selectedRecord.cropName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
