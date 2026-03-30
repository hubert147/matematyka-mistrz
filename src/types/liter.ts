// Typy dla modułu LiterMistrz

export type LiterLevel = 'easy' | 'medium' | 'hard'
export type TaskType = 'listen' | 'image' | 'syllable' | 'draw'

export interface LiterQuestion {
  id: string
  type: TaskType
  // listen + image:
  letter?: string         // np. 'A'
  word?: string           // np. 'ARBUZ'
  pronunciation?: string  // np. 'A jak Arbuz'
  emoji?: string          // np. '🍉' — fallback gdy brak obrazka
  imageFile?: string      // np. 'a_arbuz.png'
  options?: string[]      // 4 litery do wyboru
  correct?: string        // poprawna litera
  // syllable:
  syllables?: string[]    // np. ['MA', 'MA']
  syllableWord?: string   // np. 'MAMA' — gotowy wyraz
  // draw:
  drawLetter?: string     // np. 'A'
}

export interface LiterAnswer {
  question: LiterQuestion
  correct: boolean
  chosen?: string         // dla listen/image
  drawn?: boolean         // dla draw (czy narysował)
  syllableOk?: boolean    // dla syllable (czy złożył poprawnie)
}

export interface LiterSession {
  id: string
  date: string
  level: LiterLevel
  score: number
  answers: LiterAnswer[]
  review?: string
}
