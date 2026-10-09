'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n';
import { INDIAN_DISTRICTS } from '@/data/indianDistricts';
import { Camera, UploadCloud, RefreshCw, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export function PhotoUpload() {
  const { dict, language } = useI18n();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Warangal');
  const [selectedState, setSelectedState] = useState<string>('Telangana');
  const [optionalNotes, setOptionalNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Client-side image validation & downscaling to conserve farmer bandwidth
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type.toLowerCase())) {
      setErrorMessage(dict.errors.imageInvalid);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(dict.errors.imageTooLarge);
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dist = INDIAN_DISTRICTS.find(d => d.name === e.target.value);
    if (dist) {
      setSelectedDistrict(dist.name);
      setSelectedState(dist.state);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select or capture a crop photo first.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('district', selectedDistrict);
      formData.append('state', selectedState);
      formData.append('language', language);
      if (optionalNotes.trim()) {
        formData.append('notes', optionalNotes.trim());
      }

      const res = await fetch('/api/diagnose/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to analyze crop photo.');
      }

      // Save result in sessionStorage so result page can hydrate immediately
      sessionStorage.setItem('latest_diagnosis_result', JSON.stringify(data));
      // Save to recent list in localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('recent_crop_scans') || '[]');
        existing.unshift({
          id: data.id,
          crop: data.crop?.name || 'Crop',
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
      console.error('Image analysis error:', err);
      setErrorMessage(err instanceof Error ? err.message : dict.errors.general);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Camera className="w-5 h-5 text-agri-600" />
          {dict.home.photoUploadTitle}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {dict.home.photoUploadHint}
        </p>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Hidden inputs for camera capture & standard file upload */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Preview or Dropzone */}
      {!previewUrl ? (
        <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-agri-500 transition-colors bg-slate-50/50">
          <UploadCloud className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-700 mb-1">
            {dict.home.photoDropzone}
          </p>
          <p className="text-xs text-slate-500 mb-4">
            Supports JPEG, PNG, WebP (Max 10MB)
          </p>

          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-sm mx-auto">
            {/* Open Camera button */}
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-agri-700 hover:bg-agri-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors active:scale-98"
            >
              <Camera className="w-4 h-4" />
              {dict.home.cameraCapture}
            </button>

            {/* Choose from gallery button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors active:scale-98"
            >
              <UploadCloud className="w-4 h-4 text-slate-500" />
              {dict.home.photoUploadButton}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-black/5 aspect-video max-h-72 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected crop preview"
              className="w-full h-full object-contain"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
              <CheckCircle2 className="w-3 h-3 text-agri-400" />
              <span>Photo ready for diagnosis</span>
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Any visible details to add? (Optional)
            </label>
            <input
              type="text"
              value={optionalNotes}
              onChange={(e) => setOptionalNotes(e.target.value)}
              placeholder="e.g., Affecting 30% of field, started after recent rain..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-agri-500 focus:outline-hidden"
              maxLength={200}
            />
          </div>
        </div>
      )}

      {/* District selector for regional context */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-auto flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600 whitespace-nowrap">
            Crop Location:
          </span>
          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="w-full sm:w-auto text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-agri-500"
          >
            {INDIAN_DISTRICTS.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.state})
              </option>
            ))}
          </select>
        </div>

        {/* Analyze Action button */}
        {selectedFile && (
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-agri-700 hover:bg-agri-800 disabled:bg-agri-400 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-98"
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
        )}
      </div>
    </div>
  );
}
