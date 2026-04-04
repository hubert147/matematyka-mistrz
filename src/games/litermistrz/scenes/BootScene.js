// BootScene — ekran ładowania, inicjalizacja

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload() {
    const W = this.scale.width
    const H = this.scale.height

    // Tło
    this.add.rectangle(W / 2, H / 2, W, H, 0xEEF4FF)

    // Sowa ładowania
    const owl = this.add.text(W / 2, H / 2 - 80, '🦉', {
      fontSize: '80px',
    }).setOrigin(0.5)

    // Animacja sowy
    this.tweens.add({
      targets: owl,
      y: H / 2 - 100,
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1,
    })

    // Tekst ładowania
    this.add.text(W / 2, H / 2 + 30, 'Pani Sowa przygotowuje lekcję...', {
      fontSize: '18px',
      fontFamily: 'Nunito, Arial, sans-serif',
      color: '#5D6D7E',
      fontStyle: 'bold',
    }).setOrigin(0.5)

    // Pasek postępu — tło
    const barBg = this.add.graphics()
    barBg.fillStyle(0xD5DBDB, 1)
    barBg.fillRoundedRect(W / 2 - 150, H / 2 + 80, 300, 18, 9)

    // Pasek postępu — wypełnienie
    const bar = this.add.graphics()

    this.load.on('progress', (value) => {
      bar.clear()
      bar.fillStyle(0xF39C12, 1)
      bar.fillRoundedRect(W / 2 - 150, H / 2 + 80, 300 * value, 18, 9)
    })

    // Brak prawdziwych assetów — gra rysuje wszystko graficznie
    // Tutaj możemy załadować opcjonalne dźwięki/obrazki jeśli istnieją
    this.load.setPath('/voice/')
    // Nie robimy load.audio() bo pliki mogą nie istnieć jeszcze
    // AudioManager korzysta z Web Audio API jako fallback
  }

  create() {
    // Krótkie opóźnienie dla efektu
    this.time.delayedCall(400, () => {
      this.scene.start('MenuScene')
    })
  }
}
