import { VerifiedDiseaseRecord } from '../types';

export const VERIFIED_DISEASE_RECORDS: VerifiedDiseaseRecord[] = [
  // 1. PADDY (RICE) - BLAST
  {
    id: 'paddy_blast_01',
    cropName: 'Paddy / Rice',
    cropScientificName: 'Oryza sativa',
    conditionName: 'Rice Blast',
    conditionType: 'disease',
    symptoms: [
      'Spindle-shaped or eye-shaped lesions with greyish center and brownish or reddish-brown border on leaves',
      'Lesions enlarge and coalesce, causing entire leaf to dry up and wither (leaf blast)',
      'Dark brown to black necrotic lesions on the panicle neck causing neck rot or panicle drop'
    ],
    favorableWeather: {
      minTemp: 20,
      maxTemp: 28,
      humidityThreshold: 85,
      rainfallPattern: 'Intermittent drizzles, overcast skies, prolonged morning dew'
    },
    culturalPractices: [
      'Avoid excessive application of chemical Nitrogen fertilizers; apply N in 3-4 split doses',
      'Maintain adequate water level in the field; do not let the field dry out completely during tillering to panicle initiation',
      'Burn or compost stubbles and infected crop residues after harvest to reduce primary inoculum',
      'Use certified blast-resistant or tolerant varieties (e.g., MTU 1010, IR 64, Swarna Sub1)'
    ],
    biologicalControls: [
      {
        agentName: 'Pseudomonas fluorescens 0.5% WP',
        applicationMethod: 'Seed treatment (10g/kg seed) and foliar spray at 2.5 g/litre water (500 g/acre in 200 L water)',
        dosageRate: '500 g/acre',
        source: 'ICAR-National Rice Research Institute (NRRI) & CIBRC'
      },
      {
        agentName: 'Trichoderma harzianum 1% WP',
        applicationMethod: 'Seedling root dip (10g/L water for 30 mins) before transplanting',
        dosageRate: '1 kg/acre enriched with farmyard manure',
        source: 'ANGRAU Agri Advisory Guidelines'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Tricyclazole 75% WP',
        formulation: '75% WP (Wettable Powder)',
        tradeNamesSample: ['Beam', 'Baan', 'Civet'],
        approvedCrop: 'Paddy / Rice',
        targetCondition: 'Rice Blast',
        labelDoseRate: 120, // 120 g per acre (or 300 g/ha)
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray at boot leaf stage or when early leaf blast lesions appear',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Gloves', 'Eye protection glasses', 'Mask covering nose and mouth', 'Rubber boots'],
        cibrcRegistrationReference: 'CIBRC Registered for Paddy Blast (Oryza sativa)'
      },
      {
        activeIngredient: 'Isoprothiolane 40% EC',
        formulation: '40% EC (Emulsifiable Concentrate)',
        tradeNamesSample: ['Fujione'],
        approvedCrop: 'Paddy / Rice',
        targetCondition: 'Rice Blast',
        labelDoseRate: 300, // 300 ml per acre (or 750 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray with knapsack sprayer ensuring thorough canopy coverage',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Gloves', 'Face shield or mask', 'Full sleeve apron'],
        cibrcRegistrationReference: 'CIBRC Label Standard for Rice'
      }
    ],
    precautions: [
      'Do not spray against the direction of the wind.',
      'Always spray in early morning or late afternoon when temperatures are cooler.',
      'Keep grazing cattle out of treated fields for at least 2 weeks.'
    ],
    lastVerifiedDate: '2025-08-15',
    officialSource: 'ICAR - Indian Institute of Rice Research (IIRR), Hyderabad & CIBRC Label Specifications'
  },

  // 2. CHILLI - LEAF CURL VIRUS
  {
    id: 'chilli_leaf_curl_02',
    cropName: 'Chilli',
    cropScientificName: 'Capsicum annuum',
    conditionName: 'Chilli Leaf Curl Virus (Begomovirus)',
    conditionType: 'disease',
    symptoms: [
      'Severe upward curling, puckering, and crinkling of leaves',
      'Reduction in leaf size, thickening of veins, and shortened internodes causing severe stunting of plant',
      'Substantial flower drop and small, deformed, curled fruits'
    ],
    favorableWeather: {
      minTemp: 25,
      maxTemp: 35,
      humidityThreshold: 60,
      rainfallPattern: 'Dry, warm weather conducive to high Whitefly (Bemisia tabaci) populations'
    },
    culturalPractices: [
      'Erect yellow sticky traps @ 15-20 traps/acre to monitor and mass-trap vector whiteflies',
      'Grow 2-3 border rows of tall barrier crops like Maize, Sorghum, or Pearl Millet around the chilli plot',
      'Rogue out and destroy infected viral symptomatic plants in early stages to prevent secondary spread',
      'Mulch with silver or reflective plastic mulch to repel whiteflies and aphids'
    ],
    biologicalControls: [
      {
        agentName: 'Neem Oil (Azadirachtin 1% / 10000 ppm)',
        applicationMethod: 'Foliar spray at 2 ml/litre water (400 ml/acre in 200 L water) at 10-day intervals',
        dosageRate: '400 ml/acre',
        source: 'ICAR-Indian Institute of Horticultural Research (IIHR)'
      },
      {
        agentName: 'Beauveria bassiana 1.15% WP',
        applicationMethod: 'Foliar spray targeting leaf undersides where whitefly nymphs harbor',
        dosageRate: '1 kg/acre in 200 L water',
        source: 'PJTSAU Integrated Pest Management Bulletin'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Diafenthiuron 50% WP',
        formulation: '50% WP',
        tradeNamesSample: ['Pegasus'],
        approvedCrop: 'Chilli',
        targetCondition: 'Whitefly vector (Vector of Chilli Leaf Curl)',
        labelDoseRate: 240, // 240 g per acre (600 g/ha)
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray directing nozzle to undersurface of foliage',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 5,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Rubber gloves', 'Protective goggles', 'Respiratory mask'],
        cibrcRegistrationReference: 'CIBRC Registered for Chilli Whiteflies & Mites'
      },
      {
        activeIngredient: 'Pyriproxyfen 10% EC',
        formulation: '10% EC',
        tradeNamesSample: ['Lano', 'Tiger'],
        approvedCrop: 'Chilli',
        targetCondition: 'Whitefly nymphs & eggs',
        labelDoseRate: 400, // 400 ml per acre
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray during early pest emergence',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 7,
        toxicityColorCode: 'green',
        protectiveEquipmentRequired: ['Protective gloves', 'Face mask'],
        cibrcRegistrationReference: 'CIBRC Label Schedule'
      }
    ],
    precautions: [
      'Chemical sprays do not cure existing viral infection inside plant tissue; they only manage vectors.',
      'Do not spray during mid-day heat or when honeybees are actively foraging in flowering crop.',
      'Rotate insecticides with different modes of action to prevent whitefly resistance.'
    ],
    lastVerifiedDate: '2025-09-10',
    officialSource: 'ICAR - Indian Institute of Horticultural Research (IIHR) Bangalore & CIBRC'
  },

  // 3. COTTON - PINK BOLLWORM
  {
    id: 'cotton_pink_bollworm_03',
    cropName: 'Cotton',
    cropScientificName: 'Gossypium hirsutum',
    conditionName: 'Pink Bollworm (Pectinophora gossypiella)',
    conditionType: 'pest',
    symptoms: [
      'Rosetted flowers with twisted petals failing to open normally',
      'Small entrance bore holes on developing bolls that seal quickly',
      'Internal burrowing into seeds and lint; discolored, stained lint, premature boll opening'
    ],
    favorableWeather: {
      minTemp: 22,
      maxTemp: 34,
      humidityThreshold: 70,
      rainfallPattern: 'Extended mid-season to late-season reproductive phase with high humidity'
    },
    culturalPractices: [
      'Install pheromone traps with Gossyplure lure @ 8 traps/acre for pest monitoring (ETL: 8 moths/trap/night)',
      'Install 15-20 traps/acre for mass trapping of male moths',
      'Terminate cotton crop by December/January; avoid extending ratoon crop which multiplies overwintering larvae',
      'Prompt destruction and disposal of cotton stalks after final harvest'
    ],
    biologicalControls: [
      {
        agentName: 'Trichogramma bactrae (Egg parasitoid)',
        applicationMethod: 'Release Tricho-cards @ 60,000 parasitized eggs/acre (3-4 releases at 7-10 day intervals)',
        dosageRate: '3 Tricho-cards/acre',
        source: 'Central Institute for Cotton Research (CICR) Nagpur'
      },
      {
        agentName: 'Neem Seed Kernel Extract (NSKE 5%)',
        applicationMethod: 'Foliar spray at squaring and flowering stage',
        dosageRate: '10 kg neem seed extract in 200 L water/acre',
        source: 'CICR Agro-Advisory'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Chlorantraniliprole 18.5% SC',
        formulation: '18.5% SC (Suspension Concentrate)',
        tradeNamesSample: ['Coragen'],
        approvedCrop: 'Cotton',
        targetCondition: 'Bollworm Complex',
        labelDoseRate: 60, // 60 ml per acre (150 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray when ETL is reached (5-10% damaged flowers/bolls)',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'green',
        protectiveEquipmentRequired: ['Protective eye gear', 'Impermeable gloves', 'Face mask'],
        cibrcRegistrationReference: 'CIBRC Registered Schedule for Cotton Lepidoptera'
      },
      {
        activeIngredient: 'Emamectin Benzoate 5% SG',
        formulation: '5% SG (Soluble Granule)',
        tradeNamesSample: ['Proclaim', 'Emaking'],
        approvedCrop: 'Cotton',
        targetCondition: 'Pink Bollworm & Bollworm complex',
        labelDoseRate: 88, // 88-100 g per acre (220 g/ha)
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar application with thorough coverage of flower squares and young bolls',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 15,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Rubber gloves', 'Protective footwear', 'Respirator mask'],
        cibrcRegistrationReference: 'CIBRC Approved Formulation Data'
      }
    ],
    precautions: [
      'Do not apply synthetic pyrethroids repeatedly as they flare up whiteflies and bollworm resistance.',
      'Observe Pre-Harvest Interval (PHI) strictly before picking lint.',
      'Check lure viability every 21 days in pheromone traps.'
    ],
    lastVerifiedDate: '2025-10-01',
    officialSource: 'ICAR - Central Institute for Cotton Research (CICR), Nagpur & CIBRC'
  },

  // 4. TOMATO - EARLY BLIGHT & LATE BLIGHT
  {
    id: 'tomato_early_blight_04',
    cropName: 'Tomato',
    cropScientificName: 'Solanum lycopersicum',
    conditionName: 'Early Blight (Alternaria solani)',
    conditionType: 'disease',
    symptoms: [
      'Dark brown to black concentric ring lesions ("target board" appearance) on older lower leaves first',
      'Yellow chlorotic halo surrounding individual leaf spots',
      'Stem cankers and dark, leathery, sunken spots at the stem end of fruits'
    ],
    favorableWeather: {
      minTemp: 24,
      maxTemp: 32,
      humidityThreshold: 80,
      rainfallPattern: 'Alternating wet and dry periods, frequent overhead irrigation or heavy morning dews'
    },
    culturalPractices: [
      'Stake plants to keep foliage off moist soil surface and facilitate air circulation',
      'Remove lower infected leaves touching the soil (bottom pruning) to reduce splash infection',
      'Avoid overhead sprinkler irrigation; prefer drip irrigation to maintain dry foliage',
      'Practice crop rotation with non-solanaceous crops (avoid chilli, potato, brinjal) for 2 seasons'
    ],
    biologicalControls: [
      {
        agentName: 'Trichoderma viride 1% WP',
        applicationMethod: 'Foliar spray at 5 g/litre water (1 kg/acre in 200 L water) preventively before onset of symptoms',
        dosageRate: '1 kg/acre',
        source: 'ICAR-IIHR Bangalore'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Mancozeb 75% WP',
        formulation: '75% WP',
        tradeNamesSample: ['Dithane M-45', 'Indofil M-45'],
        approvedCrop: 'Tomato',
        targetCondition: 'Early Blight & Late Blight',
        labelDoseRate: 600, // 600-800 g per acre (1.5 - 2 kg/ha)
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray at early disease onset; repeat after 10-14 days if wet conditions persist',
        maxApplicationsPerSeason: 3,
        waitingPeriodDaysPHI: 3,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Protective gloves', 'Face mask', 'Eye goggles'],
        cibrcRegistrationReference: 'CIBRC Registered for Tomato Blight'
      },
      {
        activeIngredient: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
        formulation: 'SC (Suspension Concentrate)',
        tradeNamesSample: ['Amistar Top'],
        approvedCrop: 'Tomato',
        targetCondition: 'Early Blight & Anthracnose',
        labelDoseRate: 200, // 200 ml per acre (500 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray delivering fine mist onto both upper and lower leaf surfaces',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 3,
        toxicityColorCode: 'green',
        protectiveEquipmentRequired: ['Impermeable gloves', 'Protective eyewear', 'Mask'],
        cibrcRegistrationReference: 'CIBRC Label Standard for Vegetables'
      }
    ],
    precautions: [
      'Wash hands and change clothes after spraying vegetables close to harvest.',
      'Never exceed recommended label rate per acre.',
      'Allow minimum 3 days PHI before harvesting fruits for market.'
    ],
    lastVerifiedDate: '2025-07-20',
    officialSource: 'ICAR - Indian Institute of Vegetable Research (IIVR) Varanasi & CIBRC'
  },

  // 5. WHEAT - YELLOW RUST / STRIPE RUST
  {
    id: 'wheat_yellow_rust_05',
    cropName: 'Wheat',
    cropScientificName: 'Triticum aestivum',
    conditionName: 'Stripe Rust / Yellow Rust (Puccinia striiformis)',
    conditionType: 'disease',
    symptoms: [
      'Linear rows of bright yellow pustules (uredinia) arranged parallel along leaf veins like stripes',
      'Yellow powder dusts off on fingers when touched',
      'Leaves dry up prematurely, resulting in shrivelled, underdeveloped grains'
    ],
    favorableWeather: {
      minTemp: 10,
      maxTemp: 22,
      humidityThreshold: 85,
      rainfallPattern: 'Cool temperatures, prolonged dew or light fog in North-Western plains and hill states'
    },
    culturalPractices: [
      'Grow rust-resistant varieties recommended for specific zones (e.g., HD 2967, DBW 187, DBW 303)',
      'Avoid late sowing of wheat in yellow rust prone areas',
      'Inspect fields regularly during cool December-February periods'
    ],
    biologicalControls: [],
    chemicalTreatments: [
      {
        activeIngredient: 'Propiconazole 25% EC',
        formulation: '25% EC',
        tradeNamesSample: ['Tilt', 'Radar'],
        approvedCrop: 'Wheat',
        targetCondition: 'Yellow Rust / Stripe Rust',
        labelDoseRate: 200, // 200 ml per acre (500 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray immediately upon spotting initial yellow stripe foci in field',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'yellow',
        protectiveEquipmentRequired: ['Chemical resistant gloves', 'Face mask', 'Eye protection', 'Rubber boots'],
        cibrcRegistrationReference: 'CIBRC Registered for Wheat Rust'
      }
    ],
    precautions: [
      'Act rapidly on first focal appearance; stripe rust can spread across entire district within days in cool foggy weather.',
      'Do not consume or graze livestock in freshly sprayed wheat fields.'
    ],
    lastVerifiedDate: '2025-11-05',
    officialSource: 'ICAR - Indian Institute of Wheat and Barley Research (IIWBR), Karnal & CIBRC'
  },

  // 6. MAIZE - FALL ARMYWORM
  {
    id: 'maize_fall_armyworm_06',
    cropName: 'Maize / Corn',
    cropScientificName: 'Zea mays',
    conditionName: 'Fall Armyworm (Spodoptera frugiperda)',
    conditionType: 'pest',
    symptoms: [
      'Pinholes and elongated "window pane" feeding marks on young leaves',
      'Extensive ragged tearing of leaves inside the central whorl with abundant sawdust-like moist frass (droppings)',
      'Larva has characteristic 4 dark spots arranged in square on 8th abdominal segment and inverted "Y" on head'
    ],
    favorableWeather: {
      minTemp: 20,
      maxTemp: 35,
      humidityThreshold: 60,
      rainfallPattern: 'Dry spells punctuated by intermittent showers favorable for rapid generational buildup'
    },
    culturalPractices: [
      'Deep summer ploughing to expose pupae to predatory birds and sun desiccation',
      'Intercrop with pulse crops (Cowpea, Pigeonpea) @ 2:1 or 4:1 ratio to foster natural enemies',
      'Apply fine sand or wood ash (mixed with lime 9:1) into the central whorl of young maize plants to abrade caterpillar cuticle',
      'Pheromone traps with Spodoptera frugiperda lure @ 5 traps/acre for surveillance'
    ],
    biologicalControls: [
      {
        agentName: 'Metarhizium rileyi / Beauveria bassiana 1.15% WP',
        applicationMethod: 'Direct whorl application @ 5 g/litre water (1 kg/acre in 200 L water)',
        dosageRate: '1 kg/acre',
        source: 'ICAR-National Bureau of Agricultural Insect Resources (NBAIR) Bengaluru'
      },
      {
        agentName: 'Bacillus thuringiensis (Bt) kurstaki 55,000 SU/mg WP',
        applicationMethod: 'Whorl directed spray during early larval instars (first 20-30 days)',
        dosageRate: '400 g/acre',
        source: 'ICAR-Indian Institute of Maize Research (IIMR) Ludhiana'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Chlorantraniliprole 18.5% SC',
        formulation: '18.5% SC',
        tradeNamesSample: ['Coragen'],
        approvedCrop: 'Maize',
        targetCondition: 'Fall Armyworm',
        labelDoseRate: 80, // 80 ml per acre (200 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Directed spray into the central leaf whorl using single nozzle knapsack sprayer',
        maxApplicationsPerSeason: 1,
        waitingPeriodDaysPHI: 14,
        toxicityColorCode: 'green',
        protectiveEquipmentRequired: ['Protective gloves', 'Face mask', 'Eye protection'],
        cibrcRegistrationReference: 'CIBRC Emergency & Regular Label Authorization for FAW on Maize'
      },
      {
        activeIngredient: 'Spinetoram 11.7% SC',
        formulation: '11.7% SC',
        tradeNamesSample: ['Delegate'],
        approvedCrop: 'Maize',
        targetCondition: 'Fall Armyworm',
        labelDoseRate: 100, // 100 ml per acre (250 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Targeted whorl spray',
        maxApplicationsPerSeason: 1,
        waitingPeriodDaysPHI: 14,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Protective gloves', 'Face mask', 'Full sleeves'],
        cibrcRegistrationReference: 'CIBRC Registered for Maize'
      }
    ],
    precautions: [
      'Chemical spray MUST be directed into the whorl cup where caterpillar resides; broadcasting over outer foliage is ineffective.',
      'Spray in early morning or late afternoon when caterpillars become active out of deep whorl folds.'
    ],
    lastVerifiedDate: '2025-08-30',
    officialSource: 'ICAR - Indian Institute of Maize Research (IIMR) & NBAIR Bengaluru'
  },

  // 7. GROUNDNUT - TIKKA LEAF SPOT
  {
    id: 'groundnut_tikka_07',
    cropName: 'Groundnut / Peanut',
    cropScientificName: 'Arachis hypogaea',
    conditionName: 'Tikka Leaf Spot (Cercospora arachidicola & Phaeoisariopsis personata)',
    conditionType: 'disease',
    symptoms: [
      'Circular to irregular dark brown to black spots on upper and lower leaf surfaces',
      'Early leaf spot has distinct bright yellow halo; late leaf spot is darker, carbonaceous, with less prominent halo',
      'Severe defoliation leaving only top leaves, leading to reduced pod filling and weak peg formation'
    ],
    favorableWeather: {
      minTemp: 24,
      maxTemp: 30,
      humidityThreshold: 80,
      rainfallPattern: 'Prolonged cloudy days, high relative humidity and warm soil'
    },
    culturalPractices: [
      'Destroy previous crop residues and self-sown groundnut volunteer plants',
      'Crop rotation with non-host crops like Sorghum, Pearl Millet or Maize for at least 1-2 seasons',
      'Adopt recommended spacing (30 x 10 cm) to avoid overcrowding and canopy humidity stagnation'
    ],
    biologicalControls: [
      {
        agentName: 'Trichoderma viride 1% WP',
        applicationMethod: 'Seed treatment @ 4 g/kg seed before sowing',
        dosageRate: '1 kg/acre seed allotment',
        source: 'ICAR-Directorate of Groundnut Research (DGR) Junagadh'
      }
    ],
    chemicalTreatments: [
      {
        activeIngredient: 'Tebuconazole 25.9% m/m EC',
        formulation: '25.9% EC',
        tradeNamesSample: ['Folicur'],
        approvedCrop: 'Groundnut',
        targetCondition: 'Tikka Leaf Spot & Rust',
        labelDoseRate: 200, // 200-250 ml/acre (500 ml/ha)
        rateUnit: 'ml/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray at 35-40 days after sowing or when initial spots appear',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Gloves', 'Eye protection', 'Face mask'],
        cibrcRegistrationReference: 'CIBRC Registered for Groundnut Tikka & Rust'
      },
      {
        activeIngredient: 'Carbendazim 12% + Mancozeb 63% WP',
        formulation: '75% WP',
        tradeNamesSample: ['Saaf', 'Sixer'],
        approvedCrop: 'Groundnut',
        targetCondition: 'Tikka Leaf Spot',
        labelDoseRate: 400, // 400 g per acre (1 kg/ha)
        rateUnit: 'g/acre',
        recommendedWaterVolumeLitresPerAcre: 200,
        applicationMethod: 'Foliar spray ensuring wetting of lower foliage',
        maxApplicationsPerSeason: 2,
        waitingPeriodDaysPHI: 30,
        toxicityColorCode: 'blue',
        protectiveEquipmentRequired: ['Protective gloves', 'Face mask'],
        cibrcRegistrationReference: 'CIBRC Approved for Groundnut'
      }
    ],
    precautions: [
      'Do not feed treated crop straw/haulm to dairy animals until Pre-Harvest Interval has elapsed.',
      'Always use personal protective equipment when handling fungicides.'
    ],
    lastVerifiedDate: '2025-09-01',
    officialSource: 'ICAR - Directorate of Groundnut Research (DGR), Junagadh & CIBRC'
  }
];

