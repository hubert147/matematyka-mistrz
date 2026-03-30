import { useState, useRef, useEffect } from 'react'
import type { Question, Answer } from '../types'
import { cleanForTTS } from '../lib/ttsClean'

import { speak } from '../lib/azureTTS'

async function speakText(text: string) {
  const cleaned = cleanForTTS(text)
  if (cleaned) await speak(cleaned)
}

export function useQuiz(initialQuestions: Question[], onComplete: (answers: Answer[]) => void) {
  const [questions] = useState<Question[]>(() => {
    return initialQuestions.map(q => ({
      ...q,
      opts: [...q.opts].sort(() => Math.random() - 0.5)
    }))
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const questionStartTime = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length
  
  const score = answers.filter(a => a.correct).length

  // Czytaj pytanie na glos gdy sie pojawia
  useEffect(() => {
    if (isComplete || !currentQuestion) return
    // Krotkie opoznienie zeby przegladarka zdazyla odrenderowac pytanie
    const timer = setTimeout(() => {
      speakText(currentQuestion.q)
    }, 300)
    return () => clearTimeout(timer)
  }, [currentIndex, isComplete])

  const submitAnswer = (chosen: string) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    setSelectedAnswer(chosen)
    
    const isCorrect = chosen === currentQuestion.correct
    const timeMs = Date.now() - questionStartTime.current
    
    const newAnswer: Answer = {
      question: currentQuestion,
      chosen,
      correct: isCorrect,
      timeMs
    }
    
    setAnswers(prev => [...prev, newAnswer])

    // Sowa mowi, co sie stalo:
    const textToRead = isCorrect 
      ? ["Świetnie!", "Znakomicie!", "Oto chodziło!", "Rewelacja!", "Brawo!"][Math.floor(Math.random() * 5)] 
      : currentQuestion.explanation

    const cleanedText = cleanForTTS(textToRead)
    if (cleanedText) {
      speak(cleanedText).then(() => {
        setTimeout(goToNext, 600)
      })
    } else {
      goToNext()
    }

    function goToNext() {
      setIsAnswered(false)
      setSelectedAnswer(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        questionStartTime.current = Date.now()
      } else {
        onComplete([...answers, newAnswer])
      }
    }

    return { isCorrect }
  }

  const replayQuestion = () => {
    if (currentQuestion) speakText(currentQuestion.q)
  }

  return {
    currentIndex,
    currentQuestion,
    answers,
    isAnswered,
    selectedAnswer,
    submitAnswer,
    replayQuestion,
    isComplete,
    score
  }
}
