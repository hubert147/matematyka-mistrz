import type { LiterLevel, TaskType, LiterQuestion } from '../types/liter'

// ─── Dane słownikowe dla każdej litery ───────────────────────────────────────

export interface LetterEntry {
  letter: string
  word: string
  pronunciation: string   // dla TTS
  emoji: string           // fallback gdy brak obrazka
  imageFile?: string       // plik w /public/images/letters/
}

export const LETTER_DICT: Record<string, LetterEntry> = {
  A: { letter:'A', word:'ARBUZ',   pronunciation:'A jak Arbuz',   emoji:'🍉', imageFile:'a_arbuz.png' },
  B: { letter:'B', word:'BANAN',   pronunciation:'B jak Banan',   emoji:'🍌', imageFile:'b_banan.png' },
  C: { letter:'C', word:'CYTRYNA', pronunciation:'C jak Cytryna', emoji:'🍋', imageFile:'c_cytryna.png' },
  D: { letter:'D', word:'DOM',     pronunciation:'D jak Dom',     emoji:'🏠', imageFile:'d_dom.png' },
  E: { letter:'E', word:'EKRAN',   pronunciation:'E jak Ekran',   emoji:'📺', imageFile:'e_ekran.png' },
  F: { letter:'F', word:'FOKA',    pronunciation:'F jak Foka',    emoji:'🦭', imageFile:'f_foka.png' },
  G: { letter:'G', word:'GITARA',  pronunciation:'G jak Gitara',  emoji:'🎸', imageFile:'g_gitara.png' },
  H: { letter:'H', word:'HERBATA', pronunciation:'H jak Herbata', emoji:'☕', imageFile:'h_herbata.png' },
  I: { letter:'I', word:'IGŁA',    pronunciation:'I jak Igła',    emoji:'🪡', imageFile:'i_igla.png' },
  J: { letter:'J', word:'JABŁKO',  pronunciation:'J jak Jabłko',  emoji:'🍎', imageFile:'j_jablko.png' },
  K: { letter:'K', word:'KOT',     pronunciation:'K jak Kot',     emoji:'🐱', imageFile:'k_kot.png' },
  L: { letter:'L', word:'LEW',     pronunciation:'L jak Lew',     emoji:'🦁', imageFile:'l_lew.png' },
  Ł: { letter:'Ł', word:'ŁÓDKA',   pronunciation:'Ł jak Łódka',   emoji:'⛵', imageFile:'l_lodka.png' },
  M: { letter:'M', word:'MIŚ',     pronunciation:'M jak Miś',     emoji:'🧸', imageFile:'m_mis.png' },
  N: { letter:'N', word:'NOGA',    pronunciation:'N jak Noga',    emoji:'🦵', imageFile:'n_noga.png' },
  O: { letter:'O', word:'OSA',     pronunciation:'O jak Osa',     emoji:'🐝', imageFile:'o_osa.png' },
  Ó: { letter:'Ó', word:'ÓSEMKA',  pronunciation:'Ó jak Ósemka',  emoji:'8️⃣', imageFile:undefined },
  P: { letter:'P', word:'PIES',    pronunciation:'P jak Pies',    emoji:'🐕', imageFile:'p_pies.png' },
  R: { letter:'R', word:'ROWER',   pronunciation:'R jak Rower',   emoji:'🚲', imageFile:undefined },
  S: { letter:'S', word:'SŁOŃ',    pronunciation:'S jak Słoń',    emoji:'🐘', imageFile:undefined },
  Ś: { letter:'Ś', word:'ŚLIMAK',  pronunciation:'Ś jak Ślimak',  emoji:'🐌', imageFile:undefined },
  T: { letter:'T', word:'TORBA',   pronunciation:'T jak Torba',   emoji:'👜', imageFile:undefined },
  U: { letter:'U', word:'UCHO',    pronunciation:'U jak Ucho',    emoji:'👂', imageFile:undefined },
  W: { letter:'W', word:'WODA',    pronunciation:'W jak Woda',    emoji:'💧', imageFile:undefined },
  Z: { letter:'Z', word:'ZEBRA',   pronunciation:'Z jak Zebra',   emoji:'🦓', imageFile:undefined },
  Ź: { letter:'Ź', word:'ŹRÓDŁO',  pronunciation:'Ź jak Źródło',  emoji:'🏞️', imageFile:undefined },
  Ż: { letter:'Ż', word:'ŻABA',    pronunciation:'Ż jak Żaba',    emoji:'🐸', imageFile:undefined },
  Ń: { letter:'Ń', word:'KOŃ',     pronunciation:'Ń jak koń — litera na końcu', emoji:'🐴', imageFile:undefined },
  Ć: { letter:'Ć', word:'ĆMA',     pronunciation:'Ć jak Ćma',     emoji:'🦋', imageFile:undefined },
  Ą: { letter:'Ą', word:'ZĄB',     pronunciation:'Ą jak ząb — litera w środku', emoji:'🦷', imageFile:undefined },
}

