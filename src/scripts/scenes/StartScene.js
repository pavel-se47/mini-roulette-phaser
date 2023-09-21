export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  create() {
    this.createBackground();
    this.createButtons();
    this.setEvents();
  }

  createBackground() {
    this.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "chipboard"
    );
  }

  createButtons() {
    this.buttonPlay = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "PLAY",
        {
          font: "bold 60px Arial",
          fill: "white",
        }
      )
      .setOrigin(0.5)
      .setInteractive();
  }

  setEvents() {
    this.buttonPlay.on("pointerdown", this.play, this);
  }

  play() {
    this.scene.start("GameScene");
  }
}
