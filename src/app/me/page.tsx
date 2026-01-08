export default function MePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profilim</h1>
      
      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Kullanıcı Bilgileri
          </h2>
          <p className="text-gray-600">
            Kullanıcı profil bilgileri burada görünecek. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            İlerleme
          </h2>
          <p className="text-gray-600">
            Attempt geçmişi TASK-009&apos;da gelecek. (placeholder)
          </p>
        </section>
        
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            İstatistikler
          </h2>
          <p className="text-gray-600">
            Egzersiz istatistikleri burada görünecek. (placeholder)
          </p>
        </section>
      </div>
    </div>
  );
}