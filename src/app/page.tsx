import Link from "next/link";
import { createClient } from '@/lib/supabase/server';

interface Exercise {
  id: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

export default async function Home() {
  let exercises: Exercise[] = [];
  let error: string | null = null;

  try {
    const supabase = await createClient();
    const { data, error: fetchError } = await supabase
      .from('exercises')
      .select('id, title, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (fetchError) {
      error = `DB Hatası: ${fetchError.message}`;
    } else {
      exercises = data || [];
    }
  } catch {
    error = 'Veritabanı bağlantısı başarısız. Lütfen daha sonra tekrar deneyin.';
  }

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Egzersizler</h1>
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p className="font-medium">Egzersizler yüklenemedi</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Egzersizler</h1>
        <div className="p-4 bg-gray-100 border border-gray-300 text-gray-600 rounded-lg">
          <p>Henüz egzersiz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Egzersizler</h1>
      
      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <Link 
            key={exercise.id}
            href={`/exercise/${exercise.id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <h2 className="text-lg font-medium text-gray-900">
              {exercise.title}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Egzersiz ID: {exercise.id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
