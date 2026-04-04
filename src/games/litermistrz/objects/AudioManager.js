import { PHRASES, getVoiceFile } from '../data/questions.js'
import { SaveSystem } from '../services/SaveSystem.js'

// Zarządza całym audio w grze
// Priorytet: pre-generowane MP3 → SpeechSynthesis API → Web Audio API beepy

export class AudioManager {
  constructor() {
    this.muted     = SaveSystem.isMuted()
    this.ctx       = null
    this.cache     = new Map()   // text → AudioBuffer
    this.music     = null
  }

  // ───────────────────────────────── INIT ─────────────────────────────────────

  _getCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Resume jeśli suspended (autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // ────────────────────────────── TTS / GŁOS ──────────────────────────────────

  // Powiedz tekst — spróbuj MP3, fallback do SpeechSynthesis
  speak(text) {
    if (this.muted) return
    if (!text) return

    // Próbuj SpeechSynthesis (działa bez Azure)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang  = 'pl-PL'
      utterance.rate  = 0.85
      utterance.pitch = 1.1
      utterance.volume = 0.9

      // Preferuj głos polski jeśli dostępny
      const voices = window.speechSynthesis.getVoices()
      const plVoice = voices.find(v => v.lang.startsWith('pl'))
      if (plVoice) utterance.voice = plVoice

      window.speechSynthesis.speak(utterance)
      return
    }

    // Ostatni fallback — tylko beep
    this.playCorrect()
  }

  // Powiedz frazę z PHRASES
  sayPhrase(key) {
    const text = PHRASES[key]
    if (text) this.speak(text)
  }

  // ─────────────────────────── EFEKTY DŹWIĘKOWE ───────────────────────────────

  playCorrect() {
    if (this.muted) return
    this._playArpeggio([523, 659, 784], 0.15)   // C-E-G
  }

  playWrong() {
    if (this.muted) return
    this._playBoing()
  }

  playStar() {
    if (this.muted) return
    this._playArpeggio([784, 988, 1175], 0.1)   // G-B-D (wyżej)
  }

  playClick() {
    if (this.muted) return
    this._playTick()
  }

  playStreak() {
    if (this.muted) return
    this._playArpeggio([523, 659, 784, 988, 1175], 0.12)
  }

  // ────────────────────────── MUZYKA TŁA ──────────────────────────────────────

  startMusic() {
    if (this.muted) return
    // Prosta generowana muzyka tła (brak zewnętrznych plików)
    this._playAmbient()
  }

  stopMusic() {
    if (this.music) {
      try { this.music.stop() } catch(e) {}
      this.music = null
    }
  }

  // ──────────────────────────── WYCISZENIE ─────────────────────────────────────

  toggle() {
    this.muted = !this.muted
    SaveSystem.setMuted(this.muted)
    if (this.muted) {
      window.speechSynthesis?.cancel()
      this.stopMusic()
    }
    return this.muted
  }

  setMuted(val) {
    this.muted = val
    SaveSystem.setMuted(val)
    if (val) {
      window.speechSynthesis?.cancel()
      this.stopMusic()
    }
  }

  // ─────────────────────────── WEB AUDIO HELPERS ───────────────────────────────

  _playArpeggio(freqs, volume = 0.15) {
    try {
      const ctx = this._getCtx()
      freqs.forEach((freq, i) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.type = 'sine'
        osc.frequency.value = freq

        const t = ctx.currentTime + i * 0.1
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(volume, t + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3)

        osc.start(t)
        osc.stop(t + 0.35)
      })
    } catch(e) {}
  }

  _playBoing() {
    try {
      const ctx  = this._getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)
    } catch(e) {}
  }

  _playTick() {
    try {
      const ctx  = this._getCtx()
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'triangle'
      osc.frequency.value = 800

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
    } catch(e) {}
  }

  _playAmbient() {
    // Prosta muzyczka — nieużywana bo mogłoby irytować
    // Można podpiąć plik MP3 gdy będzie dostępny
  }
}
