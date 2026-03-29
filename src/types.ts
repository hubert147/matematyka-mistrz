export type Level = 'easy' | 'medium' | 'hard'
export type Screen = 'start' | 'quiz' | 'loading' | 'results'

export interface Question {
  id: string
  q: string              // treść pytania
  opts: string[]         // dokładnie 4 opcje jako stringi
  correct: string        // poprawna odpowiedź
  explanation: string    // wyjaśnienie dla AI omówienia
  category: string       // np. "Dodawanie", "Mnożenie", "Zadanie"
  difficulty: 1 | 2 | 3 // 1=łatwe, 2=średnie, 3=trudne
}

export interface Answer {
  question: Question
  chosen: string
  correct: boolean
  timeMs: number
}

export interface QuizSession {
  id: string
  date: string
  level: Level
  score: number
  totalTime: number
  answers: Answer[]
  review?: string
}
