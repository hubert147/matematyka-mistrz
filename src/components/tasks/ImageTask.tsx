import { useState } from 'react'
import type { LiterQuestion } from '../../types/liter'

interface Props {
  question: LiterQuestion
  onAnswer: (letter: string) => void
  isAnswered: boolean
  chosen: string | null
}

export function ImageTask({ question, onAnswer, isAnswered, chosen }: Props) {
  const { options = [], correct = '', word = '', emoji = '❓', imageFile } = question
  const [imgError, setImgError] = useState(false)

  const getButtonClass = (opt: string) => {
    const base = 'w-full h-24 text-5xl font-black rounded-3xl border-4 transition-all duration-200 flex items-center justify-center'
    if (!isAnswered) {
      return `${base} bg-white border-purple-200 hover:border-purple-400 hover:scale-105 active:scale-95`
    }
    if (opt === correct) return `${base} bg-green-100 border-green-500 text-green-700`
    if (opt === chosen && opt !== correct) return `${base} bg-red-100 border-red-400 text-red-600`
    return `${base} bg-white border-gray-200 opacity-40`
  }

  const showImage = imageFile && !imgError

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Obrazek lub emoji */}
      <div className="w-36 h-36 rounded-3xl bg-yellow-50 border-4 border-yellow-200 flex items-center justify-center shadow-md overflow-hidden">
        {showImage ? (
          <img
            src={`/images/letters/${imageFile}`}
            alt={word}
            className="w-full h-full object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-7xl">{emoji}</span>
        )}
      </div>

      <p className="text-lg font-bold text-gray-700 text-center px-2">
        Na jaką literę zaczyna się{' '}
        {isAnswered ? (
          <span className="text-purple-600 text-2xl font-black">{word}</span>
        ) : (
          <span className="text-purple-400 text-2xl font-black">...</span>
        )}
        ?
      </p>

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
