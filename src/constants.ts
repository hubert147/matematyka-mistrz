export const LEVEL_CONFIG = {
  easy:   { label: 'Łatwy',  emoji: '🌱', color: '#00B894', desc: 'Dodawanie i odejmowanie do 10' },
  medium: { label: 'Średni', emoji: '⚡', color: '#E67E22', desc: 'Działania do 20 i mnożenie' },
  hard:   { label: 'Trudny', emoji: '🔥', color: '#E74C3C', desc: 'Tabliczka mnożenia i zagadki' },
}

export const GOOD_AUDIO = Array.from({ length: 10 }, (_, i) => `/audio/good_${String(i+1).padStart(2,'0')}.mp3`)
export const BAD_AUDIO  = Array.from({ length: 10 }, (_, i) => `/audio/bad_${String(i+1).padStart(2,'0')}.mp3`)
