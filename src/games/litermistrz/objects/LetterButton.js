import { BUTTON_COLORS } from '../data/letters.js'

// Przycisk litery — zaokrąglony, kolorowy, z animacją naciśnięcia
// Pool-friendly: może być reset() i użyty ponownie

const BTN_SIZE   = 155
const BTN_RADIUS = 24
const FONT_SIZE  = '72px'

export class LetterButton {
  constructor(scene, x, y, colorIdx = 0) {
    this.scene    = scene
    this.colorIdx = colorIdx
    this.enabled  = false
    this.letter   = ''
    this.onTap    = null

    // Kontener
    this.container = scene.add.container(x, y)

    // Tło — zaokrąglony prostokąt
    const half = BTN_SIZE / 2
    this.bg = scene.add.graphics()
    this._drawBg(BUTTON_COLORS[colorIdx], false)
    this.container.add(this.bg)

    // Cień
    this.shadow = scene.add.ellipse(4, 8, BTN_SIZE - 10, 18, 0x000000, 0.2)
    this.container.addAt(this.shadow, 0)   // za tłem

    // Tekst litery
    this.label = scene.add.text(0, 0, '', {
      fontSize: FONT_SIZE,
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5)
    this.container.add(this.label)

    // Strefa interaktywna
    this.hitZone = scene.add.rectangle(0, 0, BTN_SIZE, BTN_SIZE, 0x000000, 0)
      .setInteractive({ useHandCursor: true })
    this.container.add(this.hitZone)

    this._bindEvents()
    this.container.setVisible(false)
  }

  // ──────────────────────────── SETUP ─────────────────────────────────────────

  setup(letter, isCorrect, onTap) {
    this.letter    = letter
    this.isCorrect = isCorrect
    this.onTap     = onTap
    this.enabled   = true
    this.answered  = false

    this.label.setText(letter)
    this._drawBg(BUTTON_COLORS[this.colorIdx], false)
    this.container.setScale(1)
    this.container.setAlpha(1)
    this.container.setVisible(true)

    // Animacja wejścia — podskocz
    this.container.setScale(0.6)
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1,
      scaleY: 1,
      duration: 250,
      ease: 'Back.Out',
    })
  }

  hide() {
    this.enabled = false
    this.container.setVisible(false)
  }

  // ───────────────────────── ODPOWIEDŹ ────────────────────────────────────────

  showCorrect() {
    this._drawBg(0x27AE60, true)   // zielony
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.12,
      scaleY: 1.12,
      duration: 120,
      yoyo: true,
    })
  }

  showWrong() {
    this._drawBg(0xE74C3C, true)   // czerwony
    this.scene.tweens.add({
      targets: this.container,
      x: this.container.x - 8,
      duration: 60,
      yoyo: true,
      repeat: 2,
    })
  }

  disable() {
    this.enabled  = false
    this.answered = true
    this.container.setAlpha(0.6)
  }

  // ──────────────────────────── EVENTY ────────────────────────────────────────

  _bindEvents() {
    this.hitZone.on('pointerdown', () => {
      if (!this.enabled || this.answered) return
      this._pressAnimation()
      this.onTap?.(this.letter, this.isCorrect)
    })

    this.hitZone.on('pointerover', () => {
      if (!this.enabled) return
      this.scene.tweens.add({
        targets: this.container,
        scaleX: 1.06,
        scaleY: 1.06,
        duration: 100,
      })
    })

    this.hitZone.on('pointerout', () => {
      if (!this.enabled) return
      this.scene.tweens.add({
        targets: this.container,
        scaleX: 1,
        scaleY: 1,
        duration: 100,
      })
    })
  }

  _pressAnimation() {
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 0.9,
      scaleY: 0.9,
      duration: 80,
      yoyo: true,
      ease: 'Power2',
    })
  }

  // ──────────────────────── RYSOWANIE TŁA ─────────────────────────────────────

  _drawBg(color, highlight) {
    this.bg.clear()
    const half = BTN_SIZE / 2

    // Dolna krawędź (głębokość)
    this.bg.fillStyle(this._darken(color, 40), 1)
    this.bg.fillRoundedRect(-half, -half + 5, BTN_SIZE, BTN_SIZE, BTN_RADIUS)

    // Główny prostokąt
    this.bg.fillStyle(color, 1)
    this.bg.fillRoundedRect(-half, -half, BTN_SIZE, BTN_SIZE - 5, BTN_RADIUS)

    // Blask na górze
    this.bg.fillStyle(0xFFFFFF, 0.15)
    this.bg.fillRoundedRect(-half + 8, -half + 8, BTN_SIZE - 16, 30, 10)

    if (highlight) {
      this.bg.lineStyle(4, 0xFFFFFF, 0.8)
      this.bg.strokeRoundedRect(-half, -half, BTN_SIZE - 5, BTN_SIZE - 5, BTN_RADIUS)
    }
  }

  _darken(color, amount) {
    const r = Math.max(0, ((color >> 16) & 0xFF) - amount)
    const g = Math.max(0, ((color >> 8)  & 0xFF) - amount)
    const b = Math.max(0, (color          & 0xFF) - amount)
    return (r << 16) | (g << 8) | b
  }

  destroy() {
    this.container.destroy()
  }
}
