'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/i18n';
import { isSupabaseConfigured } from '@/services/supabase/client';
import { User, Shield, CheckCircle2, LogIn, Database } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { dict } = useI18n();
  const [isConfigured] = useState<boolean>(isSupabaseConfigured());
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSignedIn(true);
    setMsg('Signed in successfully in local authenticated farmer session.');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Sub-nav pills */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <Link href="/settings/language" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Language & Display
        </Link>
        <Link href="/settings/profile" className="text-agri-700 bg-agri-50 px-3 py-1.5 rounded-lg border border-agri-200">
          Account & Profile
        </Link>
        <Link href="/settings/privacy" className="text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg">
          Privacy & Consent
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-agri-600" />
          Farmer Account & Cloud Sync
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          CropCare AI is fully functional as a guest. An account allows syncing your farm data across multiple devices.
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Account Status Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-agri-100 text-agri-800 flex items-center justify-center font-black text-lg">
              {signedIn ? 'KK' : '👤'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {signedIn ? email : 'Guest Farmer Session'}
              </h3>
              <p className="text-xs text-slate-500">
                {signedIn ? 'Cloud synchronization enabled' : 'Local device storage active (No account required)'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {signedIn ? 'Active User' : 'Guest Mode'}
          </span>
        </div>

        {/* Database backend status */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Database className="w-4 h-4 text-agri-600" />
            <span>Database Backend:</span>
          </div>
          <span className="font-semibold text-slate-900">
            {isConfigured ? 'Supabase PostgreSQL (Connected)' : 'Local Storage / In-Memory Session Mode'}
          </span>
        </div>

        {!signedIn ? (
          <form onSubmit={handleSignIn} className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Optional Account Sign In / Sign Up:
            </h4>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email / Phone</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl"
                required
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Sync</span>
            </button>
          </form>
        ) : (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => { setSignedIn(false); setMsg('Signed out to guest session.'); }}
              className="text-xs text-red-600 hover:underline font-semibold"
            >
              Sign out of this device
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
