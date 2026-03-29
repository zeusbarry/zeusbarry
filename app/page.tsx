import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

export default function HomePage() {
  const difficultyColor = {
    facile: "text-green-600 bg-green-50 border-green-100",
    moyen: "text-yellow-600 bg-yellow-50 border-yellow-100",
    difficile: "text-red-600 bg-red-50 border-red-100",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="px-4 pt-12 pb-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full mb-4">
          🗣️ Entraîne-toi à communiquer
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          CommsCoach
        </h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Pratique des vraies conversations avec une IA qui joue différents rôles.
          Reçois un feedback immédiat pour progresser.
        </p>
      </div>

      {/* Stats rapides */}
      <div className="flex justify-center gap-6 px-4 mb-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">{SCENARIOS.length}</p>
          <p className="text-xs text-gray-500">scénarios</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">🎙️</p>
          <p className="text-xs text-gray-500">voix incluse</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-indigo-600">24/7</p>
          <p className="text-xs text-gray-500">disponible</p>
        </div>
      </div>

      {/* Scénarios */}
      <div className="px-4 pb-12 max-w-2xl mx-auto">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Choisir un scénario
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {SCENARIOS.map((scenario) => (
            <Link
              key={scenario.id}
              href={`/chat/${scenario.id}`}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group flex items-center gap-4"
            >
              <span className="text-3xl">{scenario.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-700 transition-colors">
                    {scenario.title}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                      difficultyColor[scenario.difficulty]
                    }`}
                  >
                    {scenario.difficulty}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{scenario.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">Avec : {scenario.personaName}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-8">
          💡 Active le micro pour pratiquer à l&apos;oral · Feedback disponible dans chaque conversation
        </p>
      </div>
    </div>
  );
}
