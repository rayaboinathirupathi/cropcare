'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './dictionaries/en';
import { te } from './dictionaries/te';
import { hi } from './dictionaries/hi';
import { Language } from '../types';

type Dictionary = typeof en;

const dictionaries: Record<Language, Dictionary> = {
  en,
  te,
  hi,
};

export const LANGUAGE_SPEECH_CODES: Record<Language, string> = {
  en: 'en-IN',
  te: 'te-IN',
  hi: 'hi-IN',
};

export const LANGUAGE_DISPLAY_NAMES: Record<Language, { label: string; nativeName: string }> = {
  en: { label: 'English', nativeName: 'English' },
  te: { label: 'Telugu', nativeName: 'తెలుగు' },
  hi: { label: 'Hindi', nativeName: 'हिन्दी' },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dict: Dictionary;
  speechCode: string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'cropcare_language_pref';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && (saved === 'en' || saved === 'te' || saved === 'hi')) {
        setLanguageState(saved);
      }
    } catch {
      // In SSR or when localStorage is restricted
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Ignore storage errors
    }
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = language === 'te' ? 'te-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    return new Intl.NumberFormat(locale, options).format(value);
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        dict: dictionaries[language] || en,
        speechCode: LANGUAGE_SPEECH_CODES[language] || 'en-IN',
        formatNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Provide safe fallback for isolated component renders or tests
    return {
      language: 'en' as Language,
      setLanguage: () => {},
      dict: en,
      speechCode: 'en-IN',
      formatNumber: (v: number) => String(v),
    };
  }
  return context;
}

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] || en;
}
