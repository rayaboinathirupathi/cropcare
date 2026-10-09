-- ==============================================================================
-- CropCare AI — Database Schema Migration
-- Migration: 20261009_cropcare_schema.sql
-- Compatible with Supabase PostgreSQL (Row Level Security & Extensions)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Farmer accounts)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    farmer_name TEXT NOT NULL,
    phone_number TEXT,
    language_pref TEXT NOT NULL DEFAULT 'en', -- 'en', 'te', 'hi'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USER PREFERENCES (Accessibility & Privacy)
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    high_contrast BOOLEAN NOT NULL DEFAULT FALSE,
    large_text BOOLEAN NOT NULL DEFAULT FALSE,
    audio_narration BOOLEAN NOT NULL DEFAULT FALSE,
    store_images_consented BOOLEAN NOT NULL DEFAULT TRUE,
    store_location_consented BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. FARMS (Landholdings & agronomy)
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    village_town TEXT,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    total_area_acres NUMERIC(8, 2) NOT NULL DEFAULT 1.0,
    irrigation_type TEXT NOT NULL DEFAULT 'borewell', -- 'drip', 'canal', 'borewell', 'rainfed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CROP RECORDS (Crops planted)
CREATE TABLE IF NOT EXISTS crop_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    sowing_date DATE,
    growth_stage TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AGRICULTURAL SOURCES (Official institutions)
CREATE TABLE IF NOT EXISTS agricultural_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_name TEXT NOT NULL UNIQUE,
    organization_type TEXT NOT NULL, -- 'ICAR', 'State University', 'CIBRC', 'KVK'
    website_url TEXT,
    last_verified_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. DISEASE KNOWLEDGE (Verified reference data)
CREATE TABLE IF NOT EXISTS disease_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES agricultural_sources(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    crop_scientific_name TEXT NOT NULL,
    condition_name TEXT NOT NULL,
    condition_type TEXT NOT NULL, -- 'disease', 'pest', 'deficiency', 'environmental'
    symptoms_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    cultural_measures_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    precautions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_verified_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. PRODUCT LABEL RECORDS (Strict CIBRC registrations)
CREATE TABLE IF NOT EXISTS product_label_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    disease_id UUID REFERENCES disease_knowledge(id) ON DELETE CASCADE,
    active_ingredient TEXT NOT NULL,
    formulation TEXT NOT NULL,
    approved_crop TEXT NOT NULL,
    target_condition TEXT NOT NULL,
    label_dose_rate NUMERIC(10, 2) NOT NULL,
    rate_unit TEXT NOT NULL, -- 'g/acre', 'ml/acre', 'kg/ha', 'l/ha'
    recommended_water_litres NUMERIC(8, 2) NOT NULL DEFAULT 200.0,
    application_method TEXT NOT NULL,
    max_applications_per_season INT NOT NULL DEFAULT 2,
    phi_days INT NOT NULL, -- Pre-Harvest Interval
    toxicity_color TEXT NOT NULL, -- 'green', 'blue', 'yellow', 'red'
    ppe_required_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    cibrc_registration_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. DIAGNOSIS SESSIONS
CREATE TABLE IF NOT EXISTS diagnosis_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    session_token TEXT,
    input_modality TEXT NOT NULL, -- 'photo', 'text', 'voice'
    raw_symptom_text TEXT,
    input_language TEXT NOT NULL DEFAULT 'en',
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    district TEXT,
    state TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. DIAGNOSIS IMAGES
CREATE TABLE IF NOT EXISTS diagnosis_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES diagnosis_sessions(id) ON DELETE CASCADE,
    storage_path TEXT,
    file_mime_type TEXT NOT NULL,
    file_size_bytes INT NOT NULL,
    is_plant_image BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. DIAGNOSIS RESULTS
CREATE TABLE IF NOT EXISTS diagnosis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES diagnosis_sessions(id) ON DELETE CASCADE,
    detected_crop TEXT,
    likely_condition TEXT NOT NULL,
    condition_type TEXT NOT NULL,
    confidence_level TEXT NOT NULL, -- 'high', 'medium', 'low'
    confidence_score NUMERIC(4, 3),
    evidence_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    alternatives_json JSONB NOT NULL DEFAULT '[]'::jsonb,
    ai_provider_used TEXT NOT NULL,
    model_version TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. WEATHER SNAPSHOTS
CREATE TABLE IF NOT EXISTS weather_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES diagnosis_sessions(id) ON DELETE SET NULL,
    temperature_c NUMERIC(5, 2),
    humidity_percent NUMERIC(5, 2),
    wind_speed_kmh NUMERIC(5, 2),
    weather_condition TEXT,
    fungal_risk TEXT,
    pest_risk TEXT,
    spraying_condition TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SAVED REPORTS
CREATE TABLE IF NOT EXISTS saved_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    result_id UUID REFERENCES diagnosis_results(id) ON DELETE CASCADE,
    report_title TEXT NOT NULL,
    notes TEXT,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. FEEDBACK REPORTS (Farmer error triage)
CREATE TABLE IF NOT EXISTS feedback_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    result_id UUID REFERENCES diagnosis_results(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    feedback_type TEXT NOT NULL, -- 'accurate', 'inaccurate', 'partial'
    user_notes TEXT,
    actual_problem_reported TEXT,
    reviewed_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT EVENTS
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    actor_id TEXT,
    metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_disease_crop ON disease_knowledge(crop_name);
CREATE INDEX IF NOT EXISTS idx_disease_condition ON disease_knowledge(condition_name);
CREATE INDEX IF NOT EXISTS idx_diag_results_session ON diagnosis_results(session_id);
CREATE INDEX IF NOT EXISTS idx_diag_sessions_profile ON diagnosis_sessions(profile_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reviewed ON feedback_reports(reviewed_by_admin);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE disease_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_label_records ENABLE ROW LEVEL SECURITY;

-- 1. Public reference data is readable by all authenticated and anon users
CREATE POLICY "Public read access to disease knowledge"
    ON disease_knowledge FOR SELECT
    USING (true);

CREATE POLICY "Public read access to product label records"
    ON product_label_records FOR SELECT
    USING (true);

-- 2. User profiles & farms can only be viewed and modified by their respective owners
CREATE POLICY "Users can manage own profile"
    ON profiles FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own farm records"
    ON farms FOR ALL
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own saved reports"
    ON saved_reports FOR ALL
    USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create feedback reports"
    ON feedback_reports FOR INSERT
    WITH CHECK (true);
