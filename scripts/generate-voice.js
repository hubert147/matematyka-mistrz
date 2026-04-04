#!/usr/bin/env node
// Skrypt do pre-generowania plików MP3 przez Azure TTS (Zofia)
// Uruchom RAZ: node scripts/generate-voice.js
//
// Wymagania:
//   npm install microsoft-cognitiveservices-speech-sdk
//   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=westeurope node scripts/generate-voice.js

import { readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

const OUTPUT_DIR = './public/voice'

// Sprawdź klucz Azure
const AZURE_KEY    = process.env.AZURE_SPEECH_KEY
const AZURE_REGION = process.env.AZURE_SPEECH_REGION || 'westeurope'

if (!AZURE_KEY) {
  console.log('⚠️  Brak AZURE_SPEECH_KEY — skrypt wymaga klucza Azure TTS')
  console.log('   Ustaw: export AZURE_SPEECH_KEY=twój_klucz')
  console.log('   Lub wejdź na: https://portal.azure.com')
  console.log('')
  console.log('ℹ️  Gra działa bez plików MP3 — używa SpeechSynthesis API przeglądarki')
  process.exit(0)
}

// Upewnij się że folder istnieje
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

// Litery do wygenerowania
const LETTERS = [
  'A', 'Ą', 'B', 'C', 'Ć', 'D', 'E', 'Ę',
  'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Ł',
  'M', 'N', 'Ń', 'O', 'Ó', 'P', 'R', 'S',
  'Ś', 'T', 'U', 'W', 'Y', 'Z', 'Ź', 'Ż',
]

// Frazy do wygenerowania
const PHRASES = {
  brawo:        'Brawo! Świetnie!',
  sprobuj:      'Spróbuj jeszcze raz!',
  super_streak: 'Niesamowite! Trzy z rzędu!',
  welcome:      'Cześć! Jestem Pani Sowa. Znajdź właściwą literę!',
  game_over:    'Koniec gry! Dobra robota!',
  perfect:      'Wspaniale! Wszystko dobrze!',
}

// Litery + ich komendy "Znajdź literę X"
const LETTER_TEXTS = Object.fromEntries(
  LETTERS.map(l => [l, `Znajdź literę ${l}`])
)

async function generateSSML(text) {
  return `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
       xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="pl-PL">
  <voice name="pl-PL-ZofiaNeural">
    <prosody rate="0.85" pitch="+5%">
      <mstts:express-as style="cheerful">
        ${text}
      </mstts:express-as>
    </prosody>
  </voice>
</speak>`
}

async function generateAudio(text, filename) {
  // Dynamiczny import — package może nie być zainstalowany
  let sdk
  try {
    sdk = await import('microsoft-cognitiveservices-speech-sdk')
  } catch(e) {
    console.error('Brak pakietu: npm install microsoft-cognitiveservices-speech-sdk')
    process.exit(1)
  }

  const { SpeechConfig, AudioConfig, SpeechSynthesizer } = sdk.default || sdk

  const config = SpeechConfig.fromSubscription(AZURE_KEY, AZURE_REGION)
  config.speechSynthesisVoiceName = 'pl-PL-ZofiaNeural'

  const outputPath = join(OUTPUT_DIR, filename)
  const audioConfig = AudioConfig.fromAudioFileOutput(outputPath)
  const synthesizer = new SpeechSynthesizer(config, audioConfig)

  const ssml = await generateSSML(text)

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(ssml,
      result => {
        synthesizer.close()
        if (result.reason === 0) {
          console.log(`✅ ${filename}`)
          resolve()
        } else {
          reject(new Error(`TTS error: ${result.reason}`))
        }
      },
      err => {
        synthesizer.close()
        reject(err)
      }
    )
  })
}

async function main() {
  console.log('🦉 Generowanie plików głosowych dla LiterMistrz...')
  console.log(`📁 Output: ${OUTPUT_DIR}`)
  console.log('')

  // Litery
  for (const [letter, text] of Object.entries(LETTER_TEXTS)) {
    const filename = `letter_${letter}.mp3`
    const path     = join(OUTPUT_DIR, filename)
    if (existsSync(path)) {
      console.log(`⏭️  ${filename} (już istnieje)`)
      continue
    }
    try {
      await generateAudio(text, filename)
    } catch(e) {
      console.error(`❌ ${filename}: ${e.message}`)
    }
  }

  // Frazy
  for (const [key, text] of Object.entries(PHRASES)) {
    const filename = `phrase_${key}.mp3`
    const path     = join(OUTPUT_DIR, filename)
    if (existsSync(path)) {
      console.log(`⏭️  ${filename} (już istnieje)`)
      continue
    }
    try {
      await generateAudio(text, filename)
    } catch(e) {
      console.error(`❌ ${filename}: ${e.message}`)
    }
  }

  console.log('')
  console.log('✅ Gotowe! Pliki MP3 w ./public/voice/')
  console.log('   Wdróż aplikację — głosy będą ładowane automatycznie.')
}

main().catch(console.error)
