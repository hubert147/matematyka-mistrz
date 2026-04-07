import { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Props {
  onFinish: () => void
}

interface NoteState {
  id: number
  x: number
  y: number
  floating: boolean
}

type Phase = 'intro' | 'interactive' | 'celebration'

// ─── Constants ────────────────────────────────────────────────────────────────

const BG_GRADIENTS = [
  'linear-gradient(135deg, #ff6b9d, #c44dff)',
  'linear-gradient(135deg, #ffd93d, #ff6b9d)',
  'linear-gradient(135deg, #6bceff, #c44dff)',
  'linear-gradient(135deg, #6bff8e, #ffd93d)',
]

const BALLOONS = [
  { left: 5,  delay: 0.0, dur: 6 },
  { left: 13, delay: 0.8, dur: 7 },
  { left: 22, delay: 1.6, dur: 5 },
  { left: 33, delay: 0.4, dur: 8 },
  { left: 46, delay: 2.0, dur: 6 },
  { left: 58, delay: 1.2, dur: 7 },
  { left: 70, delay: 0.6, dur: 5 },
  { left: 84, delay: 1.8, dur: 6 },
]

const STARS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  top:   `${8  + (i * 73) % 80}%`,
  left:  `${5  + (i * 47) % 88}%`,
  delay: `${((i * 0.27) % 1.5).toFixed(2)}s`,
  size:  i % 3 === 0 ? 'text-3xl' : i % 3 === 1 ? 'text-xl' : 'text-2xl',
}))

const MAJA_LETTERS = ['M', 'A', 'J', 'A', '!']
const LETTER_COLORS = ['#FFD700', '#FF6B9D', '#C44DFF', '#6BCEFF', '#6BFF8E']

// ─── Fireworks (same pattern as ResultsScreen) ────────────────────────────────

