import Chip from './Chip';
import Colors from './Colors';

export default class ChipZone {
  constructor(scene) {
    this.scene = scene;
    this.containerButtonClearChipZone = null;
    this.colors = new Colors(this);
    this.foundMatch = false;
    this.chipArray = [];
    this.create();
  }

  create() {
    this.createChipZone();
    this.createButtonClearChipZone();
  }

  createChipZone() {
    this.group = this.scene.add.container(this.scene.x / 2 - 250, this.scene.y / 2 + 100);

    const chipZoneText = this.scene.add.text(160, -80, 'Chip zone', {
      font: 'bold 30px Arial',
      fill: 'white',
      align: 'center',
    });

    this.group.add(chipZoneText);

    let countY = 0,
      countX = 0;

    for (let i = 0; i < this.scene.sectors + 2; i += 1) {
      const w = 70;
      const h = 70;
      let x;
      let y;

      if (countX >= 7) {
        countX = 0;
        countY++;
      }

      x = countX * 80;
      y = countY * 80;

      let chip = new Chip(this.scene, x, y, w, h, this.scene.valueColorsWheelCopy[i], this.scene.valueNumbersWheelCopy[i]);
      this.group.add(chip);
      this.chipArray.push(chip);

      chip.setCallback(() => {
        if (this.onSetChip(chip)) {
          chip.value += this.scene.stats.currentBet;
          chip.valueText.setText(chip.value);
        }
      }, this.scene);

      countX++;
    }
  }

  onSetChip(chip) {
    if (!this.scene.checkBet(chip)) {
      return false;
    }
    let value = chip.number;

    this.scene.state.valueChip = [
      ...this.scene.state.valueChip,
      {
        value: value,
        color: this.colors.currentColor(value),
        currentBet: this.scene.stats.currentBet,
      },
    ];

    if (this.scene.stats.generalBetSum + this.scene.stats.currentBet > this.scene.stats.balance) {
      this.scene.notifications.alertNotification('Not enough funds to bet!');
      return;
    }
    this.scene.stats.setTotalBetValue((this.scene.stats.totalBet += this.scene.stats.currentBet));
    this.scene.state.valueWheel = null;
    this.scene.betZone.calculateGeneralBetSum();
    this.scene.onSetTextButton(this.scene.defaultTextButton, this.scene.defaultColorButton);
    return true;
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
          this.setValue();
        },
        this.scene
      );
  }

  setValue() {
    if (!this.scene.wheel.isSpinning) {
      this.scene.state.valueChip = [];
      this.scene.state.valueWheel = null;
      this.scene.stats.setTotalBetValue(0);
      this.scene.stats.setCurrentBetValue(10);
      this.scene.stats.setCurrentWinValue(0);
      this.deleteValue();
      this.scene.onSetTextButton(this.scene.defaultTextButton, this.scene.defaultColorButton);
    }
  }

  deleteValue() {
    this.chipArray.forEach(obj => {
      if (obj.value) {
        obj.value = 0;
        obj.valueText.setText('');
      }
    });
  }
}
