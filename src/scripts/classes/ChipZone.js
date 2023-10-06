import Chip from './Chip';
import Colors from './Colors';
import limits from '../../limits.json';

export default class ChipZone {
  constructor(scene) {
    this.scene = scene;
    this.containerButtonClearChipZone = null;
    this.colors = new Colors(this);
    this.foundMatch = false;
  }

  createChipZone() {
    const chipZoneText = this.scene.add.text(this.scene.x / 2 - 80, this.scene.y / 2 + 30, 'Chip zone', {
      font: 'bold 30px Arial',
      fill: 'white',
      align: 'center',
    });

    const valueNumbersWheelCopy = JSON.parse(JSON.stringify(this.scene.valueNumbersWheel));
    const valueColorsWheelCopy = JSON.parse(JSON.stringify(this.scene.valueColorsWheel));

    valueNumbersWheelCopy.push('AR');
    valueColorsWheelCopy.push(16711680);
    valueNumbersWheelCopy.push('AB');
    valueColorsWheelCopy.push(0);

    for (let i = 0; i < this.scene.sectors + 2; i += 1) {
      const w = 70;
      const h = 70;
      let x;
      let y;

      if (i <= 6) {
        x = 720 + i * 80;
        y = this.scene.y / 2 + 110;
      } else if (i <= 13) {
        x = 160 + i * 80;
        y = this.scene.y / 2 + 190;
      } else if (i <= 20) {
        x = -400 + i * 80;
        y = this.scene.y / 2 + 270;
      } else if (i <= 27) {
        x = -960 + i * 80;
        y = this.scene.y / 2 + 350;
      } else if (i <= 34) {
        x = -1520 + i * 80;
        y = this.scene.y / 2 + 430;
      } else {
        x = -2080 + i * 80;
        y = this.scene.y / 2 + 510;
      }

      // const chipAR = new Chip(this.scene, 980, 970, 70, 70, '0xff0000', 'AR')
      //   .setSize(70, 70)
      //   .setOrigin(0.5)
      //   .setInteractive()
      //   .on(
      //     'pointerdown',
      //     () => {
      //       this.onSetChip(chipAR.n);
      //     },
      //     this.scene
      //   );

      // const chipAB = new Chip(this.scene, 980, 890, 70, 70, '0x000000', 'AB')
      //   .setSize(70, 70)
      //   .setOrigin(0.5)
      //   .setInteractive()
      //   .on(
      //     'pointerdown',
      //     () => {
      //       this.onSetChip(chipAB.n);
      //     },
      //     this.scene
      //   );

      const chipNumber = new Chip(this.scene, x, y, w, h, valueColorsWheelCopy[i], valueNumbersWheelCopy[i])
        .setSize(w, h)
        .setOrigin(0.5)
        .setInteractive()
        .on(
          'pointerdown',
          () => {
            this.onSetChip(chipNumber.n);
          },
          this.scene
        );
    }
  }

  onSetChip(value) {
    if (this.scene.checkBet(value)) {
      if (!this.foundMatch) {
        (this.scene.state.valueChip = [
          ...this.scene.state.valueChip,
          {
            value: value,
            color: this.colors.currentColor(value),
            currentBet: this.scene.state.currentBet,
          },
        ]),
          (this.scene.state.balance -= this.scene.state.currentBet),
          this.scene.stats.createStats(this.scene);
        this.scene.state.valueWheel = null;
      }

      this.scene.betZone.onSetBet();
      this.scene.betZone.calculateGeneralBetSum();
      this.onSetDefaultTextButton();
    }
  }

  createButtonClearChipZone() {
    const clearChipZoneRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);

    const clearChipZoneText = this.scene.add
      .text(0, 0, 'Clear chip zone', {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      })
      .setOrigin(0.5);

    this.containerButtonClearChipZone = this.scene.add
      .container(this.scene.x / 2 + 400, 965, [clearChipZoneRectangle, clearChipZoneText])
      .setSize(180, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          if (!this.scene.wheel.isSpinning) {
            this.scene.state.balance += this.scene.state.generalBetSum;
            this.scene.state.valueChip = [];
            this.scene.state.valueWheel = null;
            this.scene.state.generalBetSum = 0;
            this.scene.state.currentBet = 10;
            this.scene.state.limit = limits.numbers;
            this.scene.state.currentWin = 0;
            this.scene.betZone.destroyBets();
            this.onSetDefaultTextButton();
            this.scene.stats.createStats(this.scene);
          }
        },
        this.scene
      );
  }

  onSetDefaultTextButton() {
    this.scene.wheel.buttonOnWheelText.setText('SPIN');
    this.scene.wheel.buttonOnWheel.fillColor = '0xffa500';
  }
}
