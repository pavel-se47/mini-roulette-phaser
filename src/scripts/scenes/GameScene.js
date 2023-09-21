import Phaser from "phaser";
import Stats from "../classes/Stats";
import AutoStart from "../classes/AutoStart";
import Wheel from "../classes/Wheel";
import BetZone from "../classes/BetZone";
import ChipZone from "../classes/ChipZone";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.x = null;
    this.y = null;
    this.stats = null;
    this.bets = [];
    this.containerWheel = null;
    this.containerRules = null;
    this.containerChip = null;
    this.containerButtonOnWheel = null;
    this.valueNumbersWheel = [0, 1, 3, 6, 4, 2, 8, 5, 7];
    this.valueColorsWheel = [
      0x00cc00, 0x000000, 0xff0000, 0x000000, 0xff0000, 0x000000, 0xff0000,
      0x000000, 0xff0000,
    ];
    this.valueColorsBet = [0xf5deb3, 0xadff2f, 0x0000ff, 0xff00ff, 0xffa500];
    this.valueNumberBet = [10, 20, 50, 100, 150];
    this.sectors = 9;
    this.isSpinning = false;
    this.spinDuration = 3000;
    this.textWheel = [];

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
  }

  preload() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;

    this.createBackground();
  }

  create() {
    this.createWheel();
    this.createButtonOnWheel();
    this.createArrowForWheel();
    this.createStatsPanel(
      this,
      this.x,
      this.y,
      this.state.balance,
      this.state.currentBet,
      this.state.currentWin
    );
    this.createAutoStartPanel();
    this.createButtonRulesAndLimits();
    this.betZone.createBet();
    this.chipZone.createChipZone();
    this.chipZone.createButtonClearChipZone();
  }

  createBackground() {
    this.add.sprite(this.x / 2, this.y / 2, "chipboard");
  }

  createWheel() {
    const graphicsForWheel = this.add.graphics({
      fillStyle: { color: null },
    });

    const radius = 200;

    for (let i = 0; i < this.sectors; i += 1) {
      const startAngle = (i / this.sectors) * Phaser.Math.PI2;
      const endAngle = ((i + 1) / this.sectors) * Phaser.Math.PI2;
      const color = this.valueColorsWheel[i];

      graphicsForWheel.fillStyle(color);
      graphicsForWheel.beginPath();
      graphicsForWheel.moveTo(0, 0);
      graphicsForWheel.arc(0, 0, radius, startAngle, endAngle);
      graphicsForWheel.closePath();
      graphicsForWheel.fillPath();

      const centerX = radius * 0.8 * Math.cos((startAngle + endAngle) / 2);
      const centerY = radius * 0.8 * Math.sin((startAngle + endAngle) / 2);

      const text = this.add
        .text(centerX, centerY, this.valueNumbersWheel[i], {
          font: "bold 30px Arial",
          fill: "white",
        })
        .setOrigin(0.5)
        .setRotation(startAngle + (endAngle - startAngle) / 2);

      this.textWheel.push(text);
    }

    graphicsForWheel.lineStyle(8, 0xffffff);
    graphicsForWheel.strokeCircle(0, 0, radius);

    this.containerWheel = this.add.container(this.x / 2, 250);
    this.containerWheel.add(graphicsForWheel);
    this.containerWheel.add(this.textWheel);
  }

  createButtonOnWheel() {
    this.buttonOnWheel = this.add
      .circle(this.x / 2, 250, 50, 0xffa500)
      .setInteractive();

    this.buttonOnWheelText = this.add
      .text(this.x / 2, 250, "SPIN", {
        font: "bold 30px Arial",
        fill: "white",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.buttonOnWheel.setStrokeStyle(8, 0xffffff);

    this.buttonOnWheel.on(
      "pointerdown",
      () => {
        this.wheel.spin(this);
      },
      this
    );
    this.buttonOnWheelText.on(
      "pointerdown",
      () => {
        this.wheel.spin(this);
      },
      this
    );
  }

  createArrowForWheel() {
    const graphicsForTriangle = this.add.graphics({
      fillStyle: { color: 0xffa500 },
    });

    const triangle = new Phaser.Geom.Triangle(
      this.x / 2,
      70,
      this.x / 2 - 30,
      20,
      this.x / 2 + 30,
      20
    );

    graphicsForTriangle.fillTriangleShape(triangle);
    graphicsForTriangle.lineStyle(8, 0xffffff);
    graphicsForTriangle.strokeTriangleShape(triangle);
  }

  createStatsPanel(context, x, y, balance, bet, win) {
    this.stats = new Stats(context, x, y, balance, bet, win);
  }

  createButtonRulesAndLimits() {
    const buttonRules = this.add
      .circle(1200, 420, 30, "0xffffff")
      .setInteractive();

    const buttonRulesText = this.add.text(1196, 405, "i", {
      font: "bold 30px Arial",
      fill: "black",
      align: "center",
    });

    buttonRules.on("pointerdown", this.createRulesAndLimits, this);
  }

  createRulesAndLimits() {
    const statsRectangle = this.add.rectangle(1494, 315, 650, 270, 0xffffff);

    const rulesText = this.add.text(
      this.x / 2 + 220,
      this.y / 2 - 350,
      'Правила игры.\n\nВыберите фишку в поле "Your Bet", которую хотите поставить.\nСделайте ставку в "Chip Zone".\nНажмите кнопку "SPIN" или "Start Auto Spin".\nКолесо начнет крутится и укажет на выигрышный сектор.\nНомер и цвет выпавшего сектора отобразится в центре круга \nдо следующей Вашей ставки.',
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const limitsNumbersText = this.add.text(
      this.x / 2 + 270,
      this.y / 2 - 150,
      "Limits 'AR' and 'AB' bet \nmax 100 credits",
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const limitsColorsText = this.add.text(
      this.x / 2 + 600,
      this.y / 2 - 150,
      "Limits numbers bet \nmax 20 credits",
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const closeText = this.add
      .text(this.x / 2 + 830, this.y / 2 - 350, "X", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive();

    this.containerRules = this.add.container(0, 0, [
      statsRectangle,
      rulesText,
      limitsNumbersText,
      limitsColorsText,
      closeText,
    ]);

    closeText.on("pointerdown", this.destroyRulesAndLimits, this);
  }

  destroyRulesAndLimits() {
    this.containerRules.destroy();
  }

  createAutoStartPanel() {
    const startAutoStartRectangle = this.add
      .rectangle(this.x / 2 + 370, this.y / 2 + 110, 180, 80, 0xffffff)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.state.autoStart = true;
          this.autoStart.startAutoSpinInterval();
        },
        this
      );

    const startAutoStartText = this.add
      .text(this.x / 2 + 300, this.y / 2 + 100, "Start Auto Spin", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.state.autoStart = true;
          this.autoStart.startAutoSpinInterval();
        },
        this
      );

    const spinViaRectangle = this.add.rectangle(
      this.x / 2 + 370,
      this.y / 2 + 210,
      180,
      80,
      0xffffff
    );

    this.spinViaText = this.add.text(
      this.x / 2 + 290,
      this.y / 2 + 200,
      `SPIN VIA ${this.state.timer} secs`,
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const stopAutoStartRectangle = this.add
      .rectangle(this.x / 2 + 370, this.y / 2 + 310, 180, 80, 0xffffff)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.state.autoStart = false;
          this.autoStart.stopAutoSpinInterval();
        },
        this
      );

    const stopAutoStartText = this.add
      .text(this.x / 2 + 300, this.y / 2 + 300, "Stop Auto Spin", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.state.autoStart = false;
          this.autoStart.stopAutoSpinInterval();
        },
        this
      );
  }

  currentColorHex(value) {
    if (value === 0) {
      return "0x00cc00";
    } else if (
      value === 3 ||
      value === 4 ||
      value === 8 ||
      value === 7 ||
      value === "AR"
    ) {
      return "0xff0000";
    } else if (
      value === 1 ||
      value === 2 ||
      value === 5 ||
      value === 6 ||
      value === "AB"
    ) {
      return "0x000000";
    }
  }

  currentColor(value) {
    if (value === 0) {
      return "green";
    } else if (
      value === 3 ||
      value === 4 ||
      value === 8 ||
      value === 7 ||
      value === "AR"
    ) {
      return "red";
    } else if (
      value === 1 ||
      value === 2 ||
      value === 5 ||
      value === 6 ||
      value === "AB"
    ) {
      return "black";
    }
  }

  onSetDefaultTextButton() {
    this.buttonOnWheelText.setText("SPIN");
    this.buttonOnWheel.fillColor = "0xffa500";
  }
}
