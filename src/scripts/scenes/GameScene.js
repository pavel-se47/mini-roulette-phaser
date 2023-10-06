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
    this.sectors = 20;
    this.valueNumberBet = [10, 20, 50, 100, 150];
    this.valueColorsBet = [0xf5deb3, 0xadff2f, 0x0000ff, 0xff00ff, 0xffa500];
    this.greenValue = [0];
    this.redValue = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    this.blackValue = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
    this.valueColors = [0x00cc00, 0x000000, 0xff0000];
    this.valueNumbersWheel = [];
    this.valueColorsWheel = [];

    this.state = {
      valueWheel: null,
      valueChip: [],
      generalBetSum: 0,
      balance: 1000,
      currentBet: 10,
      currentWin: 0,
      valueChip: [],
      limit: limits.numbers,
      autoStart: false,
      timer: 10,
    };

    this.autoStart = new AutoStart(this);
    this.chipZone = new ChipZone(this);
    this.betZone = new BetZone(this);
    this.wheel = new Wheel(this);
    this.rules = new Rules(this);
    this.stats = new Stats(this);
    this.analytics = new Analyt(this);
    this.notifications = new Notifications();
  }

  preload() {
    this.checkSectors();
    this.createBackground();
  }

  create() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;
    this.createArrNum(this.sectors);
    this.createArrColorForNum(this.valueNumbersWheel, this.valueColors);

    this.wheel.createWheel();
    this.wheel.createButtonOnWheel();
    this.wheel.createArrowForWheel();
    this.stats.createStats();
    this.betZone.createBet();
    this.chipZone.createChipZone();
    this.chipZone.createButtonClearChipZone();
    this.autoStart.createAutoStartPanel();
    this.rules.createButtonRulesAndLimits();
  }

  createBackground() {
    this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg1');
  }

  createArrNum(sectors) {
    this.valueNumbersWheel.push(this.greenValue[0]);

    for (let i = 0; i < sectors; i += 1) {
      if (this.valueNumbersWheel.length !== sectors) {
        this.valueNumbersWheel.push(this.blackValue[i]);
      }
      if (this.valueNumbersWheel.length !== sectors) {
        this.valueNumbersWheel.push(this.redValue[i]);
      }
    }
  }

  createArrColorForNum(arrNum, arrColor) {
    for (let i = 0; i < arrNum.length; i += 1) {
      switch (true) {
        case this.greenValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[0]);
          break;
        case this.blackValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[1]);
          break;
        case this.redValue.includes(arrNum[i]):
          this.valueColorsWheel.push(arrColor[2]);
          break;

        default:
          break;
      }
    }
  }

  checkBet(value) {
    if (!this.state.currentBet) {
      this.notifications.infoNotification('Place your bet!');
      return;
    }

    if (this.state.currentBet > this.state.balance) {
      this.notifications.alertNotification('Not enough funds to bet!');
      this.state.currentBet = 0;
      return;
    }

    this.state.valueChip.forEach(object => {
      if (object.value === value) {
        this.notifications.alertNotification('You have already placed a bet on this zone!');
        this.chipZone.foundMatch = true;
      }
    });

    if (typeof value !== 'number') {
      this.state.limit = limits.colors;
      if (this.state.currentBet > limits.colors) {
        this.notifications.alertNotification('You have exceeded the current limit!');
        return;
      }
    } else {
      this.state.limit = limits.numbers;
      if (this.state.currentBet > limits.numbers) {
        this.notifications.alertNotification('You have exceeded the current limit!');
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

  checkSectors() {
    if (this.sectors > 37) {
      throw new Error('Maximum number of sectors - 37 ');
    }
  }
}
