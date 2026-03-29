import { useState, useRef } from 'react'
import type { Question, Answer } from '../types'
import { useAudio } from './useAudio'

export function useQuiz(questions: Question[], onComplete: (answers: Answer[]) => void) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const questionStartTime = useRef(Date.now())
  
  const { playGood, playBad } = useAudio()

  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length
  
  const score = answers.filter(a => a.correct).length

  const submitAnswer = (chosen: string) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    setSelectedAnswer(chosen)
    
    const isCorrect = chosen === currentQuestion.correct
    const timeMs = Date.now() - questionStartTime.current
    
    setAnswers(prev => [...prev, {
      question: currentQuestion,
      chosen,
      correct: isCorrect,
      timeMs
    }])

    if (isCorrect) playGood()
    else playBad()

    setTimeout(() => {
      setIsAnswered(false)
      setSelectedAnswer(null)
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        questionStartTime.current = Date.now()
      } else {
        onComplete([...answers, {
          question: currentQuestion,
          chosen,
          correct: isCorrect,
          timeMs
        }])
      }
    }, 1500)

    return { isCorrect }
  }

  return {
    currentIndex,
    currentQuestion,
    answers,
    isAnswered,
    selectedAnswer,
    submitAnswer,
    isComplete,
    score
  }
}
