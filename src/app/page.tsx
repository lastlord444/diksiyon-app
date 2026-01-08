import Link from "next/link";

export default function Home() {
  const exercises = [
    { id: 1, title: "Harf Telaffuzu - A, E, I" },
    { id: 2, title: "Nefes Teknikleri" },
    { id: 3, title: "Tonlama Egzersizleri" }
  ];

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
              Egzersiz #{exercise.id}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
