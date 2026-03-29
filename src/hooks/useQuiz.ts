import { useState, useRef } from 'react'
import type { Question, Answer } from '../types'

export function useQuiz(questions: Question[], onComplete: (answers: Answer[]) => void) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isAnswered, setIsAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const questionStartTime = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const isComplete = currentIndex >= questions.length
  
  const score = answers.filter(a => a.correct).length

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

    const cleanedText = textToRead.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    const speech = new SpeechSynthesisUtterance(cleanedText)
    speech.lang = 'pl-PL'
    speech.rate = 0.95
    speech.pitch = 1.3
    
    const voices = window.speechSynthesis.getVoices()
    const plVoices = voices.filter(v => v.lang.includes('pl') || v.lang.includes('PL'))
    const femaleVoice = plVoices.find(v => 
      v.name.includes('Zosia') || 
      v.name.includes('Paulina') || 
      v.name.includes('Ewa') || 
      v.name.includes('Maja') ||
      v.name.includes('Google') ||
      v.name.toLowerCase().includes('female')
    )
    if (femaleVoice) speech.voice = femaleVoice
    else if (plVoices.length > 0) speech.voice = plVoices[0]

    window.speechSynthesis.cancel()

    let hasGoneNext = false
    let speechTimer: any

    const goToNext = () => {
      if (hasGoneNext) return
      hasGoneNext = true
      clearTimeout(speechTimer)
      
      setIsAnswered(false)
      setSelectedAnswer(null)
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        questionStartTime.current = Date.now()
      } else {
        onComplete([...answers, newAnswer])
      }
    }

    // Jak skonczy gadac, czeka pol sekundy i leci dalej
    speech.onend = () => {
      setTimeout(goToNext, 800)
    }
    
    // Zabezpieczenie jakby TTS nie odpalilo na urzadzeniu, to przechodzi dalej na podstawie dlugosci tekstu
    const estimatedTime = (cleanedText.length * 100) + 1500
    speechTimer = setTimeout(goToNext, estimatedTime)

    window.speechSynthesis.speak(speech)

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
