import textStyle from '../../textStyle.json';

export default class Button {
  constructor(scene, x, y, text) {
    this.scene = scene;
    this.create(x, y, text);
  }

  create(x, y, text) {
    const buttonBack = this.scene.add.rectangle(0, 0, 200, 80, 0xffffff);
    const buttonText = this.scene.add.text(0, 0, text, textStyle.startGameButton).setOrigin(0.5);
    this.containerButton = this.scene.add.container(x, y, [buttonBack, buttonText]).setSize(200, 80);
  }

  setActionDown(cb, cbContext) {
    if (cb) {
      this.enable();
    } else {
      this.disable();
    }
    this.containerButton.on('pointerdown', cb, cbContext);
  }

  enable() {
    this.containerButton.setInteractive();
  }

  disable() {
    this.containerButton.disableInteractive();
  }

  destroyClass() {
    this.containerButton?.destroy();
  }
}
