import Chip from './Chip';
import textStyle from '../../textStyle.json';

export default class Dinamics {
  constructor(scene, gameMode, objClass, sectors, numbers, colors, colorsStart) {
    this.scene = scene;
    this.gameMode = gameMode;
    this.objClass = objClass;
    this.sectors = sectors;
    this.numbers = numbers;
    this.colors = colors;
    this.colorsStart = colorsStart;
    this.sectorCountValue = [5, 12, 19, 26, 33, 37];
    this.sectorCountValueColor = '0xffa500';
    this.create();
  }

  create() {
    this.createSectorDinamics();
    this.createInput();
  }

  createSectorDinamics() {
    const dinamicsRectangleMain = this.scene.add.rectangle(0, 0, 300, 80, 0xffffff);
    const dinamicsTextMain = this.scene.add.text(-110, -10, 'Select sectors for wheel', textStyle.sectorDinamicsText);
    const dinamicsRectangleCurr = this.scene.add.rectangle(0, 450, 300, 80, 0xffffff);
    const dinamicsTextCurr = this.scene.add.text(-100, 430, 'Current sector count \n' + this.sectors, textStyle.sectorDinamicsText);

    this.dinamicsSectorGroup = this.scene.add.container(this.scene.x / 2 - 700, this.scene.y / 2 - 30, [
      dinamicsRectangleMain,
      dinamicsTextMain,
      dinamicsRectangleCurr,
      dinamicsTextCurr,
    ]);

    let countX = 0;
    let countY = 0;

    for (let i = 0; i < this.sectorCountValue.length; i += 1) {
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

      let chipSector = new Chip(this.scene, x - 80, y + 100, w, h, this.sectorCountValueColor, this.sectorCountValue[i]);

      this.dinamicsSectorGroup.add(chipSector);

      chipSector.setCallback(() => {
        this.scene.destroyGame();
        this.scene.sectors = chipSector.number;
        this.scene.startGame(this.gameMode, this.objClass, chipSector.number, this.numbers, this.colors, this.colorsStart);
        return;
      });

      countX += 1;
    }
  }

  createInput() {
    this.input = this.scene.add.dom(260, 780, 'input', 'font-size: 22px; width: 160px; text-align: center;');

    this.button = this.scene.add.text(260, 850, 'Enter number', textStyle.buttonSector).setOrigin(0.5).setInteractive();
    this.button
      .on('pointerover', () => {
        this.button.setBackgroundColor('#ffa500');
      })
      .on('pointerout', () => {
        this.button.setBackgroundColor('white');
      })
      .on('pointerdown', () => {
        const inputValue = document.querySelector('input').value;
        const value = parseInt(inputValue);

        if (!isNaN(value) && value >= 3 && value <= 37) {
          this.scene.destroyGame();
          this.scene.sectors = value;
          this.scene.startGame(this.gameMode, this.objClass, value, this.numbers, this.colors, this.colorsStart);
        } else {
          this.scene.notifications.alertNotification('The number of sectors can be set from 3 to 37');
        }
      });
  }

  destroyClass() {
    this.dinamicsSectorGroup?.destroy();
    this.input?.destroy();
    this.button?.destroy();
  }
}
