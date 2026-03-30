import type { Level, Question } from '../types'

const CACHE_KEY = 'maja_questions_cache'
const POOL_SIZE = 30          // generuj 30 pytań naraz
const CACHE_TTL_HOURS = 24    // odśwież po 24h

interface CacheEntry {
  questions: Question[]
  timestamp: number
}
type Cache = Partial<Record<Level, CacheEntry>>

function readCache(): Cache {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeCache(cache: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // localStorage może być niedostępny (prywatny tryb) — ignorujemy
  }
}

/** Zwraca 10 losowych pytań z puli lub null jeśli cache wygasł */
export function getQuestionsFromCache(level: Level): Question[] | null {
  const cache = readCache()
  const entry = cache[level]
  if (!entry) return null

  const ageHours = (Date.now() - entry.timestamp) / 3_600_000
  if (ageHours > CACHE_TTL_HOURS) return null

  // Musimy mieć jeszcze co najmniej 10 pytań
  if (entry.questions.length < 10) return null

  // Losuj 10 bez powtórzeń
  const shuffled = [...entry.questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 10)
}

/** Zapisuje pulę pytań do cache */
export function saveQuestionsToCache(level: Level, questions: Question[]) {
  const cache = readCache()
  cache[level] = { questions, timestamp: Date.now() }
  writeCache(cache)
}

/** Ile pytań wygenerować przy jednym wywołaniu API */
export const QUESTIONS_POOL_SIZE = POOL_SIZE
