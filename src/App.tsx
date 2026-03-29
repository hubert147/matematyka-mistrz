import { useState } from 'react'
import type { Level, Question, Answer, QuizSession } from './types'
import { StartScreen } from './screens/StartScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { generateQuestions, generateReview } from './lib/claude'
import { useTimer } from './hooks/useTimer'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [screen, setScreen] = useState<'start' | 'loading_q' | 'quiz' | 'loading_r' | 'results'>('start')
  const [level, setLevel] = useState<Level>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  const [session, setSession] = useState<QuizSession | null>(null)
  const timer = useTimer()
  const history = useHistory()

  const handleStart = async (lvl: Level) => {
    setLevel(lvl)
    setScreen('loading_q')
    try {
      const q = await generateQuestions(lvl)
      setQuestions(q)
      timer.start()
      setScreen('quiz')
    } catch (e) {
      console.error(e)
      alert('Nie udało się wygenerować pytań. Sprawdź klucz API i spróbuj ponownie.')
      setScreen('start')
    }
  }

  const handleQuizComplete = async (answers: Answer[]) => {
    timer.stop()
    setScreen('loading_r')
    
    const score = answers.filter(a => a.correct).length
    
    try {
      const reviewText = await generateReview(answers, level, score)
      
      const newSession: QuizSession = {
        id: Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        level,
        score,
        totalTime: timer.seconds,
        answers,
        review: reviewText
      }
      
      setSession(newSession)
      history.save(newSession)
      setScreen('results')
    } catch (e) {
      console.error(e)
      const newSession: QuizSession = {
        id: Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        level,
        score,
        totalTime: timer.seconds,
        answers,
        review: 'Dobra robota! Niestety nie udało się załadować omówienia od sowy.'
      }
      setSession(newSession)
      history.save(newSession)
      setScreen('results')
    }
  }

  const handleRestart = () => {
    timer.reset()
    setSession(null)
    setQuestions([])
    setScreen('start')
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-[#FFF9F0] min-h-screen">
      {screen === 'start' && <StartScreen onStart={handleStart} />}
      {screen === 'loading_q' && <LoadingScreen message="Pani Sowa przygotowuje pytania..." />}
      {screen === 'loading_r' && <LoadingScreen message="Pani Sowa analizuje Twoje wyniki..." />}
      {screen === 'quiz' && (
        <QuizScreen
          questions={questions}
          formattedTime={timer.formatted}
          isUrgent={timer.isUrgent}
          onComplete={handleQuizComplete}
        />
      )}
      {screen === 'results' && session && (
        <ResultsScreen session={session} onRestart={handleRestart} />
      )}
    </div>
  )
}
