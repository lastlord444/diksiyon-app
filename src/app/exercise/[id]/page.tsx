interface ExercisePageProps {
  params: { id: string };
}

export default function ExercisePage({ params }: ExercisePageProps) {
  const { id } = params;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Egzersiz #{id}
      </h1>
      
      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Metin</h2>
          <p className="text-gray-600">
            Egzersiz metni burada görünecek. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Referans Ses</h2>
          <p className="text-gray-600">
            Referans ses dosyası burada oynatılacak. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Kayıt</h2>
          <p className="text-gray-600">
            Ses kaydetme arayüzü burada olacak. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Yükleme</h2>
          <p className="text-gray-600">
            Kayıt yükleme ve analiz sonuçları burada görünecek. (placeholder)
          </p>
        </section>
      </div>
    </div>
  );
}