function launchFireworks() {
  const end = Date.now() + 4000
  const colors = ['#FFD700', '#ff6b9d', '#c44dff', '#6bceff', '#6bff8e', '#ffd93d']
  const frame = () => {
    confetti({ particleCount: 6,  angle: 60,  spread: 55, origin: { x: 0         }, colors })
    confetti({ particleCount: 6,  angle: 120, spread: 55, origin: { x: 1         }, colors })
    confetti({ particleCount: 8,  angle: 90,  spread: 80, origin: { x: 0.5, y: 0.3 }, colors, startVelocity: 45 })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

// ─── PoundNote sub-component ──────────────────────────────────────────────────

function PoundNote({ note, onRemove }: { note: NoteState; onRemove: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(note.id), 850)
    return () => clearTimeout(t)
  }, [note.id, onRemove])

  return (
    <div
      className={`fixed z-50 pointer-events-none select-none ${note.floating ? 'animate-float-up' : 'animate-pop-in'}`}
      style={{ left: note.x - 40, top: note.y - 25, width: 80, height: 50 }}
    >
      <div
        className="w-full h-full rounded-xl shadow-xl flex flex-col items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1b5e20, #4caf50, #2d6a2d)' }}
      >
        <span className="text-white font-black text-lg leading-none">£1</span>
        <span className="text-base leading-none">💷</span>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function BirthdayScreen({ onFinish }: Props) {
  const [phase, setPhase]           = useState<Phase>('intro')
  const [exiting, setExiting]       = useState(false)
  const [entering, setEntering]     = useState(false)
  const [total, setTotal]           = useState(0)
  const [displayTotal, setDisplay]  = useState(0)
  const [notes, setNotes]           = useState<NoteState[]>([])
  const [bgIndex, setBgIndex]       = useState(0)
  const [showButton, setShowButton] = useState(false)
  const [lettersShown, setLetters]  = useState(0)
  const noteIdRef = useRef(0)

  // Background color cycle
  useEffect(() => {
    const iv = setInterval(() => setBgIndex(i => (i + 1) % BG_GRADIENTS.length), 1000)
    return () => clearInterval(iv)
  }, [])

  // Letter-by-letter reveal during intro
  useEffect(() => {
    if (phase !== 'intro') return
    const timers = [150, 450, 750, 1050, 1250].map((delay, i) =>
      setTimeout(() => setLetters(i + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Animate counter
  useEffect(() => {
    if (total === 0) return
    const start = displayTotal
    const target = total
    const steps = 10
    let step = 0
    const iv = setInterval(() => {
      step++
      setDisplay(Math.round(start + ((target - start) / steps) * step))
      if (step >= steps) clearInterval(iv)
    }, 20)
    return () => clearInterval(iv)
  }, [total]) // eslint-disable-line react-hooks/exhaustive-deps

  // Phase 3: fireworks + show button after 3s
  useEffect(() => {
    if (phase !== 'celebration') return
    launchFireworks()
    const t = setTimeout(() => setShowButton(true), 3000)
    return () => clearTimeout(t)
  }, [phase])

  const removeNote = useCallback((id: number) => {
    setNotes(prev => prev.filter(n => n.id !== id))
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.clientX
    const y = e.clientY

    // Intro → transition → interactive on click
    if (phase === 'intro' && !exiting) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: ['#FFD700', '#FF6B9D', '#C44DFF', '#6BFF8E', '#6BCEFF'],
        startVelocity: 35,
      })
      setExiting(true)
      setTimeout(() => {
        setPhase('interactive')
        setExiting(false)
        setEntering(true)
        setTimeout(() => setEntering(false), 600)
      }, 450)
      return
    }

    if (phase !== 'interactive') return

    const id = ++noteIdRef.current
    setNotes(prev => [...prev, { id, x, y, floating: false }])
    setTimeout(() => {
      setNotes(prev => prev.map(n => n.id === id ? { ...n, floating: true } : n))
    }, 250)

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x: x / window.innerWidth, y: y / window.innerHeight },
      colors: ['#FFD700', '#FFA500', '#FF6B9D', '#C44DFF', '#6BFF8E'],
      startVelocity: 25,
    })

    setTotal(prev => {
      const next = prev + 1
      if (next >= 100) setTimeout(() => setPhase('celebration'), 300)
      return next
    })
  }, [phase])

  return (
    <div
      className="fixed inset-0 z-40 overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: BG_GRADIENTS[bgIndex],
        transition: 'background 0.8s ease',
        touchAction: 'manipulation',
      }}
      onClick={handleClick}
    >

      {/* Stars */}
      {STARS.map(star => (
        <div
          key={star.id}
          className={`absolute pointer-events-none animate-twinkle ${star.size}`}
          style={{ top: star.top, left: star.left, animationDelay: star.delay }}
        >
          ⭐
        </div>
      ))}

      {/* Balloons */}
      {BALLOONS.map((b, i) => (
        <div
          key={i}
          className="absolute bottom-0 pointer-events-none text-5xl animate-balloon-rise"
          style={{
            left: `${b.left}%`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.dur}s`,
          }}
        >
          🎈
        </div>
      ))}

      {/* ══ PHASE 1: INTRO ══ */}
      {(phase === 'intro' || exiting) && (
        <div
          className="flex flex-col items-center gap-4 z-10 pointer-events-none select-none"
          style={{
            transition: 'opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease',
            opacity: exiting ? 0 : 1,
            transform: exiting ? 'scale(1.3)' : 'scale(1)',
            filter: exiting ? 'blur(8px)' : 'none',
          }}
        >
          <div className="text-[8rem] leading-none drop-shadow-2xl animate-pop-in">🎂</div>

          <div className="flex gap-1">
            {MAJA_LETTERS.map((letter, i) => (
              <span
                key={i}
                className="text-7xl font-black drop-shadow-lg"
                style={{
                  color: LETTER_COLORS[i],
                  display: 'inline-block',
                  transform: i < lettersShown ? 'scale(1)' : 'scale(0)',
                  opacity: i < lettersShown ? 1 : 0,
                  transition: 'transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.2s',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                {letter}
              </span>
            ))}
          </div>

          <p className="text-white font-black text-3xl drop-shadow-lg">
            Dziś masz 7 lat! 🎉
          </p>

          {lettersShown >= 5 && (
            <p
              className="text-white/90 font-black text-xl drop-shadow animate-bounce-slow mt-2"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              👆 Dotknij ekran!
            </p>
          )}
        </div>
      )}

      {/* ══ PHASE 2: INTERACTIVE ══ */}
      {phase === 'interactive' && (
        <div
          className="flex flex-col items-center gap-5 z-10 select-none"
          style={{
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            opacity: entering ? 0 : 1,
            transform: entering ? 'scale(0.8) translateY(30px)' : 'scale(1) translateY(0)',
          }}
        >

          {/* Counter */}
          <div
            className="bg-white/25 backdrop-blur-sm rounded-3xl px-8 py-3 shadow-xl pointer-events-none"
          >
            <span className="text-white font-black text-5xl drop-shadow-lg">
              £{displayTotal.toLocaleString('en-GB')}
            </span>
            <span className="text-white/70 font-bold text-2xl ml-2">/ £100</span>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-4 bg-white/30 rounded-full overflow-hidden pointer-events-none">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${(total / 100) * 100}%`,
                background: 'linear-gradient(90deg, #FFD700, #FFA500)',
              }}
            />
          </div>

          {/* Prompt */}
          <p className="text-white font-black text-2xl drop-shadow-md animate-bounce-slow text-center px-6 pointer-events-none">
            Stukaj wszędzie po prezenty! 👇
          </p>

          {/* Tap count hint */}
          <p className="text-white/70 font-bold text-lg pointer-events-none">
            {total === 0 ? '100 kliknięć = £100 🎁' : `${100 - total} kliknięć do nagrody!`}
          </p>
        </div>
      )}

      {/* ══ PHASE 3: CELEBRATION ══ */}
      {phase === 'celebration' && (
        <div className="flex flex-col items-center gap-6 z-10 px-4 text-center select-none">
          <div
            className="rounded-3xl px-8 py-6 shadow-2xl animate-shimmer border-4 border-yellow-300 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6B9D)' }}
          >
            <div className="text-5xl mb-2">🎆🎇🎆</div>
            <div className="text-white font-black text-4xl drop-shadow-lg leading-tight">
              WYGRAŁAŚ
            </div>
            <div className="text-white font-black text-6xl drop-shadow-xl my-1 tracking-tight">
              £100!
            </div>
            <div className="text-yellow-100 font-black text-2xl">
              Twój prezent na zawsze! ❤️
            </div>
            <div className="text-5xl mt-2">🎂🎊🎉</div>
          </div>

          {showButton && (
            <button
              className="mt-2 bg-white text-purple-700 font-black text-xl px-10 py-4 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 animate-pop-in"
              onClick={e => { e.stopPropagation(); onFinish() }}
            >
              Wejdź do swojego świata! →
            </button>
          )}
        </div>
      )}

      {/* Pound notes (all phases) */}
      {notes.map(note => (
        <PoundNote key={note.id} note={note} onRemove={removeNote} />
      ))}
    </div>
  )
}
