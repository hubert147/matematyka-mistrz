// UIScene — opcjonalna scena overlay (HUD)
// W tej implementacji HUD jest wbudowany bezpośrednio w GameScene
// Ten plik zostawiony dla przyszłej rozbudowy

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false })
  }

  create() {
    // Placeholder — HUD renderowany przez GameScene
  }
}
