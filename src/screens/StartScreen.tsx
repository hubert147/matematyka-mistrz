import { useState } from 'react'
import type { Level } from '../types'
import { LEVEL_CONFIG } from '../constants'

interface Props {
  onStart: (level: Level) => void
}

export function StartScreen({ onStart }: Props) {
  const [level, setLevel] = useState<Level>('easy')
  const handleStart = () => {
    onStart(level)
  }

  return (
    <div className="max-w-lg mx-auto px-4 min-h-screen flex flex-col items-center justify-center relative">
      <div className="text-8xl animate-bounce mb-6">🏆</div>
      <h1 className="text-4xl sm:text-5xl font-black text-orange-500 mb-2 text-center">Konkurs Matematyczny</h1>
      <p className="text-gray-500 font-bold mb-8">10 pytań • licznik czasu • ocena</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
        {(Object.entries(LEVEL_CONFIG) as [Level, typeof LEVEL_CONFIG[Level]][]).map(([key, config]) => (
          <div
            key={key}
            onClick={() => setLevel(key)}
            className={`border-2 rounded-2xl p-4 cursor-pointer transition flex flex-col items-center text-center
              ${level === key ? 'bg-opacity-10 scale-105' : 'border-gray-200 hover:border-orange-300'}`}
            style={{
              borderColor: level === key ? config.color : undefined,
              backgroundColor: level === key ? `${config.color}15` : undefined
            }}
          >
            <div className="text-4xl mb-2">{config.emoji}</div>
            <div className="font-bold mb-1" style={{ color: level === key ? config.color : '#374151' }}>{config.label}</div>
            <div className="text-xs text-gray-500">{config.desc}</div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStart}
        className="w-full bg-orange-500 text-white font-black text-xl py-4 rounded-2xl hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition"
      >
        START
      </button>

    </div>
  )
}
