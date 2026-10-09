'use client';

import React from 'react';
import { useI18n } from '@/i18n';
import { BookOpen, Camera, ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EducationPage() {
  const { dict } = useI18n();

  const toxicityCodes = [
    {
      color: 'bg-emerald-500',
      label: 'Green Triangle (Slightly Toxic)',
      desc: 'Caution. Relatively safe for mammals; maintain standard basic precautions.',
    },
    {
      color: 'bg-blue-500',
      label: 'Blue Triangle (Moderately Toxic)',
      desc: 'Danger / Warning. Requires protective gloves, eye gear, and respirator mask.',
    },
    {
      color: 'bg-amber-400',
      label: 'Yellow Triangle (Highly Toxic)',
      desc: 'Poison. Strict adherence to PPE; do not spray near water sources or beehives.',
    },
    {
      color: 'bg-red-600',
      label: 'Red Triangle (Extremely Toxic)',
      desc: 'Extremely Poisonous. Severe restriction; handle with specialized full-body gear only.',
    },
  ];

  const helplines = [
    {
      name: 'Kisan Call Center (Ministry of Agriculture, GoI)',
      number: '1800-180-1551',
      desc: 'Free toll-free consultation with agronomists in 22 regional Indian languages (6 AM - 10 PM)',
    },
    {
      name: 'ICAR - Indian Agricultural Research Institute (Pusa Helpline)',
      number: '011-25841000',
      desc: 'Crop pathology and national advisory desk',
    },
    {
      name: 'Professor Jayashankar Telangana State Agri Univ (PJTSAU)',
      number: '1800-425-3536',
      desc: 'Toll-free farmer advice for Telangana region',
    },
    {
      name: 'Acharya N.G. Ranga Agricultural University (ANGRAU)',
      number: '1800-425-0430',
      desc: 'Toll-free advisory for Andhra Pradesh region',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-agri-600" />
          {dict.education.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Essential agricultural best practices, pesticide safety standards, and photography tips for high-accuracy diagnosis.
        </p>
      </div>

      {/* Photography Guide */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Camera className="w-5 h-5 text-agri-600" />
          {dict.education.photoTipsTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. Close Focus</span>
            <p>{dict.education.tip1}</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. Natural Lighting</span>
            <p>{dict.education.tip2}</p>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. Check Underside</span>
            <p>{dict.education.tip3}</p>
          </div>
        </div>
      </div>

      {/* Pesticide Safety & CIBRC Compliance */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          {dict.education.pesticideSafetyTitle}
        </h2>

        <div className="space-y-2 text-xs text-slate-700">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
            <span>{dict.education.safetyRule1}</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
            <span>{dict.education.safetyRule2}</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
            <span>{dict.education.safetyRule3}</span>
          </p>
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
            <span>{dict.education.safetyRule4}</span>
          </p>
        </div>

        {/* Toxicity Triangle Guide */}
        <div className="pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Understanding Toxicity Triangle Labels on Chemical Containers:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toxicityCodes.map((code, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className={`w-4 h-4 rounded-sm ${code.color} shrink-0 mt-1 shadow-2xs`} />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">{code.label}</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">{code.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Limitations & Legal Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-xs text-amber-950 space-y-2">
        <h2 className="text-sm font-bold flex items-center gap-2 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-700" />
          AI Assistant Limitations & Safe Boundaries
        </h2>
        <p>
          CropCare AI uses advanced computer vision and verified agricultural pathology data to suggest likely diagnoses. However, visual symptoms can mimic physiological stresses (e.g., salinity, drought, nutrient deficiency).
        </p>
        <p>
          <strong>Never apply heavy chemical interventions based on AI suggestions alone.</strong> Always confirm with an on-ground agricultural extension officer, Krishi Vigyan Kendra (KVK) scientist, or university plant clinic.
        </p>
      </div>

      {/* Emergency Helpline Directory */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <PhoneCall className="w-5 h-5 text-agri-600" />
          {dict.education.helplineTitle}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{h.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{h.desc}</p>
              </div>
              <a
                href={`tel:${h.number.replace(/[^0-9]/g, '')}`}
                className="mt-3 inline-flex items-center gap-1.5 font-bold text-xs text-agri-700 hover:text-agri-900 bg-white p-2 rounded-xl border border-slate-200"
              >
                <PhoneCall className="w-3.5 h-3.5 text-agri-600" />
                <span>{h.number} (Tap to Call)</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
