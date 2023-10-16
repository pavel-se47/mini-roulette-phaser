import Chip from './Chip';
import Colors from './Colors';
import textStyle from '../../textStyle.json';

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
    const chipZoneText = this.scene.add.text(170, -80, 'Chip zone', textStyle.chipZoneText);
    this.group = this.scene.add.container(this.scene.x / 2 - 250, this.scene.y / 2 + 100, [chipZoneText]);

    let countX = 0;
    let countY = 0;

    if (this.scene.gameMode === 'roulette') {
      for (let i = 0; i < this.scene.sectors + 2; i += 1) {
        const w = 70;
        const h = 70;
        let x;
        let y;

        if (countX >= 7) {
          countX = 0;
          countY += 1;
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
        });

        countX += 1;
      }
    } else if (this.scene.gameMode === 'dice') {
      for (let i = 0; i < this.scene.sectorsDice; i += 1) {
        const w = 70;
        const h = 70;
        let x;
        let y;

        if (countX >= 3) {
          countX = 0;
          countY += 1;
        }

        x = countX * 80;
        y = countY * 80;

        let chip = new Chip(this.scene, x + 160, y, w, h, this.scene.valueColorsDice, this.scene.valueNumbersDice[i]);
        this.group.add(chip);
        this.chipArray.push(chip);

        chip.setCallback(() => {
          if (this.onSetChip(chip)) {
            chip.value += this.scene.stats.currentBet;
            chip.valueText.setText(chip.value);
          }
        });

        countX += 1;
      }
    }
  }

  onSetChip(chip) {
    let allBets = this.scene.state.valueChip;

    if (!this.scene.checkBet(chip)) {
      return false;
    }

    if (this.scene.gameMode === 'roulette') {
      if (this.scene.wheel.isSpinning) {
        return;
      }
    } else if (this.scene.gameMode === 'dice') {
      if (this.scene.dice.isRoll) {
        return;
      }
    }

    let value = chip.number;
    let currentBet = this.scene.stats.currentBet;
    let totalBet = this.scene.stats.totalBet;
    let balance = this.scene.stats.balance;
    const existingBet = allBets.find(obj => obj.value === value);

    if (existingBet) {
      existingBet.currentBet += this.scene.stats.currentBet;
    } else {
      allBets.push({
        value: value,
        color: this.colors.currentColor(value),
        currentBet: this.scene.stats.currentBet,
      });
    }

    if (totalBet + currentBet > balance) {
      this.scene.notifications.alertNotification('Not enough funds to bet!');
      return;
    }
    this.scene.state.valueWheel = null;
    this.scene.stats.setTotalBetValue((totalBet += currentBet));
    this.scene.betZone.calculateTotalBet();
    this.scene.onSetTextButton();
    return true;
  }

  createButtonClearChipZone() {
    const clearChipZoneRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);
    const clearChipZoneText = this.scene.add.text(0, 0, 'Reset all', textStyle.resetButtonText).setOrigin(0.5);

    this.containerButtonClearChipZone = this.scene.add
      .container(this.scene.x / 2 + 400, 965, [clearChipZoneRectangle, clearChipZoneText])
      .setSize(180, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.setDefaultValue();
        },
        this.scene
      );
  }
}
