// Wszystkie 32 polskie litery z metadanymi

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
}

// Litery pogrupowane wg trudności
export const LETTERS = [
  // EASY — samogłoski + najprostsze
  { letter: 'A', word: 'ARBUZ',   emoji: '🍉', image: '/images/letters/a_arbuz.png',   pronunciation: 'A jak Arbuz',   difficulty: 'easy',   distractors: ['O', 'E', 'Ą'] },
  { letter: 'E', word: 'EKRAN',   emoji: '📺', image: '/images/letters/e_ekran.png',   pronunciation: 'E jak Ekran',   difficulty: 'easy',   distractors: ['A', 'I', 'Ę'] },
  { letter: 'I', word: 'IGŁA',    emoji: '🪡', image: '/images/letters/i_igla.png',    pronunciation: 'I jak Igła',    difficulty: 'easy',   distractors: ['J', 'L', 'T'] },
  { letter: 'O', word: 'OSA',     emoji: '🐝', image: '/images/letters/o_osa.png',     pronunciation: 'O jak Osa',     difficulty: 'easy',   distractors: ['Q', 'Ó', 'D'] },
  { letter: 'U', word: 'UCHO',    emoji: '👂', image: '/images/letters/u_ucho.png',    pronunciation: 'U jak Ucho',    difficulty: 'easy',   distractors: ['V', 'N', 'H'] },
  { letter: 'M', word: 'MIŚ',     emoji: '🧸', image: '/images/letters/m_mis.png',     pronunciation: 'M jak Miś',     difficulty: 'easy',   distractors: ['N', 'W', 'H'] },
  { letter: 'B', word: 'BANAN',   emoji: '🍌', image: '/images/letters/b_banan.png',   pronunciation: 'B jak Banan',   difficulty: 'easy',   distractors: ['D', 'P', 'R'] },
  { letter: 'T', word: 'TORBA',   emoji: '👜', image: '/images/letters/t_torba.png',   pronunciation: 'T jak Torba',   difficulty: 'easy',   distractors: ['I', 'L', 'F'] },

  // MEDIUM — spółgłoski
  { letter: 'C', word: 'CYTRYNA', emoji: '🍋', image: '/images/letters/c_cytryna.png', pronunciation: 'C jak Cytryna', difficulty: 'medium', distractors: ['G', 'Ć', 'O'] },
  { letter: 'D', word: 'DOM',     emoji: '🏠', image: '/images/letters/d_dom.png',     pronunciation: 'D jak Dom',     difficulty: 'medium', distractors: ['B', 'P', 'R'] },
  { letter: 'F', word: 'FOKA',    emoji: '🦭', image: '/images/letters/f_foka.png',    pronunciation: 'F jak Foka',    difficulty: 'medium', distractors: ['T', 'P', 'E'] },
  { letter: 'G', word: 'GITARA',  emoji: '🎸', image: '/images/letters/g_gitara.png',  pronunciation: 'G jak Gitara',  difficulty: 'medium', distractors: ['C', 'Q', 'O'] },
  { letter: 'H', word: 'HERBATA', emoji: '☕', image: '/images/letters/h_herbata.png', pronunciation: 'H jak Herbata', difficulty: 'medium', distractors: ['N', 'M', 'K'] },
  { letter: 'K', word: 'KOT',     emoji: '🐱', image: '/images/letters/k_kot.png',     pronunciation: 'K jak Kot',     difficulty: 'medium', distractors: ['H', 'X', 'R'] },
  { letter: 'L', word: 'LEW',     emoji: '🦁', image: '/images/letters/l_lew.png',     pronunciation: 'L jak Lew',     difficulty: 'medium', distractors: ['I', 'T', 'Ł'] },
  { letter: 'N', word: 'NOGA',    emoji: '🦵', image: '/images/letters/n_noga.png',    pronunciation: 'N jak Noga',    difficulty: 'medium', distractors: ['M', 'H', 'Ń'] },
  { letter: 'P', word: 'PIES',    emoji: '🐕', image: '/images/letters/p_pies.png',    pronunciation: 'P jak Pies',    difficulty: 'medium', distractors: ['B', 'D', 'R'] },
  { letter: 'R', word: 'ROWER',   emoji: '🚲', image: '/images/letters/r_rower.png',   pronunciation: 'R jak Rower',   difficulty: 'medium', distractors: ['P', 'B', 'K'] },
  { letter: 'S', word: 'SŁOŃ',    emoji: '🐘', image: '/images/letters/s_slon.png',    pronunciation: 'S jak Słoń',    difficulty: 'medium', distractors: ['Ś', 'Z', 'C'] },
  { letter: 'W', word: 'WODA',    emoji: '💧', image: '/images/letters/w_woda.png',    pronunciation: 'W jak Woda',    difficulty: 'medium', distractors: ['V', 'M', 'N'] },

  // HARD — polskie znaki diakrytyczne
  { letter: 'Ą', word: 'ZĄB',     emoji: '🦷', image: '/images/letters/a_zab.png',    pronunciation: 'Ą jak Ząb',     difficulty: 'hard',   distractors: ['A', 'O', 'Q'] },
  { letter: 'Ć', word: 'ĆMA',     emoji: '🦋', image: '/images/letters/c_cma.png',    pronunciation: 'Ć jak Ćma',     difficulty: 'hard',   distractors: ['C', 'G', 'Ś'] },
  { letter: 'Ę', word: 'ĘCINA',   emoji: '🌾', image: null,                            pronunciation: 'Ę jak Ęcina',   difficulty: 'hard',   distractors: ['E', 'A', 'F'] },
  { letter: 'J', word: 'JABŁKO',  emoji: '🍎', image: '/images/letters/j_jablko.png', pronunciation: 'J jak Jabłko',  difficulty: 'hard',   distractors: ['I', 'L', 'T'] },
  { letter: 'Ł', word: 'ŁÓDKA',   emoji: '⛵', image: '/images/letters/l_lodka.png',  pronunciation: 'Ł jak Łódka',   difficulty: 'hard',   distractors: ['L', 'T', 'I'] },
  { letter: 'Ń', word: 'KOŃ',     emoji: '🐴', image: '/images/letters/n_kon.png',    pronunciation: 'Ń jak Koń',     difficulty: 'hard',   distractors: ['N', 'M', 'H'] },
  { letter: 'Ó', word: 'ÓSEMKA',  emoji: '8️⃣', image: '/images/letters/o_osemka.png', pronunciation: 'Ó jak Ósemka',  difficulty: 'hard',   distractors: ['O', 'Q', 'G'] },
  { letter: 'Ś', word: 'ŚLIMAK',  emoji: '🐌', image: '/images/letters/s_slimak.png', pronunciation: 'Ś jak Ślimak',  difficulty: 'hard',   distractors: ['S', 'C', 'Z'] },
  { letter: 'Y', word: 'YETI',    emoji: '🏔️', image: null,                            pronunciation: 'Y jak Yeti',    difficulty: 'hard',   distractors: ['V', 'U', 'I'] },
  { letter: 'Z', word: 'ZEBRA',   emoji: '🦓', image: '/images/letters/z_zebra.png',  pronunciation: 'Z jak Zebra',   difficulty: 'hard',   distractors: ['S', 'Ź', 'Ż'] },
  { letter: 'Ź', word: 'ŹRÓDŁO',  emoji: '🏞️', image: '/images/letters/z_zrodlo.png', pronunciation: 'Ź jak Źródło',  difficulty: 'hard',   distractors: ['Z', 'Ż', 'S'] },
  { letter: 'Ż', word: 'ŻABA',    emoji: '🐸', image: '/images/letters/z_zaba.png',   pronunciation: 'Ż jak Żaba',    difficulty: 'hard',   distractors: ['Z', 'Ź', 'G'] },
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

// Mapowanie ścieżki obrazka → klucz Phaser (załadowany w BootScene)
const IMAGE_KEY_MAP = {
  '/images/letters/a_arbuz.png':   'img_a',
  '/images/letters/b_banan.png':   'img_b',
  '/images/letters/c_cytryna.png': 'img_c',
  '/images/letters/d_dom.png':     'img_d',
  '/images/letters/e_ekran.png':   'img_e',
  '/images/letters/f_foka.png':    'img_f',
  '/images/letters/g_gitara.png':  'img_g',
  '/images/letters/h_herbata.png': 'img_h',
  '/images/letters/i_igla.png':    'img_i',
  '/images/letters/j_jablko.png':  'img_j',
  '/images/letters/k_kot.png':     'img_k',
  '/images/letters/l_lew.png':     'img_l',
  '/images/letters/l_lodka.png':   'img_lodka',
  '/images/letters/m_mis.png':     'img_m',
  '/images/letters/n_noga.png':    'img_n',
  '/images/letters/o_osa.png':     'img_o',
  '/images/letters/p_pies.png':    'img_p',
  '/images/letters/r_rower.png':   'img_r',
  '/images/letters/s_slon.png':    'img_s',
  '/images/letters/t_torba.png':   'img_t',
  '/images/letters/u_ucho.png':    'img_u',
  '/images/letters/w_woda.png':    'img_w',
  '/images/letters/z_zebra.png':   'img_z',
  '/images/letters/a_zab.png':     'img_a_zab',
  '/images/letters/c_cma.png':     'img_c_cma',
  '/images/letters/n_kon.png':     'img_n_kon',
  '/images/letters/o_osemka.png':  'img_o_osemka',
  '/images/letters/s_slimak.png':  'img_s_slimak',
  '/images/letters/z_zrodlo.png':  'img_z_zrodlo',
  '/images/letters/z_zaba.png':    'img_z_zaba',
}

export function getImageKey(imagePath) {
  return imagePath ? (IMAGE_KEY_MAP[imagePath] || null) : null
}

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
