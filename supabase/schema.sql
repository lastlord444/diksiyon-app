-- Diksiyon App Database Schema
-- TASK-008: exercises + attempts tables with RLS
-- 
-- Usage: Supabase SQL Editor'da tek seferde çalıştır

-- ===================================
-- 1. TABLES
-- ===================================

-- Exercises table: egzersizlerin metadata'sı
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
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
-- 2. INDEXES
-- ===================================

-- User'ın attempts'larını created_at desc ile sırala
CREATE INDEX idx_attempts_user_created ON public.attempts(user_id, created_at DESC);

-- Exercise'ın attempts'larını created_at desc ile sırala
CREATE INDEX idx_attempts_exercise_created ON public.attempts(exercise_id, created_at DESC);

-- ===================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS for both tables
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;

-- ===================================
-- 4. RLS POLICIES
-- ===================================

-- EXERCISES: Public read (anon + authenticated users)
CREATE POLICY "exercises_select_public" ON public.exercises 
  FOR SELECT 
  TO anon, authenticated
  USING (true);

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

-- ===================================
-- 5. SEED DATA
-- ===================================

-- Sample exercises (3 gerçekçi Türkçe egzersiz)
INSERT INTO public.exercises (title, body) VALUES 
(
  'Harf Telaffuzu - A, E, I Sesli Harfleri',
  'Aşağıdaki kelimeleri net bir şekilde telaffuz edin: Ahmet, elma, inek, odul, uzak. Her kelimeyi 3 kez tekrarlayın ve sesli harflere özellikle dikkat edin.'
),
(
  'Nefes Kontrolü ve Tonlama',
  'Derin bir nefes alın ve "Merhaba, bugün hava çok güzel" cümlesini tek nefeste, net ve anlaşılır şekilde söyleyin. Cümle sonunda sesiniz titrememeli.'
),
(
  'Zor Ünsüz Birleşimleri',
  'Bu kelime gruplarını hızlı ve doğru telaffuz edin: strateji, planlama, krupye, proje, trafik. Her grubu 5 kez tekrar edin.'
);

-- ===================================
-- SCHEMA COMPLETED
-- ===================================

-- Verification queries (kullanım örnekleri):
-- SELECT * FROM public.exercises;
-- SELECT * FROM public.attempts WHERE user_id = auth.uid();