// ─── Słowa sylabowe (zawsze wielosylabowe) ────────────────────────────────────

export interface SyllableEntry {
  word: string
  syllables: string[]
}

export const SYLLABLE_WORDS: Record<LiterLevel, SyllableEntry[]> = {
  easy: [
    { word:'MAMA',   syllables:['MA','MA'] },
    { word:'TATA',   syllables:['TA','TA'] },
    { word:'BABA',   syllables:['BA','BA'] },
    { word:'LALA',   syllables:['LA','LA'] },
    { word:'BOLO',   syllables:['BO','LO'] },
    { word:'MOLO',   syllables:['MO','LO'] },
    { word:'LATO',   syllables:['LA','TO'] },
    { word:'TUBA',   syllables:['TU','BA'] },
  ],
  medium: [
    { word:'KOTEK',  syllables:['KO','TEK'] },
    { word:'ROWER',  syllables:['RO','WER'] },
    { word:'KASKA',  syllables:['KAS','KA'] },
    { word:'NOGA',   syllables:['NO','GA'] },
    { word:'PARA',   syllables:['PA','RA'] },
    { word:'KURA',   syllables:['KU','RA'] },
    { word:'SOWA',   syllables:['SO','WA'] },
    { word:'RYBA',   syllables:['RY','BA'] },
  ],
  hard: [
    { word:'SAMOLOT', syllables:['SA','MO','LOT'] },
    { word:'MOTYL',   syllables:['MO','TYL'] },
    { word:'ŁÓDKA',   syllables:['ŁÓD','KA'] },
    { word:'ŚCIANA',  syllables:['ŚCIA','NA'] },
    { word:'ŹRÓDŁO',  syllables:['ŹRÓD','ŁO'] },
    { word:'ŻYRAFA',  syllables:['ŻY','RA','FA'] },
    { word:'ĆWICZENIE',syllables:['ĆWI','CZE','NIE'] },
    { word:'ŚWINIA',  syllables:['ŚWI','NIA'] },
  ],
}

// ─── Konfiguracja poziomów ─────────────────────────────────────────────────

export const LEVEL_CONFIG: Record<LiterLevel, {
  label: string
  emoji: string
  color: string
  bgColor: string
  desc: string
  letters: string[]
  taskTypes: TaskType[]
  drawLetters: string[]
}> = {
  easy: {
    label: 'Łatwy',
    emoji: '🌱',
    color: '#00B894',
    bgColor: '#E8F8F5',
    desc: 'Samogłoski i proste litery',
    letters: ['A','E','I','O','U','M','B','T','D','L'],
    taskTypes: ['listen','image'],
    drawLetters: ['A','E','I','O','U'],
  },
  medium: {
    label: 'Średni',
    emoji: '⚡',
    color: '#E67E22',
    bgColor: '#FEF9E7',
    desc: 'Więcej liter i pierwsze sylaby',
    letters: ['K','R','S','N','P','W','Z','G','J','C'],
    taskTypes: ['listen','image','syllable'],
    drawLetters: ['K','R','S','N','P'],
  },
  hard: {
    label: 'Trudny',
    emoji: '🔥',
    color: '#E74C3C',
    bgColor: '#FDEDEC',
    desc: 'Wszystkie litery, sylaby i pisanie',
    letters: ['F','H','Ł','Ó','Ź','Ż','Ć','Ś','Ą','Ń'],
    taskTypes: ['listen','image','syllable','draw'],
    drawLetters: ['F','H','Ł','Ż','Ć'],
  },
}

