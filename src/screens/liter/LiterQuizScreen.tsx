import type { LiterLevel, LiterAnswer } from '../../types/liter'
import { useLiterQuiz } from '../../hooks/useLiterQuiz'
import { ListenTask } from '../../components/tasks/ListenTask'
import { ImageTask } from '../../components/tasks/ImageTask'
import { SyllableTask } from '../../components/tasks/SyllableTask'
import { DrawTask } from '../../components/tasks/DrawTask'

interface Props {
  level: LiterLevel
  onComplete: (answers: LiterAnswer[]) => void
  onBack: () => void
}

export function LiterQuizScreen({ level, onComplete, onBack }: Props) {
  const { 
    currentIndex, 
    currentQuestion, 
    isAnswered, 
    currentAnswer, 
    submitAnswer, 
    replayQuestion,
    score,
    total
  } = useLiterQuiz(level, onComplete)

  if (!currentQuestion) return null

  const progress = (currentIndex / total) * 100

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col items-center pt-8 px-4 relative overflow-hidden">
      {/* Pasek postępu */}
      <div className="w-full max-w-lg sticky top-0 bg-white/80 backdrop-blur-md z-10 p-4 rounded-3xl shadow-sm mb-6 flex flex-col gap-2">
        <div className="flex justify-between items-center w-full">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 font-bold flex items-center gap-1">
            ← Wyjdź
          </button>
          <span className="font-bold text-gray-700 font-black">LiterMistrz {currentIndex + 1}/{total}</span>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-black">
            Wynik: {score}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500 transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Karta zadania */}
      <div className="w-full max-w-lg bg-white p-6 rounded-[2rem] shadow-sm flex flex-col items-center mb-24">
        {currentQuestion.type === 'listen' && (
          <ListenTask 
            question={currentQuestion} 
            onAnswer={(l) => submitAnswer({ chosen: l, correct: l === currentQuestion.correct })}
            isAnswered={isAnswered}
            chosen={currentAnswer?.chosen || null}
            onSpeak={replayQuestion}
          />
        )}

        {currentQuestion.type === 'image' && (
          <ImageTask 
            question={currentQuestion} 
            onAnswer={(l) => submitAnswer({ chosen: l, correct: l === currentQuestion.correct })}
            isAnswered={isAnswered}
            chosen={currentAnswer?.chosen || null}
          />
        )}

        {currentQuestion.type === 'syllable' && (
          <SyllableTask 
            question={currentQuestion}
            onAnswer={(ok) => submitAnswer({ correct: ok })}
            isAnswered={isAnswered}
            isCorrect={currentAnswer?.correct ?? null}
          />
        )}

        {currentQuestion.type === 'draw' && (
          <DrawTask 
            question={currentQuestion}
            onAnswer={(ok) => submitAnswer({ correct: ok })}
            isAnswered={isAnswered}
            isCorrect={currentAnswer?.correct ?? null}
          />
        )}
      </div>

      {/* OWL FEEDBACK (floating) */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 transform transition-transform duration-300 flex justify-center ${
          isAnswered ? 'translate-y-0' : 'translate-y-full'
        }`}>
        <div className="max-w-lg w-full">
          {currentAnswer?.correct ? (
            <div className="bg-green-500 text-white font-black text-xl p-4 rounded-2xl text-center shadow-lg border-2 border-green-600">
              ✅ Brawo! Świetnie!
            </div>
          ) : (
            <div className="bg-red-500 text-white font-black text-xl p-4 rounded-2xl text-center shadow-lg border-2 border-red-600">
              ❌ Spróbuj jeszcze raz w kolejnym zadaniu!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
