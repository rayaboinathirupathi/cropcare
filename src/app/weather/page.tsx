'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';
import { WeatherWidget } from '@/components/WeatherWidget';
import { AgriculturalAdvisory } from '@/types';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { CloudSun, Bell, ShieldCheck, Calendar, MapPin } from 'lucide-react';

export default function WeatherPage() {
  const { dict } = useI18n();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Warangal');
  const [advisories, setAdvisories] = useState<AgriculturalAdvisory[]>([]);

  useEffect(() => {
    const dist = INDIAN_DISTRICTS.find(d => d.name === selectedDistrict) || INDIAN_DISTRICTS[0];
    fetch(`/api/advisories?district=${encodeURIComponent(dist.name)}&state=${encodeURIComponent(dist.state)}`)
      .then(res => res.json())
      .then(data => {
        if (data.advisories) setAdvisories(data.advisories);
      })
      .catch(err => console.error('Error loading advisories:', err));
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <CloudSun className="w-6 h-6 text-agri-600" />
          {dict.weather.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {dict.weather.subtitle}
        </p>
      </div>

      {/* Main Full-Size Weather & Agronomic Risk Component */}
      <WeatherWidget initialDistrict={selectedDistrict} />

      {/* Regional Agromet Advisory Bulletin Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-agri-600" />
              {dict.weather.advisoryHeader}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued for farmers in {selectedDistrict} and surrounding blocks
            </p>
          </div>
          <span className="text-[11px] font-bold text-agri-800 bg-agri-50 px-2.5 py-1 rounded-lg border border-agri-200">
            Official Bulletin
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {advisories.map((adv) => (
            <div key={adv.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                <span className="font-bold text-slate-800">{adv.issuedBy}</span>
                <span className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {adv.date}
                </span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                {adv.title}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed">
                {adv.advisoryText}
              </p>

              {adv.urgentNotice && (
                <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{adv.urgentNotice}</span>
                </div>
              )}

              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="font-semibold">Focus Crops:</span>
                {adv.cropFocus.map((c, i) => (
                  <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