// ─── Generator harmonogramu zadań ─────────────────────────────────────────────

/** Zwraca tablicę 10 typów zadań — losowy mix lub skupienie na jednym typie */
export function generateSchedule(level: LiterLevel, focusType?: TaskType): TaskType[] {
  if (focusType) {
    return Array(10).fill(focusType)
  }

  const types = LEVEL_CONFIG[level].taskTypes
  const n = types.length
  const total = 10
  const base = Math.floor(total / n)
  const remainder = total % n

  const schedule: TaskType[] = []
  for (const t of types) {
    for (let i = 0; i < base; i++) schedule.push(t)
  }
  for (let i = 0; i < remainder; i++) {
    schedule.push(types[Math.floor(Math.random() * n)])
  }

  // Tasuje tablicę
  return schedule.sort(() => Math.random() - 0.5)
}

// ─── Generator konkretnego pytania ────────────────────────────────────────────

let _usedLetters: string[] = []
let _usedSyllableWords: string[] = []

export function resetQuestionState() {
  _usedLetters = []
  _usedSyllableWords = []
}

function pickLetter(letters: string[]): string {
  const unused = letters.filter(l => !_usedLetters.includes(l))
  const pool = unused.length > 0 ? unused : letters
  const letter = pool[Math.floor(Math.random() * pool.length)]
  _usedLetters.push(letter)
  return letter
}

function pickSyllableWord(level: LiterLevel): SyllableEntry {
  const pool = SYLLABLE_WORDS[level]
  const unused = pool.filter(w => !_usedSyllableWords.includes(w.word))
  const entry = (unused.length > 0 ? unused : pool)[Math.floor(Math.random() * (unused.length || pool.length))]
  _usedSyllableWords.push(entry.word)
  return entry
}

function generateOptions(correct: string, allLetters: string[]): string[] {
  const wrong = allLetters.filter(l => l !== correct)
  const shuffled = wrong.sort(() => Math.random() - 0.5).slice(0, 3)
  const opts = [...shuffled, correct].sort(() => Math.random() - 0.5)
  return opts
}

export function buildQuestion(type: TaskType, level: LiterLevel, index: number): LiterQuestion {
  const cfg = LEVEL_CONFIG[level]

  if (type === 'listen' || type === 'image') {
    const letter = pickLetter(cfg.letters)
    const entry = LETTER_DICT[letter]
    const options = generateOptions(letter, cfg.letters)
    return {
      id: `q${index + 1}`,
      type,
      letter,
      word: entry?.word,
      pronunciation: entry?.pronunciation ?? `${letter}`,
      emoji: entry?.emoji ?? '❓',
      imageFile: entry?.imageFile,
      options,
      correct: letter,
    }
  }

  if (type === 'syllable') {
    const entry = pickSyllableWord(level)
    return {
      id: `q${index + 1}`,
      type,
      syllables: [...entry.syllables].sort(() => Math.random() - 0.5), // podane w losowej kolejności
      syllableWord: entry.word,
    }
  }

  // draw
  const drawLetters = cfg.drawLetters
  const drawLetter = drawLetters[Math.floor(Math.random() * drawLetters.length)]
  return {
    id: `q${index + 1}`,
    type: 'draw',
    drawLetter,
    pronunciation: `Narysuj literę ${drawLetter}`,
  }
}
