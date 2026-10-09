import { CropDiagnosisResponse, Language } from '../types';

// Regional name translations for common crops
const CROP_TRANSLATIONS: Record<string, { te: string; hi: string; en: string }> = {
  'chilli': { te: 'మిరప', hi: 'मिर्च', en: 'Chilli' },
  'paddy': { te: 'వరి', hi: 'धान', en: 'Paddy / Rice' },
  'rice': { te: 'వరి', hi: 'धान', en: 'Paddy / Rice' },
  'paddy / rice': { te: 'వరి', hi: 'धान', en: 'Paddy / Rice' },
  'cotton': { te: 'పత్తి', hi: 'कपास', en: 'Cotton' },
  'tomato': { te: 'టమోటా', hi: 'टमाटर', en: 'Tomato' },
  'wheat': { te: 'గోధుమ', hi: 'गेहूं', en: 'Wheat' },
  'maize': { te: 'మొక్కజొన్న', hi: 'मक्का', en: 'Maize' },
  'maize / corn': { te: 'మొక్కజొన్న', hi: 'मक्का', en: 'Maize' },
  'groundnut': { te: 'వేరుశనగ', hi: 'मूंगफली', en: 'Groundnut' },
  'groundnut / peanut': { te: 'వేరుశనగ', hi: 'मूंगफली', en: 'Groundnut' },
  'sugarcane': { te: 'చెరకు', hi: 'गन्ना', en: 'Sugarcane' },
};

// Regional translations for conditions
const CONDITION_TRANSLATIONS: Record<string, { te: string; hi: string; en: string }> = {
  'rice blast': {
    te: 'వరి అగ్గితెగులు (బ్లాస్ట్)',
    hi: 'धान का ब्लास्ट रोग (झोंका)',
    en: 'Rice Blast'
  },
  'chilli leaf curl virus (begomovirus)': {
    te: 'మిరప ఆకు ముడత వైరస్ మరియు తెల్లదోమ',
    hi: 'मिर्च का पर्ण कुंचन रोग (पत्ती मरोड़) व सफेद मक्खी',
    en: 'Chilli Leaf Curl Virus'
  },
  'pink bollworm (pectinophora gossypiella)': {
    te: 'పత్తి గులాబీ రంగు కాయ తొలుచు పురుగు',
    hi: 'कपास की गुलाबी सुंडी (पिंक बॉलवर्म)',
    en: 'Pink Bollworm'
  },
  'early blight (alternaria solani)': {
    te: 'టమోటా ముందస్తు ఆకుమచ్చ తెగులు (ఎర్లీ బ్లైట్)',
    hi: 'टमाटर का अगेती झुलसा रोग (अर्ली ब्लाइट)',
    en: 'Tomato Early Blight'
  },
  'stripe rust / yellow rust (puccinia striiformis)': {
    te: 'గోధుమ పసుపు కుంకుమ తెగులు (ఎల్లో రస్ట్)',
    hi: 'गेहूं का पीला रतुआ रोग (येलो रस्ट)',
    en: 'Wheat Yellow Rust'
  },
  'fall armyworm (spodoptera frugiperda)': {
    te: 'మొక్కజొన్న కత్తెర పురుగు (ఫాల్ ఆర్మీవార్మ్)',
    hi: 'मक्का का फाल आर्मीवर्म कीट',
    en: 'Maize Fall Armyworm'
  },
  'tikka leaf spot (cercospora arachidicola & phaeoisariopsis personata)': {
    te: 'వేరుశనగ తిక్క ఆకుమచ్చ తెగులు',
    hi: 'मूंगफली का टिक्का रोग (पर्ण धब्बा)',
    en: 'Groundnut Tikka Leaf Spot'
  },
};

export function getCropRegionalName(cropName: string | null | undefined, lang: Language): string {
  if (!cropName) return lang === 'te' ? 'పంట' : lang === 'hi' ? 'फसल' : 'Crop';
  const norm = cropName.toLowerCase().trim();
  for (const [key, val] of Object.entries(CROP_TRANSLATIONS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val[lang];
    }
  }
  return cropName;
}

export function getConditionRegionalName(conditionName: string | null | undefined, lang: Language): string {
  if (!conditionName) return lang === 'te' ? 'సమస్య' : lang === 'hi' ? 'समस्या' : 'Condition';
  const norm = conditionName.toLowerCase().trim();
  for (const [key, val] of Object.entries(CONDITION_TRANSLATIONS)) {
    if (norm.includes(key) || key.includes(norm)) {
      return val[lang];
    }
  }
  return conditionName;
}

