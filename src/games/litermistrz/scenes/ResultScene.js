import { AudioManager } from '../objects/AudioManager.js'
import { PaniSowa } from '../objects/PaniSowa.js'
import { SaveSystem } from '../services/SaveSystem.js'

// ResultScene — ekran wyników po sesji

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene')
  }

  init(data) {
    this.correct  = data.correct  || 0
    this.total    = data.total    || 10
    this.stars    = data.stars    || 0
    this.sessions = data.sessions || 1
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height
    this.W = W
    this.H = H

    this.audio = new AudioManager()

    this._drawBackground(W, H)

    // Pani Sowa (u góry)
    this.owl = new PaniSowa(this, W / 2, 120)

    if (this.stars === 3) {
      this.owl.setHappy()
      this.owl.showBubble('Wspaniale! 🌟🌟🌟')
      this.time.delayedCall(300, () => this.audio.speak('Wspaniale! Wszystko dobrze!'))
    } else if (this.stars >= 2) {
      this.owl.setHappy()
      this.owl.showBubble('Świetnie! Tak trzymaj!')
      this.time.delayedCall(300, () => this.audio.speak('Świetnie! Tak trzymaj!'))
    } else {
      this.owl.setThinking()
      this.owl.showBubble('Ćwicz dalej!')
      this.time.delayedCall(300, () => this.audio.speak('Ćwicz dalej! Dasz radę!'))
    }

    // Karta wyników
    this._drawResultCard(W, H)

    // Gwiazdki
    this._drawStars(W, H)

    // Wynik numeryczny
    this._drawScore(W, H)

    // Przycisk ponownie
    this._drawPlayAgainButton(W, H)

    // Przycisk wróć do menu
    this._drawMenuButton(W, H)

    // Fajerwerki dla 3 gwiazdek
    if (this.stars === 3) {
      this.time.delayedCall(400, () => this._launchFireworks(W, H))
    }

    // Animacja gwiazdek z opóźnieniem
    this._animateStarsIn()
  }

  // ──────────────────────── KARTA WYNIKÓW ─────────────────────────────────────

  _drawResultCard(W, H) {
    const cardY = 240
    const card  = this.add.graphics()
    card.fillStyle(0xFFFFFF, 0.95)
    card.fillRoundedRect(W / 2 - 160, cardY, 320, 220, 24)
    card.lineStyle(3, 0xF39C12, 0.5)
    card.strokeRoundedRect(W / 2 - 160, cardY, 320, 220, 24)
  }

  _drawStars(W, H) {
    const starY   = 280
    const spacing = 72
    this.starObjects = []

    for (let i = 0; i < 3; i++) {
      const filled = i < this.stars
      const star   = this.add.text(
        W / 2 - spacing + i * spacing,
        starY,
        filled ? '⭐' : '☆',
        {
          fontSize: filled ? '52px' : '46px',
          color: filled ? '#F39C12' : '#BDC3C7',
        }
      ).setOrigin(0.5).setScale(0)

      this.starObjects.push(star)
    }
  }

  _animateStarsIn() {
    this.starObjects.forEach((star, i) => {
      this.time.delayedCall(300 + i * 220, () => {
        this.tweens.add({
          targets: star,
          scaleX: 1,
          scaleY: 1,
          duration: 300,
          ease: 'Back.Out',
          onComplete: () => {
            if (i < this.stars) {
              this.audio.playStar()
              this.tweens.add({
                targets: star,
                angle: 15,
                duration: 100,
                yoyo: true,
                repeat: 1,
              })
            }
          },
        })
      })
    })
  }

  _drawScore(W, H) {
    // Wynik
    this.add.text(W / 2, 365, `${this.correct} / ${this.total}`, {
      fontSize: '54px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: this.stars >= 2 ? '#27AE60' : this.stars === 1 ? '#E67E22' : '#E74C3C',
      fontStyle: 'bold',
    }).setOrigin(0.5).setAlpha(0).setScale(0.6)

    this.tweens.add({
      targets: this.children.list[this.children.list.length - 1],
      alpha: 1,
      scaleX: 1,
      scaleY: 1,
      duration: 400,
      delay: 900,
      ease: 'Back.Out',
    })

    this.add.text(W / 2, 416, 'poprawnych odpowiedzi', {
      fontSize: '16px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
    }).setOrigin(0.5)

    // Łączne gwiazdki
    const total = SaveSystem.getTotalStars()
    this.add.text(W / 2, 445, `Łącznie gwiazdek: ⭐ ${total}`, {
      fontSize: '15px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#E67E22',
      fontStyle: 'bold',
    }).setOrigin(0.5)
  }

  // ───────────────────────── PRZYCISKI ────────────────────────────────────────

  _drawPlayAgainButton(W, H) {
    const y = H - 165

    const bg = this.add.graphics()
    bg.fillStyle(0xF39C12, 1)
    bg.fillRoundedRect(W / 2 - 130, y - 28, 260, 56, 20)

    const label = this.add.text(W / 2, y, '🔄  Zagraj ponownie', {
      fontSize: '22px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    const zone = this.add.rectangle(W / 2, y, 260, 56, 0x000000, 0)
      .setInteractive({ useHandCursor: true })

    zone.on('pointerdown', () => {
      this.audio.playClick()
      this.scene.start('GameScene')
    })

    zone.on('pointerover', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1.04, scaleY: 1.04, duration: 100 })
    })

    zone.on('pointerout', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1, scaleY: 1, duration: 100 })
    })
  }

  _drawMenuButton(W, H) {
    const y = H - 100

    const bg = this.add.graphics()
    bg.fillStyle(0xECF0F1, 1)
    bg.fillRoundedRect(W / 2 - 110, y - 24, 220, 48, 18)

    const label = this.add.text(W / 2, y, '🏠  Menu główne', {
      fontSize: '19px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    const zone = this.add.rectangle(W / 2, y, 220, 48, 0x000000, 0)
      .setInteractive({ useHandCursor: true })

    zone.on('pointerdown', () => {
      this.audio.playClick()
      this.scene.start('MenuScene')
    })

    zone.on('pointerover', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1.03, scaleY: 1.03, duration: 100 })
    })

    zone.on('pointerout', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1, scaleY: 1, duration: 100 })
    })
  }

  // ──────────────────────── FAJERWERKI (3★) ───────────────────────────────────

  _launchFireworks(W, H) {
    const duration = 3000
    const end      = Date.now() + duration

    const emojis = ['🌟', '⭐', '✨', '🎉', '🎊', '💫']

    const frame = () => {
      if (Date.now() > end) return
      if (!this.scene.isActive()) return

      for (let i = 0; i < 3; i++) {
        const x = Math.random() * W
        const y = Math.random() * H * 0.6
        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
        const size  = 20 + Math.floor(Math.random() * 20)

        const particle = this.add.text(x, y, emoji, { fontSize: `${size}px` })
          .setOrigin(0.5)

        this.tweens.add({
          targets: particle,
          y: y + 80 + Math.random() * 60,
          alpha: 0,
          duration: 900 + Math.random() * 400,
          ease: 'Power2',
          onComplete: () => particle.destroy(),
        })
      }

      requestAnimationFrame(frame)
    }

    frame()
    this.audio.playStreak()
  }

  // ─────────────────────────── TŁO ────────────────────────────────────────────

  _drawBackground(W, H) {
    const bg = this.add.graphics()
    bg.fillGradientStyle(0xFFF9F0, 0xFFF9F0, 0xFFF0D4, 0xFFF0D4, 1)
    bg.fillRect(0, 0, W, H)

    // Trawa
    const ground = this.add.graphics()
    ground.fillStyle(0x2ECC71, 1)
    ground.fillRect(0, H - 30, W, 30)
  }
}
