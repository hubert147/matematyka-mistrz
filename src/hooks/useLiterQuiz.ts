import { useState, useEffect } from 'react'
import type { LiterLevel, LiterQuestion, LiterAnswer, TaskType } from '../types/liter'
import { generateSchedule, buildQuestion, resetQuestionState } from '../data/literData'
import { speak } from '../lib/azureTTS'
import { cleanForTTS } from '../lib/ttsClean'

function speakText(text: string) {
  const cleaned = cleanForTTS(text)
  if (cleaned) speak(cleaned)
}

export function useLiterQuiz(level: LiterLevel, onComplete: (answers: LiterAnswer[]) => void, focusType?: TaskType) {
  const [schedule] = useState<TaskType[]>(() => generateSchedule(level, focusType))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<LiterAnswer[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [currentAnswer, setCurrentAnswer] = useState<{ chosen?: string; correct: boolean } | null>(null)
  
  const [questions] = useState<LiterQuestion[]>(() => {
    resetQuestionState()
    return schedule.map((type, i) => buildQuestion(type, level, i))
  })

  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length
  const score = answers.filter(a => a.correct).length

  // Auto-read question prompt if applicable
  useEffect(() => {
    if (isComplete || !currentQuestion) return
    
    // For drawing, we read the instruction
    if (currentQuestion.type === 'draw') {
      const timer = setTimeout(() => speakText(currentQuestion.pronunciation || ''), 500)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, isComplete])

  const replayQuestion = () => {
    if (!currentQuestion) return
    if (currentQuestion.type === 'listen' || currentQuestion.type === 'draw') {
      speakText(currentQuestion.pronunciation || '')
    } else if (currentQuestion.type === 'image') {
      speakText(`Na jaką literę zaczyna się ${currentQuestion.word}?`)
    }
  }

  const submitAnswer = (ans: { chosen?: string; correct: boolean }) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    setCurrentAnswer(ans)
    
    const newAnswer: LiterAnswer = {
      question: currentQuestion,
      correct: ans.correct,
      chosen: ans.chosen
    }
    
    const nextAnswers = [...answers, newAnswer]
    setAnswers(nextAnswers)

    // Feedback audio
    const feedback = ans.correct 
      ? ["Świetnie!", "Doskonale!", "Brawo!", "Super!"][Math.floor(Math.random() * 4)]
      : "Spróbuj jeszcze raz w kolejnym zadaniu!"
    
    speakText(feedback)

    // Wait and go next
    setTimeout(() => {
      setIsAnswered(false)
      setCurrentAnswer(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
      } else {
        onComplete(nextAnswers)
      }
    }, 2500)
  }

  return {
    currentIndex,
    currentQuestion,
    isAnswered,
    currentAnswer,
    submitAnswer,
    replayQuestion,
    score,
    total: questions.length
  }
}
