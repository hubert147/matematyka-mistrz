// Wszystkie 32 polskie litery z metadanymi

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
}

// Litery pogrupowane wg trudności
export const LETTERS = [
  // EASY — samogłoski + najprostsze
  { letter: 'A', word: 'ARBUZ',   emoji: '🍉', pronunciation: 'A jak Arbuz',   difficulty: 'easy',   distractors: ['O', 'E', 'Ą'] },
  { letter: 'E', word: 'EKRAN',   emoji: '📺', pronunciation: 'E jak Ekran',   difficulty: 'easy',   distractors: ['A', 'I', 'Ę'] },
  { letter: 'I', word: 'IGŁA',    emoji: '🪡', pronunciation: 'I jak Igła',    difficulty: 'easy',   distractors: ['J', 'L', 'T'] },
  { letter: 'O', word: 'OSA',     emoji: '🐝', pronunciation: 'O jak Osa',     difficulty: 'easy',   distractors: ['Q', 'Ó', 'D'] },
  { letter: 'U', word: 'UCHO',    emoji: '👂', pronunciation: 'U jak Ucho',    difficulty: 'easy',   distractors: ['V', 'N', 'H'] },
  { letter: 'M', word: 'MIŚ',     emoji: '🧸', pronunciation: 'M jak Miś',     difficulty: 'easy',   distractors: ['N', 'W', 'H'] },
  { letter: 'B', word: 'BANAN',   emoji: '🍌', pronunciation: 'B jak Banan',   difficulty: 'easy',   distractors: ['D', 'P', 'R'] },
  { letter: 'T', word: 'TORBA',   emoji: '👜', pronunciation: 'T jak Torba',   difficulty: 'easy',   distractors: ['I', 'L', 'F'] },

  // MEDIUM — spółgłoski
  { letter: 'C', word: 'CYTRYNA', emoji: '🍋', pronunciation: 'C jak Cytryna', difficulty: 'medium', distractors: ['G', 'Ć', 'O'] },
  { letter: 'D', word: 'DOM',     emoji: '🏠', pronunciation: 'D jak Dom',     difficulty: 'medium', distractors: ['B', 'P', 'R'] },
  { letter: 'F', word: 'FOKA',    emoji: '🦭', pronunciation: 'F jak Foka',    difficulty: 'medium', distractors: ['T', 'P', 'E'] },
  { letter: 'G', word: 'GITARA',  emoji: '🎸', pronunciation: 'G jak Gitara',  difficulty: 'medium', distractors: ['C', 'Q', 'O'] },
  { letter: 'H', word: 'HERBATA', emoji: '☕', pronunciation: 'H jak Herbata', difficulty: 'medium', distractors: ['N', 'M', 'K'] },
  { letter: 'K', word: 'KOT',     emoji: '🐱', pronunciation: 'K jak Kot',     difficulty: 'medium', distractors: ['H', 'X', 'R'] },
  { letter: 'L', word: 'LEW',     emoji: '🦁', pronunciation: 'L jak Lew',     difficulty: 'medium', distractors: ['I', 'T', 'Ł'] },
  { letter: 'N', word: 'NOGA',    emoji: '🦵', pronunciation: 'N jak Noga',    difficulty: 'medium', distractors: ['M', 'H', 'Ń'] },
  { letter: 'P', word: 'PIES',    emoji: '🐕', pronunciation: 'P jak Pies',    difficulty: 'medium', distractors: ['B', 'D', 'R'] },
  { letter: 'R', word: 'ROWER',   emoji: '🚲', pronunciation: 'R jak Rower',   difficulty: 'medium', distractors: ['P', 'B', 'K'] },
  { letter: 'S', word: 'SŁOŃ',    emoji: '🐘', pronunciation: 'S jak Słoń',    difficulty: 'medium', distractors: ['Ś', 'Z', 'C'] },
  { letter: 'W', word: 'WODA',    emoji: '💧', pronunciation: 'W jak Woda',    difficulty: 'medium', distractors: ['V', 'M', 'N'] },

  // HARD — polskie znaki diakrytyczne
  { letter: 'Ą', word: 'ZĄB',     emoji: '🦷', pronunciation: 'Ą jak Ząb',     difficulty: 'hard',   distractors: ['A', 'O', 'Q'] },
  { letter: 'Ć', word: 'ĆMA',     emoji: '🦋', pronunciation: 'Ć jak Ćma',     difficulty: 'hard',   distractors: ['C', 'G', 'Ś'] },
  { letter: 'Ę', word: 'ĘCINA',   emoji: '🌾', pronunciation: 'Ę jak łąka',    difficulty: 'hard',   distractors: ['E', 'A', 'F'] },
  { letter: 'J', word: 'JABŁKO',  emoji: '🍎', pronunciation: 'J jak Jabłko',  difficulty: 'hard',   distractors: ['I', 'L', 'T'] },
  { letter: 'Ł', word: 'ŁÓDKA',   emoji: '⛵', pronunciation: 'Ł jak Łódka',   difficulty: 'hard',   distractors: ['L', 'T', 'I'] },
  { letter: 'Ń', word: 'KOŃ',     emoji: '🐴', pronunciation: 'Ń jak Koń',     difficulty: 'hard',   distractors: ['N', 'M', 'H'] },
  { letter: 'Ó', word: 'ÓSEMKA',  emoji: '8️⃣', pronunciation: 'Ó jak Ósemka',  difficulty: 'hard',   distractors: ['O', 'Q', 'G'] },
  { letter: 'Ś', word: 'ŚLIMAK',  emoji: '🐌', pronunciation: 'Ś jak Ślimak',  difficulty: 'hard',   distractors: ['S', 'C', 'Z'] },
  { letter: 'Y', word: 'YETI',    emoji: '🏔️', pronunciation: 'Y jak Yeti',    difficulty: 'hard',   distractors: ['V', 'U', 'I'] },
  { letter: 'Z', word: 'ZEBRA',   emoji: '🦓', pronunciation: 'Z jak Zebra',   difficulty: 'hard',   distractors: ['S', 'Ź', 'Ż'] },
  { letter: 'Ź', word: 'ŹRÓDŁO',  emoji: '🏞️', pronunciation: 'Ź jak Źródło',  difficulty: 'hard',   distractors: ['Z', 'Ż', 'S'] },
  { letter: 'Ż', word: 'ŻABA',    emoji: '🐸', pronunciation: 'Ż jak Żaba',    difficulty: 'hard',   distractors: ['Z', 'Ź', 'G'] },
]

