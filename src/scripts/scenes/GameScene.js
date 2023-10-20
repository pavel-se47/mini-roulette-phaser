import Wheel from '../classes/Wheel';
import Dice from '../classes/Dice';
import Colors from '../classes/Colors';
import BetZone from '../classes/BetZone';
import ChipZone from '../classes/ChipZone';
import Rules from '../classes/Rules';
import Stats from '../classes/Stats';
import AutoStart from '../classes/AutoStart';
import Notifications from '../classes/Notifications';
import Analyt from '../classes/Analyt';
import Dinamics from '../classes/Dinamics';
import Button from '../classes/Button';
import limits from '../../limits.json';
import textStyle from '../../textStyle.json';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.gameMode = null;
    //roulette
    this.sectors = 37;
    this.valueNumbersWheel = [];
    this.valueColorsWheel = [];
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
    this.valueColorsDice = 0x000000;
    this.defaultTextButtonDice = 'ROLL';
    this.defaultColorButtonDice = '0x000000';
  }

  preload() {
    this.createBackground();
  }

  create() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;
    this.createButtonCreateDice();
    this.createButtonCreateRoulette();
  }

  createBackground() {
    this.background = this.add.sprite(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'bg1');
  }

  createButtonCreateDice() {
    this.createDice = new Button(this, this.x / 2, this.y / 2 - 50, 'Create Dice');
    this.createDice.setActionDown(() => {
      this.startGame('dice', Dice, this.sectorsDice, this.valueNumbersDice, this.valueColorsDice);
      this.destroyButtonCreateDice();
      this.destroyButtonCreateRoulette();
    }, this);
  }

  createButtonCreateRoulette() {
    this.createRoulette = new Button(this, this.x / 2, this.y / 2 + 50, 'Create Roulette');
    this.createRoulette.setActionDown(() => {
      this.startGame('roulette', Wheel, this.sectors, this.valueNumbersWheel, this.valueColorsWheel, this.valueColors);
      this.destroyButtonCreateDice();
      this.destroyButtonCreateRoulette();
    }, this);
  }

  destroyButtonCreateDice() {
    this.createDice?.destroyClass();
    this.createDice = null;
  }

  destroyButtonCreateRoulette() {
    this.createRoulette?.destroyClass();
    this.createRoulette = null;
  }

  startGame(gameMode, objClass, sectors, numbers, colors, colorsStart) {
    this.gameMode = gameMode;
    this.checkSectors();
    this.buttonSwitch();
    this.createButtonResetAll();
    this.createGameFiled(sectors, numbers, colorsStart);

    if (this.gameMode === 'roulette') {
      this.valueNumbersWheel = [];
      this.valueColorsWheel = [];
      this.autoStart = new AutoStart(this, sectors);
      this.rulesContainer = this.add.container();
      this.rulesContainer.add((this.rules = new Rules(this, 1200, 400)));
      this.dinamics = new Dinamics(this, gameMode, objClass, this.sectors, this.valueNumbersWheel, this.valueColorsWheel, colorsStart);
    }

    this.chipZone = new ChipZone(this, sectors, numbers, colors);
    this.notifications = new Notifications();
    this.colors = new Colors(this);
    this.betZone = new BetZone(this, this.valueNumberBet, this.valueColorsBet);
    this.analytics = new Analyt(this);
    this.gameObj = new objClass(this, sectors, numbers, colors);
    this.stats = new Stats(this);
  }

  buttonSwitch() {
    if (this.gameMode === 'dice') {
      this.switchGame = new Button(this, 622, 400, 'Switch Roulette');
      this.switchGame.setActionDown(() => {
        this.destroyGame();
        this.startGame('roulette', Wheel, this.sectors, this.valueNumbersWheel, this.valueColorsWheel, this.valueColors);
      }, this);
    } else if (this.gameMode === 'roulette') {
      this.switchGame = new Button(this, 622, 400, 'Switch Dice');
      this.switchGame.setActionDown(() => {
        this.destroyGame();
        this.startGame('dice', Dice, this.sectorsDice, this.valueNumbersDice, this.valueColorsDice);
      }, this);
    }
  }

  destroyGame() {
    this.notifications = null;
    this.analytics = null;
    this.gameObj?.destroyClass();
    this.gameObj = null;
    this.betZone?.destroyClass();
    this.betZone = null;
    this.stats?.destroyClass();
    this.stats = null;
    this.chipZone?.destroyClass();
    this.chipZone = null;
    this.rulesContainer?.destroy();
    this.autoStart?.destroyClass();
    this.autoStart = null;
    this.dinamics?.destroyClass();
    this.dinamics = null;
    this.switchGame?.destroyClass();
    this.switchGame = null;
  }

  checkSectors() {
    switch (this.gameMode) {
      case 'roulette':
        if (this.sectors < 3 || this.sectors > 37) {
          throw new Error(alert('The number of sectors can be set from 3 to 37'));
        }
        break;

      case 'dice':
        if (this.sectorsDice < 2 || this.sectorsDice > 6) {
          throw new Error(alert('The number of sectors can be set from 2 to 6'));
        }
        break;

      default:
        break;
    }
  }

  createGameFiled(sectors, numbers, colors) {
    switch (this.gameMode) {
      case 'roulette':
        this.createArrNum(sectors);
        this.createArrColorForNum(numbers, colors);
        break;

      case 'dice':
        break;

      default:
        break;
    }
  }

  createArrNum(sectors) {
    this.valueNumbersWheel.push(this.greenValue[0]);

    for (let i = 0; i < sectors / 2; i += 1) {
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

  spin(sectors) {
    if (this.checkBeforeSpin()) {
      this.stats.setBalanceValue((this.stats.balance -= this.stats.totalBet));
      this.setValueWheel(sectors);
      this.onSetTextButton();
      this.gameObj.rotation();
      this.gameObj.tween.on('complete', () => {
        this.onSetTextButton(this.state.valueWheel.value, this.state.valueWheel.colorHex);
        this.pay();
        if (!this.state.autoStart) {
          this.state.valueChip = [];
          this.chipZone.deleteValueOnChip();
        }
        if (this.gameMode === 'roulette') {
          this.autoStart.startAutoSpinInterval();
        } else if (this.gameMode === 'dice') {
          this.gameObj.setWinImgDice();
        }
      });
    }
  }

  setValueWheel(sectors) {
    this.state.valueWheel = this.analytics.getValue(sectors);
  }

  pay() {
    this.valueGameObjCheck(this.state.valueWheel, this.state.valueChip);
  }

  valueGameObjCheck(winValue, allBets) {
    let valueWh = winValue.value;
    let colorWh = winValue.color;

    let win = this.analytics.deal(allBets, valueWh, colorWh);

    if (win) {
      win.forEach(objW => {
        let bet = objW.currentBet;
        let winValue = bet * objW.coef;
        this.stats.setBalanceValue((this.stats.balance += winValue));
        this.stats.setCurrentWinValue((this.stats.currentWin = winValue));
        this.notifications.successNotification(objW);

        allBets.forEach(objB => {
          if (objW.value !== objB.value) {
            this.forLose(this.state.autoStart, objB);
          }
        });
      });
    } else {
      allBets.forEach(objB => {
        this.forLose(this.state.autoStart, objB);
      });
    }

    if (this.state.autoStart) {
      if (this.stats.balance === 0 && this.stats.balance < this.stats.currentBet) {
        this.notifications.alertNotification('Top up your balance to continue playing!');
        this.state.autoStart = false;
        this.state.valueChip = [];
        this.state.timer = 10;
        this.autostart.spinViaText.setText(`SPIN VIA ${this.state.timer} secs`);
        this.stats.setBalanceValue(0);
        this.stats.setCurrentBetValue(0);
        this.stats.setTotalBetValue(0);
      }
    }
  }

  forLose(autoStart, obj) {
    if (!autoStart) {
      this.stats.setTotalBetValue(0);
    }
    this.stats.setCurrentWinValue(0);
    this.notifications.errorNotification(obj);
  }

  calculateTotalBet() {
    const currBet = this.state.valueChip.map(object => object.currentBet);
    const totalBet = currBet.reduce((acc, number) => acc + number, 0);
    this.stats.totalBet = totalBet;
  }

  onSetChip(chip) {
    let allBets = this.state.valueChip;

    if (!this.checkBet(chip)) {
      return;
    }

    if (this.gameObj.isPlay) {
      return;
    }

    let value = chip.number;
    let currentBet = this.stats.currentBet;
    let totalBet = this.stats.totalBet;
    let balance = this.stats.balance;
    const existingBet = allBets.find(obj => obj.value === value);

    if (existingBet) {
      existingBet.currentBet += this.stats.currentBet;
    } else {
      allBets.push({
        value: value,
        color: this.colors.currentColor(value),
        currentBet: this.stats.currentBet,
      });
    }

    if (totalBet + currentBet > balance) {
      this.notifications.alertNotification('Not enough funds to bet!');
      return;
    }
    this.state.valueWheel = null;
    this.stats.setTotalBetValue((totalBet += currentBet));
    this.calculateTotalBet();
    this.onSetTextButton();

    if (this.gameMode === 'dice') {
      this.gameObj.createDiceDefault();
    }

    return true;
  }

  createButtonResetAll() {
    const resetAllRectangle = this.add.rectangle(0, 0, 180, 80, 0xffffff);
    const resetAllText = this.add.text(0, 0, 'Reset all', textStyle.resetButtonText).setOrigin(0.5);

    this.containerButtonResetAll = this.add
      .container(this.x / 2 + 400, 965, [resetAllRectangle, resetAllText])
      .setSize(180, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.setDefaultValue();
        },
        this
      );
  }

  setDefaultValue() {
    if (!this.gameObj.isPlay) {
      if (this.gameMode === 'roulette') {
        this.state.timer = 10;
        this.autoStart.spinViaText.setText(`SPIN VIA ${this.state.timer} secs`);
      } else if (this.gameMode === 'dice') {
        this.gameObj.createDiceDefault();
      }
    }

    this.state.valueChip = [];
    this.state.valueWheel = null;
    this.stats.setTotalBetValue(0);
    this.stats.setCurrentBetValue(10);
    this.stats.setCurrentWinValue(0);
    this.chipZone.deleteValueOnChip();
    this.onSetTextButton();
  }

  onSetTextButton(text, color) {
    switch (this.gameMode) {
      case 'roulette':
        text || text === 0 ? this.gameObj.buttonOnWheelText.setText(text) : this.gameObj.buttonOnWheelText.setText(this.defaultTextButton);
        color ? (this.gameObj.buttonOnWheel.fillColor = color) : (this.gameObj.buttonOnWheel.fillColor = this.defaultColorButton);
        break;

      case 'dice':
        text ? this.gameObj.buttonOnDiceText.setText(text) : this.gameObj.buttonOnDiceText.setText(this.defaultTextButtonDice);
        break;

      default:
        break;
    }
  }
}
