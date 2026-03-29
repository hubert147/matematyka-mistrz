import { useState, useEffect } from 'react'

export function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const start = () => setIsRunning(true)
  const stop = () => setIsRunning(false)
  const reset = () => {
    setSeconds(0)
    setIsRunning(false)
  }

  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const formatted = `${mins}:${secs.toString().padStart(2, '0')}`
  const isUrgent = seconds >= 60

  return { seconds, formatted, isUrgent, start, stop, reset }
}
