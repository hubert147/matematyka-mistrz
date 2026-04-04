import { useState, useEffect, useCallback } from 'react'
import type { Level, Question, Answer, QuizSession } from './types'
import type { LiterLevel, LiterAnswer, LiterSession } from './types/liter'
import { StartScreen } from './screens/StartScreen'
import { LoadingScreen } from './screens/LoadingScreen'
import { QuizScreen } from './screens/QuizScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { MainScreen } from './screens/MainScreen'
import { TutorScreen } from './screens/TutorScreen'
import { ChatScreen } from './screens/ChatScreen'
import { LiterStartScreen } from './screens/liter/LiterStartScreen'
import { LiterQuizScreen } from './screens/liter/LiterQuizScreen'
import { LiterResultsScreen } from './screens/liter/LiterResultsScreen'
import { LiterStudySelectScreen } from './screens/liter/LiterStudySelectScreen'
import { LiterMistrzGame } from './games/litermistrz/Game'

import { generateQuestions, generateReview, generateLiterReview } from './lib/claude'
import { getQuestionsFromCache, saveQuestionsToCache } from './lib/questionsCache'
import type { TaskType } from './types/liter'
import { useTimer } from './hooks/useTimer'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [screen, setScreen] = useState<'main' | 'start' | 'loading_q' | 'quiz' | 'loading_r' | 'results' | 'tutor' | 'chat' | 'liter_start' | 'liter_quiz' | 'liter_results' | 'liter_loading_r' | 'liter_study_select' | 'litermistrz_game'>('main')
  const [level, setLevel] = useState<Level>('easy')
  const [literLevel, setLiterLevel] = useState<LiterLevel>('easy')
  const [focusType, setFocusType] = useState<TaskType | undefined>()
  
  const [questions, setQuestions] = useState<Question[]>([])
  const [session, setSession] = useState<QuizSession | null>(null)
  const [literSession, setLiterSession] = useState<LiterSession | null>(null)
  
  const timer = useTimer()
  const history = useHistory()

  const goToMain = useCallback(() => {
    timer.reset()
    setSession(null)
    setLiterSession(null)
    setQuestions([])
    setScreen('main')
  }, [timer])

  useEffect(() => {
    if (screen !== 'main') {
      window.history.pushState({ screen }, '', window.location.href)
    }
  }, [screen])

  useEffect(() => {
    const handlePopState = () => goToMain()
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [goToMain])

  // --- MATEMATYKA ---
  const handleStartMath = async (lvl: Level) => {
    setLevel(lvl)
    const cached = getQuestionsFromCache(lvl)
    if (cached) {
      setQuestions(cached)
      timer.start()
      setScreen('quiz')
      return
    }
    setScreen('loading_q')
    try {
      const pool = await generateQuestions(lvl)
      saveQuestionsToCache(lvl, pool)
      const shuffled = [...pool].sort(() => Math.random() - 0.5)
      setQuestions(shuffled.slice(0, 10))
      timer.start()
      setScreen('quiz')
    } catch (e: any) {
      console.error('Błąd startu matematyki:', e)
      alert('Problem z Sową: ' + (e.message || 'Błąd API'))
      setScreen('start')
    }
  }

  const handleMathComplete = async (answers: Answer[]) => {
    timer.stop()
    setScreen('loading_r')
    const score = answers.filter(a => a.correct).length
    try {
      const reviewText = await generateReview(answers, level, score)
      const newSession: QuizSession = {
        id: Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        level, score, totalTime: timer.seconds, answers, review: reviewText
      }
      setSession(newSession)
      history.save(newSession)
      setScreen('results')
    } catch (e) {
      setScreen('results')
    }
  }

  // --- LITERKI ---
  const handleStartLiter = (lvl: LiterLevel) => {
    setLiterLevel(lvl)
    setFocusType(undefined)
    setScreen('liter_quiz')
  }

  const handleStartStudyLiter = (lvl: LiterLevel, type: TaskType) => {
    setLiterLevel(lvl)
    setFocusType(type)
    setScreen('liter_quiz')
  }

  const handleLiterComplete = async (answers: LiterAnswer[]) => {
    setScreen('liter_loading_r')
    const score = answers.filter(a => a.correct).length
    try {
      const reviewText = await generateLiterReview(answers, literLevel, score)
      const newSession: LiterSession = {
        id: Math.random().toString(36).slice(2),
        date: new Date().toISOString(),
        level: literLevel, score, answers, review: reviewText
      }
      setLiterSession(newSession)
      setScreen('liter_results')
    } catch (e) {
      console.error(e)
      setScreen('liter_results')
    }
  }

  return (
    <div className="font-sans antialiased text-gray-900 bg-[#FFF9F0] min-h-screen">
      {screen === 'main' && (
        <MainScreen
          onSelectMathQuiz={() => setScreen('start')}
          onSelectLiterQuiz={() => setScreen('liter_start')}
          onSelectTutor={() => setScreen('tutor')}
          onSelectChat={() => setScreen('chat')}
          onSelectStudy={() => setScreen('liter_study_select')}
          onSelectLiterMistrz={() => setScreen('litermistrz_game')}
        />
      )}
      
      {screen === 'chat' && <ChatScreen onBack={goToMain} />}
      {screen === 'tutor' && <TutorScreen onBack={goToMain} />}
      
      {/* MATEMATYKA PKG */}
      {screen === 'start' && <StartScreen onStart={handleStartMath} onBack={goToMain} />}
      {screen === 'quiz' && <QuizScreen questions={questions} formattedTime={timer.formatted} isUrgent={timer.isUrgent} onComplete={handleMathComplete} />}
      {screen === 'results' && session && <ResultsScreen session={session} onRestart={goToMain} />}
      
      {/* LITERMISTRZ PHASER GAME */}
      {screen === 'litermistrz_game' && <LiterMistrzGame onBack={goToMain} />}

      {/* LITERKI PKG */}
      {screen === 'liter_start' && <LiterStartScreen onStart={handleStartLiter} onBack={goToMain} />}
      {screen === 'liter_study_select' && <LiterStudySelectScreen onStart={handleStartStudyLiter} onBack={goToMain} />}
      {screen === 'liter_quiz' && <LiterQuizScreen level={literLevel} focusType={focusType} onComplete={handleLiterComplete} onBack={goToMain} />}
      {screen === 'liter_results' && literSession && <LiterResultsScreen session={literSession} onRestart={goToMain} />}

      {/* LOADING STATES */}
      {screen === 'loading_q' && <LoadingScreen message="Pani Sowa przygotowuje pytania..." />}
      {screen === 'loading_r' && <LoadingScreen message="Pani Sowa analizuje Twoje wyniki..." />}
      {screen === 'liter_loading_r' && <LoadingScreen message="Pani Sowa sprawdza Twoje literki..." />}
    </div>
  )
}
