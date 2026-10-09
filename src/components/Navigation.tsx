'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/i18n';
import { 
  ScanLine, 
  FlaskConical, 
  CloudSun, 
  History, 
  Tractor, 
  BookOpen, 
  ShieldCheck 
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();
  const { dict } = useI18n();

  const navItems = [
    { href: '/', label: dict.nav.home, icon: ScanLine },
    { href: '/treatments', label: dict.nav.treatments, icon: FlaskConical },
    { href: '/weather', label: dict.nav.weather, icon: CloudSun },
    { href: '/history', label: dict.nav.history, icon: History },
    { href: '/farm-profile', label: dict.nav.farmProfile, icon: Tractor },
    { href: '/education', label: dict.nav.education, icon: BookOpen },
    { href: '/admin', label: dict.nav.admin, icon: ShieldCheck },
  ];

  return (
    <>
      {/* Desktop secondary navigation bar */}
      <nav className="hidden md:block bg-agri-50 border-b border-agri-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-agri-700 text-white shadow-xs'
                      : 'text-agri-900 hover:bg-agri-200/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile bottom sticky navigation bar (thumb-accessible for smartphones) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1">
        <div className="grid grid-cols-5 gap-1 items-center">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-center transition-all ${
                  isActive
                    ? 'text-agri-700 font-bold bg-agri-50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-agri-600 scale-110' : 'text-slate-500'} transition-transform`} />
                <span className="text-[10px] mt-0.5 truncate max-w-[64px] leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
