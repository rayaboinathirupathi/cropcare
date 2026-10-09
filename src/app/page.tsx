'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { PhotoUpload } from '@/components/PhotoUpload';
import { SymptomForm } from '@/components/SymptomForm';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { WeatherWidget } from '@/components/WeatherWidget';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { 
  Camera, 
  Edit3, 
  Mic, 
  History, 
  ArrowRight, 
  ShieldCheck, 
  Tractor, 
  CheckCircle2 
} from 'lucide-react';

export default function HomePage() {
  const { dict } = useI18n();
  const [activeTab, setActiveTab] = useState<'photo' | 'text' | 'voice'>('photo');
  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recent_crop_scans') || '[]');
      setRecentScans(saved);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-agri-900 via-agri-800 to-agri-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-agri-700/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-agri-200 mb-3 border border-agri-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
            <span>ICAR & CIBRC Knowledge Grounding</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {dict.home.heroTitle}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-agri-100 leading-relaxed max-w-xl">
            {dict.home.heroSubtitle}
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 opacity-15 pointer-events-none hidden md:block">
          <Tractor className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Weather Snapshot Bar */}
      <WeatherWidget compact={true} />

      {/* Main 3 Diagnostic Modalities Container */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {dict.home.inputOptionsTitle}
          </h2>
          <span className="text-xs text-agri-700 font-semibold hidden sm:inline">
            Free • No Signup Required
          </span>
        </div>

        {/* 3 Large Input Option Tabs */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              activeTab === 'photo'
                ? 'bg-agri-50 border-agri-600 text-agri-900 shadow-sm scale-102'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'photo' ? 'bg-agri-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                {dict.home.tabPhoto}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Camera & Gallery</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              activeTab === 'text'
                ? 'bg-agri-50 border-agri-600 text-agri-900 shadow-sm scale-102'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'text' ? 'bg-agri-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                {dict.home.tabText}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Type Natural Text</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('voice')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-2 p-3 sm:p-4 rounded-2xl border-2 transition-all ${
              activeTab === 'voice'
                ? 'bg-agri-50 border-agri-600 text-agri-900 shadow-sm scale-102'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'voice' ? 'bg-agri-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
              <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs sm:text-sm font-bold block leading-tight">
                {dict.home.tabVoice}
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:block">Regional Voice</span>
            </div>
          </button>
        </div>

        {/* Selected Input Panel */}
        <div className="transition-all duration-200">
          {activeTab === 'photo' && <PhotoUpload />}
          {activeTab === 'text' && <SymptomForm />}
          {activeTab === 'voice' && <VoiceRecorder />}
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />

      {/* Recent Scans Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-agri-600" />
            {dict.home.recentScansTitle}
          </h3>
          {recentScans.length > 0 && (
            <Link
              href="/history"
              className="text-xs font-semibold text-agri-700 hover:text-agri-900 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <p className="text-xs">{dict.home.noRecentScans}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentScans.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/diagnose/result?id=${item.id}`}
                className="p-3 bg-slate-50 hover:bg-agri-50/60 border border-slate-200 rounded-xl transition-colors block"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span className="font-bold text-slate-800">{item.crop}</span>
                  <span>{item.date}</span>
                </div>
                <p className="text-xs font-semibold text-slate-900 truncate">
                  {item.condition}
                </p>
                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-agri-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Report Available
                  </span>
                  <span className="text-slate-400 uppercase font-medium">{item.confidence} confidence</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
