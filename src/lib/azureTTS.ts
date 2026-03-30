const REGION = import.meta.env.VITE_AZURE_REGION || 'westeurope'
const AZURE_KEY = import.meta.env.VITE_AZURE_TTS_KEY

/** Cache dla audio (żeby nie pobierać tego samego dwa razy w jednej sesji) */
const audioCache: Record<string, string> = {}

/** 
 * Funkcja konwertująca tekst na mowę za pomocą Microsoft Azure (Zofia Neural) 
 */
export async function speak(text: string): Promise<void> {
  if (!AZURE_KEY) {
    // Fallback do systemowego syntezatora jeśli brak klucza
    console.warn('Brak klucza Azure TTS — używam systemowego syntezatora.')
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pl-PL'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
    return
  }

  try {
    // Sprawdź cache
    if (audioCache[text]) {
      const audio = new Audio(audioCache[text])
      await audio.play()
      return
    }

    const res = await fetch(
      `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: `<speak version='1.0' xml:lang='pl-PL'>
          <voice name='pl-PL-ZofiaNeural'>
            ${text}
          </voice>
        </speak>`
      }
    )

    if (!res.ok) throw new Error(`Azure TTS Error: ${res.status}`)

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    audioCache[text] = url // Zapisz w cache sesyjnym
    
    const audio = new Audio(url)
    await audio.play()
  } catch (e) {
    console.error('Błąd Azure TTS:', e)
  }
}
