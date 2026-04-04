// Pani Sowa — postać sowy nauczycielki
// Renderowana jako emoji + animacje tween (bez pliku sprite)

export class PaniSowa {
  constructor(scene, x, y) {
    this.scene = scene

    // Kontener — wszystko wewnątrz skaluje się razem
    this.container = scene.add.container(x, y)

    // Cień pod sową
    this.shadow = scene.add.ellipse(0, 52, 90, 25, 0x000000, 0.15)
    this.container.add(this.shadow)

    // Główne emoji sowy
    this.owlText = scene.add.text(0, 0, '🦉', {
      fontSize: '80px',
    }).setOrigin(0.5, 0.5)
    this.container.add(this.owlText)

    // Dymek mowy (ukryty na start)
    this.bubble    = null
    this.bubbleText = null
    this._buildBubble()

    // Animacja idle — lekkie unoszenie
    this._idleAnim()
  }

  // ─────────────────────────── DYMEK ──────────────────────────────────────────

  _buildBubble() {
    const g = this.scene.add.graphics()
    g.fillStyle(0xFFFFFF, 0.95)
    g.lineStyle(3, 0xF39C12, 1)

    // Zaokrąglony prostokąt
    g.fillRoundedRect(-90, -120, 180, 60, 14)
    g.strokeRoundedRect(-90, -120, 180, 60, 14)

    // Ogon dymka
    g.fillTriangle(-10, -62, 10, -62, 0, -44)

    g.setVisible(false)
    this.container.add(g)
    this.bubble = g

    this.bubbleText = this.scene.add.text(0, -90, '', {
      fontSize: '22px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#2C3E50',
      fontStyle: 'bold',
    }).setOrigin(0.5, 0.5)
    this.bubbleText.setVisible(false)
    this.container.add(this.bubbleText)
  }

  showBubble(text) {
    if (this.bubble) {
      this.bubble.setVisible(true)
      this.bubbleText.setText(text)
      this.bubbleText.setVisible(true)

      // Animacja pojawienia się
      this.bubble.setAlpha(0)
      this.bubbleText.setAlpha(0)
      this.scene.tweens.add({
        targets: [this.bubble, this.bubbleText],
        alpha: 1,
        duration: 200,
        ease: 'Power2',
      })
    }
  }

  hideBubble() {
    if (this.bubble) {
      this.scene.tweens.add({
        targets: [this.bubble, this.bubbleText],
        alpha: 0,
        duration: 150,
        onComplete: () => {
          this.bubble?.setVisible(false)
          this.bubbleText?.setVisible(false)
        },
      })
    }
  }

  // ──────────────────────────── STANY ─────────────────────────────────────────

  setHappy() {
    this.owlText.setText('🦉')
    this._stopCurrentAnim()

    // Podskocz i obróć
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 30,
      duration: 180,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => this._idleAnim(),
    })
    this.scene.tweens.add({
      targets: this.owlText,
      scaleX: 1.3,
      scaleY: 1.3,
      duration: 150,
      yoyo: true,
    })
  }

  setSad() {
    this._stopCurrentAnim()
    // Przechyl lekko
    this.scene.tweens.add({
      targets: this.owlText,
      angle: -15,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.scene.time.delayedCall(800, () => {
          this.scene.tweens.add({
            targets: this.owlText,
            angle: 0,
            duration: 200,
            onComplete: () => this._idleAnim(),
          })
        })
      },
    })
  }

  setThinking() {
    this._stopCurrentAnim()
    this.scene.tweens.add({
      targets: this.owlText,
      angle: 10,
      duration: 300,
      yoyo: true,
      repeat: 1,
      onComplete: () => this._idleAnim(),
    })
  }

  // ──────────────────────────── ANIMACJE ──────────────────────────────────────

  _idleAnim() {
    if (!this.scene || !this.container?.active) return
    this._currentTween = this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 8,
      duration: 1200,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })
  }

  _stopCurrentAnim() {
    if (this._currentTween) {
      this._currentTween.stop()
      this._currentTween = null
    }
  }

  // ─────────────────────────── POZYCJA ────────────────────────────────────────

  get x() { return this.container.x }
  get y() { return this.container.y }

  setPosition(x, y) {
    this.container.setPosition(x, y)
  }

  destroy() {
    this._stopCurrentAnim()
    this.container.destroy()
  }
}
