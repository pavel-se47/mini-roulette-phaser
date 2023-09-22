import Wheel from "../classes/Wheel";
import BetZone from "../classes/BetZone";
import ChipZone from "../classes/ChipZone";
import Rules from "../classes/Rules";
import Stats from "../classes/Stats";
import AutoStart from "../classes/AutoStart";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.x = null;
    this.y = null;
    this.bets = [];
    this.sectors = 11;
    this.valueNumberBet = [10, 20, 50, 100, 150];
    this.valueColorsBet = [0xf5deb3, 0xadff2f, 0x0000ff, 0xff00ff, 0xffa500];
    this.valueNumbersWheel = [0, 1, 3, 6, 4, 2, 8, 5, 7, 9, 10];
    this.valueColorsWheel = [
      0x00cc00, 0x000000, 0xff0000, 0x000000, 0xff0000, 0x000000, 0xff0000,
      0x000000, 0xff0000, 0x000000, 0xff0000,
    ];

    this.state = {
      valueWheel: null,
      valueChip: [],
      generalBetSum: 0,
      balance: 1000,
      currentBet: 10,
      currentWin: 0,
      valueChip: [],
      limit: 20,
      autoStart: false,
      timer: 10,
    };

    this.autoStart = new AutoStart(this);
    this.chipZone = new ChipZone(this);
    this.betZone = new BetZone(this);
    this.wheel = new Wheel(this);
    this.rules = new Rules(this);
    this.stats = new Stats();
  }

  preload() {
    this.createBackground();
  }

  create() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;

    this.wheel.createWheel();
    this.wheel.createButtonOnWheel();
    this.wheel.createArrowForWheel();
    this.stats.createStats(this);
    this.betZone.createBet();
    this.chipZone.createChipZone();
    this.chipZone.createButtonClearChipZone();
    this.autoStart.createAutoStartPanel();
    this.rules.createButtonRulesAndLimits();
  }

  createBackground() {
    this.add.sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height / 2,
      "bg1"
    );
  }
}
