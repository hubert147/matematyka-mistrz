import { PaniSowa } from '../objects/PaniSowa.js'
import { AudioManager } from '../objects/AudioManager.js'
import { SaveSystem } from '../services/SaveSystem.js'

// MenuScene — ekran startowy z Panią Sową

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene')
  }

  create() {
    const W = this.scale.width
    const H = this.scale.height

    this.audio = new AudioManager()

    this._drawBackground(W, H)
    this._drawClouds(W, H)
    this._drawGround(W, H)

    // Pani Sowa
    this.owl = new PaniSowa(this, W / 2, H / 2 - 80)
    this.owl.showBubble('Znajdź właściwą literę!')

    // Tytuł
    this.add.text(W / 2, 70, 'LiterMistrz', {
      fontSize: '42px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#8E44AD',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(W / 2, 115, 'Nauka liter z Panią Sową', {
      fontSize: '17px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
    }).setOrigin(0.5)

    // Statystyki
    this._drawStats(W, H)

    // Przycisk GRAJ!
    this._drawPlayButton(W, H)

    // Przycisk wróć (do React)
    this._drawBackButton(W)

    // Wejście głosowe powitania
    this.time.delayedCall(300, () => {
      this.audio.speak('Cześć! Jestem Pani Sowa. Naciśnij Graj i znajdź właściwą literę!')
    })
  }

  // ──────────────────────────── TŁO ───────────────────────────────────────────

  _drawBackground(W, H) {
    // Gradient — niebo
    const sky = this.add.graphics()
    sky.fillGradientStyle(0xD4E8FF, 0xD4E8FF, 0xEEF4FF, 0xEEF4FF, 1)
    sky.fillRect(0, 0, W, H)
  }

  _drawClouds(W, H) {
    const cloudPositions = [
      { x: W * 0.15, y: H * 0.1, scale: 0.7 },
      { x: W * 0.75, y: H * 0.08, scale: 0.9 },
      { x: W * 0.5,  y: H * 0.05, scale: 0.55 },
    ]
    cloudPositions.forEach(pos => {
      const c = this.add.text(pos.x, pos.y, '☁️', {
        fontSize: `${Math.round(48 * pos.scale)}px`,
      }).setOrigin(0.5).setAlpha(0.7)

      this.tweens.add({
        targets: c,
        x: pos.x + 15,
        duration: 3000 + Math.random() * 2000,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
      })
    })
  }

  _drawGround(W, H) {
    // Trawa
    const ground = this.add.graphics()
    ground.fillStyle(0x2ECC71, 1)
    ground.fillRect(0, H - 50, W, 50)

    // Kwiaty
    const flowers = ['🌸', '🌼', '🌺']
    for (let i = 0; i < 6; i++) {
      this.add.text(
        30 + i * (W / 6),
        H - 38,
        flowers[i % flowers.length],
        { fontSize: '22px' }
      ).setOrigin(0.5)
    }
  }

  _drawStats(W, H) {
    const sessions = SaveSystem.getSessionCount()
    const stars    = SaveSystem.getTotalStars()

    const statsY = H - 110
    const bg = this.add.graphics()
    bg.fillStyle(0xFFFFFF, 0.7)
    bg.fillRoundedRect(W / 2 - 120, statsY - 16, 240, 44, 16)

    this.add.text(W / 2 - 50, statsY + 6, `⭐ ${stars}`, {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#E67E22',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    this.add.text(W / 2 + 50, statsY + 6, `🎮 ${sessions}`, {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#3498DB',
      fontStyle: 'bold',
    }).setOrigin(0.5)
  }

  // ─────────────────────── PRZYCISK GRAJ ──────────────────────────────────────

  _drawPlayButton(W, H) {
    const btnY = H - 175

    const bg = this.add.graphics()
    bg.fillStyle(0xF39C12, 1)
    bg.fillRoundedRect(W / 2 - 110, btnY - 34, 220, 68, 22)

    // Blask
    bg.fillStyle(0xFFFFFF, 0.2)
    bg.fillRoundedRect(W / 2 - 100, btnY - 28, 200, 24, 10)

    const label = this.add.text(W / 2, btnY, '▶  GRAJ!', {
      fontSize: '28px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#FFFFFF',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Interaktywna zona
    const zone = this.add.rectangle(W / 2, btnY, 220, 68, 0x000000, 0)
      .setInteractive({ useHandCursor: true })

    zone.on('pointerdown', () => {
      this.audio.playClick()
      this.tweens.add({
        targets: [bg, label],
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 80,
        yoyo: true,
        onComplete: () => this.scene.start('GameScene'),
      })
    })

    zone.on('pointerover', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1.04, scaleY: 1.04, duration: 100 })
    })

    zone.on('pointerout', () => {
      this.tweens.add({ targets: [bg, label], scaleX: 1, scaleY: 1, duration: 100 })
    })

    // Pulsowanie przycisku
    this.tweens.add({
      targets: [bg, label],
      scaleX: 1.03,
      scaleY: 1.03,
      duration: 900,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
  }

  _drawBackButton(W) {
    const backBg = this.add.graphics()
    backBg.fillStyle(0xECF0F1, 1)
    backBg.fillRoundedRect(12, 12, 80, 38, 14)

    const backLabel = this.add.text(52, 31, '← Wróć', {
      fontSize: '14px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#7F8C8D',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    const backZone = this.add.rectangle(52, 31, 80, 38, 0x000000, 0)
      .setInteractive({ useHandCursor: true })

    backZone.on('pointerdown', () => {
      this.audio.playClick()
      // Powiadom React przez custom event
      window.dispatchEvent(new CustomEvent('litermistrz:back'))
    })
  }
}
