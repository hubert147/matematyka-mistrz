import { useState, useEffect, useCallback } from 'react'
import type { Level, Question, Answer, QuizSession } from './types'
import { StartScreen } from './screens/StartScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { MainScreen } from './screens/MainScreen'
import { TutorScreen } from './screens/TutorScreen'
import { ChatScreen } from './screens/ChatScreen'
import { generateQuestions, generateReview } from './lib/claude'
import { getQuestionsFromCache, saveQuestionsToCache } from './lib/questionsCache'
import { useTimer } from './hooks/useTimer'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [screen, setScreen] = useState<'main' | 'start' | 'loading_q' | 'quiz' | 'loading_r' | 'results' | 'tutor' | 'chat'>('main')
  const [level, setLevel] = useState<Level>('easy')
  const [questions, setQuestions] = useState<Question[]>([])
  const [session, setSession] = useState<QuizSession | null>(null)
  const timer = useTimer()
  const history = useHistory()

  // --- Android Back Button Support ---
  // Gdy przechodzimy na nowy ekran (nie 'main'), wpychamy dummy state do historii przegladarki.
  // Klikniecie wstecz na Androidzie odpala popstate — lapiem to i wracamy do menu.
  const goToMain = useCallback(() => {
    timer.reset()
    setSession(null)
    setQuestions([])
    setScreen('main')
  }, [timer])

  useEffect(() => {
    if (screen !== 'main') {
      window.history.pushState({ screen }, '', window.location.href)
    }
  }, [screen])

  useEffect(() => {
    const handlePopState = () => {
      // Zawsze wracamy do menu glownego gdy uzytkownik wcisnie wstecz
      goToMain()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [goToMain])

  const handleStart = async (lvl: Level) => {
    setLevel(lvl)

    // 1. Spróbuj z cache
    const cached = getQuestionsFromCache(lvl)
    if (cached) {
      setQuestions(cached)
      timer.start()
      setScreen('quiz')
      return
    }

    // 2. Cache miss — generuj pulę i zapisz
    setScreen('loading_q')
    try {
      const pool = await generateQuestions(lvl)   // generuje QUESTIONS_POOL_SIZE
      saveQuestionsToCache(lvl, pool)              // zapisz całą pulę
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      setQuestions(shuffled.slice(0, 10))          // na quiz bierz 10
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
    goToMain()
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-[#FFF9F0] min-h-screen">
      {screen === 'main' && <MainScreen onSelectQuiz={() => setScreen('start')} onSelectTutor={() => setScreen('tutor')} onSelectChat={() => setScreen('chat')} />}
      {screen === 'chat' && <ChatScreen onBack={() => setScreen('main')} />}
      {screen === 'tutor' && <TutorScreen onBack={() => setScreen('main')} />}
      {screen === 'start' && <StartScreen onStart={handleStart} onBack={() => setScreen('main')} />}
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
