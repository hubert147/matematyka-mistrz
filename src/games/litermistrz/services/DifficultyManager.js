import { SESSION_POOL, getRandomLetter, getDistractors } from '../data/letters.js'
import { SaveSystem } from './SaveSystem.js'

// Zarządza trudnością i doborem liter na sesję

export class DifficultyManager {
  constructor() {
    this.correctStreak = 0
    this.wrongStreak   = 0
    this.poolLevel     = SaveSystem.getPoolLevel()
    this.usedLetters   = []
  }

  get pool() {
    return SESSION_POOL[this.poolLevel] || SESSION_POOL.beginner
  }

  // Pobierz następną literę (unikaj powtórzeń)
  nextLetter() {
    const letter = getRandomLetter(this.pool, this.usedLetters)
    this.usedLetters.push(letter.letter)

    // Resetuj historię gdy wszystkie litery z puli użyte
    if (this.usedLetters.length >= this.pool.length) {
      this.usedLetters = []
    }

    return letter
  }

  // Zbuduj pytanie: litera + 3 dystraktory (tasowane)
  buildQuestion(letterData) {
    const distractors = getDistractors(letterData, this.pool, 3)
    const options     = this._shuffle([letterData.letter, ...distractors])
    const correctIdx  = options.indexOf(letterData.letter)

    return {
      target:     letterData.letter,
      word:       letterData.word,
      emoji:      letterData.emoji,
      image:      letterData.image || null,
      prompt:     letterData.pronunciation,
      options,
      correctIdx,
    }
  }

  onCorrect() {
    this.correctStreak++
    this.wrongStreak = 0
  }

  onWrong() {
    this.wrongStreak++
    this.correctStreak = 0
  }

  get hasStreak() {
    return this.correctStreak > 0 && this.correctStreak % 3 === 0
  }

  _shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5)
  }

  // Czy sesja powinna odblokować wyższy poziom?
  shouldLevelUp(totalSessions) {
    const current = this.poolLevel
    if (current === 'beginner'     && totalSessions >= 4)  return 'intermediate'
    if (current === 'intermediate' && totalSessions >= 7)  return 'advanced'
    return null
  }
}
