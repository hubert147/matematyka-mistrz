import { PaniSowa } from '../objects/PaniSowa.js'
import { LetterButton } from '../objects/LetterButton.js'
import { AudioManager } from '../objects/AudioManager.js'
import { DifficultyManager } from '../services/DifficultyManager.js'
import { SaveSystem } from '../services/SaveSystem.js'
import { VOICE_PROMPTS } from '../data/questions.js'

const TOTAL_ROUNDS = 10
const NEXT_DELAY   = 1500   // ms po odpowiedzi
const SHOW_CORRECT = 2000   // ms pokazania prawidłowej po błędzie

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene')
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height

    this.W = W
    this.H = H

    // Inicjalizacja
    this.audio      = new AudioManager()
    this.difficulty = new DifficultyManager()
    this.round      = 0
    this.correct    = 0
    this.streak     = 0
    this.answered   = false
    this.buttons    = []

    this._drawBackground(W, H)
    this._drawClouds(W, H)
    this._drawGround(W, H)

    // Pani Sowa
    this.owl = new PaniSowa(this, W / 2, 155)

    // Przycisk wróć
    this._drawBackButton()

    // Przycisk wyciszenia
    this._drawMuteButton()

    // Pasek postępu (góra)
    this._drawProgressBar()

    // Label pytania
    this.questionLabel = this.add.text(W / 2, 275, '', {
      fontSize: '22px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#2C3E50',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Label emoji/słowa
    this.wordLabel = this.add.text(W / 2, 308, '', {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
    }).setOrigin(0.5)

    // Wynik
    this.scoreText = this.add.text(W - 16, 14, '0 pkt', {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#E67E22',
      fontStyle: 'bold',
    }).setOrigin(1, 0)

    // Klawiatura 1-4
    this.input.keyboard?.on('keydown', (event) => {
      const idx = ['Digit1','Digit2','Digit3','Digit4'].indexOf(event.code)
      if (idx !== -1 && this.buttons[idx] && !this.answered) {
        this.buttons[idx].hitZone.emit('pointerdown')
      }
    })

    // Pierwszy round
    this.time.delayedCall(300, () => this._nextRound())
  }

  // ────────────────────────────── PYTANIE ─────────────────────────────────────

  _nextRound() {
    if (this.round >= TOTAL_ROUNDS) {
      this._endGame()
      return
    }

    this.round++
    this.answered = false

    // Pobierz literę i pytanie
    const letterData = this.difficulty.nextLetter()
    this.currentQ    = this.difficulty.buildQuestion(letterData)

    // Zaktualizuj pasek postępu
    this._updateProgressBar()

    // Zaktualizuj pytanie
    const prompt = VOICE_PROMPTS[this.currentQ.target]
    this.questionLabel.setText(`Znajdź literę:  ${this.currentQ.target}`)
    this.wordLabel.setText(prompt?.hint || '')

    // Dymek u sowy
    this.owl.showBubble(this.currentQ.target)
    this.owl.setThinking()

    // Głos
    this.time.delayedCall(200, () => {
      this.audio.speak(prompt?.find || `Znajdź literę ${this.currentQ.target}`)
    })

    // Pokaż przyciski
    this._showButtons(this.currentQ)
  }

  // ────────────────────────── PRZYCISKI ───────────────────────────────────────

  _showButtons(question) {
    const W = this.W
    const H = this.H

    // 2×2 grid — wyśrodkowany
    const btnSize = 155
    const gap     = 18
    const gridW   = btnSize * 2 + gap
    const startX  = (W - gridW) / 2 + btnSize / 2
    const startY  = 360

    const positions = [
      { x: startX,          y: startY },
      { x: startX + btnSize + gap, y: startY },
      { x: startX,          y: startY + btnSize + gap },
      { x: startX + btnSize + gap, y: startY + btnSize + gap },
    ]

    // Ukryj stare przyciski jeśli są
    this.buttons.forEach(b => b.hide())

    // Stwórz lub odtwórz przyciski
    question.options.forEach((letter, i) => {
      let btn = this.buttons[i]
      if (!btn) {
        btn = new LetterButton(this, positions[i].x, positions[i].y, i)
        this.buttons[i] = btn
      } else {
        btn.container.setPosition(positions[i].x, positions[i].y)
      }

      const isCorrect = (i === question.correctIdx)
      btn.setup(letter, isCorrect, (tappedLetter, correct) => {
        this._onAnswer(correct, i)
      })

      // Opóźnienie dla efektu kaskady
      btn.container.setAlpha(0)
      this.time.delayedCall(i * 60, () => {
        this.tweens.add({
          targets: btn.container,
          alpha: 1,
          duration: 150,
        })
      })
    })
  }

  // ─────────────────────────── ODPOWIEDŹ ──────────────────────────────────────

  _onAnswer(isCorrect, tappedIdx) {
    if (this.answered) return
    this.answered = true

    // Wyłącz pozostałe przyciski
    this.buttons.forEach(b => b.disable())

    if (isCorrect) {
      this._handleCorrect(tappedIdx)
    } else {
      this._handleWrong(tappedIdx)
    }
  }

  _handleCorrect(idx) {
    this.correct++
    this.streak++
    this.difficulty.onCorrect()

    this.buttons[idx]?.showCorrect()
    this.owl.setHappy()
    this.owl.showBubble('🌟 Brawo!')

    this.audio.playCorrect()
    this.time.delayedCall(180, () => this.audio.speak('Brawo!'))

    // Aktualizuj wynik
    this._updateScore()

    // Efekt gwiazdek
    this._spawnStars(this.buttons[idx]?.container.x || this.W / 2, this.buttons[idx]?.container.y || this.H / 2)

    // Streak bonus
    if (this.difficulty.hasStreak) {
      this.time.delayedCall(600, () => {
        this.audio.playStreak()
        this._showStreakBanner()
      })
    }

    this.time.delayedCall(NEXT_DELAY, () => this._nextRound())
  }

  _handleWrong(idx) {
    this.streak = 0
    this.difficulty.onWrong()

    this.buttons[idx]?.showWrong()
    this.owl.setSad()
    this.owl.showBubble('Spróbuj jeszcze raz!')

    this.audio.playWrong()
    this.time.delayedCall(200, () => this.audio.speak('Spróbuj jeszcze raz!'))

    // Pokaż prawidłową po 1.5s
    this.time.delayedCall(1200, () => {
      const correctBtn = this.buttons[this.currentQ.correctIdx]
      correctBtn?.showCorrect()
    })

    // Lekkie shake kamery
    this.cameras.main.shake(220, 0.006)

    this.time.delayedCall(NEXT_DELAY + 800, () => this._nextRound())
  }

  // ─────────────────────────── GWIAZDKI ───────────────────────────────────────

  _spawnStars(x, y) {
    const count = 8
    for (let i = 0; i < count; i++) {
      const star = this.add.text(x, y, '⭐', {
        fontSize: `${16 + Math.random() * 16}px`,
      }).setOrigin(0.5)

      const angle = (i / count) * Math.PI * 2
      const dist  = 60 + Math.random() * 50

      this.tweens.add({
        targets: star,
        x: x + Math.cos(angle) * dist,
        y: y + Math.sin(angle) * dist,
        alpha: 0,
        scaleX: 0.5,
        scaleY: 0.5,
        duration: 600 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => star.destroy(),
      })
    }
  }

  // ──────────────────────── PASEK POSTĘPU ─────────────────────────────────────

  _drawProgressBar() {
    const W = this.W
    this.progressDots = []

    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      const dot = this.add.circle(
        W / 2 - (TOTAL_ROUNDS - 1) * 18 / 2 + i * 18,
        18,
        7,
        0xD5DBDB
      )
      this.progressDots.push(dot)
    }
  }

  _updateProgressBar() {
    this.progressDots.forEach((dot, i) => {
      if (i < this.round - 1) {
        dot.setFillStyle(0xF39C12)   // wypełnione
      } else if (i === this.round - 1) {
        dot.setFillStyle(0xE67E22)   // aktualne
        this.tweens.add({
          targets: dot,
          scaleX: 1.4, scaleY: 1.4,
          duration: 150, yoyo: true,
        })
      }
    })
  }

  // ──────────────────────── WYNIK ─────────────────────────────────────────────

  _updateScore() {
    const pts = this.correct * 10
    this.scoreText.setText(`${pts} pkt`)
    this.tweens.add({
      targets: this.scoreText,
      scaleX: 1.3, scaleY: 1.3,
      duration: 120, yoyo: true,
    })
  }

  // ─────────────────────── STREAK BANNER ──────────────────────────────────────

  _showStreakBanner() {
    const W = this.W
    const H = this.H

    const bannerBg = this.add.graphics()
    bannerBg.fillStyle(0xF39C12, 0.95)
    bannerBg.fillRoundedRect(W / 2 - 140, H / 2 - 40, 280, 80, 20)

    const text = this.add.text(W / 2, H / 2, '🔥 Passa! Trzy z rzędu!', {
      fontSize: '22px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    bannerBg.setAlpha(0)
    text.setAlpha(0)

    this.tweens.add({
      targets: [bannerBg, text],
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.Out',
      onComplete: () => {
        this.time.delayedCall(1200, () => {
          this.tweens.add({
            targets: [bannerBg, text],
            alpha: 0,
            duration: 300,
            onComplete: () => {
              bannerBg.destroy()
              text.destroy()
            },
          })
        })
      },
    })
  }

  // ─────────────────────────── TŁO ────────────────────────────────────────────

  _drawBackground(W, H) {
    const bg = this.add.graphics()
    bg.fillGradientStyle(0xD4E8FF, 0xD4E8FF, 0xEEF4FF, 0xEEF4FF, 1)
    bg.fillRect(0, 0, W, H)
  }

  _drawClouds(W, H) {
    [
      { x: W * 0.1, y: 35 },
      { x: W * 0.8, y: 28 },
    ].forEach(pos => {
      this.add.text(pos.x, pos.y, '☁️', { fontSize: '30px' })
        .setOrigin(0.5).setAlpha(0.5)
    })
  }

  _drawGround(W, H) {
    const g = this.add.graphics()
    g.fillStyle(0x2ECC71, 1)
    g.fillRect(0, H - 30, W, 30)
  }

  // ─────────────────────── PRZYCISKI UI ───────────────────────────────────────

  _drawBackButton() {
    const bg = this.add.graphics()
    bg.fillStyle(0xFFFFFF, 0.8)
    bg.fillRoundedRect(12, 12, 76, 36, 12)

    this.add.text(50, 30, '← Wróć', {
      fontSize: '13px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    const zone = this.add.rectangle(50, 30, 76, 36, 0x000000, 0)
      .setInteractive({ useHandCursor: true })

    zone.on('pointerdown', () => {
      this.audio.playClick()
      window.dispatchEvent(new CustomEvent('litermistrz:back'))
    })
  }

  _drawMuteButton() {
    const W = this.W
    const muteLabel = this.add.text(W - 14, 54, this.audio.muted ? '🔇' : '🔊', {
      fontSize: '24px',
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true })

    muteLabel.on('pointerdown', () => {
      const nowMuted = this.audio.toggle()
      muteLabel.setText(nowMuted ? '🔇' : '🔊')
    })
  }

  // ─────────────────────────── KONIEC ─────────────────────────────────────────

  _endGame() {
    const stars   = SaveSystem.calcStars(this.correct, TOTAL_ROUNDS)
    const sessions = SaveSystem.incrementSessionCount()
    SaveSystem.addStars(stars)
    SaveSystem.updatePoolLevel()

    SaveSystem.saveSession({
      date:    new Date().toISOString(),
      correct: this.correct,
      total:   TOTAL_ROUNDS,
      stars,
    })

    this.time.delayedCall(400, () => {
      this.scene.start('ResultScene', {
        correct: this.correct,
        total:   TOTAL_ROUNDS,
        stars,
        sessions,
      })
    })
  }
}
