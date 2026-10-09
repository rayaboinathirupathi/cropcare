import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/components/Header';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { DosageCalculatorWidget } from '@/components/DosageCalculatorWidget';
import { I18nProvider } from '@/i18n';
import { ChemicalTreatmentRecord } from '@/types';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

describe('React Component Tests (React Testing Library)', () => {
  it('renders Header with brand, language switcher, and Kisan Helpline badge', () => {
    render(
      <I18nProvider>
        <Header />
      </I18nProvider>
    );

    expect(screen.getByText(/CropCare/i)).toBeInTheDocument();
    expect(screen.getByText(/1800-180-1551/i)).toBeInTheDocument();
    expect(screen.getByText('తెలుగు')).toBeInTheDocument();
    expect(screen.getByText('हिन्दी')).toBeInTheDocument();
  });

  it('renders DisclaimerBanner with authoritative grounding notice', () => {
    render(
      <I18nProvider>
        <DisclaimerBanner />
      </I18nProvider>
    );

    expect(screen.getByText(/Authoritative Agricultural Guidance Grounding/i)).toBeInTheDocument();
    expect(screen.getByText(/CIBRC/i)).toBeInTheDocument();
  });

  it('renders DosageCalculatorWidget and updates land area', () => {
    const mockTreatments: ChemicalTreatmentRecord[] = [
      {
        activeIngredient: 'Tricyclazole 75% WP',
        formulation: '75% WP',
        approvedCrop: 'Paddy / Rice',
        targetCondition: 'Rice Blast',
        labelDoseRate: 120,
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Gloves', 'Mask'],
        cibrcRegistrationReference: 'CIBRC Registered for Paddy Blast',
      }
    ];

    render(
      <I18nProvider>
        <DosageCalculatorWidget treatments={mockTreatments} cropName="Paddy / Rice" />
      </I18nProvider>
    );

    expect(screen.getByText(/Interactive Dosage & Spray Calculator/i)).toBeInTheDocument();
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '3' } });
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });
});
