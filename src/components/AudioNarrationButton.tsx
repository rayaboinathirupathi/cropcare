'use client';

import React, { useState, useEffect } from 'react';
import { useI18n, LANGUAGE_SPEECH_CODES } from '@/i18n';
import { Volume2, VolumeX, Globe } from 'lucide-react';
import { Language } from '@/types';

interface AudioNarrationButtonProps {
  scripts?: {
    en: string;
    te: string;
    hi: string;
  };
  textToSpeak?: string;
  compact?: boolean;
}

export function AudioNarrationButton({
  scripts,
  textToSpeak,
  compact = false,
}: AudioNarrationButtonProps) {
  const { language: currentAppLang, dict } = useI18n();
  const [audioLang, setAudioLang] = useState<Language>(currentAppLang);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Sync default audio language when user changes app language
  useEffect(() => {
    setAudioLang(currentAppLang);
  }, [currentAppLang]);

  // Load available speech synthesis voices from browser
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const getActiveScript = (lang: Language): string => {
    if (scripts && scripts[lang]) {
      return scripts[lang];
    }
    return textToSpeak || '';
  };

  const handleSpeak = (selectedLanguage: Language = audioLang) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech audio narration is not supported in this browser.');
      return;
    }

    // If currently speaking the same language, toggle stop
    if (isSpeaking && audioLang === selectedLanguage) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any active playback

    const script = getActiveScript(selectedLanguage);
    if (!script) return;

    setAudioLang(selectedLanguage);

    const utterance = new SpeechSynthesisUtterance(script);
    const speechCode = LANGUAGE_SPEECH_CODES[selectedLanguage] || 'en-IN';
    utterance.lang = speechCode;
    utterance.rate = 0.88; // Slightly slower tempo for clear comprehension in outdoor conditions

    // Attempt to pick the best native voice matching the language
    if (availableVoices.length > 0) {
      const matchingVoice = availableVoices.find(v => 
        v.lang === speechCode ||
        v.lang.startsWith(selectedLanguage) ||
        (selectedLanguage === 'hi' && (v.lang.includes('hi') || v.name.includes('Hindi'))) ||
        (selectedLanguage === 'te' && (v.lang.includes('te') || v.name.includes('Telugu')))
      );
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const langLabels: Record<Language, string> = {
    en: 'English',
    te: 'తెలుగు (Telugu)',
    hi: 'हिन्दी (Hindi)',
  };

  return (
    <div className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-agri-50/80 p-1.5 rounded-2xl border border-agri-200 shadow-2xs">
      {/* Primary Speak / Stop Trigger Button */}
      <button
        type="button"
        onClick={() => handleSpeak(audioLang)}
        className={`inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
          isSpeaking
            ? 'bg-red-600 text-white animate-pulse'
            : 'bg-agri-700 hover:bg-agri-800 text-white'
        }`}
        title={isSpeaking ? 'Stop voice reading' : `Listen in ${langLabels[audioLang]}`}
      >
        {isSpeaking ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Stop Voice ({audioLang.toUpperCase()})</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 text-agri-200" />
            <span>{dict.diagnosis.readAloud}</span>
          </>
        )}
      </button>

      {/* Multilingual Voice Selection Pills */}
      <div className="flex items-center justify-center bg-white/90 p-0.5 rounded-xl border border-agri-200/80 text-[11px] font-semibold">
        {(['en', 'te', 'hi'] as Language[]).map((lang) => {
          const isActive = audioLang === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => handleSpeak(lang)}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-agri-100 text-agri-950 font-bold border border-agri-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={`Listen assessment in ${langLabels[lang]}`}
            >
              {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिन्दी'}
            </button>
          );
        })}
      </div>
    </div>
  );
}
