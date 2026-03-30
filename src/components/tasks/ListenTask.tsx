import { useEffect } from 'react'
import type { LiterQuestion } from '../../types/liter'

interface Props {
  question: LiterQuestion
  onAnswer: (letter: string) => void
  isAnswered: boolean
  chosen: string | null
  onSpeak: () => void
}

export function ListenTask({ question, onAnswer, isAnswered, chosen, onSpeak }: Props) {
  const { options = [], correct = '' } = question

  // Odtwórz głos automatycznie przy pojawieniu się pytania
  useEffect(() => {
    const t = setTimeout(onSpeak, 400)
    return () => clearTimeout(t)
  }, [question.id])

  const getButtonClass = (opt: string) => {
    const base = 'w-full h-24 text-5xl font-black rounded-3xl border-4 transition-all duration-200 flex items-center justify-center'
    if (!isAnswered) {
      return `${base} bg-white border-blue-200 hover:border-blue-400 hover:scale-105 active:scale-95`
    }
    if (opt === correct) return `${base} bg-green-100 border-green-500 text-green-700`
    if (opt === chosen && opt !== correct) return `${base} bg-red-100 border-red-400 text-red-600`
    return `${base} bg-white border-gray-200 opacity-40`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Przycisk odsłuchania */}
      <button
        onClick={onSpeak}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-28 h-28 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center text-6xl shadow-lg hover:scale-105 active:scale-95 transition-all">
          🔊
        </div>
        <span className="text-blue-600 font-bold text-sm">Dotknij, żeby posłuchać</span>
      </button>

      <p className="text-xl font-bold text-gray-600 text-center">
        Której litery słyszysz?
      </p>

      {/* Litery do wyboru */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => onAnswer(opt)}
            disabled={isAnswered}
            className={getButtonClass(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
