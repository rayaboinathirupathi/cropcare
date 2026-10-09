'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { FarmProfile } from '@/types';
import { Tractor, Save, CheckCircle2 } from 'lucide-react';

export default function FarmProfilePage() {
  const { dict } = useI18n();

  const [profile, setProfile] = useState<FarmProfile>({
    id: 'local_profile',
    farmerName: 'Kishan Kumar',
    villageOrTown: 'Hanamkonda',
    district: 'Warangal',
    state: 'Telangana',
    totalLandAcres: 3.5,
    irrigationType: 'borewell',
    cropsGrown: ['Cotton', 'Chilli', 'Paddy / Rice'],
  });

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('farmer_farm_profile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('farmer_farm_profile', JSON.stringify(profile));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const availableCrops = ['Paddy / Rice', 'Chilli', 'Cotton', 'Tomato', 'Wheat', 'Maize / Corn', 'Groundnut / Peanut', 'Sugarcane', 'Soybean'];

  const toggleCrop = (crop: string) => {
    setProfile(prev => {
      const exists = prev.cropsGrown.includes(crop);
      const nextCrops = exists
        ? prev.cropsGrown.filter(c => c !== crop)
        : [...prev.cropsGrown, crop];
      return { ...prev, cropsGrown: nextCrops };
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Tractor className="w-6 h-6 text-agri-600" />
          {dict.farmProfile.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Customize your farm parameters so CropCare AI can tailor weather advisories and dosage calculations automatically.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{dict.farmProfile.savedSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {dict.farmProfile.farmerName}
            </label>
            <input
              type="text"
              value={profile.farmerName}
              onChange={(e) => setProfile({ ...profile, farmerName: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Village / Town / Mandal
            </label>
            <input
              type="text"
              value={profile.villageOrTown}
              onChange={(e) => setProfile({ ...profile, villageOrTown: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {dict.farmProfile.location}
            </label>
            <select
              value={profile.district}
              onChange={(e) => {
                const dist = INDIAN_DISTRICTS.find(d => d.name === e.target.value);
                if (dist) {
                  setProfile({ ...profile, district: dist.name, state: dist.state });
                }
              }}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50 font-medium focus:ring-2 focus:ring-agri-500"
            >
              {INDIAN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {dict.farmProfile.landSize}
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={profile.totalLandAcres}
              onChange={(e) => setProfile({ ...profile, totalLandAcres: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {dict.farmProfile.irrigation}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['borewell', 'drip', 'canal', 'rainfed'] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setProfile({ ...profile, irrigationType: method })}
                className={`p-2.5 rounded-xl border text-xs font-semibold capitalize transition-all ${
                  profile.irrigationType === method
                    ? 'bg-agri-700 text-white border-agri-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {dict.farmProfile.cropsGrown}
          </label>
          <div className="flex flex-wrap gap-2">
            {availableCrops.map((crop) => {
              const active = profile.cropsGrown.includes(crop);
              return (
                <button
                  key={crop}
                  type="button"
                  onClick={() => toggleCrop(crop)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-agri-100 text-agri-900 border border-agri-300 font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {crop} {active ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{dict.farmProfile.saveButton}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
