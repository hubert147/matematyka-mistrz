import { useState, useRef, useEffect } from 'react'
import type { Question, Answer } from '../types'
import { cleanForTTS } from '../lib/ttsClean'

// Pomocnicza funkcja do zaladowania glosow (Chrome laduje je asynchronicznie)
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
    if (window.speechSynthesis.getVoices().length > 0) {
      tryFind()
    } else {
      window.speechSynthesis.onvoiceschanged = tryFind
    }
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

    getPolishFemaleVoice().then(voice => {
      const speech = new SpeechSynthesisUtterance(cleanedText)
      speech.lang = 'pl-PL'
      speech.rate = 0.95
      speech.pitch = 1.3
      if (voice) speech.voice = voice

      window.speechSynthesis.cancel()

      let hasGoneNext = false
      let speechTimer: any

      const goToNext = () => {
        if (hasGoneNext) return
        hasGoneNext = true
        clearTimeout(speechTimer)

        // Zerujemy stan odpowiedzi PRZED zmiana pytania, by uniknac przeblysku
        setIsAnswered(false)
        setSelectedAnswer(null)

        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1)
          questionStartTime.current = Date.now()
        } else {
          onComplete([...answers, newAnswer])
        }
      }

      speech.onend = () => setTimeout(goToNext, 600)
      const estimatedTime = (cleanedText.length * 90) + 1500
      speechTimer = setTimeout(goToNext, estimatedTime)

      window.speechSynthesis.speak(speech)
    })

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
