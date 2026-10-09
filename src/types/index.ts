export type Language = 'en' | 'te' | 'hi';

export type ConditionType = 
  | 'disease' 
  | 'pest' 
  | 'deficiency' 
  | 'environmental' 
  | 'healthy' 
  | 'unknown';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type PlantPart = 
  | 'leaf' 
  | 'stem' 
  | 'fruit' 
  | 'flower' 
  | 'root' 
  | 'whole_plant' 
  | 'unknown';

export interface CropInfo {
  name: string;
  scientificName: string;
  regionalNames: {
    en: string;
    te: string;
    hi: string;
  };
}

export interface DiagnosisHypothesis {
  condition: string;
  conditionType: ConditionType;
  confidence: ConfidenceLevel;
  confidenceScore?: number; // 0.0 - 1.0 calibrated representation
  evidence: string[];
  alternatives: string[];
  affectedPart?: PlantPart;
  severity?: 'mild' | 'moderate' | 'severe' | 'unknown';
}

export interface ManagementRecommendation {
  action: string;
  reason: string;
  category: 'cultural' | 'biological' | 'chemical' | 'prevention';
  sourceIds: string[];
}

export interface CropDiagnosisResponse {
  id: string;
  timestamp: string;
  crop: {
    name: string | null;
    scientificName: string | null;
    regionalName?: string;
  };
  inputAssessment: {
    isPlantImage: boolean | null;
    imageQuality: 'good' | 'acceptable' | 'poor' | 'not_applicable';
    suitabilityRemarks?: string;
  };
  diagnoses: DiagnosisHypothesis[];
  followUpQuestions: string[];
  managementRecommendations: ManagementRecommendation[];
  needsExpertReview: boolean;
  limitations: string[];
  verifiedKnowledgeMatch?: VerifiedDiseaseRecord | null;
  weatherRiskContext?: string;
  aiProviderUsed: string;
}

export interface VerifiedDiseaseRecord {
  id: string;
  cropName: string;
  cropScientificName: string;
  conditionName: string;
  conditionType: ConditionType;
  symptoms: string[];
  favorableWeather: {
    minTemp?: number;
    maxTemp?: number;
    humidityThreshold?: number; // e.g. > 80%
    rainfallPattern?: string;
  };
  culturalPractices: string[];
  biologicalControls: {
    agentName: string;
    applicationMethod: string;
    dosageRate?: string;
    source: string;
  }[];
  chemicalTreatments: ChemicalTreatmentRecord[];
  precautions: string[];
  lastVerifiedDate: string;
  officialSource: string; // e.g., "ICAR - Central Rice Research Institute / CIBRC 2025"
}

export interface ChemicalTreatmentRecord {
  activeIngredient: string;
  formulation: string; // e.g., "Mancozeb 75% WP", "Hexaconazole 5% SC"
  tradeNamesSample?: string[]; // Note: generic recommendation is primary
  approvedCrop: string;
  targetCondition: string;
  labelDoseRate: number; // numerical value
  rateUnit: 'g/acre' | 'ml/acre' | 'kg/ha' | 'l/ha' | 'g/litre_water' | 'ml/litre_water';
  recommendedWaterVolumeLitresPerAcre: number; // e.g. 200 L
  applicationMethod: string; // e.g. "Foliar Spray using Knapsack Sprayer"
  maxApplicationsPerSeason: number;
  waitingPeriodDaysPHI: number; // Pre-Harvest Interval (PHI) in days
  toxicityColorCode: 'green' | 'blue' | 'yellow' | 'red';
  protectiveEquipmentRequired: string[];
  cibrcRegistrationReference: string;
}

export type LandUnit = 'acre' | 'hectare' | 'guntha' | 'sq_meter';

export interface DosageCalculationRequest {
  treatmentRecordId: string;
  landArea: number;
  landUnit: LandUnit;
  sprayerType?: 'knapsack_manual' | 'motorized_power' | 'tractor_boom';
}

export interface DosageCalculationResult {
  treatmentRecord: ChemicalTreatmentRecord;
  inputArea: number;
  inputUnit: LandUnit;
  areaInAcres: number;
  calculatedProductQuantity: number;
  productQuantityUnit: 'grams' | 'ml' | 'kilograms' | 'litres';
  totalWaterVolumeLitres: number;
  numberOfTanksApprox: {
    tankSizeLitres: number; // e.g., 15L or 16L knapsack
    tankCount: number;
    productPerTank: number;
    productPerTankUnit: 'grams' | 'ml';
  };
  safetyWarning: string;
  labelInstructionsVerbatim: string;
  phiDays: number;
}

export interface WeatherSummary {
  locationName: string;
  latitude: number;
  longitude: number;
  temperatureC: number;
  humidityPercent: number;
  windSpeedKmH: number;
  weatherConditionText: string;
  weatherCode: number;
  forecastDaily: {
    date: string;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number;
    weatherCode: number;
  }[];
  agriculturalIndices: {
    fungalDiseaseRisk: 'low' | 'moderate' | 'high';
    pestSurgeRisk: 'low' | 'moderate' | 'high';
    sprayingCondition: 'favorable' | 'marginal' | 'unfavorable';
    sprayingAdvice: string;
  };
  timestamp: string;
}

export interface AgriculturalAdvisory {
  id: string;
  title: string;
  issuedBy: string; // e.g. "PJTSAU Agri-Advisory Bulletin" / "ICAR Agromet"
  date: string;
  applicableRegion: string;
  cropFocus: string[];
  advisoryText: string;
  urgentNotice?: string;
}

export interface FarmProfile {
  id: string;
  farmerName: string;
  phoneNumber?: string;
  villageOrTown: string;
  district: string;
  state: string;
  totalLandAcres: number;
  irrigationType: 'drip' | 'canal' | 'borewell' | 'rainfed';
  cropsGrown: string[];
}

export interface FeedbackReport {
  id: string;
  diagnosisId: string;
  farmerFeedback: 'accurate' | 'inaccurate' | 'partial';
  userNotes?: string;
  actualProblemReported?: string;
  createdAt: string;
  reviewedByAdmin?: boolean;
}
