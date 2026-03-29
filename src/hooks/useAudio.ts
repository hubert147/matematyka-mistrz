import { useEffect, useRef } from 'react'
import { GOOD_AUDIO, BAD_AUDIO } from '../constants'

export function useAudio() {
  const goodQueue = useRef<string[]>([])
  const badQueue  = useRef<string[]>([])

  function shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5)
  }

  function playGood() {
    if (goodQueue.current.length === 0) goodQueue.current = shuffle(GOOD_AUDIO)
    const src = goodQueue.current.pop()!
    const audio = new Audio(src)
    audio.play().catch(() => {})
  }

  function playBad() {
    if (badQueue.current.length === 0) badQueue.current = shuffle(BAD_AUDIO)
    const src = badQueue.current.pop()!
    const audio = new Audio(src)
    audio.play().catch(() => {})
  }

  useEffect(() => {
    goodQueue.current = shuffle(GOOD_AUDIO)
    badQueue.current  = shuffle(BAD_AUDIO)
  }, [])

  return { playGood, playBad }
}
