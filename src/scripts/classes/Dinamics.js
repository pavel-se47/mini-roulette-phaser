import Chip from './Chip';
import textStyle from '../../textStyle.json';

export default class Dinamics {
  constructor(scene) {
    this.scene = scene;
    this.sectorCountValue = [5, 12, 19, 26, 33, 37];
    this.sectorCountValueColor = '0xffa500';
    this.create();
  }

  // сделать инпут на ввод секторов с клавиатуры

  create() {
    this.createSectorDinamics();
    // this.createInput();
  }

  createSectorDinamics() {
    const dinamicsRectangleMain = this.scene.add.rectangle(0, 0, 300, 80, 0xffffff);
    const dinamicsTextMain = this.scene.add.text(-60, -10, 'Select sectors', textStyle.sectorDinamicsText);
    const dinamicsRectangleCurr = this.scene.add.rectangle(0, 450, 300, 80, 0xffffff);
    const dinamicsTextCurr = this.scene.add.text(-100, 430, 'Current sector count \n' + this.scene.sectors, textStyle.sectorDinamicsText);

    const dinamicsSectorGroup = this.scene.add.container(this.scene.x / 2 - 700, this.scene.y / 2 - 30, [
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

      dinamicsSectorGroup.add(chipSector);

      chipSector.setCallback(() => {
        this.scene.sectors = chipSector.number;
        this.scene.valueNumbersWheel = [];
        this.scene.valueColorsWheel = [];
        this.scene.scene.restart();
      });

      countX += 1;
    }
  }

  // createInput() {
  //   const numericInput = this.scene.add.dom(260, 800, 'input', 'font-size: 24px; width: 200px; text-align: center;');

  //   const button = this.scene.add.text(260, 850, 'Enter number', textStyle.buttonSector).setOrigin(0.5).setInteractive();

  //   button
  //     .on('pointerover', () => {
  //       button.setBackgroundColor('#ffa500');
  //     })
  //     .on('pointerout', () => {
  //       button.setBackgroundColor('white');
  //     })
  //     .on('pointerdown', () => {
  //       const value = parseInt(document.querySelector('input[type="number"]'));

  //       if (!isNaN(value) && value >= 3 && value <= 37) {
  //         this.scene.sectors = value;
  //         this.scene.valueNumbersWheel = [];
  //         this.scene.valueColorsWheel = [];
  //         this.scene.scene.restart();
  //       } else {
  //         this.scene.notifications.alertNotification('The number of sectors can be set from 3 to 37');
  //       }
  //     });
  // }
}