export function findVerifiedRecordByCropAndCondition(crop: string, condition: string): VerifiedDiseaseRecord | null {
  const normCrop = crop.toLowerCase().trim();
  const normCond = condition.toLowerCase().trim();

  for (const record of VERIFIED_DISEASE_RECORDS) {
    const recordCrop = record.cropName.toLowerCase();
    const recordCond = record.conditionName.toLowerCase();

    const cropMatch = recordCrop.includes(normCrop) || normCrop.includes(record.cropScientificName.toLowerCase()) ||
      (normCrop.includes('rice') && recordCrop.includes('paddy')) ||
      (normCrop.includes('paddy') && recordCrop.includes('rice')) ||
      (normCrop.includes('chilli') && recordCrop.includes('chilli')) ||
      (normCrop.includes('cotton') && recordCrop.includes('cotton')) ||
      (normCrop.includes('tomato') && recordCrop.includes('tomato')) ||
      (normCrop.includes('wheat') && recordCrop.includes('wheat')) ||
      (normCrop.includes('maize') && recordCrop.includes('maize')) ||
      (normCrop.includes('corn') && recordCrop.includes('maize')) ||
      (normCrop.includes('groundnut') && recordCrop.includes('groundnut'));

    const condMatch = recordCond.includes(normCond) || normCond.includes(recordCond) ||
      (normCond.includes('blast') && recordCond.includes('blast')) ||
      (normCond.includes('curl') && recordCond.includes('curl')) ||
      (normCond.includes('bollworm') && recordCond.includes('bollworm')) ||
      (normCond.includes('blight') && recordCond.includes('blight')) ||
      (normCond.includes('rust') && recordCond.includes('rust')) ||
      (normCond.includes('armyworm') && recordCond.includes('armyworm')) ||
      (normCond.includes('tikka') && recordCond.includes('tikka'));

    if (cropMatch && condMatch) {
      return record;
    }
  }

  // Fallback: match by condition keyword
  for (const record of VERIFIED_DISEASE_RECORDS) {
    if (normCond.includes('blast') && record.conditionName.toLowerCase().includes('blast')) return record;
    if (normCond.includes('curl') && record.conditionName.toLowerCase().includes('curl')) return record;
    if (normCond.includes('bollworm') && record.conditionName.toLowerCase().includes('bollworm')) return record;
    if (normCond.includes('blight') && record.conditionName.toLowerCase().includes('blight')) return record;
    if (normCond.includes('rust') && record.conditionName.toLowerCase().includes('rust')) return record;
    if (normCond.includes('armyworm') && record.conditionName.toLowerCase().includes('armyworm')) return record;
    if (normCond.includes('tikka') && record.conditionName.toLowerCase().includes('tikka')) return record;
  }

  return null;
}
