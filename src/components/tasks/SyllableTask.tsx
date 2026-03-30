import { useState } from 'react'
import type { LiterQuestion } from '../../types/liter'

interface Props {
  question: LiterQuestion
  onAnswer: (correct: boolean) => void
  isAnswered: boolean
  isCorrect: boolean | null
}

export function SyllableTask({ question, onAnswer, isAnswered, isCorrect }: Props) {
  const { syllables = [], syllableWord = '' } = question
  const [built, setBuilt] = useState<string[]>([])
  const [available, setAvailable] = useState<string[]>([...syllables])

  const addSyllable = (syl: string, idx: number) => {
    if (isAnswered) return
    setBuilt(prev => [...prev, syl])
    setAvailable(prev => {
      const next = [...prev]
      next.splice(idx, 1)
      return next
    })
  }

  const removeSyllable = (idx: number) => {
    if (isAnswered) return
    const syl = built[idx]
    setBuilt(prev => prev.filter((_, i) => i !== idx))
    setAvailable(prev => [...prev, syl])
  }

  const handleClear = () => {
    setBuilt([])
    setAvailable([...syllables])
  }

  const handleCheck = () => {
    const assembled = built.join('')
    onAnswer(assembled === syllableWord)
  }

  const allUsed = available.length === 0

  const builtBg = isAnswered
    ? isCorrect
      ? 'bg-green-50 border-green-400'
      : 'bg-red-50 border-red-400'
    : 'bg-blue-50 border-blue-300'

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-xl font-bold text-gray-700 text-center">
        Ułóż sylaby w odpowiedniej kolejności!
      </p>

      {/* Składany wyraz */}
      <div className={`w-full min-h-[64px] rounded-2xl border-4 ${builtBg} flex items-center justify-center gap-2 flex-wrap p-3 transition-colors`}>
        {built.length === 0 ? (
          <span className="text-gray-400 font-bold text-lg">Tutaj pojawi się wyraz...</span>
        ) : (
          built.map((syl, i) => (
            <button
              key={i}
              onClick={() => removeSyllable(i)}
              disabled={isAnswered}
              className="bg-white border-2 border-blue-400 text-blue-700 font-black text-2xl px-4 py-2 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all"
            >
              {syl}
            </button>
          ))
        )}
      </div>

      {/* Dostępne sylaby */}
      <div className="flex gap-3 flex-wrap justify-center">
        {available.map((syl, i) => (
          <button
            key={`${syl}-${i}`}
            onClick={() => addSyllable(syl, i)}
            disabled={isAnswered}
            className="bg-yellow-100 border-4 border-yellow-400 text-gray-800 font-black text-2xl px-5 py-3 rounded-2xl hover:bg-yellow-200 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            {syl}
          </button>
        ))}
      </div>

      {/* Przyciski akcji */}
      {!isAnswered && (
        <div className="flex gap-3 w-full">
          <button
            onClick={handleClear}
            className="flex-1 py-3 rounded-2xl bg-gray-100 border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-200 transition-all"
          >
            🗑️ Wyczyść
          </button>
          <button
            onClick={handleCheck}
            disabled={!allUsed}
            className={`flex-1 py-3 rounded-2xl font-black text-white transition-all ${
              allUsed
                ? 'bg-green-500 border-2 border-green-600 hover:bg-green-600 hover:scale-105'
                : 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            ✅ Sprawdź!
          </button>
        </div>
      )}

      {isAnswered && (
        <div className={`w-full py-3 rounded-2xl text-center font-black text-white text-xl ${
          isCorrect ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {isCorrect ? `✅ Tak! To jest ${syllableWord}!` : `❌ Poprawnie: ${syllableWord}`}
        </div>
      )}
    </div>
  )
}
