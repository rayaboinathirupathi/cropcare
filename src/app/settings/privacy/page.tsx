'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { ShieldCheck, Trash2, MapPin, Camera, CheckCircle2 } from 'lucide-react';

export default function PrivacySettingsPage() {
  const { dict } = useI18n();

  const [consentLocation, setConsentLocation] = useState<boolean>(true);
  const [consentPhotoStorage, setConsentPhotoStorage] = useState<boolean>(false);
  const [clearedMessage, setClearedMessage] = useState<boolean>(false);

  useEffect(() => {
    try {
      setConsentLocation(localStorage.getItem('consent_location') !== 'false');
      setConsentPhotoStorage(localStorage.getItem('consent_photo_storage') === 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleToggleLocation = () => {
    const next = !consentLocation;
    setConsentLocation(next);
    localStorage.setItem('consent_location', String(next));
  };

  const handleTogglePhotoStorage = () => {
    const next = !consentPhotoStorage;
    setConsentPhotoStorage(next);
    localStorage.setItem('consent_photo_storage', String(next));
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to delete all your saved crop scans, farm profiles, and local history? This action cannot be undone.')) {
      try {
        localStorage.removeItem('recent_crop_scans');
        localStorage.removeItem('farmer_farm_profile');
        sessionStorage.clear();
        setClearedMessage(true);
        setTimeout(() => setClearedMessage(false), 4000);
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sub-nav pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <Link href="/settings/language" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Language & Display
        </Link>
        <Link href="/settings/profile" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Account & Profile
        </Link>
        <Link href="/settings/privacy" className="text-agri-700 bg-agri-50 px-3 py-1.5 rounded-lg border border-agri-200">
          Privacy & Consent
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-agri-600" />
          {dict.settings.privacySection}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {dict.settings.privacyDesc}
        </p>
      </div>

      {clearedMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All local diagnostic history and preferences have been permanently deleted.</span>
        </div>
      )}

      {/* Consent Toggles */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Farmer Data Consent Controls
        </h2>

        {/* Location Consent */}
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-agri-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Permit Location for Agromet Advisories
              </span>
              <span className="text-[11px] text-slate-500">
                Allows retrieving regional disease warnings and weather forecasts for your district.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleLocation}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              consentLocation ? 'bg-agri-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Photo Storage Consent */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-start gap-3">
            <Camera className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Allow Anonymous Photo Retention for Pathology Review
              </span>
              <span className="text-[11px] text-slate-500">
                When disabled, uploaded photos are analyzed in volatile memory and purged immediately after diagnosis.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTogglePhotoStorage}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              consentPhotoStorage ? 'bg-agri-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </button>
        </div>
      </div>

      {/* Plain Language Privacy Notice */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 text-xs text-slate-700 space-y-2.5">
        <h3 className="font-bold text-slate-900 text-sm">Our Agricultural Privacy Commitment:</h3>
        <p>• <strong>Zero Hidden Training:</strong> We never silently use your crop photos or farm identity to train public models without your explicit consent.</p>
        <p>• <strong>No Coordinate Leaks:</strong> Exact GPS coordinates are not transmitted to generative AI endpoints; only general district names are referenced for microclimate risk.</p>
        <p>• <strong>Right to Erasure:</strong> You can completely purge all diagnostic records and images at any time using the button below.</p>
      </div>

      {/* Delete all data button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleClearAllData}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-2xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>{dict.settings.clearData}</span>
        </button>
      </div>
    </div>
  );
}
