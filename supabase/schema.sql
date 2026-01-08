-- Diksiyon App Database Schema
-- Updated: exercises tablosu yenilendi + attempts + RLS policies
-- 
-- Usage: Supabase SQL Editor'da tek seferde çalıştır

-- ===================================
-- 1. EXTENSIONS
-- ===================================

-- UUID extension (gen_random_uuid için gerekli)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- 2. FUNCTIONS
-- ===================================

-- Updated_at otomatik güncelleme function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ===================================
-- 3. TABLES
-- ===================================

-- Exercises table: egzersizlerin metadata'sı
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  reference_audio_path text NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Attempts table: kullanıcı egzersiz denemelerinin kayıtları  
CREATE TABLE public.attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'started'
);

-- ===================================
-- 4. TRIGGERS
-- ===================================

-- Updated_at trigger for exercises table
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON public.exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- 5. INDEXES
-- ===================================

-- Exercise listesi için sort_order + is_active
CREATE INDEX idx_exercises_sort_active ON public.exercises(sort_order ASC, is_active);

-- User'ın attempts'larını created_at desc ile sırala
CREATE INDEX idx_attempts_user_created ON public.attempts(user_id, created_at DESC);

-- Exercise'ın attempts'larını created_at desc ile sırala
CREATE INDEX idx_attempts_exercise_created ON public.attempts(exercise_id, created_at DESC);

-- ===================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS for both tables
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

-- ===================================
-- 7. RLS POLICIES
-- ===================================

-- EXERCISES: Authenticated users can read active exercises
CREATE POLICY "exercises_select_authenticated" ON public.exercises 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

-- EXERCISES: INSERT kapalı (manuel seed ile eklenir)
-- EXERCISES: UPDATE kapalı  
-- EXERCISES: DELETE kapalı

-- ATTEMPTS: User can select only their own attempts
CREATE POLICY "attempts_select_own" ON public.attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ATTEMPTS: User can insert only their own attempts  
CREATE POLICY "attempts_insert_own" ON public.attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ATTEMPTS: UPDATE kapalı
-- ATTEMPTS: DELETE kapalı

-- ===================================
-- SCHEMA COMPLETED
-- ===================================

-- Verification queries (kullanım örnekleri):
-- SELECT * FROM public.exercises WHERE is_active = true ORDER BY sort_order;
-- SELECT * FROM public.attempts WHERE user_id = auth.uid();