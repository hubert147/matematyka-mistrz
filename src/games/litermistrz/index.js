import Phaser from 'phaser'
import { BootScene }   from './scenes/BootScene.js'
import { MenuScene }   from './scenes/MenuScene.js'
import { GameScene }   from './scenes/GameScene.js'
import { UIScene }     from './scenes/UIScene.js'
import { ResultScene } from './scenes/ResultScene.js'

// Konfiguracja gry Phaser — portret, mobile-first

export function createLiterMistrzGame(parent) {
  const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 800,
    backgroundColor: '#EEF4FF',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent,
    },
    scene: [BootScene, MenuScene, GameScene, UIScene, ResultScene],
    render: {
      antialias: true,
      pixelArt: false,
    },
    // Brak fizyki — gra nie potrzebuje
    // physics: { default: 'arcade' },
  }

  return new Phaser.Game(config)
}
