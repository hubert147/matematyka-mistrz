import type { Level, Question, Answer } from '../types'
import type { LiterLevel, LiterAnswer } from '../types/liter'
import { QUESTIONS_POOL_SIZE } from './questionsCache'

async function fetchFromProxy(body: any) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Claude Proxy Error:', err)
    throw new Error('Sowa ma problem z myśleniem (API Error)')
  }

  return res.json()
}

export async function generateQuestions(level: Level): Promise<Question[]> {
  const levelDesc = {
    easy:   'dodawanie i odejmowanie do 10, liczenie obiektów (do 8), proste porównywanie liczb, figury geometryczne',
    medium: 'dodawanie i odejmowanie do 20, mnożenie przez 2 3 4 5, proste zadania tekstowe z jednym działaniem',
    hard:   'tabliczka mnożenia do 10x10, brakujący czynnik (? x 6 = 42), wzorce liczbowe, zadania tekstowe wielokrokowe',
  }[level]

  const prompt = `Jesteś generatorem pytań matematycznych dla dzieci 6-8 lat. Zwróć TYLKO tablicę JSON z ${QUESTIONS_POOL_SIZE} pytaniami. Zero tekstu poza JSON.
POZIOM: ${level} | ZAKRES: ${levelDesc}
Progresja trudności: pytania 1-10 difficulty:1, 11-20 difficulty:2, 21-30 difficulty:3.
ZASADY (krytyczne):
- "correct" musi być identycznym stringiem z "opts" (znak po znaku)
- 4 różne opcje; dystraktorzy różnią się o ±1-3 od wyniku, nigdy ujemne
- "q": max 15 słów; porównanie ZAWSZE z obiema liczbami ("Większa: 7 czy 3?"); zero emoji
- "explanation": 1-2 zdania, obrazowe (jabłka, palce, czekoladki)
- "category": Dodawanie | Odejmowanie | Mnożenie | Liczenie | Porównywanie | Figury | Zadanie | Wzorzec | Brakujący czynnik
- "id": q1..q${QUESTIONS_POOL_SIZE}; "difficulty": liczba 1|2|3
- Maks. 3 pytania z tej samej kategorii w bloku 10`

  const data = await fetchFromProxy({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    system: [{ type: 'text', text: prompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `Generuj ${QUESTIONS_POOL_SIZE} pytań matematycznych.` }],
  })

  const text = data.content?.[0]?.text || ''
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Brak JSON w odpowiedzi Claude')
  const questions: Question[] = JSON.parse(match[0])

  if (!Array.isArray(questions) || questions.length < 10) {
    throw new Error('Claude nie zwrócił wystarczającej liczby pytań')
  }

  return questions
}

export async function generateReview(
  answers: Answer[],
  level: Level,
  score: number
): Promise<string> {
  const wrong = answers.filter(a => !a.correct)
  if (wrong.length === 0) {
    return 'Brawo! Bezbłędny wynik! Jesteś prawdziwym mistrzem matematyki! Wszystkie 10 pytań poprawnie — to niesamowite osiągnięcie!'
  }

  const wrongList = wrong.map(a =>
    `- Pytanie: "${a.question.q}" | Twoja odpowiedź: ${a.chosen} | Poprawna: ${a.question.correct} | Wskazówka: ${a.question.explanation}`
  ).join('\\n')

  const data = await fetchFromProxy({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: [{
      type: 'text',
      text: `Jesteś Panią Sową — ciepłą nauczycielką matematyki dla dzieci 6-8 lat. Napisz krótkie, ciepłe omówienie wyników quizu (do 120 słów). zacznij od pochwały. Pisz bezpośrednio do dziecka, po polsku, ciepło i zachęcająco.`,
      cache_control: { type: 'ephemeral' }
    }],
    messages: [{ role: 'user', content: `Poziom: ${level}. Wynik: ${score}/10. Błędy:\n${wrongList}` }],
  })

  return data.content?.[0]?.text || 'Dobra robota! Ćwicz dalej!'
}

