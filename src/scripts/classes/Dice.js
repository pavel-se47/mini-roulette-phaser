import textStyle from '../../textStyle.json';

export default class Dice {
  constructor(scene, sectors, numbers) {
    this.scene = scene;
    this.sectors = sectors;
    this.numbers = numbers;
    this.isRoll = false;
    this.rollDuration = 2000;
    this.containerDice = null;
    this.create();
  }

  create() {
    this.createDiceDefault();
    this.createButtonOnDice();
  }

  createDiceDefault() {
    if (this.diceWin) {
      this.diceWin.setVisible(false);
    }

    if (this.diceDefault) {
      this.diceDefault.setVisible(true);
    } else {
      this.diceDefault = this.scene.add.sprite(this.scene.x / 2, 250, 'dice').setScale(0.7);
    }
  }

  createDiceWin(i) {
    if (this.diceDefault) {
      this.diceDefault.setVisible(false);
    }

    if (this.diceWin) {
      this.diceWin.setVisible(true);
    } else {
      this.diceWin = this.scene.add.sprite(this.scene.x / 2, 250, 'dice' + i).setScale(0.6);
    }
  }

  setWinImgDice() {
    for (let i = 1; i <= this.numbers.length; i += 1) {
      if (this.scene.state.valueWheel.value === i) {
        this.createDiceWin(i);
      }
    }
  }

  createButtonOnDice() {
    this.buttonOnDice = this.scene.add.circle(0, 0, 50, this.scene.defaultTextButtonDice).setStrokeStyle(8, 0xffffff);

    this.buttonOnDiceText = this.scene.add.text(0, 0, this.scene.defaultTextButtonDice, textStyle.buttonOnWheelText).setOrigin(0.5);

    this.containerButtonOnDice = this.scene.add
      .container(this.scene.x / 2, 850, [this.buttonOnDice, this.buttonOnDiceText])
      .setSize(85, 85)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          if (!this.isRoll) {
            this.scene.spin();
          }
        },
        this.scene
      );
  }

  rotation() {
    if (!this.isRoll) {
      this.isRoll = true;
      this.roll = this.scene.tweens.add({
        targets: this.diceDefault,
        angle: 1080,
        duration: this.rollDuration,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.isRoll = false;
        },
      });
    }
  }
}
