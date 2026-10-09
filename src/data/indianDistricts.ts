export interface IndianDistrict {
  id: string;
  name: string;
  state: string;
  regionalName?: {
    te?: string;
    hi?: string;
  };
  latitude: number;
  longitude: number;
  majorCrops: string[];
}

export const INDIAN_DISTRICTS: IndianDistrict[] = [
  // Telangana
  {
    id: 'ts_warangal',
    name: 'Warangal',
    state: 'Telangana',
    regionalName: { te: 'వరంగల్', hi: 'वारंगल' },
    latitude: 17.9689,
    longitude: 79.5941,
    majorCrops: ['Cotton', 'Chilli', 'Paddy / Rice', 'Maize']
  },
  {
    id: 'ts_karimnagar',
    name: 'Karimnagar',
    state: 'Telangana',
    regionalName: { te: 'కరీంనగర్', hi: 'करीमनगर' },
    latitude: 18.4386,
    longitude: 79.1288,
    majorCrops: ['Paddy / Rice', 'Cotton', 'Maize']
  },
  {
    id: 'ts_khammam',
    name: 'Khammam',
    state: 'Telangana',
    regionalName: { te: 'ఖమ్మం', hi: 'खम्मम' },
    latitude: 17.2473,
    longitude: 80.1514,
    majorCrops: ['Chilli', 'Cotton', 'Paddy / Rice']
  },
  {
    id: 'ts_nizamabad',
    name: 'Nizamabad',
    state: 'Telangana',
    regionalName: { te: 'నిజామాబాద్', hi: 'निज़ामाबाद' },
    latitude: 18.6725,
    longitude: 78.0941,
    majorCrops: ['Paddy / Rice', 'Soybean', 'Sugarcane', 'Maize']
  },
  // Andhra Pradesh
  {
    id: 'ap_guntur',
    name: 'Guntur',
    state: 'Andhra Pradesh',
    regionalName: { te: 'గుంటూరు', hi: 'गुंटूर' },
    latitude: 16.3067,
    longitude: 80.4365,
    majorCrops: ['Chilli', 'Cotton', 'Paddy / Rice', 'Tobacco']
  },
  {
    id: 'ap_krishna',
    name: 'Krishna (Vijayawada)',
    state: 'Andhra Pradesh',
    regionalName: { te: 'కృష్ణా', hi: 'कृष्णा' },
    latitude: 16.5062,
    longitude: 80.6480,
    majorCrops: ['Paddy / Rice', 'Sugarcane', 'Mango', 'Cotton']
  },
  {
    id: 'ap_kurnool',
    name: 'Kurnool',
    state: 'Andhra Pradesh',
    regionalName: { te: 'కర్నూలు', hi: 'कुरनूल' },
    latitude: 15.8281,
    longitude: 78.0373,
    majorCrops: ['Groundnut / Peanut', 'Cotton', 'Chilli', 'Paddy / Rice']
  },
  {
    id: 'ap_anantapur',
    name: 'Anantapur',
    state: 'Andhra Pradesh',
    regionalName: { te: 'అనంతపురం', hi: 'अनंतपुर' },
    latitude: 14.6819,
    longitude: 77.6006,
    majorCrops: ['Groundnut / Peanut', 'Paddy / Rice', 'Cotton']
  },
  // Maharashtra
  {
    id: 'mh_nashik',
    name: 'Nashik',
    state: 'Maharashtra',
    regionalName: { hi: 'नासिक' },
    latitude: 19.9975,
    longitude: 73.7898,
    majorCrops: ['Tomato', 'Onion', 'Grapes', 'Paddy / Rice']
  },
  {
    id: 'mh_nagpur',
    name: 'Nagpur',
    state: 'Maharashtra',
    regionalName: { hi: 'नागपुर' },
    latitude: 21.1458,
    longitude: 79.0882,
    majorCrops: ['Cotton', 'Soybean', 'Oranges', 'Paddy / Rice']
  },
  {
    id: 'mh_pune',
    name: 'Pune',
    state: 'Maharashtra',
    regionalName: { hi: 'पुणे' },
    latitude: 18.5204,
    longitude: 73.8567,
    majorCrops: ['Sugarcane', 'Tomato', 'Maize', 'Soybean']
  },
  // Punjab & Haryana
  {
    id: 'pb_ludhiana',
    name: 'Ludhiana',
    state: 'Punjab',
    regionalName: { hi: 'लुधियाना' },
    latitude: 30.9010,
    longitude: 75.8573,
    majorCrops: ['Wheat', 'Paddy / Rice', 'Cotton', 'Maize']
  },
  {
    id: 'hr_karnal',
    name: 'Karnal',
    state: 'Haryana',
    regionalName: { hi: 'करनाल' },
    latitude: 29.6857,
    longitude: 76.9905,
    majorCrops: ['Wheat', 'Paddy / Rice', 'Sugarcane']
  },
  // Karnataka
  {
    id: 'ka_mandya',
    name: 'Mandya',
    state: 'Karnataka',
    regionalName: { te: 'మాండ్య', hi: 'मांड्या' },
    latitude: 12.5218,
    longitude: 76.8951,
    majorCrops: ['Sugarcane', 'Paddy / Rice', 'Ragi']
  },
  {
    id: 'ka_belagavi',
    name: 'Belagavi',
    state: 'Karnataka',
    regionalName: { hi: 'बेलगावी' },
    latitude: 15.8497,
    longitude: 74.4977,
    majorCrops: ['Sugarcane', 'Cotton', 'Maize', 'Soybean']
  },
  // Uttar Pradesh & Madhya Pradesh
  {
    id: 'up_varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    regionalName: { hi: 'वाराणसी' },
    latitude: 25.3176,
    longitude: 82.9739,
    majorCrops: ['Paddy / Rice', 'Wheat', 'Tomato', 'Vegetables']
  },
  {
    id: 'mp_indore',
    name: 'Indore',
    state: 'Madhya Pradesh',
    regionalName: { hi: 'इन्दौर' },
    latitude: 22.7196,
    longitude: 75.8577,
    majorCrops: ['Soybean', 'Wheat', 'Cotton', 'Maize']
  }
];

export function findDistrictById(id: string): IndianDistrict | undefined {
  return INDIAN_DISTRICTS.find(d => d.id === id);
}

export function searchDistricts(query: string): IndianDistrict[] {
  const q = query.toLowerCase().trim();
  return INDIAN_DISTRICTS.filter(d => 
    d.name.toLowerCase().includes(q) ||
    d.state.toLowerCase().includes(q) ||
    (d.regionalName?.te && d.regionalName.te.includes(q)) ||
    (d.regionalName?.hi && d.regionalName.hi.includes(q)) ||
    d.majorCrops.some(c => c.toLowerCase().includes(q))
  );
}
