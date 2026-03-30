import type { LiterLevel, TaskType } from '../../types/liter'

interface Props {
  onStart: (level: LiterLevel, type: TaskType) => void
  onBack: () => void
}

export function LiterStudySelectScreen({ onStart, onBack }: Props) {
  const levels: { id: LiterLevel, label: string, color: string }[] = [
    { id: 'easy', label: 'ŁATWY', color: '#00B894' },
    { id: 'medium', label: 'ŚREDNI', color: '#E67E22' },
    { id: 'hard', label: 'TRUDNY', color: '#E74C3C' },
  ]

  const types: { id: TaskType, label: string, emoji: string, desc: string }[] = [
    { id: 'listen', label: 'Słuch',  emoji: '🔊', desc: 'Posłuchaj i znajdź literę' },
    { id: 'image',  label: 'Obraz',  emoji: '🎨', desc: 'Na jaką literę zaczyna się słowo?' },
    { id: 'syllable', label: 'Sylaby', emoji: '🧩', desc: 'Ułóż wyraz z klocków' },
    { id: 'draw',   label: 'Pisanie', emoji: '✏️', desc: 'Naucz się pisać literę' },
  ]

  return (
    <div className="min-h-screen bg-[#F0F7FF] flex flex-col items-center px-4 py-10 relative overflow-hidden">
      <button onClick={onBack} className="self-start mb-6 text-gray-400 hover:text-gray-600 font-bold flex items-center gap-1">
        ← Wróć do menu
      </button>

      <div className="text-7xl mb-3 animate-pulse">📚</div>
      <h1 className="text-4xl font-black text-blue-600 mb-2 text-center underline decoration-yellow-400 underline-offset-8 decoration-4">SALA NAUKI</h1>
      <p className="text-gray-500 font-bold mb-10 text-center">Wybierz, co chcesz dziś potrenować!</p>

      {/* Wybór rodzaju zadania */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {types.map(t => (
          <div key={t.id} className="bg-white p-6 rounded-[2rem] shadow-sm border-4 border-blue-50 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <span className="text-4xl">{t.emoji}</span>
                <div className="text-left">
                  <div className="font-black text-gray-800 text-xl">{t.label}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase">{t.desc}</div>
                </div>
             </div>
             
             <div className="flex gap-2">
                {levels.map(l => (
                   <button
                     key={l.id}
                     onClick={() => onStart(l.id, t.id)}
                     className="flex-1 py-3 rounded-2xl font-black text-xs text-white shadow-sm hover:scale-105 active:scale-95 transition-all"
                     style={{ backgroundColor: l.color }}
                   >
                     {l.label}
                   </button>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
