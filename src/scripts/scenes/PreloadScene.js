export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload() {
    this.createBackground();
  }

  create() {
    this.scene.start("Start");
  }

  createBackground() {
    this.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "bg0"
    );
  }
}
