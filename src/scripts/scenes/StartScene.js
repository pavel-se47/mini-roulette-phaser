export default class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.createBackground();
    this.createButtons();
  }

  createBackground() {
    this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg0');
  }

  createButtons() {
    this.buttonPlay = this.add
      .text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'PLAY', {
        font: 'bold 60px Arial',
        fill: 'white',
      })
      .setOrigin(0.5)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.start('GameScene');
        },
        this
      );
  }
}
