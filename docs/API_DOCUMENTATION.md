# CropCare AI — API Reference Documentation

All endpoints are hosted under `/api/*` and return standard JSON payloads.

---

## 1. Diagnostics Endpoints

### `POST /api/diagnose/image`
Analyzes a crop photograph using multimodal computer vision and grounds results against verified ICAR records.

**Request**: `multipart/form-data`
- `image`: Binary file (JPEG, PNG, or WebP; maximum 10 MB)
- `district` *(optional)*: string (e.g., `"Warangal"`)
- `state` *(optional)*: string (e.g., `"Telangana"`)
- `language` *(optional)*: `"en" | "te" | "hi"`
- `notes` *(optional)*: string (additional observations)

**Response**: `200 OK`
```json
{
  "id": "diag_1728464920_ab12",
  "timestamp": "2026-10-09T14:30:00.000Z",
  "crop": {
    "name": "Chilli",
    "scientificName": "Capsicum annuum"
  },
  "inputAssessment": {
    "isPlantImage": true,
    "imageQuality": "good"
  },
  "diagnoses": [
    {
      "condition": "Chilli Leaf Curl Virus (Begomovirus)",
      "conditionType": "disease",
      "confidence": "high",
      "evidence": ["Severe upward leaf curling", "Whitefly vectors present"],
      "alternatives": ["Mite infestation"]
    }
  ],
  "managementRecommendations": [
    {
      "action": "Erect yellow sticky traps @ 15-20 traps/acre",
      "reason": "Mass trapping of whitefly vectors",
      "category": "cultural",
      "sourceIds": ["ICAR-IIHR Bangalore"]
    }
  ],
  "needsExpertReview": true,
  "verifiedKnowledgeMatch": { ... },
  "aiProviderUsed": "Google Gemini (Multimodal AI) + ICAR Verified Knowledge Grounding"
}
```

---

### `POST /api/diagnose/text`
Analyzes natural language symptom descriptions in English, Telugu, or Hindi.

**Request**: `application/json`
```json
{
  "text": "My chilli crop has severe leaf curl and tiny white insects",
  "district": "Guntur",
  "state": "Andhra Pradesh",
  "language": "en"
}
```

---

### `POST /api/diagnose/voice-transcript`
Processes speech transcripts captured through the farmer's microphone.

**Request**: `application/json`
```json
{
  "transcript": "మిరప తోటలో ఆకులు పైకి ముడుచుకుని తెల్ల దోమ కనిపిస్తోంది",
  "district": "Warangal",
  "state": "Telangana",
  "language": "te",
  "speechProvider": "Web Speech API Client Transcription"
}
```

---

## 2. Weather & Advisories

### `GET /api/weather?lat=17.9689&lon=79.5941&district=Warangal`
Retrieves live Open-Meteo meteorological parameters and calculates agricultural disease risk indices.

**Response**:
```json
{
  "locationName": "Warangal",
  "temperatureC": 28.5,
  "humidityPercent": 82,
  "windSpeedKmH": 8.4,
  "agriculturalIndices": {
    "fungalDiseaseRisk": "high",
    "pestSurgeRisk": "moderate",
    "sprayingCondition": "favorable",
    "sprayingAdvice": "Weather is favorable for pesticide or foliar nutrient spraying."
  },
  "forecastDaily": [ ... ]
}
```

---

### `GET /api/advisories?district=Warangal&state=Telangana`
Retrieves location-specific regional agricultural advisory bulletins.

---

## 3. Treatments & Calculations

### `POST /api/treatments/calculate`
Executes unit-aware, deterministic dosage calculation based strictly on CIBRC label specifications.

**Request**:
```json
{
  "treatmentRecordId": "Tricyclazole 75% WP",
  "landArea": 2.5,
  "landUnit": "acre",
  "tankSizeLitres": 16
}
```

**Response**:
```json
{
  "inputArea": 2.5,
  "inputUnit": "acre",
  "areaInAcres": 2.5,
  "calculatedProductQuantity": 300,
  "productQuantityUnit": "grams",
  "totalWaterVolumeLitres": 500,
  "numberOfTanksApprox": {
    "tankSizeLitres": 16,
    "tankCount": 32,
    "productPerTank": 9.6,
    "productPerTankUnit": "grams"
  },
  "phiDays": 30,
  "safetyWarning": "PRECAUTION: Wear required PPE ...",
  "labelInstructionsVerbatim": "Approved Label Rate: 120 g/acre in 200L water/acre ..."
}
```

---

## 4. Administrative & Feedback

### `GET /api/health`
Health check reporting operational status of AI provider, weather services, database, and safety validators.

### `POST /api/admin/feedback`
Captures farmer feedback (`accurate` or `inaccurate`) for agricultural review.

### `GET /api/admin/knowledge` & `POST /api/admin/knowledge`
Authorized interface for agricultural extension staff to curate verified disease and label data.
