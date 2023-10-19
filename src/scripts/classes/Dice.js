import textStyle from '../../textStyle.json';

export default class Dice {
  constructor(scene, sectors, numbers, colors) {
    this.scene = scene;
    this.sectors = sectors;
    this.numbers = numbers;
    this.colors = colors;
    this.isPlay = false;
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
      this.diceWin.destroy();
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

    this.diceWin = this.scene.add.sprite(this.scene.x / 2, 250, 'dice' + i).setScale(0.6);
  }

  setWinImgDice() {
    for (let i = 1; i <= this.numbers.length; i += 1) {
      if (this.scene.state.valueWheel.value === i) {
        this.createDiceWin(i);
        return;
      }
    }
  }

  createButtonOnDice() {
    this.buttonOnDice = this.scene.add.circle(0, 0, 50, this.scene.defaultColorButtonDice).setStrokeStyle(8, 0xffffff);
    this.buttonOnDiceText = this.scene.add.text(0, 0, this.scene.defaultTextButtonDice, textStyle.buttonOnWheelText).setOrigin(0.5);
    this.containerButtonOnDice = this.scene.add
      .container(this.scene.x / 2, 850, [this.buttonOnDice, this.buttonOnDiceText])
      .setSize(85, 85)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          if (!this.isPlay) {
            this.scene.spin(this.sectors);
          }
        },
        this.scene
      );
  }

  rotation() {
    if (!this.isPlay) {
      this.isPlay = true;
      this.tween = this.scene.tweens.add({
        targets: this.diceDefault,
        angle: 1080,
        duration: this.rollDuration,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.isPlay = false;
        },
      });
    }
  }

  destroyClass() {
    this.diceDefault?.destroy();
    this.diceWin?.destroy();
    this.containerButtonOnDice?.destroy();
    this.tween?.destroy();
  }
}
