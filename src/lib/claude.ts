import type { Level, Question, Answer } from '../types'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function generateQuestions(level: Level): Promise<Question[]> {
  const levelDesc = {
    easy:   'dodawanie i odejmowanie do 10, liczenie obiektów (do 8), proste porównywanie liczb, figury geometryczne',
    medium: 'dodawanie i odejmowanie do 20, mnożenie przez 2 3 4 5, proste zadania tekstowe z jednym działaniem',
    hard:   'tabliczka mnożenia do 10x10, brakujący czynnik (? x 6 = 42), wzorce liczbowe, zadania tekstowe wielokrokowe',
  }[level]

  const prompt = `Wygeneruj dokładnie 10 pytań matematycznych dla dziecka 6-8 lat, poziom: ${level}.
Zakres: ${levelDesc}.

WAŻNE — pytania muszą być PROGRESYWNE (każde następne trudniejsze):
- Pytania 1-3: difficulty 1 (najprostsze z zakresu)
- Pytania 4-7: difficulty 2 (średnie)
- Pytania 8-10: difficulty 3 (najtrudniejsze z zakresu)

Zwróć TYLKO poprawny JSON (bez markdown, bez komentarzy) w formacie:
[
  {
    "id": "q1",
    "q": "3 + 4 = ?",
    "opts": ["5", "6", "7", "8"],
    "correct": "7",
    "explanation": "3 plus 4 to 7, liczymy dalej od 3: cztery kroki to 4,5,6,7",
    "category": "Dodawanie",
    "difficulty": 1
  }
]

Zasady:
- opts: zawsze dokładnie 4 elementy jako stringi, poprawna odpowiedź ukryta losowo wśród opcji
- correct: musi być identyczne z jednym z opts
- explanation: proste, ciepłe wyjaśnienie dla dziecka (1-2 zdania), jak dojść do odpowiedzi
- category: jedna z: Dodawanie, Odejmowanie, Mnożenie, Liczenie, Porównywanie, Figury, Zadanie, Wzorzec, Brakujący czynnik
- Dla zadań tekstowych używaj ciekawych kontekstów: jabłka, pająki, pizze, rowery, kaczki, ciastka
- NIE powtarzaj tych samych liczb w kolejnych pytaniach`

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
      messages: [{ role: 'user', content: prompt }],
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
  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error('Claude nie zwrócił 10 pytań')
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

  const prompt = `Jesteś Panią Sową — ciepłą nauczycielką matematyki dla dzieci 6-8 lat.
Dziecko ukończyło quiz matematyczny (poziom: ${level}). Wynik: ${score}/10.

Błędne odpowiedzi:
${wrongList}

Napisz krótkie, ciepłe omówienie (do 120 słów):
1. Zacznij od pochwały za to co poszło dobrze
2. Dla każdego błędu wyjaśnij PROSTYMI SŁOWAMI dlaczego poprawna odpowiedź jest właśnie taka (użyj pola Wskazówka)
3. Zakończ jednym motywującym zdaniem

Pisz bezpośrednio do dziecka ("Ty", "Twoja"), po polsku, ciepło i zachęcająco.
Używaj prostych słów. Nie używaj trudnych terminów matematycznych.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
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
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
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
              text: prompt,
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
