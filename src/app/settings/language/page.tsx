'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n, LANGUAGE_DISPLAY_NAMES } from '@/i18n';
import { Language } from '@/types';
import { Globe, Sun, Type, Volume2, Shield, User, ArrowLeft, Check } from 'lucide-react';

export default function LanguageAndAccessibilityPage() {
  const { dict, language, setLanguage } = useI18n();

  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [audioNarration, setAudioNarration] = useState<boolean>(false);

  useEffect(() => {
    try {
      const hc = localStorage.getItem('cropcare_high_contrast') === 'true';
      const lt = localStorage.getItem('cropcare_large_text') === 'true';
      const an = localStorage.getItem('cropcare_audio_narration') === 'true';
      setHighContrast(hc);
      setLargeText(lt);
      setAudioNarration(an);

      if (hc) document.body.classList.add('high-contrast');
      if (lt) document.body.classList.add('large-text');
    } catch {
      // ignore
    }
  }, []);

  const toggleHighContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('cropcare_high_contrast', String(next));
    if (next) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  };

  const toggleLargeText = () => {
    const next = !largeText;
    setLargeText(next);
    localStorage.setItem('cropcare_large_text', String(next));
    if (next) document.body.classList.add('large-text');
    else document.body.classList.remove('large-text');
  };

  const toggleAudio = () => {
    const next = !audioNarration;
    setAudioNarration(next);
    localStorage.setItem('cropcare_audio_narration', String(next));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sub-nav pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <Link href="/settings/language" className="text-agri-700 bg-agri-50 px-3 py-1.5 rounded-lg border border-agri-200">
          Language & Display
        </Link>
        <Link href="/settings/profile" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Account & Profile
        </Link>
        <Link href="/settings/privacy" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Privacy & Consent
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-agri-600" />
          {dict.settings.languageSection}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select your primary language for voice, diagnostic reports, and dosage labels.
        </p>
      </div>

      {/* Language Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['en', 'te', 'hi'] as Language[]).map((lang) => {
          const isSelected = language === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                isSelected
                  ? 'border-agri-600 bg-agri-50/80 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <span className="text-sm font-extrabold text-slate-900 block">
                  {LANGUAGE_DISPLAY_NAMES[lang].nativeName}
                </span>
                <span className="text-xs text-slate-500">
                  {LANGUAGE_DISPLAY_NAMES[lang].label}
                </span>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full bg-agri-600 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Accessibility & Sunlight Optimization Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Accessibility & Field Usability
        </h2>

        {/* High contrast */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Sun className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {dict.settings.highContrast}
              </span>
              <span className="text-[11px] text-slate-500">
                Enhances contrast and readability in direct sunlight in outdoor farm conditions.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleHighContrast}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              highContrast ? 'bg-agri-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Large text */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <Type className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {dict.settings.largeText}
              </span>
              <span className="text-[11px] text-slate-500">
                Increases font sizes for easier readability on small smartphone screens.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleLargeText}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              largeText ? 'bg-agri-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Audio narration */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <Volume2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                {dict.settings.audioNarration}
              </span>
              <span className="text-[11px] text-slate-500">
                Automatically plays voice narration when an assessment is loaded.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleAudio}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              audioNarration ? 'bg-agri-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </div>
    </div>
  );
}
