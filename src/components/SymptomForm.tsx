'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { Edit3, CheckCircle2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export function SymptomForm() {
  const { dict, language } = useI18n();
  const router = useRouter();

  const [symptomText, setSymptomText] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Warangal');
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [detectedCrop, setDetectedCrop] = useState<string>('');
  const [plantPart, setPlantPart] = useState<string>('leaf');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Suggested symptom starter chips in current language
  const exampleChips: Record<string, string[]> = {
    en: [
      'Chilli leaves curled upwards with tiny whiteflies',
      'Paddy leaf spindle spots with greyish centers',
      'Cotton rosetted flowers and boll damage',
      'Tomato target-ring brown spots on lower leaves',
      'Maize central whorl damaged with sawdust frass',
    ],
    te: [
      'మిరప ఆకులు పైకి ముడుచుకుని తెల్ల దోమ కనిపిస్తోంది',
      'వరి ఆకులపై కంటి ఆకారపు మచ్చలు, కొనలు ఎండిపోతున్నాయి',
      'పత్తి పూత రాలిపోవడం మరియు గులాబీ రంగు పురుగు',
      'టమోటా క్రింది ఆకులపై గుండ్రని నల్లటి మచ్చలు',
      'మొక్కజొన్న సుడులలో లద్దె పురుగు విసర్జన',
    ],
    hi: [
      'मिर्च की पत्तियां ऊपर मुड़ रही हैं और सफेद मक्खी दिख रही है',
      'धान की पत्तियों पर आंख के आकार के भूरे धब्बे',
      'कपास के फूलों का न खुलना और गुलाबी सुंडी का प्रकोप',
      'टमाटर की निचली पत्तियों पर छल्लेदार काले धब्बे',
      'मक्का के गोभ में कीड़े का मल और कटे पत्ते',
    ]
  };

  const handleChipClick = (chip: string) => {
    setSymptomText(chip);
    setErrorMessage(null);
    // Auto-detect crop from chip
    autoDetectCrop(chip);
  };

  const autoDetectCrop = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('chilli') || lower.includes('మిరప') || lower.includes('मिर्च')) setDetectedCrop('Chilli');
    else if (lower.includes('paddy') || lower.includes('rice') || lower.includes('వరి') || lower.includes('धान')) setDetectedCrop('Paddy / Rice');
    else if (lower.includes('cotton') || lower.includes('పత్తి') || lower.includes('कपास')) setDetectedCrop('Cotton');
    else if (lower.includes('tomato') || lower.includes('టమోటా') || lower.includes('टमाटर')) setDetectedCrop('Tomato');
    else if (lower.includes('maize') || lower.includes('corn') || lower.includes('మొక్కజొన్న') || lower.includes('मक्का')) setDetectedCrop('Maize / Corn');
    else if (lower.includes('wheat') || lower.includes('గోధుమ') || lower.includes('गेहूं')) setDetectedCrop('Wheat');
    else if (lower.includes('groundnut') || lower.includes('వేరుశనగ') || lower.includes('मूंगफली')) setDetectedCrop('Groundnut / Peanut');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSymptomText(val);
    setErrorMessage(null);
    autoDetectCrop(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (symptomText.trim().length < 3) {
      setErrorMessage(dict.home.textHelper);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fullText = detectedCrop
        ? `[Crop: ${detectedCrop}] [Affected Part: ${plantPart}] ${symptomText.trim()}`
        : symptomText.trim();

      const res = await fetch('/api/diagnose/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fullText,
          district: selectedDistrict,
          state: selectedState,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze symptoms.');
      }

      sessionStorage.setItem('latest_diagnosis_result', JSON.stringify(data));
      try {
        const existing = JSON.parse(localStorage.getItem('recent_crop_scans') || '[]');
        existing.unshift({
          id: data.id,
          crop: data.crop?.name || detectedCrop || 'Crop',
          condition: data.diagnoses[0]?.condition || 'Under Assessment',
          confidence: data.diagnoses[0]?.confidence || 'medium',
          date: new Date().toLocaleDateString(),
        });
        localStorage.setItem('recent_crop_scans', JSON.stringify(existing.slice(0, 10)));
      } catch {
        // Ignore local storage error
      }

      router.push(`/diagnose/result?id=${data.id}`);
    } catch (err) {
      console.error('Text diagnosis error:', err);
      setErrorMessage(err instanceof Error ? err.message : dict.errors.general);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-agri-600" />
          {dict.home.tabText}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {dict.home.textHelper}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Suggested quick chips */}
      <div className="mb-4">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-agri-600" />
          Common Symptoms Quick Tap:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(exampleChips[language] || exampleChips.en).map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="text-xs bg-slate-100 hover:bg-agri-100 hover:text-agri-900 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors text-left"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            rows={4}
            value={symptomText}
            onChange={handleTextChange}
            placeholder={dict.home.textPlaceholder}
            className="w-full p-3.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:outline-hidden resize-none bg-slate-50/50"
            maxLength={1000}
          />
          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1 px-1">
            <span>Natural language symptom analyzer</span>
            <span>{symptomText.length} / 1000</span>
          </div>
        </div>

        {/* Editable Extracted Context Chips (Section 5 requirement) */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Detected / Target Crop:
            </label>
            <input
              type="text"
              value={detectedCrop}
              onChange={(e) => setDetectedCrop(e.target.value)}
              placeholder="e.g. Chilli, Paddy, Cotton"
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Affected Plant Part:
            </label>
            <select
              value={plantPart}
              onChange={(e) => setPlantPart(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            >
              <option value="leaf">Leaves (ఆకులు / पत्तियां)</option>
              <option value="stem">Stem / Trunk (కాండం / तना)</option>
              <option value="fruit">Fruit / Pod (కాయ / फल)</option>
              <option value="flower">Flower / Square (పూత / फूल)</option>
              <option value="root">Roots (వేర్లు / जड़ें)</option>
              <option value="whole_plant">Whole Plant (మొత్తం మొక్క / पूरा पौधा)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              District / State:
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => {
                const dist = INDIAN_DISTRICTS.find(d => d.name === e.target.value);
                if (dist) {
                  setSelectedDistrict(dist.name);
                  setSelectedState(dist.state);
                }
              }}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium"
            >
              {INDIAN_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading || symptomText.trim().length < 3}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-agri-700 hover:bg-agri-800 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-98"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {dict.home.analyzing}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {dict.home.analyzeButton}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
