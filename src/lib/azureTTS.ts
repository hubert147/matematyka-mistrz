/** Cache dla audio (żeby nie pobierać tego samego dwa razy w jednej sesji) */
const audioCache: Record<string, string> = {}

/** 
 * Funkcja konwertująca tekst na mowę za pomocą Microsoft Azure (Zofia Neural) 
 */
export async function speak(text: string): Promise<void> {
  try {
    // Sprawdź cache
    if (audioCache[text]) {
      const audio = new Audio(audioCache[text])
      await audio.play()
      return
    }

    const res = await fetch('/api/tts', {
      method: 'POST',
      body: `<speak version='1.0' xml:lang='pl-PL'>
          <voice name='pl-PL-ZofiaNeural'>
            ${text}
          </voice>
        </speak>`
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error(`Azure TTS API Error [${res.status}]:`, errBody)
      throw new Error(`Azure TTS Error: ${res.status}`)
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    audioCache[text] = url // Zapisz w cache sesyjnym
    
    console.log('Azure TTS: Audio wygenerowane pomyślnie.')
    const audio = new Audio(url)
    await audio.play()
  } catch (e) {
    console.error('Błąd Azure TTS (przełączam na fallback):', e)
    // Fallback do systemowego syntezatora
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'pl-PL'
    window.speechSynthesis.speak(utterance)
  }
}
