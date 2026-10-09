'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n, LANGUAGE_SPEECH_CODES } from '@/i18n';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { Mic, MicOff, RefreshCw, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';

export function VoiceRecorder() {
  const { dict, language } = useI18n();
  const router = useRouter();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Warangal');
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser Web Speech API is supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  const startRecording = () => {
    setErrorMessage(null);

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setErrorMessage(dict.errors.speechNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = LANGUAGE_SPEECH_CODES[language] || 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions or type your symptoms.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No voice detected. Please speak closer to the microphone.');
        } else {
          setErrorMessage(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setErrorMessage('Could not access microphone.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    stopRecording();
    setTranscript('');
    setErrorMessage(null);
  };

  const handleAnalyzeTranscript = async () => {
    if (!transcript.trim()) {
      setErrorMessage('Please speak or type your symptoms first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/diagnose/voice-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript.trim(),
          district: selectedDistrict,
          state: selectedState,
          language,
          speechProvider: 'Web Speech API Client Transcription',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process voice transcript.');
      }

      sessionStorage.setItem('latest_diagnosis_result', JSON.stringify(data));
      try {
        const existing = JSON.parse(localStorage.getItem('recent_crop_scans') || '[]');
        existing.unshift({
          id: data.id,
          crop: data.crop?.name || 'Crop',
          condition: data.diagnoses[0]?.condition || 'Voice Assessment',
          confidence: data.diagnoses[0]?.confidence || 'medium',
          date: new Date().toLocaleDateString(),
        });
        localStorage.setItem('recent_crop_scans', JSON.stringify(existing.slice(0, 10)));
      } catch {
        // Ignore local storage error
      }

      router.push(`/diagnose/result?id=${data.id}`);
    } catch (err) {
      console.error('Voice transcript analysis error:', err);
      setErrorMessage(err instanceof Error ? err.message : dict.errors.general);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
          <Mic className="w-5 h-5 text-agri-600" />
          {dict.home.tabVoice}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Speak in your native language ({language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिन्दी' : 'English'}).
          Review and edit the recognized text before submitting.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 text-left">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!speechSupported && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left">
          <strong>Browser Notice:</strong> Speech recognition is not supported in this browser.
          You can use the <strong>&quot;Describe Symptoms&quot;</strong> tab or type your text below.
        </div>
      )}

      {/* Prominent Microphone Tap Button */}
      <div className="my-6 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 ${
            isRecording
              ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-100'
              : 'bg-agri-600 hover:bg-agri-700 text-white ring-8 ring-agri-50'
          }`}
          title={isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
        >
          {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </button>

        <p className="text-xs font-semibold text-slate-700 mt-3">
          {isRecording ? dict.home.voiceListening : dict.home.voiceButton}
        </p>
        <span className="text-[11px] text-slate-400 mt-0.5">
          Speech code: {LANGUAGE_SPEECH_CODES[language] || 'en-IN'}
        </span>
      </div>

      {/* Recognized Transcript Display & Editing Box */}
      <div className="text-left mt-6 pt-4 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex justify-between items-center">
          <span>{dict.home.transcriptTitle}:</span>
          {transcript && (
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-normal"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          )}
        </label>

        <textarea
          rows={3}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder={dict.home.transcriptEditHint}
          className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:outline-hidden bg-slate-50/50"
        />

        {/* Location selector */}
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-600 font-medium">District:</span>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const d = INDIAN_DISTRICTS.find(dist => dist.name === e.target.value);
                if (d) {
                  setSelectedDistrict(d.name);
                  setSelectedState(d.state);
                }
              }}
              className="px-2 py-1.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 font-medium"
            >
              {INDIAN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleAnalyzeTranscript}
              disabled={isLoading || !transcript.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-agri-700 hover:bg-agri-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  {dict.home.analyzing}
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dict.home.analyzeButton}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
