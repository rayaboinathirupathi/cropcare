'use client';

import React, { useState } from 'react';
import { useI18n, LANGUAGE_SPEECH_CODES } from '@/i18n';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioNarrationButtonProps {
  textToSpeak: string;
}

export function AudioNarrationButton({ textToSpeak }: AudioNarrationButtonProps) {
  const { language, dict } = useI18n();
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech audio narration is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Clear any ongoing speech

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = LANGUAGE_SPEECH_CODES[language] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower, clearer tempo for farmers outdoors

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
        isSpeaking
          ? 'bg-red-600 text-white animate-pulse'
          : 'bg-agri-100 hover:bg-agri-200 text-agri-900 border border-agri-200'
      }`}
      title={isSpeaking ? 'Stop voice reading' : 'Read assessment aloud'}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span>Stop Voice</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-agri-700" />
          <span>{dict.diagnosis.readAloud}</span>
        </>
      )}
    </button>
  );
}
