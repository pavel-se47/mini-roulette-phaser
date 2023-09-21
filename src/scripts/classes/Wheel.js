import BetZone from "./BetZone";
import Stats from "../classes/Stats";
import { alert, info, error, success } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

export default class Wheel {
  constructor(scene) {
    this.scene = scene;
    this.betZone = new BetZone(this.scene);
    this.stats = new Stats();
  }

  createWheel = () => {
    const graphicsForWheel = this.scene.add.graphics({
      fillStyle: { color: null },
    });

    const radius = 200;

    for (let i = 0; i < this.scene.sectors; i += 1) {
      const startAngle = (i / this.scene.sectors) * Phaser.Math.PI2;
      const endAngle = ((i + 1) / this.scene.sectors) * Phaser.Math.PI2;
      const color = this.scene.valueColorsWheel[i];

      graphicsForWheel.fillStyle(color);
      graphicsForWheel.beginPath();
      graphicsForWheel.moveTo(0, 0);
      graphicsForWheel.arc(0, 0, radius, startAngle, endAngle);
      graphicsForWheel.closePath();
      graphicsForWheel.fillPath();

      const centerX = radius * 0.8 * Math.cos((startAngle + endAngle) / 2);
      const centerY = radius * 0.8 * Math.sin((startAngle + endAngle) / 2);

      const text = this.scene.add
        .text(centerX, centerY, this.scene.valueNumbersWheel[i], {
          font: "bold 30px Arial",
          fill: "white",
        })
        .setOrigin(0.5)
        .setRotation(startAngle + (endAngle - startAngle) / 2);

      this.scene.textWheel.push(text);
    }

    graphicsForWheel.lineStyle(8, 0xffffff);
    graphicsForWheel.strokeCircle(0, 0, radius);

    this.scene.containerWheel = this.scene.add.container(this.scene.x / 2, 250);
    this.scene.containerWheel.add(graphicsForWheel);
    this.scene.containerWheel.add(this.scene.textWheel);
  };