export function generateMultilingualAudioScripts(diagnosis: CropDiagnosisResponse): {
  en: string;
  te: string;
  hi: string;
} {
  const primary = diagnosis.diagnoses[0];
  const cropRaw = diagnosis.crop.name;
  const condRaw = primary ? primary.condition : 'Unknown';

  const isHealthy = primary?.conditionType === 'healthy';

  // 1. English Script
  const cropEn = getCropRegionalName(cropRaw, 'en');
  const condEn = getConditionRegionalName(condRaw, 'en');
  const actionEn = diagnosis.managementRecommendations[0]?.action || 'Inspect the affected field area.';
  const scriptEn = isHealthy
    ? `Crop health report for ${cropEn}. Your crop appears healthy and vigorous with no active disease detected. Continue normal balanced irrigation and fertilization.`
    : `Crop assessment report. Identified crop is ${cropEn}. Most likely problem is ${condEn}. Confidence level is ${primary.confidence}. Key observed symptoms: ${primary.evidence.slice(0, 2).join(', ')}. Immediate recommended action: ${actionEn}. Always observe approved CIBRC label directions and wear protective gear.`;

  // 2. Telugu Script (తెలుగు)
  const cropTe = getCropRegionalName(cropRaw, 'te');
  const condTe = getConditionRegionalName(condRaw, 'te');
  const actionTe = isHealthy
    ? 'సహజమైన సమతుల్య ఎరువులు మరియు నీటి యాజమాన్యాన్ని కొనసాగించండి.'
    : diagnosis.verifiedKnowledgeMatch?.culturalPractices[0] || 'చేనును నిశితంగా పరిశీలించి తగిన చర్యలు తీసుకోండి.';
  const confidenceTe = primary.confidence === 'high' ? 'అధిక ఖచ్చితత్వం' : primary.confidence === 'medium' ? 'మధ్యస్థ ఖచ్చితత్వం' : 'తక్కువ ఖచ్చితత్వం';

  const scriptTe = isHealthy
    ? `${cropTe} పంట ఆరోగ్య నివేదిక. మీ పంట పూర్తి పచ్చదనంతో ఆరోగ్యంగా ఉంది. ఎలాంటి తెగుళ్లు కనిపించలేదు. సాధారణ నీటి మరియు ఎరువుల యాజమాన్యాన్ని కొనసాగించండి.`
    : `పంట ఆరోగ్య నివేదిక. గుర్తించిన పంట: ${cropTe}. సోకిన ముఖ్యమైన తెగులు: ${condTe}. ఖచ్చితత్వ స్థాయి: ${confidenceTe}. వెంటనే చేయవలసిన సిఫార్సు: ${actionTe}. రసాయన మందులు వాడే ముందు CIBRC ఆమోదిత లేబుల్ సూచనలను మరియు రక్షణ జాగ్రత్తలను తప్పక పాటించండి.`;

  // 3. Hindi Script (हिन्दी)
  const cropHi = getCropRegionalName(cropRaw, 'hi');
  const condHi = getConditionRegionalName(condRaw, 'hi');
  const actionHi = isHealthy
    ? 'उचित सिंचाई और संतुलित खाद प्रबंधन जारी रखें।'
    : diagnosis.verifiedKnowledgeMatch?.culturalPractices[0] || 'खेत का निरीक्षण करें और आवश्यक प्रबंधन अपनाएं।';
  const confidenceHi = primary.confidence === 'high' ? 'उच्च सटीकता' : primary.confidence === 'medium' ? 'मध्यम सटीकता' : 'कम सटीकता';

  const scriptHi = isHealthy
    ? `${cropHi} फसल स्वास्थ्य रिपोर्ट। आपकी फसल स्वस्थ और हरी-भरी है। किसी भी सक्रिय रोग के लक्षण नहीं पाए गए हैं। सामान्य सिंचाई और खाद प्रबंधन जारी रखें।`
    : `फसल स्वास्थ्य विश्लेषण रिपोर्ट। पहचानी गई फसल: ${cropHi}। संभावित मुख्य समस्या: ${condHi}। सटीकता स्तर: ${confidenceHi}। तुरंत अनुशंसित कदम: ${actionHi}। कीटनाशक छिड़काव से पहले CIBRC अनुमोदित लेबल निर्देशों और सुरक्षा नियमों का पालन अवश्य करें।`;

  return {
    en: scriptEn,
    te: scriptTe,
    hi: scriptHi,
  };
}
