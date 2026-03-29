import { useState, useRef } from 'react'
import { analyzeTutorImage } from '../lib/claude'
import { LoadingScreen } from './LoadingScreen'
import { QuizScreen } from './QuizScreen'
import type { Question, Answer } from '../types'

interface Props {
  onBack: () => void
}

export function TutorScreen({ onBack }: Props) {
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'explanation' | 'quiz' | 'results'>('idle')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState<number>(0)
  
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      setImagePreview(base64)
      setStatus('analyzing')
      
      try {
        const { explanation, questions } = await analyzeTutorImage(base64)
        setExplanation(explanation)
        setQuestions(questions)
        setStatus('explanation')
      } catch (err) {
        console.error(err)
        alert('Przepraszam, Pani Sowa miała problem z odczytaniem zdjęcia. Spróbuj zrobić wyraźniejsze zdjęcie jeszcze raz!')
        setStatus('idle')
        setImagePreview(null)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleStartQuiz = () => {
    setStatus('quiz')
  }

  const handleQuizComplete = (answers: Answer[]) => {
    const s = answers.filter(a => a.correct).length
    setScore(s)
    setStatus('results')
  }

  if (status === 'analyzing') {
    return <LoadingScreen message="Pani Sowa analizuje Twoje zdjęcie..." />
  }

  if (status === 'quiz') {
    return (
      <QuizScreen
        questions={questions}
        formattedTime="--:--"
        isUrgent={false}
        onComplete={handleQuizComplete}
      />
    )
  }

  if (status === 'results') {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
        <h1 className="text-5xl font-black text-purple-600 mb-6 text-center">Lekcja zakończona!</h1>
        <div className="bg-white w-full p-8 rounded-3xl shadow-sm text-center mb-8 border-4 border-purple-100">
          <div className="text-8xl mb-4">🎓</div>
          <p className="text-2xl font-bold text-gray-700 mb-2">Twój wynik:</p>
          <p className="text-4xl text-purple-600 font-black">{score}/{questions.length}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-purple-500 hover:bg-purple-600 text-white w-full py-4 rounded-2xl font-black text-xl transition-colors shadow-sm"
        >
          Wróć do Menu Głównego
        </button>
      </div>
    )
  }

  if (status === 'explanation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border-4 border-purple-100 mb-8 relative">
          <div className="absolute -top-12 -left-6 text-7xl md:text-9xl transform -rotate-12 drop-shadow-xl">🦉</div>
          <h2 className="text-3xl font-black text-purple-600 ml-16 md:ml-24 mb-6">Pani Sowa tłumaczy:</h2>
          
          {imagePreview && (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-sm border-2 border-purple-50">
              <img src={imagePreview} alt="Zadanie" className="w-full h-auto max-h-64 object-contain" />
            </div>
          )}

          <div className="prose prose-purple prose-lg max-w-none text-gray-700 font-medium leading-relaxed mb-8">
            {explanation.split('\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                const speech = new SpeechSynthesisUtterance(explanation)
                speech.lang = 'pl-PL'
                
                // Ciepły, młodszy, "sowi" ptasi wydźwięk - trochę wyżej, odrobinkę wolniej
                speech.rate = 0.95
                speech.pitch = 1.3
                
                // Szukamy kobiecych głosów ('Zosia' na iPhone, 'Paulina' na Windows, 'Google' na Android)
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
                
                if (femaleVoice) {
                  speech.voice = femaleVoice
                } else if (plVoices.length > 0) {
                  speech.voice = plVoices[0]
                }

                window.speechSynthesis.cancel() // wylacza poprzednie nakladajace sie glosy
                window.speechSynthesis.speak(speech)
              }}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 py-4 rounded-2xl font-black text-xl transition-colors flex items-center justify-center gap-3 w-full"
            >
              <span>🔊</span> Przeczytaj mi to na głos
            </button>
            <button
              onClick={handleStartQuiz}
              className="bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-2xl font-black text-xl transition-colors shadow-sm w-full"
            >
              Sprawdźmy moją wiedzę! 📝
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 min-h-screen flex flex-col items-center py-12">
      <div className="w-full flex items-center justify-between mb-12">
        <button onClick={onBack} className="text-4xl hover:scale-110 transition-transform">⬅️</button>
        <span className="text-5xl font-black text-purple-500">Pani Sowa</span>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 w-full rounded-[2rem] shadow-sm border-4 border-purple-100 flex flex-col items-center text-center">
        <div className="text-[6rem] mb-6">📸</div>
        <h2 className="text-3xl font-black text-gray-800 mb-4 leading-tight">Masz problem z zadaniem?</h2>
        <p className="text-gray-500 font-medium text-lg mb-8">
          Zrób zdjęcie strony w książce lub zeszycie. Pani Sowa przyjrzy się temu, 
          wytłumaczy Ci materiał prosto i cieplutko, a na koniec da parę pytań testowych!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full mt-4">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={cameraInputRef}
            onChange={handleImageUpload}
            className="hidden" 
          />
          <input 
            type="file" 
            accept="image/*" 
            ref={galleryInputRef}
            onChange={handleImageUpload}
            className="hidden" 
          />
          
          <button 
            onClick={() => cameraInputRef.current?.click()}
            className="bg-purple-500 hover:bg-purple-600 text-white flex-1 py-5 rounded-2xl font-black text-xl transition-all shadow-md transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>📷</span> Zrób zdjęcie
          </button>
          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="bg-indigo-500 hover:bg-indigo-600 text-white flex-1 py-5 rounded-2xl font-black text-xl transition-all shadow-md transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>📂</span> Dodaj z dysku
          </button>
        </div>
      </div>
    </div>
  )
}
