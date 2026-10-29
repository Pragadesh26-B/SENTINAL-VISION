-- ==============================================================================
-- CRIMEFACE AI - SUPABASE POSTGRESQL DATABASE SCHEMA
-- Execute in Supabase SQL Editor to initialize required tables, buckets, and policies
-- ==============================================================================

-- 1. Create Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    badge_number TEXT,
    agency TEXT DEFAULT 'Metropolitan Forensic Division',
    role TEXT DEFAULT 'Investigator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read profile" 
ON public.profiles FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow users update own profile" 
ON public.profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- 2. Create Cases table
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    incident_type TEXT NOT NULL,
    incident_date DATE,
    location TEXT,
    summary TEXT,
    status TEXT NOT NULL DEFAULT 'Active Investigation',
    primary_composite_url TEXT,
    investigator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on cases
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cases" 
ON public.cases FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow authenticated write cases" 
ON public.cases FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 3. Create Suspect Composites table (stores revision history)
CREATE TABLE IF NOT EXISTS public.suspect_composites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    revision_number INT NOT NULL DEFAULT 1,
    extracted_traits JSONB NOT NULL DEFAULT '{}'::jsonb,
    witness_notes TEXT,
    correction_prompt TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on composites
ALTER TABLE public.suspect_composites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to composites" 
ON public.suspect_composites FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "Allow authenticated write composites" 
ON public.suspect_composites FOR ALL 
TO authenticated 
USING (true)
WITH CHECK (true);

-- 4. Storage Bucket Setup
-- Run this in SQL Editor to set up public sketch bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('crimeface-sketches', 'crimeface-sketches', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for storage bucket
CREATE POLICY "Public Access for Crimeface Sketches"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'crimeface-sketches');

CREATE POLICY "Authenticated Upload to Crimeface Sketches"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'crimeface-sketches');
