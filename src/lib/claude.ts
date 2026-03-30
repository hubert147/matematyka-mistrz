import type { Level, Question, Answer } from '../types'
import { QUESTIONS_POOL_SIZE } from './questionsCache'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function generateQuestions(level: Level): Promise<Question[]> {
  const levelDesc = {
    easy:   'dodawanie i odejmowanie do 10, liczenie obiektów (do 8), proste porównywanie liczb, figury geometryczne',
    medium: 'dodawanie i odejmowanie do 20, mnożenie przez 2 3 4 5, proste zadania tekstowe z jednym działaniem',
    hard:   'tabliczka mnożenia do 10x10, brakujący czynnik (? x 6 = 42), wzorce liczbowe, zadania tekstowe wielokrokowe',
  }[level]

  const prompt = `Jesteś generatorem pytań matematycznych dla dzieci 6-8 lat. Twoim jedynym zadaniem jest zwrócenie poprawnego JSON z 10 pytaniami. Nic więcej.

POZIOM: ${level}
ZAKRES: ${levelDesc}

## STRUKTURA PROGRESJI (OBOWIĄZKOWA)

Pytania 1-3 → difficulty: 1 (najprostsze w zakresie, małe liczby, oczywisty kontekst)
Pytania 4-7 → difficulty: 2 (średnie, nieco większe liczby, jeden krok myślenia)
Pytania 8-10 → difficulty: 3 (najtrudniejsze w zakresie, większe liczby lub wielokrok)

## ZASADY OBLICZEŃ — KRYTYCZNE

Przed zapisaniem każdego pytania wykonaj następujące kroki:
1. Oblicz wynik ręcznie: zapisz działanie i wynik
2. Sprawdź drugi raz: potwierdź że wynik się zgadza
3. Sprawdź opts: upewnij się że "correct" jest IDENTYCZNE z jednym z czterech opts (ten sam string, ta sama liczba)
4. Sprawdź dystraktorzy: pozostałe 3 opcje muszą być BŁĘDNE ale WIARYGODNE (różnią się o 1-3 od poprawnej)

Przykład weryfikacji:
- Działanie: 7 × 8
- Krok 1: 7×8 = 56 ✓
- Krok 2: 8×7 = 56 ✓ (przemienność)
- correct: "56"
- opts: ["54", "56", "58", "63"] ✓ (56 jest w liście, pozostałe błędne)

## FORMAT WYJŚCIOWY

Zwróć WYŁĄCZNIE tablicę JSON. Zero tekstu przed, zero tekstu po, zero markdown, zero komentarzy.
Pierwszym znakiem odpowiedzi musi być "[", ostatnim "]".

[
  {
    "id": "q1",
    "q": "3 + 4 = ?",
    "opts": ["5", "6", "7", "8"],
    "correct": "7",
    "explanation": "Liczymy dalej od 3, robiąc cztery kroki: 4, 5, 6, 7 — i już mamy wynik!",
    "category": "Dodawanie",
    "difficulty": 1
  }
]

## REGUŁY KAŻDEGO POLA

"id" → "q1" do "q10" — kolejno, bez przerw

"q" → treść pytania, max 15 słów
  - Działania zapisuj jako: 7 + 3 = ?, 5 × 4 = ?, 15 - 8 = ?
  - Brakujący czynnik: ? × 6 = 42
  - Zadanie tekstowe: max 2 zdania, ZAWSZE z konkretnymi liczbami w treści
  - Porównanie: ZAWSZE podaj obie liczby wprost, np. "Która liczba jest większa: 7 czy 3?" — nigdy samo "Która jest większa?"
  - ABSOLUTNY ZAKAZ: pytania bez konkretnych liczb w treści (np. zakazane: "Która liczba jest większa?" bez podania jakie liczby)
  - NIE używaj znaków specjalnych ani emoji w pytaniu

"opts" → dokładnie 4 stringi
  - Poprawna odpowiedź ukryta na losowej pozycji (nie zawsze pierwsza lub ostatnia)
  - Dystraktorzy: liczby bliskie wyniku (±1, ±2, ±3), NIGDY ujemne dla tego wieku
  - Wszystkie 4 opcje muszą być różne od siebie
  - Dla pytań słownych ("które większe?") opts to np. ["3", "7", "są równe", "nie wiem"]

"correct" → musi być IDENTYCZNYM STRINGIEM z jednego z opts, znak po znaku

"explanation" → 1-2 zdania, ciepły ton Pani Sowy, konkretny sposób dojścia do wyniku
  - Używaj obrazów z życia: jabłka, palce, czekoladki, kaczki, kroki
  - Przykład dobry: "Wyobraź sobie 6 pudełek z 7 czekoladkami — razem masz 42 słodkości!"
  - Przykład zły: "Odpowiedź to 42" (za mało, nie tłumaczy)

"category" → TYLKO jedna z: Dodawanie, Odejmowanie, Mnożenie, Liczenie, Porównywanie, Figury, Zadanie, Wzorzec, Brakujący czynnik

"difficulty" → liczba 1, 2 lub 3 (nie string)

## RÓŻNORODNOŚĆ — OBOWIĄZKOWA

- Żadne dwie liczby nie mogą się powtarzać jako główne operandy (np. nie dwa pytania z "7 × 8")
- Maksymalnie 3 pytania z tej samej kategorii
- Zadania tekstowe: każde z innym kontekstem (np. jedno o jabłkach, drugie o pająkach)
- Opcje odpowiedzi: poprawna na pozycji 1 max 2 razy, na pozycji 2 max 3 razy, itd. — rozkład losowy

## SAMOKONTROLA PRZED ZWRÓCENIEM

Zanim zwrócisz JSON, sprawdź mentalnie każde pytanie według listy:
□ Czy wynik jest matematycznie poprawny?
□ Czy "correct" jest identyczne z jednym z "opts"?
□ Czy wszystkie 4 opts są różne od siebie?
□ Czy difficulty rośnie (1,1,1,2,2,2,2,3,3,3)?
□ Czy JSON jest syntaktycznie poprawny (wszystkie nawiasy zamknięte, przecinki na miejscu)?
□ Czy odpowiedź zaczyna się od "[" i kończy na "]"?

Jeśli którakolwiek odpowiedź brzmi "nie" — popraw przed zwróceniem.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: prompt,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [{ role: 'user', content: `Generuj ${QUESTIONS_POOL_SIZE} pytań matematycznych.` }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Claude API Error:', err)
    throw new Error('Błąd komunikacji z Claude API')
  }

  const data = await res.json()
  const text = data.content?.[0]?.text || ''

  // Bezpieczny parse — wytnij JSON z odpowiedzi
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Brak JSON w odpowiedzi Claude')
  const questions: Question[] = JSON.parse(match[0])

  // Walidacja
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

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: [
        {
          type: 'text',
          text: `Jesteś Panią Sową — ciepłą nauczycielką matematyki dla dzieci 6-8 lat. Napisz krótkie, ciepłe omówienie wyników quizu (do 120 słów). 1. Zacznij od pochwały. 2. Wyjaśnij błędy prostymi obrazami. 3. Zakończ motywacyjnie. Pisz bezpośrednio do dziecka, po polsku, ciepło i zachęcająco.`,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [{ role: 'user', content: `Poziom: ${level}. Wynik: ${score}/10. Błędy:\n${wrongList}` }],
    }),
  })

  const data = await res.json()
  return data.content?.[0]?.text || 'Dobra robota! Ćwicz dalej!'
}

export async function analyzeTutorImage(
  base64Image: string
): Promise<{ explanation: string; questions: Question[] }> {
  // Strip out the data:image prefix to get just the base64 string
  const base64Data = base64Image.split(',')[1] || base64Image
  const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg'

  const prompt = `Jesteś Panią Sową - ciepłą i doświadczoną edukatorką wczesnoszkolną (dzieci 6-8 lat).
Dostajesz zdjęcie zadania domowego dziecka, kawałka ćwiczeń lub książki.
Twoim głównym zadaniem jest WYTŁUMACZENIE dziecku co jest na zdjęciu i o co w nim chodzi.
Kategorycznie ZAKAZUJĘ podawania gotowych rozwiązań do niezrobionych zadań na zdjęciu. Masz pomóc dziecku do nich dojść krok po kroku.

Wymagany format JSON z dokładnie dwoma kluczami (bez znaczników markdown, czysty JSON):
{
  "explanation": "Twój ciepły komentarz jako Pani Sowa. Wyjaśnienie koncepcji. Minimum 3 zdania, maksimum 6.",
  "questions": [
    {
      "id": "t1",
      "q": "Pytanie sprawdzające wygenerowane na podstawie zdjęcia. Np. Ile skrzydeł mają 3 kaczki?",
      "opts": ["A", "B", "C", "D"],
      "correct": "Poprawna odpowiedz pasujaca 1:1 do stringa z opts",
      "explanation": "Wyjaśnienie odpowiedzi po wybraniu błędnej",
      "category": "Temat ze zdjęcia",
      "difficulty": 1
    }
  ]
}

- Zwróć od 2 do 3 pytań "questions" z options.
- Jeśli zdjęcie nie dotyczy matematyki/nauki przekaż dziecku w "explanation", że Sowa chętnie porozmawia, ale tu uczy matematyki, i daj 1 łatwe, całkowicie standardowe, matematyczne pytanie.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: [
        {
          type: 'text',
          text: prompt,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: "Przeanalizuj to zdjęcie zadania domowego.",
            },
          ],
        },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Claude Vision API Error:', err)
    throw new Error('Błąd odczytu obrazu')
  }

  const data = await res.json()
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


  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: [
        {
          type: 'text',
          text: `Jesteś Panią Sową — przyjazna, ciepła i figlarna nauczycielka dla dzieci 6-8 lat. Uczysz matematyki i przyrody.
ZASADY: max 3 zdania; zero markdown; max 2 emoji; nigdy "błąd" (mów "prawie!"); porównania z życia (jabłka, palce, pizza).
Jeśli pytanie nieEdukacyjne: "Uhu! Sowy znają się tylko na szkole i przyrodzie! Na co masz ochotę?"
Jeśli dziecko pisze o smutku/strachu: reaguj ciepło i zaproponuj rozmowę z rodzicem.`,
          cache_control: { type: 'ephemeral' }
        }
      ],
      messages: messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Claude Chat API Error:', err)
    throw new Error('Błąd komunikacji z Sową')
  }

  const data = await res.json()
  return data.content?.[0]?.text || 'Sowa chwilowo przysnęła na gałęzi. Uhu!'
}
