'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n, LANGUAGE_DISPLAY_NAMES } from '@/i18n';
import { Sprout, PhoneCall, Globe, ShieldCheck } from 'lucide-react';
import { Language } from '@/types';

export function Header() {
  const { language, setLanguage, dict } = useI18n();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top emergency hotline bar */}
      <div className="bg-agri-900 text-agri-100 px-4 py-1.5 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-agri-400" />
          <span>{dict.app.disclaimerBadge}</span>
        </div>
        <a
          href="tel:18001801551"
          className="flex items-center space-x-1.5 hover:text-white transition-colors bg-agri-800 px-2 py-0.5 rounded text-white font-semibold"
          title="Direct Toll-Free Call to Kisan Call Center"
        >
          <PhoneCall className="w-3 h-3 text-agri-300" />
          <span>1800-180-1551 (Kisan Helpline)</span>
        </a>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-md group-hover:bg-agri-700 transition-colors">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              CropCare <span className="text-agri-600 font-extrabold">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
              {dict.app.tagline}
            </p>
          </div>
        </Link>

        {/* Language switcher & settings */}
        <div className="flex items-center space-x-2">
          {/* Language selector toggle pills */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1.5 hidden sm:inline" />
            {(['en', 'te', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === lang
                    ? 'bg-agri-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title={`Switch to ${LANGUAGE_DISPLAY_NAMES[lang].label}`}
              >
                {LANGUAGE_DISPLAY_NAMES[lang].nativeName}
              </button>
            ))}
          </div>

          <Link
            href="/settings/language"
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Settings"
          >
            <span className="text-sm font-semibold sm:hidden">⚙️</span>
            <span className="text-xs font-medium text-slate-700 hidden sm:inline px-2 py-1 bg-slate-100 rounded border border-slate-200">
              {dict.nav.settings}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