export async function analyzeTutorImage(
  base64Image: string
): Promise<{ explanation: string; questions: Question[] }> {
  const base64Data = base64Image.split(',')[1] || base64Image
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg'

  const prompt = `Jesteś Panią Sową - ciepłą i doświadczoną edukatorką wczesnoszkolną (dzieci 6-8 lat).
Wytłumacz dziecku co jest na zdjęciu i o co w nim chodzi. Kategorycznie ZAKAZUJĘ podawania gotowych rozwiązań do niezrobionych zadań.
Wymagany format JSON z dokładnie dwoma kluczami:
{
  "explanation": "Twój ciepły komentarz jako Pani Sowa. Wyjaśnienie koncepcji. Minimum 3 zdania, maksimum 6.",
  "questions": [
    {
      "id": "t1",
      "q": "Pytanie sprawdzające wygenerowane na podstawie zdjęcia.",
      "opts": ["A", "B", "C", "D"],
      "correct": "Poprawna odpowiedz pasujaca 1:1 do stringa z opts",
      "explanation": "Wyjaśnienie odpowiedzi po wybraniu błędnej",
      "category": "Temat ze zdjęcia",
      "difficulty": 1
    }
  ]
}`

  const data = await fetchFromProxy({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: [{ type: 'text', text: prompt, cache_control: { type: 'ephemeral' } }],
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64Data } },
        { type: 'text', text: "Przeanalizuj to zdjęcie zadania domowego." },
      ],
    }],
  })

  const text = data.content?.[0]?.text || ''
  try {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error()
    const parsed = JSON.parse(match[0])
    return {
      explanation: parsed.explanation || 'Niestety, nie potrafię tego wyjaśnić.',
      questions: Array.isArray(parsed.questions) ? parsed.questions : []
    }
  } catch (e) {
    console.error('JSON parsing failed:', text)
    throw new Error('Claude zwrócił niepoprawny format')
  }
}

export async function sendChatMessage(
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const sysPrompt = `Jesteś Panią Sową — przyjazna, ciepła i figlarna nauczycielka dla dzieci 6-8 lat. Uczysz matematyki i przyrody.
ZASADY: max 3 zdania; zero markdown; max 2 emoji; nigdy "błąd" (mów "prawie!"); porównania z życia (jabłka, palce, pizza).`

  const data = await fetchFromProxy({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: [{ type: 'text', text: sysPrompt, cache_control: { type: 'ephemeral' } }],
    messages: messages,
  })

  return data.content?.[0]?.text || 'Sowa chwilowo przysnęła na gałęzi. Uhu!'
}

export async function generateLiterReview(
  answers: LiterAnswer[],
  level: LiterLevel,
  score: number
): Promise<string> {
  const wrong = answers.filter(a => !a.correct)
  if (wrong.length === 0) return 'Dostałeś 10 na 10! Jesteś Królem i Mistrzem Liter! Wszystko bezbłędnie — sowa pęka z dumy! Uhu!'

  const wrongList = wrong.map(a => {
    if (a.question.type === 'listen' || a.question.type === 'image') return `- Pytanie o literę ${a.question.letter} | Błędnie wskazano literę.`
    if (a.question.type === 'syllable') return `- Wyraz ${a.question.syllableWord} | Błąd w składaniu sylab.`
    if (a.question.type === 'draw') return `- Pisanie litery ${a.question.drawLetter} | Kształt nie był idealny.`
    return ''
  }).join('\\n')

  const sysPrompt = `Jesteś Panią Sową — ciepłą nauczycielką literatury i czytania dla dzieci 6 lat. Napisz krótkie (max 120 słów), proste omówienie wyników konkursu literowego. Pisz po polsku, bez markdown.`

  const data = await fetchFromProxy({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    system: [{ type: 'text', text: sysPrompt, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: `Poziom: ${level}. Wynik: ${score}/10. Błędy:\n${wrongList}` }],
  })

  return data.content?.[0]?.text || 'Bardzo ładnie Ci poszło! Czytaj dalej i omijaj przeszkody!'
}
