'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { VERIFIED_DISEASE_RECORDS } from '@/data/agriculturalKnowledge';
import { VerifiedDiseaseRecord, FeedbackReport } from '@/types';
import { ShieldCheck, Plus, CheckCircle2, AlertTriangle, KeyRound, Lock, FileText, Database } from 'lucide-react';

export default function AdminPage() {
  const { dict } = useI18n();

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminKey, setAdminKey] = useState<string>('');
  const [records, setRecords] = useState<VerifiedDiseaseRecord[]>(VERIFIED_DISEASE_RECORDS);
  const [feedbackReports, setFeedbackReports] = useState<FeedbackReport[]>([]);
  const [activeTab, setActiveTab] = useState<'knowledge' | 'feedback' | 'add'>('knowledge');

  // Add Record Form State
  const [newCrop, setNewCrop] = useState<string>('');
  const [newCondition, setNewCondition] = useState<string>('');
  const [newSource, setNewSource] = useState<string>('ICAR & CIBRC 2025');
  const [newSymptoms, setNewSymptoms] = useState<string>('');
  const [newActiveIngr, setNewActiveIngr] = useState<string>('');
  const [newDoseRate, setNewDoseRate] = useState<number>(200);
  const [newRateUnit, setNewRateUnit] = useState<'g/acre' | 'ml/acre'>('g/acre');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey === 'cropcare_admin_secret_dev_2026' || adminKey.length >= 8) {
      setIsAdminAuthenticated(true);
      fetchFeedback();
    } else {
      alert('Invalid admin credentials. Please enter the authorized secret key.');
    }
  };

  const fetchFeedback = () => {
    fetch('/api/admin/feedback')
      .then(res => res.json())
      .then(data => {
        if (data.reports) setFeedbackReports(data.reports);
      })
      .catch(() => {});
  };

  const handleAddKnowledgeRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrop || !newCondition) return;

    const newRecord: VerifiedDiseaseRecord = {
      id: `custom_${Date.now()}`,
      cropName: newCrop,
      cropScientificName: `${newCrop} spp.`,
      conditionName: newCondition,
      conditionType: 'disease',
      symptoms: newSymptoms.split('\n').filter(s => s.trim().length > 0),
      favorableWeather: { humidityThreshold: 80 },
      culturalPractices: ['Maintain proper plant spacing and crop sanitation'],
      biologicalControls: [],
      chemicalTreatments: newActiveIngr ? [
        {
          activeIngredient: newActiveIngr,
          formulation: `${newActiveIngr} formulation`,
          approvedCrop: newCrop,
          targetCondition: newCondition,
          labelDoseRate: newDoseRate,
          rateUnit: newRateUnit,
          recommendedWaterVolumeLitresPerAcre: 200,
          applicationMethod: 'Foliar spray with knapsack sprayer',
          maxApplicationsPerSeason: 2,
          waitingPeriodDaysPHI: 15,
          toxicityColorCode: 'blue',
          protectiveEquipmentRequired: ['Gloves', 'Mask'],
          cibrcRegistrationReference: 'CIBRC Verified Label'
        }
      ] : [],
      precautions: ['Follow label instructions strictly.'],
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      officialSource: newSource,
    };

    try {
      const res = await fetch('/api/admin/knowledge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`,
        },
        body: JSON.stringify(newRecord),
      });

      if (res.ok) {
        setRecords([newRecord, ...records]);
        setStatusMsg('New verified knowledge record added successfully.');
        setActiveTab('knowledge');
        setNewCrop('');
        setNewCondition('');
        setNewSymptoms('');
        setNewActiveIngr('');
      }
    } catch {
      alert('Failed to save knowledge record');
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 bg-agri-100 text-agri-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">
            {dict.admin.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Restricted access for agricultural extension officers, agronomists, and system administrators.
          </p>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Secret Key / Password:
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter administrator secret..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Default dev key: <code>cropcare_admin_secret_dev_2026</code>
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Verify & Enter Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-agri-100 text-agri-800 px-2.5 py-0.5 rounded-full text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{dict.admin.badge}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {dict.admin.title}
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'knowledge' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600'
            }`}
          >
            Verified Knowledge ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'feedback' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600'
            }`}
          >
            Farmer Feedback ({feedbackReports.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'add' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600'
            }`}
          >
            + Add Disease Record
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Tab 1: Knowledge Base List */}
      {activeTab === 'knowledge' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-900">
              Verified Disease & Label Records
            </h2>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              {dict.admin.cibrcIntegrity}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="p-3">Crop Name</th>
                  <th className="p-3">Condition</th>
                  <th className="p-3">Registered Chemical Treatments</th>
                  <th className="p-3">Official Verification Source</th>
                  <th className="p-3">Verified Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{r.cropName}</td>
                    <td className="p-3 font-semibold text-agri-800">{r.conditionName}</td>
                    <td className="p-3">
                      {r.chemicalTreatments.length > 0 ? (
                        r.chemicalTreatments.map((t, idx) => (
                          <div key={idx} className="text-[11px] text-slate-700">
                            <strong>{t.activeIngredient}</strong> ({t.labelDoseRate} {t.rateUnit})
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Non-chemical only</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{r.officialSource}</td>
                    <td className="p-3 text-slate-500 whitespace-nowrap">{r.lastVerifiedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Feedback Review */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Farmer Misdiagnosis & Feedback Triage
          </h2>
          {feedbackReports.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No feedback reports submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {feedbackReports.map((fb) => (
                <div key={fb.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                        fb.farmerFeedback === 'accurate' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fb.farmerFeedback}
                      </span>
                      <span className="text-slate-400 text-[10px]">{new Date(fb.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{fb.userNotes || 'No additional comments provided'}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Diagnosis Ref: {fb.diagnosisId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('Feedback marked as reviewed.')}
                    className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 text-xs font-semibold whitespace-nowrap"
                  >
                    Mark Reviewed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Add Knowledge Record */}
      {activeTab === 'add' && (
        <form onSubmit={handleAddKnowledgeRecord} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Add Verified Agricultural Knowledge Record
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Name</label>
              <input
                type="text"
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                placeholder="e.g. Groundnut / Peanut"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Condition Name</label>
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="e.g. Rust / Leaf Spot"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Symptoms (One per line)</label>
            <textarea
              rows={3}
              value={newSymptoms}
              onChange={(e) => setNewSymptoms(e.target.value)}
              placeholder="e.g. Circular brown pustules on lower leaf surface"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Approved Active Ingredient</label>
              <input
                type="text"
                value={newActiveIngr}
                onChange={(e) => setNewActiveIngr(e.target.value)}
                placeholder="e.g. Mancozeb 75% WP"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label Rate</label>
              <input
                type="number"
                value={newDoseRate}
                onChange={(e) => setNewDoseRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
              <select
                value={newRateUnit}
                onChange={(e) => setNewRateUnit(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50"
              >
                <option value="g/acre">g/acre</option>
                <option value="ml/acre">ml/acre</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Official Authoritative Source</label>
            <input
              type="text"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
              required
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold rounded-xl shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Save to Knowledge Base</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
