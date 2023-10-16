import textStyle from '../../textStyle.json';

export default class Dice {
  constructor(scene, sectors, numbers, colors) {
    this.scene = scene;
    this.sectors = sectors;
    this.colorSector = colors;
    this.numbers = numbers;
    this.isRoll = false;
    this.spinDuration = 3000;
    this.containerDice = null;
    this.create();
  }

  create() {
    this.createDice();
    this.createButtonOnWheel();
  }

  createDice() {
    let graphics = this.scene.add.graphics().fillStyle(0xaaaaaa).fillRect(0, 0, 300, 300).lineStyle(8, 0xffffff).strokeRect(0, 0, 300, 300);

    this.containerDice = this.scene.add.container(this.scene.x / 2 - 150, this.scene.y / 2 - 440, [graphics]);
  }

  createButtonOnWheel() {
    this.buttonOnDice = this.scene.add.circle(0, 0, 50, 0xaaaaaa).setStrokeStyle(8, 0xffffff);

    this.buttonOnDiceText = this.scene.add.text(0, 0, this.scene.defaultTextButtonDice, textStyle.buttonOnWheelText).setOrigin(0.5);

    this.containerButtonOnDice = this.scene.add
      .container(this.scene.x / 2, 250, [this.buttonOnDice, this.buttonOnDiceText])
      .setSize(85, 85)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.spin();
        },
        this.scene
      );
  }
}