// Litery wg poziomu sesji
export const SESSION_POOL = {
  beginner: LETTERS.filter(l => l.difficulty === 'easy'),
  intermediate: LETTERS.filter(l => ['easy', 'medium'].includes(l.difficulty)),
  advanced: LETTERS,
}

// Wizualnie podobne litery (dystraktory)
export const SIMILAR_LETTERS = {
  B: ['D', 'P', 'R'],
  D: ['B', 'P', 'O'],
  P: ['B', 'D', 'R'],
  M: ['N', 'W', 'H'],
  N: ['M', 'H', 'Ń'],
  S: ['Ś', 'Z', 'C'],
  Z: ['Ź', 'Ż', 'S'],
  L: ['I', 'T', 'Ł'],
  Ł: ['L', 'T', 'I'],
  O: ['Q', 'Ó', 'D'],
  Ó: ['O', 'Q', 'G'],
  C: ['G', 'O', 'Ć'],
  Ć: ['C', 'Ś', 'G'],
}

// Kolory przycisków liter — 4 zawsze inne
export const BUTTON_COLORS = [
  0x3498DB, // niebieski
  0xE67E22, // pomarańczowy
  0x9B59B6, // fioletowy
  0x27AE60, // zielony
]

export const BUTTON_COLORS_HEX = [
  '#3498DB',
  '#E67E22',
  '#9B59B6',
  '#27AE60',
]

// Pobierz literę po nazwie
export function getLetterData(letter) {
  return LETTERS.find(l => l.letter === letter) || null
}

// Pobierz losową literę z puli
export function getRandomLetter(pool, exclude = []) {
  const available = pool.filter(l => !exclude.includes(l.letter))
  if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)]
  return available[Math.floor(Math.random() * available.length)]
}

// Dystraktory dla danej litery (wizualnie podobne + losowe)
export function getDistractors(letterData, pool, count = 3) {
  const similar = (letterData.distractors || []).filter(d =>
    pool.some(l => l.letter === d)
  )

  const result = [...similar.slice(0, count)]

  // Uzupełnij losowymi jeśli brak podobnych
  if (result.length < count) {
    const others = pool
      .map(l => l.letter)
      .filter(l => l !== letterData.letter && !result.includes(l))
      .sort(() => Math.random() - 0.5)

    result.push(...others.slice(0, count - result.length))
  }

  return result.slice(0, count)
}
