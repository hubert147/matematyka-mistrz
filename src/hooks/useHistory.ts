import type { QuizSession } from '../types'

const KEY = 'matematyka_mistrz_v2'

export function useHistory() {
  const load = (): QuizSession[] => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
  }
  const save = (s: QuizSession) => {
    const all = load()
    localStorage.setItem(KEY, JSON.stringify([s, ...all].slice(0, 20)))
  }
  return { load, save }
}
