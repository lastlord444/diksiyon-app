import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AttemptButton from '@/components/AttemptButton';

interface ExercisePageProps {
  params: { id: string };
}

interface Exercise {
  id: string;
  title: string;
  content: string;
  sort_order: number;
  is_active: boolean;
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const { id } = params;
  let exercise: Exercise | null = null;
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from('exercises')
      .select('id, title, content, sort_order, is_active')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        // No rows returned
        notFound();
      }
      error = `DB Hatası: ${fetchError.message}`;
    } else {
      exercise = data;
    }
  } catch {
    error = 'Veritabanı bağlantısı başarısız. Lütfen daha sonra tekrar deneyin.';
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Egzersiz Hatası</h1>
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-medium">Egzersiz yüklenemedi</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-sm mt-2 text-red-600">
            Olası sebepler: Ağ bağlantısı sorunu, veritabanı erişim hatası, geçersiz egzersiz ID&apos;si
          </p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    notFound();
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {exercise.title}
      </h1>
      
      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Egzersiz Metni</h2>
          <p className="text-gray-700 leading-relaxed">
            {exercise.content}
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Attempt Başlat</h2>
          <p className="text-gray-600 mb-4">
            Bu egzersizi denemek için aşağıdaki butona tıklayın.
          </p>
          <AttemptButton exerciseId={exercise.id} />
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Referans Ses</h2>
          <p className="text-gray-600">
            Referans ses dosyası ileride eklenecek. (TASK-010)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Ses Kaydetme</h2>
          <p className="text-gray-600">
            Ses kaydetme arayüzü ileride eklenecek. (TASK-010)
          </p>
        </section>
      </div>
    </div>
  );
}