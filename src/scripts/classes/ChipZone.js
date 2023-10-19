import Chip from './Chip';
import textStyle from '../../textStyle.json';

export default class ChipZone {
  constructor(scene, sectors, numbers, colors) {
    this.scene = scene;
    this.sectors = sectors;
    this.numbers = numbers;
    this.colorsChip = colors;
    this.containerButtonClearChipZone = null;
    this.foundMatch = false;
    this.chipArray = [];
    this.create();
  }

  create() {
    this.scene.gameMode === 'roulette' ? this.createCopyArr(this.numbers, this.colorsChip) : null;
    this.createChipZone();
  }

  createCopyArr(numbers, colors) {
    this.valueNumbersWheelCopy = JSON.parse(JSON.stringify(numbers));
    this.valueColorsWheelCopy = JSON.parse(JSON.stringify(colors));

    this.valueNumbersWheelCopy.push('AR');
    this.valueColorsWheelCopy.push(16711680);
    this.valueNumbersWheelCopy.push('AB');
    this.valueColorsWheelCopy.push(0);
  }

  createChipZone() {
    const chipZoneText = this.scene.add.text(170, -80, 'Chip zone', textStyle.chipZoneText);
    this.group = this.scene.add.container(this.scene.x / 2 - 250, this.scene.y / 2 + 100, [chipZoneText]);

    if (this.scene.gameMode === 'roulette') {
      this.createChip(2, 7, 0, this.sectors, this.valueNumbersWheelCopy, this.valueColorsWheelCopy);
    } else if (this.scene.gameMode === 'dice') {
      this.createChip(0, 3, 170, this.sectors, this.numbers, this.colorsChip);
    }
  }

  createChip(zoneColorBet, chipInLine, offsetX, sector, number, color) {
    let countX = 0;
    let countY = 0;

    for (let i = 0; i < sector + zoneColorBet; i += 1) {
      const w = 70;
      const h = 70;
      let x;
      let y;

      if (countX >= chipInLine) {
        countX = 0;
        countY += 1;
      }

      x = countX * 80;
      y = countY * 80;

      let chip = new Chip(this.scene, x + offsetX, y, w, h, typeof color === 'object' ? color[i] : color, number[i]);
      this.group.add(chip);
      this.chipArray.push(chip);

      chip.setCallback(() => {
        if (this.scene.onSetChip(chip)) {
          chip.value += this.scene.stats.currentBet;
          chip.valueText.setText(chip.value);
        }
      });

      countX += 1;
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

  destroyClass() {
    this.group?.destroy();
    this.containerButtonClearChipZone?.destroy();
    this.colors = null;
    this.chipArray.length = 0;
  }
}
