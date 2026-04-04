// System zapisu postępów w localStorage — bez backendu

const KEYS = {
  SESSIONS:     'lm_sessions_played',
  TOTAL_STARS:  'lm_total_stars',
  BEST_STARS:   'lm_best_stars',    // { A: 3, B: 2, ... }
  SESSION_COUNT: 'lm_session_count',
  UNLOCKED_POOL: 'lm_pool_level',   // 'beginner' | 'intermediate' | 'advanced'
  MUTED:        'lm_muted',
}

export class SaveSystem {
  // Liczba rozegranych sesji
  static getSessionCount() {
    return parseInt(localStorage.getItem(KEYS.SESSION_COUNT) || '0', 10)
  }

  static incrementSessionCount() {
    const n = this.getSessionCount() + 1
    localStorage.setItem(KEYS.SESSION_COUNT, String(n))
    return n
  }

  // Łączna liczba gwiazdek
  static getTotalStars() {
    return parseInt(localStorage.getItem(KEYS.TOTAL_STARS) || '0', 10)
  }

  static addStars(count) {
    const total = this.getTotalStars() + count
    localStorage.setItem(KEYS.TOTAL_STARS, String(total))
    return total
  }

  // Najlepszy wynik gwiazdkowy per litera
  static getBestStars(letter) {
    const all = JSON.parse(localStorage.getItem(KEYS.BEST_STARS) || '{}')
    return all[letter] || 0
  }

  static setBestStars(letter, stars) {
    const all = JSON.parse(localStorage.getItem(KEYS.BEST_STARS) || '{}')
    if ((all[letter] || 0) < stars) {
      all[letter] = stars
      localStorage.setItem(KEYS.BEST_STARS, JSON.stringify(all))
    }
  }

  // Poziom trudności na bazie liczby sesji
  static getPoolLevel() {
    const saved = localStorage.getItem(KEYS.UNLOCKED_POOL)
    if (saved) return saved
    return this._computePoolLevel()
  }

  static _computePoolLevel() {
    const sessions = this.getSessionCount()
    if (sessions >= 7) return 'advanced'
    if (sessions >= 4) return 'intermediate'
    return 'beginner'
  }

  static updatePoolLevel() {
    const level = this._computePoolLevel()
    localStorage.setItem(KEYS.UNLOCKED_POOL, level)
    return level
  }

  // Wyciszenie dźwięku
  static isMuted() {
    return localStorage.getItem(KEYS.MUTED) === 'true'
  }

  static setMuted(value) {
    localStorage.setItem(KEYS.MUTED, String(value))
  }

  // Historia sesji (ostatnie 10)
  static getSessions() {
    return JSON.parse(localStorage.getItem(KEYS.SESSIONS) || '[]')
  }

  static saveSession(session) {
    const sessions = this.getSessions()
    sessions.unshift(session)
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 10)))
  }

  // Oblicz gwiazdki na podstawie dokładności
  static calcStars(correct, total) {
    const accuracy = correct / total
    if (accuracy >= 0.9) return 3
    if (accuracy >= 0.7) return 2
    if (accuracy >= 0.4) return 1
    return 0
  }

  // Reset (tylko do testów)
  static reset() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k))
  }
}
