-- Diksiyon App Seed Data
-- Usage: schema.sql çalıştırdıktan sonra bu dosyayı çalıştır
-- Note: RLS policies devreye girdiği için bu seed'i service role ile çalıştır

-- ===================================
-- EXERCISES SEED DATA
-- ===================================

-- 5 örnek diksiyon egzersizi
INSERT INTO public.exercises (title, content, reference_audio_path, sort_order, is_active) VALUES 
(
  'Sesli Harfler - A, E, I, O, U',
  'Aşağıdaki kelimeleri net bir şekilde telaffuz edin: araba, elma, inek, otel, uzak. Her kelimeyi 3 kez tekrarlayın ve sesli harflere özellikle dikkat edin.',
  NULL,
  1,
  true
),
(
  'Nefes Kontrolü ve Tonlama',
  'Derin bir nefes alın ve "Merhaba, bugün hava çok güzel" cümlesini tek nefeste, net ve anlaşılır şekilde söyleyin. Cümle sonunda sesiniz titrememeli.',
  NULL,
  2,
  true
),
(
  'R Harfi Telaffuzu',
  'Bu kelimeleri doğru R telaffuzuyla söyleyin: karar, araba, herkese, koridor, gururlu. R sesini dil ucuyla damağa değdirerek çıkarın.',
  NULL,
  3,
  true
),
(
  'Zor Ünsüz Birleşimleri',
  'Bu kelime gruplarını hızlı ve doğru telaffuz edin: strateji, planlama, krupye, proje, trafik. Her grubu 5 kez tekrar edin.',
  NULL,
  4,
  true
),
(
  'Artikülasyon Egzersizi',
  'Şu cümleyi açık ve net bir şekilde söyleyin: "Şişli''de şahane şarkılar söyleyen şarkıcı". Harfleri birbirine karıştırmadan telaffuz edin.',
  NULL,
  5,
  true
);

-- ===================================
-- SEED COMPLETED
-- ===================================

-- Verification query:
-- SELECT title, sort_order, is_active FROM public.exercises ORDER BY sort_order;