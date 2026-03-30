import { useState, useEffect } from 'react'
import type { Question, Answer } from '../types'
import { useQuiz } from '../hooks/useQuiz'

interface Props {
  questions: Question[]
  formattedTime: string
  isUrgent: boolean
  onComplete: (answers: Answer[]) => void
}

export function QuizScreen({ questions, formattedTime, isUrgent, onComplete }: Props) {
  const { currentIndex, currentQuestion, isAnswered, selectedAnswer, submitAnswer, replayQuestion } = useQuiz(questions, onComplete)
  const [owlPos, setOwlPos] = useState<'left' | 'right' | 'top' | 'bottom'>('bottom')

  useEffect(() => {
    if (isAnswered) {
      const positions = ['left', 'right', 'top', 'bottom'] as const
      setOwlPos(positions[Math.floor(Math.random() * positions.length)])
    }
  }, [isAnswered, currentIndex])

  if (!currentQuestion) return null

  const getButtonClass = (opt: string) => {
    if (!isAnswered) return 'bg-white border-gray-200 hover:border-orange-300 transform hover:scale-[1.02]'
    
    if (opt === currentQuestion.correct) {
      return 'bg-green-50 border-green-500 text-green-700'
    }
    
    if (opt === selectedAnswer && selectedAnswer !== currentQuestion.correct) {
      return 'bg-red-50 border-red-500 text-red-600'
    }
    
    return 'bg-white border-gray-200 opacity-50'
  }

  const progress = ((currentIndex) / questions.length) * 100

  const getOwlClasses = () => {
    const base = "fixed text-[7rem] md:text-[9rem] z-50 transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] drop-shadow-2xl"
    if (!isAnswered) {
      switch (owlPos) {
        case 'left': return `${base} top-1/3 -left-48 -rotate-90 opacity-0`
        case 'right': return `${base} top-1/3 -right-48 rotate-90 opacity-0`
        case 'top': return `${base} -top-48 left-1/2 -translate-x-1/2 rotate-180 opacity-0`
        case 'bottom': return `${base} -bottom-48 left-1/2 -translate-x-1/2 opacity-0`
      }
    } else {
      switch (owlPos) {
        case 'left': return `${base} top-1/3 left-0 md:left-8 rotate-12 opacity-100`
        case 'right': return `${base} top-1/3 right-0 md:right-8 -rotate-12 opacity-100`
        case 'top': return `${base} top-2 left-1/2 -translate-x-1/2 opacity-100`
        case 'bottom': return `${base} bottom-32 left-1/2 -translate-x-1/2 opacity-100`
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center pt-8 px-4 relative overflow-hidden">
      <div className={getOwlClasses()}>🦉</div>
      <div className="w-full max-w-lg sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 rounded-3xl shadow-sm mb-6 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <span className="font-bold text-gray-700">Pytanie {currentIndex + 1}/10</span>
          <span className={`font-mono font-bold text-lg ${isUrgent ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            ⏱ {formattedTime}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-orange-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="w-full max-w-lg bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
        <div className="bg-purple-100 text-purple-700 rounded-full px-4 py-1 text-sm font-bold mb-4 inline-block">
          {currentQuestion.category}
        </div>
        
        <div className="flex items-center justify-center gap-3 mb-8 min-h-[4rem]">
          <h2 className="text-3xl font-black text-gray-800 leading-snug text-center">
            {currentQuestion.q}
          </h2>
          {!isAnswered && (
            <button
              onClick={replayQuestion}
              title="Odtwórz pytanie"
              className="flex-shrink-0 w-11 h-11 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 text-xl flex items-center justify-center transition-all active:scale-90"
            >
              🔊
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          {currentQuestion.opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => submitAnswer(opt)}
              disabled={isAnswered}
              className={`min-h-[4.5rem] text-2xl font-black rounded-2xl border-[3px] transition-all duration-200 ${getButtonClass(opt)}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`fixed bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 flex justify-center ${
          isAnswered ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-lg w-full">
          {selectedAnswer === currentQuestion.correct ? (
            <div className="bg-green-500 text-white font-black text-xl p-4 rounded-2xl text-center shadow-lg border-2 border-green-600">
              ✅ Brawo! Świetna odpowiedź!
            </div>
          ) : (
            <div className="bg-red-500 text-white font-black text-xl p-4 rounded-2xl text-center shadow-lg border-2 border-red-600">
              ❌ Poprawna odpowiedź to {currentQuestion.correct}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
