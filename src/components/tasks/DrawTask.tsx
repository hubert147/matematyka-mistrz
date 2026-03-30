import { useRef, useState, useEffect } from 'react'
import type { LiterQuestion } from '../../types/liter'

interface Props {
  question: LiterQuestion
  onAnswer: (correct: boolean) => void
  isAnswered: boolean
  isCorrect: boolean | null
}

const MIN_POINTS = 50  // minimalna liczba punktów do zaliczenia

export function DrawTask({ question, onAnswer, isAnswered, isCorrect }: Props) {
  const { drawLetter = 'A' } = question
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawingRef = useRef(false)
  const pointsRef = useRef(0)
  const [hasDrawn, setHasDrawn] = useState(false)

  // Wyczyść canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pointsRef.current = 0
    setHasDrawn(false)
  }

  const getPos = (e: MouseEvent | Touch, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const clientX = 'clientX' in e ? e.clientX : (e as Touch).clientX
    const clientY = 'clientY' in e ? e.clientY : (e as Touch).clientY
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    ctx.strokeStyle = '#4A90D9'
    ctx.lineWidth = 8
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      if (isAnswered) return
      isDrawingRef.current = true
      const { x, y } = getPos(e, canvas)
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDrawingRef.current || isAnswered) return
      const { x, y } = getPos(e, canvas)
      ctx.lineTo(x, y)
      ctx.stroke()
      pointsRef.current++
      setHasDrawn(true)
    }
    const onMouseUp = () => { isDrawingRef.current = false }

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      if (isAnswered) return
      e.preventDefault()
      isDrawingRef.current = true
      const { x, y } = getPos(e.touches[0], canvas)
      ctx.beginPath()
      ctx.moveTo(x, y)
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDrawingRef.current || isAnswered) return
      e.preventDefault()
      const { x, y } = getPos(e.touches[0], canvas)
      ctx.lineTo(x, y)
      ctx.stroke()
      pointsRef.current++
      setHasDrawn(true)
    }
    const onTouchEnd = () => { isDrawingRef.current = false }

    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('touchstart', onTouchStart, { passive: false })
    canvas.addEventListener('touchmove', onTouchMove, { passive: false })
    canvas.addEventListener('touchend', onTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchend', onTouchEnd)
    }
  }, [isAnswered])

  const handleCheck = () => {
    const ok = pointsRef.current >= MIN_POINTS
    onAnswer(ok)
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-xl font-bold text-gray-700 text-center">
        Narysuj literę po śladzie!
      </p>

      {/* Canvas z wzorem w tle */}
      <div className="relative w-72 h-72 rounded-3xl overflow-hidden border-4 border-blue-300 bg-white shadow-lg">
        {/* Wzór litery w tle */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontSize: '200px',
            color: '#000',
            opacity: 0.08,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {drawLetter}
        </div>
        {/* Canvas do rysowania */}
        <canvas
          ref={canvasRef}
          width={288}
          height={288}
          className="absolute inset-0 w-full h-full touch-none"
          style={{ cursor: isAnswered ? 'default' : 'crosshair' }}
        />
        {/* Feedback overlay */}
        {isAnswered && (
          <div className={`absolute inset-0 flex items-center justify-center text-6xl ${
            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {isCorrect ? '✅' : '😊'}
          </div>
        )}
      </div>

      {/* Wynik */}
      {isAnswered ? (
        <div className={`w-full py-3 rounded-2xl text-center font-black text-white text-xl ${
          isCorrect ? 'bg-green-500' : 'bg-orange-400'
        }`}>
          {isCorrect ? '🎉 Świetny kształt!' : '😊 Spróbuj następnym razem!'}
        </div>
      ) : (
        <div className="flex gap-3 w-full">
          <button
            onClick={clearCanvas}
            className="flex-1 py-3 rounded-2xl bg-gray-100 border-2 border-gray-300 text-gray-600 font-bold hover:bg-gray-200"
          >
            🗑️ Wyczyść
          </button>
          <button
            onClick={handleCheck}
            disabled={!hasDrawn}
            className={`flex-1 py-3 rounded-2xl font-black text-white transition-all ${
              hasDrawn
                ? 'bg-blue-500 border-2 border-blue-600 hover:bg-blue-600 hover:scale-105'
                : 'bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed'
            }`}
          >
            ✅ Sprawdź!
          </button>
        </div>
      )}
    </div>
  )
}
