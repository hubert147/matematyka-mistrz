import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import type { QuizSession } from '../types'
import { useHistory } from '../hooks/useHistory'

interface Props {
  session: QuizSession
  onRestart: () => void
}

function launchFireworks() {
  const duration = 4000
  const end = Date.now() + duration
  const colors = ['#ff0000', '#ffd700', '#00ff00', '#00bfff', '#ff69b4', '#ff6600']

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    })
    confetti({
      particleCount: 8,
      angle: 90,
      spread: 80,
      origin: { x: 0.5, y: 0.3 },
      colors,
      startVelocity: 45,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

export function ResultsScreen({ session, onRestart }: Props) {
  const { load } = useHistory()
  const [history, setHistory] = useState<QuizSession[]>([])
  const isPerfect = session.score === 10

  useEffect(() => {
    if (isPerfect) {
      launchFireworks()
    } else if (session.score >= 7) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
    }
    setHistory(load())
  }, [session.score])

  const [displayScore, setDisplayScore] = useState(0)
  
  useEffect(() => {
    const end = session.score
    if (end === 0) return
    let start = 0
    const d = 1000 / end
    const iv = setInterval(() => {
      start++
      setDisplayScore(start)
      if (start >= end) clearInterval(iv)
    }, d)
    return () => clearInterval(iv)
  }, [session.score])

  const stars = session.score >= 9 ? 5 : session.score >= 7 ? 4 : session.score >= 5 ? 3 : session.score >= 3 ? 2 : 1
  const color = session.score >= 8 ? 'text-green-500' : session.score >= 5 ? 'text-orange-500' : 'text-red-500'

  return (
    <div className="max-w-lg mx-auto px-4 py-8 min-h-screen relative bg-[#FFF9F0]">
      {isPerfect && (
        <div className="text-center bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-8 rounded-3xl shadow-xl mb-6 mt-8 animate-bounce-slow border-4 border-yellow-300">
          <div className="text-6xl mb-3">🎆🎇🎆</div>
          <div className="text-white font-black text-3xl drop-shadow-lg leading-tight">
            WYGRAŁAŚ
          </div>
          <div className="text-white font-black text-5xl drop-shadow-lg my-2 tracking-tight">
            MILION DOLARÓW!
          </div>
          <div className="text-yellow-100 font-black text-6xl drop-shadow-lg tracking-widest">
            $1,000,000
          </div>
          <div className="text-5xl mt-3">💰🏆💰</div>
        </div>
      )}

      <div className="text-center bg-white p-8 rounded-3xl shadow-sm mb-6 mt-8">
        <div className="text-6xl text-yellow-400 mb-4 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < stars ? 'opacity-100 drop-shadow-md pb-4' : 'opacity-20 grayscale pb-4'}>★</span>
          ))}
        </div>
        
        <div className={`text-8xl font-black ${color} mb-6 tracking-tighter drop-shadow-sm`}>
          {displayScore} <span className="text-4xl text-gray-300">/ 10</span>
        </div>
        
        <div className="flex gap-6 justify-center mt-4 text-gray-600 font-bold bg-gray-50 p-4 rounded-full border border-gray-100">
          <div className="flex items-center gap-2">⏱ {Math.floor(session.totalTime / 60)}:{(session.totalTime % 60).toString().padStart(2, '0')}</div>
          <div className="flex items-center gap-2">✅ {session.score}/10 poprawnych</div>
        </div>
      </div>

      {session.review && (
        <div className="mt-6 bg-amber-50 rounded-2xl p-6 border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <h3 className="font-black flex items-center gap-2 text-amber-800 text-lg mb-3">
            <span className="text-2xl">🦉</span> Co mówi Pani Sowa:
          </h3>
          <p className="text-sm leading-relaxed text-amber-900 whitespace-pre-wrap font-medium relative z-10">
            {session.review.replace(/\\n/g, '\\n')}
          </p>
        </div>
      )}

      <button
        onClick={onRestart}
        className="w-full bg-orange-500 text-white font-black text-xl py-5 rounded-2xl hover:bg-orange-600 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition mt-8"
      >
        🔄 Zagraj ponownie
      </button>

      {history.length > 1 && (
        <div className="mt-12 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h4 className="font-bold text-gray-600 text-center mb-6">📊 Ostatnie wyniki</h4>
          <div className="flex flex-col gap-3">
            {history.slice(0, 5).map(h => (
              <div key={h.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">{new Date(h.date).toLocaleDateString()}</span>
                  <span className="text-sm font-bold text-gray-700 capitalize">{h.level}</span>
                </div>
                <div className="text-lg font-black text-gray-800 bg-white px-3 py-1 rounded-lg border border-gray-200">
                  {h.score}/10
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
