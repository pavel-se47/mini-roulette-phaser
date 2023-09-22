export default class StartScene extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  create() {
    this.createBackground();
    this.createButton();
    this.setEvent();
  }

  createBackground() {
    this.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "bg0"
    );
  }

  createButton() {
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

  setEvent() {
    this.buttonPlay.on("pointerdown", this.play, this);
  }

  play() {
    this.scene.start("GameScene");
  }
}
