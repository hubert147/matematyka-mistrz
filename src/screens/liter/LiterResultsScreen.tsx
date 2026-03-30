import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { LiterSession } from '../../types/liter'

interface Props {
  session: LiterSession
  onRestart: () => void
}

export function LiterResultsScreen({ session, onRestart }: Props) {
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    if (session.score >= 7) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#F97316', '#22C55E']
      })
    }
    
    const timer = setTimeout(() => setShowReview(true), 1000)
    return () => clearTimeout(timer)
  }, [session.score])

  const getRank = () => {
    if (session.score === 10) return { title: 'Mistrz Liter!', emoji: '👑', color: 'text-yellow-500' }
    if (session.score >= 8) return { title: 'Prawie Ekspert!', emoji: '🌟', color: 'text-purple-500' }
    if (session.score >= 5) return { title: 'Dobra Robota!', emoji: '👍', color: 'text-blue-500' }
    return { title: 'Ćwicz Dalej!', emoji: '📚', color: 'text-orange-500' }
  }

  const rank = getRank()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-12 text-center">
      <div className="text-8xl mb-4 animate-bounce">{rank.emoji}</div>
      <h1 className={`text-5xl font-black mb-2 ${rank.color}`}>{rank.title}</h1>
      <p className="text-gray-500 font-bold text-xl mb-8">Ukończono poziom: {session.level === 'easy' ? 'Łatwy' : session.level === 'medium' ? 'Średni' : 'Trudny'}</p>

      <div className="bg-gray-50 rounded-[3rem] p-10 mb-8 border-4 border-gray-100 shadow-inner w-full max-w-sm">
        <div className="text-gray-400 font-black text-sm uppercase tracking-widest mb-2">Twój Wynik</div>
        <div className="text-8xl font-black text-gray-800">
          {session.score}<span className="text-4xl text-gray-300">/10</span>
        </div>
      </div>

      <div className={`w-full max-w-lg bg-purple-50 p-6 rounded-[2rem] border-2 border-purple-200 mb-8 transform transition-all duration-700 ${showReview ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <h3 className="text-purple-600 font-black text-lg mb-3 flex items-center justify-center gap-2">
          <span>🦉</span> Pani Sowa o Tobie:
        </h3>
        <p className="text-gray-700 italic leading-relaxed text-lg">
          {session.review || 'Wspaniale Ci poszło! Każdy dzień z literkami to nowa przygoda. Jesteś niesamowitym uczniem! Uhu!'}
        </p>
      </div>

      <button
        onClick={onRestart}
        className="bg-orange-500 text-white font-black text-2xl px-12 py-5 rounded-3xl shadow-xl hover:bg-orange-600 hover:scale-110 active:scale-95 transition-all"
      >
        Dalej do menu 🚀
      </button>
    </div>
  )
}
