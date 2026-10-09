import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { I18nProvider } from '@/i18n';

export const metadata: Metadata = {
  title: 'CropCare AI — AI-Powered Crop Disease Detection & Treatment Assistant',
  description: 'Evidence-based crop disease diagnosis, weather risk evaluation, and CIBRC-verified dosage guidance for Indian farmers in English, Telugu, and Hindi.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#166534',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0 antialiased">
        <I18nProvider>
          <Header />
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="hidden md:block bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-semibold text-slate-200 text-sm">CropCare AI — Empowering Indian Agriculture</p>
                <p className="mt-1">Agricultural recommendations are strictly grounded in ICAR research and CIBRC approved label specifications.</p>
              </div>
              <div className="flex gap-4">
                <a href="tel:18001801551" className="hover:text-white underline">Kisan Helpline: 1800-180-1551</a>
                <span>•</span>
                <a href="/settings/privacy" className="hover:text-white underline">Privacy & Consent</a>
                <span>•</span>
                <a href="/education" className="hover:text-white underline">Safety & Limitations</a>
              </div>
            </div>
          </footer>
        </I18nProvider>
      </body>
    </html>
  );
}
