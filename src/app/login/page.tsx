export default function LoginPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Giriş</h1>
      
      <div className="max-w-md">
        <p className="text-gray-600 mb-6">
          Supabase Auth TASK-007&apos;de bağlanacak.
        </p>
        
        <button 
          disabled
          className="w-full px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          Giriş Yap (yakında)
        </button>
      </div>
    </div>
  );
}