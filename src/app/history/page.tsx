'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { History, Trash2, ArrowRight, ScanLine, CheckCircle2 } from 'lucide-react';

export default function HistoryPage() {
  const { dict } = useI18n();
  const [scans, setScans] = useState<any[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>('All');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recent_crop_scans') || '[]');
      setScans(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = scans.filter(s => s.id !== id);
    setScans(updated);
    try {
      localStorage.setItem('recent_crop_scans', JSON.stringify(updated));
    } catch {
      // ignore
    }
    fetch(`/api/diagnoses/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const crops = ['All', ...Array.from(new Set(scans.map(s => s.crop).filter(Boolean)))];

  const filteredScans = scans.filter(s => 
    selectedCrop === 'All' || s.crop === selectedCrop
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-agri-600" />
            {dict.history.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review previous crop assessments, recommendations, and dosage records.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <ScanLine className="w-4 h-4" />
          <span>New Scan</span>
        </Link>
      </div>

      {scans.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {crops.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                selectedCrop === c
                  ? 'bg-agri-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filteredScans.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">
            {dict.history.emptyHistory}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            When you photograph or describe crop symptoms, the diagnosis report will be saved here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            <ScanLine className="w-4 h-4" />
            <span>Check a Crop Now</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-agri-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-extrabold text-agri-800">{scan.crop}</span>
                  <span>•</span>
                  <span>{scan.date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-agri-800 transition-colors">
                  {scan.condition}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 uppercase font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
                  <span>{scan.confidence} confidence</span>
                </div>
              </div>

              <div className="flex items-center gap-2 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <Link
                  href={`/diagnose/result?id=${scan.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-agri-100 hover:text-agri-900 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                >
                  <span>{dict.history.viewDetails}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={(e) => handleDelete(scan.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={dict.history.deleteRecord}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
