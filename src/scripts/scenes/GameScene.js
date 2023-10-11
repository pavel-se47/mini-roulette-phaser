import Wheel from '../classes/Wheel';
import BetZone from '../classes/BetZone';
import ChipZone from '../classes/ChipZone';
import Rules from '../classes/Rules';
import Stats from '../classes/Stats';
import AutoStart from '../classes/AutoStart';
import Notifications from '../classes/Notifications';
import Analyt from '../classes/Analyt';
import limits from '../../limits.json';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.sectors = 37;
    this.valueNumberBet = [10, 20, 50, 100, 150];
    this.valueColorsBet = [0xf5deb3, 0xadff2f, 0x0000ff, 0xff00ff, 0xffa500];
    this.greenValue = [0];
    this.redValue = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
    this.blackValue = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];
    this.valueColors = [0x00cc00, 0x000000, 0xff0000];
    this.valueNumbersWheel = [];
    this.valueNumbersWheelCopy = [];
    this.valueColorsWheel = [];
    this.valueColorsWheelCopy = [];
    this.state = {
      valueWheel: null,
      valueChip: [],
      autoStart: false,
      timer: 10,
      checkBet: false,
    };
  }

  preload() {
    this.checkSectors();
    this.createBackground();
  }

  create() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;
    this.createGameFiled(this.sectors, this.valueNumbersWheel, this.valueColors);

    this.notifications = new Notifications(this);
    this.analytics = new Analyt(this);

    this.wheel = new Wheel(this);
    this.wheel.create();

    this.stats = new Stats(this);
    this.stats.create();

    this.betZone = new BetZone(this);
    this.betZone.create();

    this.chipZone = new ChipZone(this);
    this.chipZone.create();

    this.autoStart = new AutoStart(this);
    this.autoStart.create();

    this.rules = new Rules(this);
    this.rules.create();
  }

  checkSectors() {
    if (this.sectors < 3 || this.sectors > 37) {
      throw new Error('The number of sectors can be set from 3 to 37');
    }
  }

  createBackground() {
    this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg1');
  }

  createGameFiled(sectors, numbers, colors) {
    this.createArrNum(sectors);
    this.createArrColorForNum(numbers, colors);
    this.createCopyArr();
  }

  createArrNum(sectors) {
    this.valueNumbersWheel.push(this.greenValue[0]);

    for (let i = 0; i < sectors; i += 1) {
      if (this.valueNumbersWheel.length !== sectors) {
        this.valueNumbersWheel.push(this.redValue[i]);
      }
      if (this.valueNumbersWheel.length !== sectors) {
        this.valueNumbersWheel.push(this.blackValue[i]);
      }
    }
  }

  createArrColorForNum(arrNum, arrColor) {
    for (let i = 0; i < arrNum.length; i += 1) {
      switch (true) {
        case this.greenValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[0]);
          break;
        case this.redValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[2]);
          break;
        case this.blackValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[1]);
          break;

        default:
          break;
      }
    }
  }

  createCopyArr() {
    this.valueNumbersWheelCopy = JSON.parse(JSON.stringify(this.valueNumbersWheel));
    this.valueColorsWheelCopy = JSON.parse(JSON.stringify(this.valueColorsWheel));

    this.valueNumbersWheelCopy.push('AR');
    this.valueColorsWheelCopy.push(16711680);
    this.valueNumbersWheelCopy.push('AB');
    this.valueColorsWheelCopy.push(0);
  }

  checkBet(chip) {
    let value = chip.number;
    let betSum = chip.value + this.stats.currentBet;

    if (!this.stats.currentBet) {
      this.notifications.infoNotification('Place your bet!');
      return;
    }

    if (this.stats.currentBet > this.stats.balance) {
      this.notifications.alertNotification('Not enough funds to bet!');
      this.stats.currentBet = 0;
      return;
    }

    if (typeof value !== 'number') {
      if (betSum > limits.colors || this.stats.currentBet > limits.colors) {
        this.notifications.alertNotification('You have exceeded the current limit for colors!');
        return;
      }
    } else {
      if (betSum > limits.numbers || this.stats.currentBet > limits.numbers) {
        this.notifications.alertNotification('You have exceeded the current limit for numbers!');
        return;
      }
    }

    return true;
  }

  setValueWheel() {
    this.state.valueWheel = this.analytics.getValue();
  }

  pay() {
    this.analytics.valueWheelCheck();
  }
}
