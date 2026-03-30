import type { LiterLevel } from '../../types/liter'
import { LEVEL_CONFIG } from '../../data/literData'

interface Props {
  onStart: (level: LiterLevel) => void
  onBack: () => void
}

export function LiterStartScreen({ onStart, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col items-center px-4 py-10">
      <button onClick={onBack} className="self-start mb-6 text-gray-400 hover:text-gray-600 font-bold flex items-center gap-1">
        ← Wróć
      </button>

      <div className="text-7xl mb-3 animate-bounce">📖</div>
      <h1 className="text-4xl font-black text-purple-600 mb-1 text-center">LiterMistrz</h1>
      <p className="text-gray-500 font-semibold mb-10 text-center">Nauka liter i czytania — wybierz poziom!</p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {(Object.entries(LEVEL_CONFIG) as [LiterLevel, typeof LEVEL_CONFIG[LiterLevel]][]).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => onStart(key)}
            className="w-full p-6 rounded-[2rem] bg-white shadow-md border-4 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-5"
            style={{ borderColor: cfg.color }}
          >
            <span className="text-5xl">{cfg.emoji}</span>
            <div className="text-left">
              <div className="text-2xl font-black" style={{ color: cfg.color }}>{cfg.label}</div>
              <div className="text-gray-500 text-sm font-medium">{cfg.desc}</div>
              <div className="text-xs text-gray-400 mt-1">
                Typy zadań: {cfg.taskTypes.length} różne
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
