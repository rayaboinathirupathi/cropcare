'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { CropDiagnosisResponse } from '@/types';
import { DosageCalculatorWidget } from '@/components/DosageCalculatorWidget';
import { AudioNarrationButton } from '@/components/AudioNarrationButton';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Share2, 
  Printer, 
  ArrowLeft, 
  ShieldCheck, 
  Bug, 
  Leaf, 
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from 'lucide-react';

export default function DiagnosisResultPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="w-12 h-12 border-4 border-agri-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-base font-bold text-slate-800">Loading Crop Health Assessment...</h2>
        </div>
      }
    >
      <DiagnosisResultContent />
    </Suspense>
  );
}

function DiagnosisResultContent() {
  const { dict, language } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const diagnosisId = searchParams.get('id');

  const [diagnosis, setDiagnosis] = useState<CropDiagnosisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);

  useEffect(() => {
    // 1. Try to read from sessionStorage for instant zero-latency transition
    const cached = sessionStorage.getItem('latest_diagnosis_result');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!diagnosisId || parsed.id === diagnosisId) {
          setDiagnosis(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // continue
      }
    }

    // 2. Fetch from API endpoint if ID is provided
    if (diagnosisId) {
      fetch(`/api/diagnoses/${diagnosisId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.id) {
            setDiagnosis(data);
          }
        })
        .catch(err => console.error('Error fetching diagnosis:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [diagnosisId]);

  const handleFeedback = async (type: 'accurate' | 'inaccurate') => {
    if (!diagnosis) return;
    setFeedbackType(type);
    setFeedbackSubmitted(true);
    try {
      await fetch('/api/admin/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosisId: diagnosis.id,
          feedbackType: type,
        }),
      });
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-agri-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-800">Loading Crop Health Assessment...</h2>
      </div>
    );
  }

  if (!diagnosis) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-800">No Assessment Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Please check your crop using photo upload or symptom description.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-agri-700 text-white rounded-xl text-xs font-bold shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Scan Home</span>
        </Link>
      </div>
    );
  }

  const primaryHypothesis = diagnosis.diagnoses[0];
  const isHealthy = primaryHypothesis?.conditionType === 'healthy';

  // Construct text for audio speech synthesis (TTS)
  const narrationScript = `Crop assessment report. Identified crop: ${diagnosis.crop.name || 'Plant'}. ` +
    `Likely condition: ${primaryHypothesis.condition}. Confidence level: ${primaryHypothesis.confidence}. ` +
    `Key symptoms: ${primaryHypothesis.evidence.join('. ')}. ` +
    `Recommended action: ${diagnosis.managementRecommendations[0]?.action || 'Inspect field carefully'}. ` +
    `Always observe official CIBRC label directions and wear protective gear.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top back & actions toolbar */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>New Check</span>
        </Link>

        <div className="flex items-center gap-2">
          <AudioNarrationButton textToSpeak={narrationScript} />
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white rounded-xl border border-slate-200 text-xs font-semibold flex items-center gap-1"
            title="Print report"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* A. Diagnosis Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 overflow-hidden">
        {/* Source distinction banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100 text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-bold text-agri-800 bg-agri-50 px-2.5 py-1 rounded-lg border border-agri-200">
            <ShieldCheck className="w-3.5 h-3.5 text-agri-600" />
            <span>{diagnosis.aiProviderUsed}</span>
          </span>
          <span className="text-slate-400">
            Scan ID: {diagnosis.id.slice(0, 15)} • {new Date(diagnosis.timestamp).toLocaleDateString()}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-agri-700 uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              {dict.diagnosis.cropIdentified}: {diagnosis.crop.name || 'Crop'}
              {diagnosis.crop.scientificName && (
                <span className="text-slate-400 font-normal italic lowercase ml-1">
                  ({diagnosis.crop.scientificName})
                </span>
              )}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {primaryHypothesis.condition}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg uppercase ${
                isHealthy
                  ? 'bg-emerald-100 text-emerald-800'
                  : primaryHypothesis.conditionType === 'pest'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {primaryHypothesis.conditionType}
              </span>

              {/* Calibrated Confidence Badge */}
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                primaryHypothesis.confidence === 'high'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : primaryHypothesis.confidence === 'medium'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>
                {primaryHypothesis.confidence === 'high'
                  ? dict.diagnosis.confidenceHigh
                  : primaryHypothesis.confidence === 'medium'
                  ? dict.diagnosis.confidenceMedium
                  : dict.diagnosis.confidenceLow}
              </span>
            </div>
          </div>
        </div>

        {/* Symptoms Observed */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {dict.diagnosis.evidenceTitle}
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {primaryHypothesis.evidence.map((ev, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-agri-600 mt-1.5 shrink-0" />
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternative possibilities */}
        {primaryHypothesis.alternatives.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              {dict.diagnosis.alternativesTitle}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {primaryHypothesis.alternatives.map((alt, idx) => (
                <span key={idx} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up clarification questions */}
        {diagnosis.followUpQuestions && diagnosis.followUpQuestions.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
            <span className="font-bold block mb-1 flex items-center gap-1 text-blue-800">
              <HelpCircle className="w-3.5 h-3.5" />
              Follow-Up Diagnostic Questions:
            </span>
            <ul className="list-disc list-inside space-y-1 text-blue-950">
              {diagnosis.followUpQuestions.map((q, idx) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* B. Recommended Next Steps */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-agri-600" />
          {dict.diagnosis.nextStepsTitle}
        </h3>

        <div className="space-y-3">
          {diagnosis.managementRecommendations.map((rec, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-agri-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-slate-900">{rec.action}</p>
                <p className="text-slate-600 mt-0.5">{rec.reason}</p>
                {rec.sourceIds.length > 0 && (
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Source: {rec.sourceIds.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. Interactive Dosage Calculator & Verified Treatments */}
      {diagnosis.verifiedKnowledgeMatch && (
        <div className="space-y-4">
          <DosageCalculatorWidget
            treatments={diagnosis.verifiedKnowledgeMatch.chemicalTreatments}
            cropName={diagnosis.crop.name || undefined}
          />

          {/* Biological & Cultural Practices Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Cultural & Biological Management (Non-Chemical Priority)
            </h4>

            {diagnosis.verifiedKnowledgeMatch.biologicalControls.length > 0 && (
              <div className="mb-4">
                <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Verified Bio-Control Agents:
                </span>
                <div className="space-y-2">
                  {diagnosis.verifiedKnowledgeMatch.biologicalControls.map((bio, idx) => (
                    <div key={idx} className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs">
                      <strong className="text-emerald-950 font-bold">{bio.agentName}</strong>
                      <p className="text-slate-700 mt-0.5">{bio.applicationMethod}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">Source: {bio.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                Recommended Agronomic Cultural Practices:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {diagnosis.verifiedKnowledgeMatch.culturalPractices.map((cult, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                    <span>{cult}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer and Limitations */}
      <DisclaimerBanner />

      {/* Farmer Feedback Section */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 text-center">
        <h4 className="text-xs font-bold text-slate-800">
          {dict.diagnosis.feedbackPrompt}
        </h4>
        {feedbackSubmitted ? (
          <p className="text-xs text-agri-700 font-semibold mt-2">
            {dict.diagnosis.feedbackThanks}
          </p>
        ) : (
          <div className="flex justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => handleFeedback('accurate')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl shadow-2xs transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>{dict.diagnosis.feedbackAccurate}</span>
            </button>
            <button
              type="button"
              onClick={() => handleFeedback('inaccurate')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl shadow-2xs transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />
              <span>{dict.diagnosis.feedbackInaccurate}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