  createButtonOnWheel = () => {
    this.scene.buttonOnWheel = this.scene.add
      .circle(this.scene.x / 2, 250, 50, 0xffa500)
      .setInteractive();

    this.scene.buttonOnWheelText = this.scene.add
      .text(this.scene.x / 2, 250, "SPIN", {
        font: "bold 30px Arial",
        fill: "white",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.scene.buttonOnWheel.setStrokeStyle(8, 0xffffff);

    this.scene.buttonOnWheel.on(
      "pointerdown",
      () => {
        this.scene.wheel.spin(this.scene);
      },
      this.scene
    );
    this.scene.buttonOnWheelText.on(
      "pointerdown",
      () => {
        this.scene.wheel.spin(this.scene);
      },
      this.scene
    );
  };

  createArrowForWheel = () => {
    const graphicsForTriangle = this.scene.add.graphics({
      fillStyle: { color: 0xffa500 },
    });

    const triangle = new Phaser.Geom.Triangle(
      this.scene.x / 2,
      70,
      this.scene.x / 2 - 30,
      20,
      this.scene.x / 2 + 30,
      20
    );

    graphicsForTriangle.fillTriangleShape(triangle);
    graphicsForTriangle.lineStyle(8, 0xffffff);
    graphicsForTriangle.strokeTriangleShape(triangle);
  };

  spin = (context) => {
    if (context.state.balance && !context.state.currentBet) {
      info({
        title: "Place your bet!",
        delay: 1000,
        hide: true,
        width: "400px",
      });
      return;
    }

    if (!context.state.valueChip.length) {
      info({
        title: "Place your chip!",
        delay: 1000,
        hide: true,
        width: "400px",
      });
      return;
    }

    if (!context.state.currentBet) {
      alert({
        title: "Not enough funds to bet!",
        delay: 1000,
        hide: true,
        width: "400px",
      });
      return;
    }

    const randomWinNumber = Phaser.Utils.Array.GetRandom(
      context.valueNumbersWheel
    );

    if (randomWinNumber === 0) {
      context.state.valueWheel = {
        value: randomWinNumber,
        color: "green",
      };
    } else if (
      randomWinNumber === 3 ||
      randomWinNumber === 4 ||
      randomWinNumber === 8 ||
      randomWinNumber === 7
    ) {
      context.state.valueWheel = {
        value: randomWinNumber,
        color: "red",
      };
    } else if (
      randomWinNumber === 1 ||
      randomWinNumber === 2 ||
      randomWinNumber === 5 ||
      randomWinNumber === 6
    ) {
      context.state.valueWheel = {
        value: randomWinNumber,
        color: "black",
      };
    }

    this.onSetDefaultTextButton();

    this.targetAngle = 360 + this.currentAngleRotate(randomWinNumber);

    if (!context.isSpinning) {
      context.isSpinning = true;

      context.tweens.add({
        targets: context.containerWheel,
        angle: this.targetAngle,
        duration: context.spinDuration,
        ease: "Cubic.easeOut",
        onComplete: () => {
          context.isSpinning = false;
          context.buttonOnWheelText.setText(randomWinNumber);
          context.buttonOnWheel.fillColor =
            this.currentColorHex(randomWinNumber);
          this.valueWheelChange(context);
          context.autoStart.startAutoSpinInterval();
          if (!context.state.autoStart) {
            this.betZone.destroyBets(context);
          }
        },
      });
    }
  };

  currentAngleRotate(number) {
    if (number === 0) {
      return 610;
    } else if (number === 1) {
      return 570;
    } else if (number === 2) {
      return 410;
    } else if (number === 3) {
      return 530;
    } else if (number === 4) {
      return 450;
    } else if (number === 5) {
      return 690;
    } else if (number === 6) {
      return 490;
    } else if (number === 7) {
      return 650;
    } else if (number === 8) {
      return 370;
    }
  }

  currentColorHex = (value) => {
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
  };

  onSetDefaultTextButton = () => {
    this.scene.buttonOnWheelText.setText("SPIN");
    this.scene.buttonOnWheel.fillColor = "0xffa500";
  };

  valueWheelChange(context) {
    if (!context.state.valueWheel) {
      return;
    }

    if (context.state.autoStart) {
      context.state.balance -= context.state.generalBetSum;

      if (
        context.state.balance === 0 &&
        context.state.balance < context.state.currentBet
      ) {
        alert({
          title: "Top up your balance to continue playing!",
          delay: 1000,
          hide: true,
          width: "400px",
        });

        (context.state.autoStart = false),
          (context.state.balance = 0),
          (context.state.currentBet = 0),
          (context.state.valueChip = []);
        return;
      }
    }

    context.state.valueChip.forEach((object) => {
      if (object?.value === "AB" || object?.value === "AR") {
        return;
      }
      if (object?.value !== context.state.valueWheel?.value) {
        error({
          title: `Sorry, you number ${object.value} lost :(`,
          text: `You lost ${object.currentBet} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });
        return;
      } else {
        (context.state.balance += object.currentBet * 8),
          (context.state.currentWin = object.currentBet * 8),
          this.stats.createStats(this.scene);
        success({
          title: `Congratulations! You number ${object.value} win!`,
          text: `You win ${object.currentBet * 8} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });
        return;
      }
    });

    context.state.valueChip.forEach((object) => {
      const colorUpperCase = object?.color?.toUpperCase();

      if (
        object?.value === "AB" &&
        context.state.valueWheel.color === "black" &&
        object?.color === context.state.valueWheel?.color
      ) {
        (context.state.balance += object.currentBet * 2),
          (context.state.currentWin = object.currentBet * 2),
          this.stats.createStats(this.scene);
        success({
          title: `Congratulations! You color ${colorUpperCase} win!`,
          text: `You win ${object.currentBet * 2} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });

        if (object?.value === context.state.valueWheel?.value) {
          context.state.balance + object.currentBet * 8,
            (context.state.currentWin = object.currentBet * 8),
            this.stats.createStats(this.scene);

          success({
            title: `Congratulations! You number ${object.value} win!`,
            text: `You win ${object.currentBet * 8} credits!`,
            delay: 1000,
            hide: true,
            width: "400px",
          });
        }
        return;
      } else if (object?.value === "AB") {
        error({
          title: `Sorry, you color ${colorUpperCase} lost :(`,
          text: `You lost ${object.currentBet} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });
      }

      if (
        object?.value === "AR" &&
        context.state.valueWheel.color === "red" &&
        object?.color === context.state.valueWheel?.color
      ) {
        (context.state.balance += object.currentBet * 2),
          (context.state.currentWin = object.currentBet * 2),
          this.stats.createStats(this.scene);

        success({
          title: `Congratulations! You color ${colorUpperCase} win!`,
          text: `You win ${object.currentBet * 2} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });

        if (object?.value === context.state.valueWheel?.value) {
          (context.state.balance += object.currentBet * 8),
            (context.state.currentWin = object.currentBet * 8),
            this.stats.createStats(this.scene);
          success({
            title: `Congratulations! You number ${object.value} win!`,
            text: `You win ${object.currentBet * 8} credits!`,
            delay: 1000,
            hide: true,
            width: "400px",
          });
        }
        return;
      } else if (object?.value === "AR") {
        error({
          title: `Sorry, you color ${colorUpperCase} lost :(`,
          text: `You lost ${object.currentBet} credits!`,
          delay: 1000,
          hide: true,
          width: "400px",
        });
      }
    });

    if (!context.state.autoStart) {
      context.state.valueChip = [];
      context.state.generalBetSum = 0;
    }

    context.state.currentWin = 0;
    this.stats.createStats(this.scene);
  }
}
