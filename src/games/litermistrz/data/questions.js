// Komendy głosowe i podpowiedzi dla każdej litery
// Głos: "Znajdź literę A" / "Która litera to A jak Arbuz?"

export const VOICE_PROMPTS = {
  // Format: { find: 'tekst do TTS', hint: 'tekst pomocniczy' }
  A:  { find: 'Znajdź literę A',  hint: 'A jak Arbuz 🍉' },
  Ą:  { find: 'Znajdź literę Ą',  hint: 'Ą jak Ząb 🦷' },
  B:  { find: 'Znajdź literę B',  hint: 'B jak Banan 🍌' },
  C:  { find: 'Znajdź literę C',  hint: 'C jak Cytryna 🍋' },
  Ć:  { find: 'Znajdź literę Ć',  hint: 'Ć jak Ćma 🦋' },
  D:  { find: 'Znajdź literę D',  hint: 'D jak Dom 🏠' },
  E:  { find: 'Znajdź literę E',  hint: 'E jak Ekran 📺' },
  Ę:  { find: 'Znajdź literę Ę',  hint: 'Ę jak łąka 🌾' },
  F:  { find: 'Znajdź literę F',  hint: 'F jak Foka 🦭' },
  G:  { find: 'Znajdź literę G',  hint: 'G jak Gitara 🎸' },
  H:  { find: 'Znajdź literę H',  hint: 'H jak Herbata ☕' },
  I:  { find: 'Znajdź literę I',  hint: 'I jak Igła 🪡' },
  J:  { find: 'Znajdź literę J',  hint: 'J jak Jabłko 🍎' },
  K:  { find: 'Znajdź literę K',  hint: 'K jak Kot 🐱' },
  L:  { find: 'Znajdź literę L',  hint: 'L jak Lew 🦁' },
  Ł:  { find: 'Znajdź literę Ł',  hint: 'Ł jak Łódka ⛵' },
  M:  { find: 'Znajdź literę M',  hint: 'M jak Miś 🧸' },
  N:  { find: 'Znajdź literę N',  hint: 'N jak Noga 🦵' },
  Ń:  { find: 'Znajdź literę Ń',  hint: 'Ń jak Koń 🐴' },
  O:  { find: 'Znajdź literę O',  hint: 'O jak Osa 🐝' },
  Ó:  { find: 'Znajdź literę Ó',  hint: 'Ó jak Ósemka 8️⃣' },
  P:  { find: 'Znajdź literę P',  hint: 'P jak Pies 🐕' },
  R:  { find: 'Znajdź literę R',  hint: 'R jak Rower 🚲' },
  S:  { find: 'Znajdź literę S',  hint: 'S jak Słoń 🐘' },
  Ś:  { find: 'Znajdź literę Ś',  hint: 'Ś jak Ślimak 🐌' },
  T:  { find: 'Znajdź literę T',  hint: 'T jak Torba 👜' },
  U:  { find: 'Znajdź literę U',  hint: 'U jak Ucho 👂' },
  W:  { find: 'Znajdź literę W',  hint: 'W jak Woda 💧' },
  Y:  { find: 'Znajdź literę Y',  hint: 'Y jak Yeti 🏔️' },
  Z:  { find: 'Znajdź literę Z',  hint: 'Z jak Zebra 🦓' },
  Ź:  { find: 'Znajdź literę Ź',  hint: 'Ź jak Źródło 🏞️' },
  Ż:  { find: 'Znajdź literę Ż',  hint: 'Ż jak Żaba 🐸' },
}

// Frazy ogólne
export const PHRASES = {
  brawo:         'Brawo! Świetnie!',
  sprobuj:       'Spróbuj jeszcze raz!',
  super_streak:  'Niesamowite! Trzy z rzędu!',
  welcome:       'Cześć! Jestem Pani Sowa. Znajdź właściwą literę!',
  game_over:     'Koniec! Dobra robota!',
  perfect:       'Wspaniale! Wszystko dobrze!',
  level_up:      'Coraz lepiej! Idziemy dalej!',
  start:         'Zaczynam!',
}

// Klucze do pre-generowanych plików MP3
// Plik: /voice/letter_A.mp3, /voice/phrase_brawo.mp3 itd.
export function getVoiceFile(type, key) {
  if (type === 'letter') return `/voice/letter_${key}.mp3`
  if (type === 'phrase') return `/voice/phrase_${key}.mp3`
  return null
}
