import Wheel from '../classes/Wheel';
import Dice from '../classes/Dice';
import BetZone from '../classes/BetZone';
import ChipZone from '../classes/ChipZone';
import Rules from '../classes/Rules';
import Stats from '../classes/Stats';
import AutoStart from '../classes/AutoStart';
import Notifications from '../classes/Notifications';
import Analyt from '../classes/Analyt';
import Dinamics from '../classes/Dinamics';
import limits from '../../limits.json';
import textStyle from '../../textStyle.json';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.gameMode = null;
    //roulette
    this.sectors = 33;
    this.valueNumbersWheel = [];
    this.valueNumbersWheelCopy = [];
    this.valueColorsWheel = [];
    this.valueColorsWheelCopy = [];
    this.valueNumberBet = [10, 20, 50, 100, 150];
    this.valueColorsBet = [0xf5deb3, 0xadff2f, 0x0000ff, 0xff00ff, 0xffa500];
    this.greenValue = [0];
    this.redValue = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
    this.blackValue = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];
    this.valueColors = [0x00cc00, 0x000000, 0xff0000];
    this.defaultTextButton = 'SPIN';
    this.defaultColorButton = '0xffa500';
    this.state = {
      valueWheel: null,
      valueChip: [],
      autoStart: false,
      timer: 10,
    };
    // dice
    this.sectorsDice = 6;
    this.valueNumbersDice = [1, 2, 3, 4, 5, 6];
    this.valueColorsDice = '0x000000';
    this.defaultTextButtonDice = 'ROLL';
    this.defaultColorButtonDice = '0x000000';
  }

  preload() {
    this.load.html('input', 'src/assets/text/nameform.html');
    this.createBackground();
  }

  create(data) {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;
    this.gameMode = data?.key;
    this.setGameMode(this.gameMode);
  }

  createBackground() {
    this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg1');
  }

  setGameMode(gameMode) {
    switch (gameMode) {
      case 'roulette':
        this.startRoulette();
        break;

      case 'dice':
        this.startDice();
        break;

      default:
        break;
    }
  }

  startRoulette() {
    this.gameMode = 'roulette';
    this.checkSectors();
    this.valueNumbersWheel = [];
    this.valueColorsWheel = [];
    this.buttonSwitchGame();
    this.createGameFiled(this.sectors, this.valueNumbersWheel, this.valueColors);

    this.notifications = new Notifications();
    this.autoStart = new AutoStart(this);
    this.chipZone = new ChipZone(this);
    this.betZone = new BetZone(this);
    this.analytics = new Analyt(this);
    this.wheel = new Wheel(this, this.sectors, this.valueNumbersWheel, this.valueColorsWheel);
    this.stats = new Stats(this);
    this.rules = this.add.container(1494, 315, new Rules(this));
    this.dinamics = new Dinamics(this);
  }

  startDice() {
    this.gameMode = 'dice';
    this.checkSectors();
    this.buttonSwitchGame();
    this.createGameFiled(this.sectorsDice, this.valueNumbersDice, this.valueColorsDice);

    this.notifications = new Notifications();
    this.chipZone = new ChipZone(this);
    this.betZone = new BetZone(this);
    this.analytics = new Analyt(this);
    this.dice = new Dice(this, this.sectorsDice, this.valueNumbersDice);
    this.stats = new Stats(this);
  }

  buttonSwitchGame() {
    const buttonSwitchGameRectangle = this.add.rectangle(0, 0, 200, 80, 0xffffff);
    const buttonSwitchGameText = this.add.text(0, 0, 'Switch game', textStyle.startGameButton).setOrigin(0.5);

    this.containerButtonSwitchGame = this.add
      .container(622, 400, [buttonSwitchGameRectangle, buttonSwitchGameText])
      .setSize(200, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.start('Start');
          this.gameMode = null;
        },
        this
      );
  }

  checkSectors() {
    if (this.gameMode === 'roulette') {
      if (this.sectors < 3 || this.sectors > 37) {
        throw new Error(alert('The number of sectors can be set from 3 to 37'));
      }
    } else if (this.gameMode === 'dice') {
      if (this.sectorsDice < 2 || this.sectorsDice > 6) {
        throw new Error(alert('The number of sectors can be set from 2 to 6'));
      }
    }
  }

  createGameFiled(sectors, numbers, colors) {
    switch (this.gameMode) {
      case 'roulette':
        this.createArrNum(sectors);
        this.createArrColorForNum(numbers, colors);
        this.createCopyArr();
        break;

      case 'dice':
        break;

      default:
        break;
    }
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

  checkBeforeSpin() {
    if (!this.state.valueChip.length) {
      this.notifications.infoNotification('Place your chip!');
      return;
    }
    return true;
  }

  spin() {
    if (this.checkBeforeSpin()) {
      this.stats.setBalanceValue((this.stats.balance -= this.stats.totalBet));
      this.setValueWheel();
      this.onSetTextButton();

      if (this.gameMode === 'roulette') {
        this.wheel.rotation();
        this.wheel.tweens.on('complete', () => {
          this.onSetTextButton(this.state.valueWheel.value, this.state.valueWheel.colorHex);
          this.pay();
          this.autoStart.startAutoSpinInterval();
          if (!this.state.autoStart) {
            this.state.valueChip = [];
            this.deleteValue();
          }
        });
      } else if (this.gameMode === 'dice') {
        this.dice.rotation();
        this.dice.roll.on('complete', () => {
          this.onSetTextButton(this.state.valueWheel.value, this.state.valueWheel.colorHex);
          this.pay();
          this.state.valueChip = [];
          this.deleteValue();
          this.dice.setWinImgDice();
        });
      }
    }
  }

  setValueWheel() {
    if (this.gameMode === 'roulette') {
      this.state.valueWheel = this.analytics.getValue(this.sectors);
    } else if (this.gameMode === 'dice') {
      this.state.valueWheel = this.analytics.getValue(this.sectorsDice);
    }
  }

  pay() {
    this.analytics.valueWheelCheck(this.state.valueWheel, this.state.valueChip);
  }

  onSetTextButton(text, color) {
    if (this.gameMode === 'roulette') {
      if (text || text === 0) {
        this.wheel.buttonOnWheelText.setText(text);
      } else {
        this.wheel.buttonOnWheelText.setText(this.defaultTextButton);
      }
      if (color) {
        this.wheel.buttonOnWheel.fillColor = color;
      } else {
        this.wheel.buttonOnWheel.fillColor = this.defaultColorButton;
      }
    } else if (this.gameMode === 'dice') {
      if (text) {
        this.dice.buttonOnDiceText.setText(text);
      } else {
        this.dice.buttonOnDiceText.setText(this.defaultTextButtonDice);
      }
    }
  }

  setDefaultValue() {
    if (this.gameMode === 'roulette') {
      if (!this.wheel.isSpinning) {
        this.state.timer = 10;
        this.autoStart.spinViaText.setText(`SPIN VIA ${this.state.timer} secs`);
        this.state.valueChip = [];
        this.state.valueWheel = null;
        this.stats.setTotalBetValue(0);
        this.stats.setCurrentBetValue(10);
        this.stats.setCurrentWinValue(0);
        this.deleteValue();
        this.onSetTextButton();
      }
    } else if (this.gameMode === 'dice') {
      if (!this.dice.isRoll) {
        this.dice.createDiceDefault();
        this.state.valueChip = [];
        this.state.valueWheel = null;
        this.stats.setTotalBetValue(0);
        this.stats.setCurrentBetValue(10);
        this.stats.setCurrentWinValue(0);
        this.deleteValue();
        this.onSetTextButton();
      }
    }
  }

  deleteValue() {
    this.chipZone.chipArray.forEach(obj => {
      if (obj.value) {
        obj.value = 0;
        obj.valueText.setText('');
      }
    });
  }
}
