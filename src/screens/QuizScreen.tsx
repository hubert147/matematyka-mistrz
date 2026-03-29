import type { Question, Answer } from '../types'
import { useQuiz } from '../hooks/useQuiz'

interface Props {
  questions: Question[]
  formattedTime: string
  isUrgent: boolean
  onComplete: (answers: Answer[]) => void
}

export function QuizScreen({ questions, formattedTime, isUrgent, onComplete }: Props) {
  const { currentIndex, currentQuestion, isAnswered, selectedAnswer, submitAnswer } = useQuiz(questions, onComplete)

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

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center pt-8 px-4 relative">
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
        
        <h2 className="text-3xl font-black text-gray-800 leading-snug mb-8 min-h-[4rem] flex items-center justify-center">
          {currentQuestion.q}
        </h2>

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
