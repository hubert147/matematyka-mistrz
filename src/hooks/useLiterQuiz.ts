import { useState, useEffect } from 'react'
import type { LiterLevel, LiterQuestion, LiterAnswer, TaskType } from '../types/liter'
import { generateSchedule, buildQuestion, resetQuestionState } from '../data/literData'
import { cleanForTTS } from '../lib/ttsClean'

// Reuse the voice loading logic from useQuiz or extract it? 
// For now, I'll localise it or use a shared one if I had one. 
// Actually, I'll use a simple version here.

function getPolishFemaleVoice(): Promise<SpeechSynthesisVoice | null> {
  return new Promise(resolve => {
    const tryFind = () => {
      const voices = window.speechSynthesis.getVoices()
      const plVoices = voices.filter(v => v.lang.includes('pl') || v.lang.includes('PL'))
      const female = plVoices.find(v =>
        v.name.includes('Zosia') || v.name.includes('Paulina') ||
        v.name.includes('Ewa') || v.name.includes('Maja') ||
        v.name.includes('Google') || v.name.toLowerCase().includes('female')
      )
      resolve(female || plVoices[0] || null)
    }
    if (window.speechSynthesis.getVoices().length > 0) tryFind()
    else window.speechSynthesis.onvoiceschanged = tryFind
  })
}

function speakText(text: string) {
  const cleaned = cleanForTTS(text)
  if (!cleaned) return
  getPolishFemaleVoice().then(voice => {
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(cleaned)
    utt.lang = 'pl-PL'
    utt.rate = 0.95
    utt.pitch = 1.3
    if (voice) utt.voice = voice
    window.speechSynthesis.speak(utt)
  })
}

export function useLiterQuiz(level: LiterLevel, onComplete: (answers: LiterAnswer[]) => void) {
  const [schedule] = useState<TaskType[]>(() => generateSchedule(level))
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
