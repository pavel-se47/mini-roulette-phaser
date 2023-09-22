import BetZone from "./BetZone";
import Stats from "./Stats";
import Colors from "./Colors";
import Notifications from "./Notifications";

export default class Wheel {
  constructor(scene) {
    this.scene = scene;
    this.isSpinning = false;
    this.spinDuration = 3000;
    this.containerWheel = null;
    this.textWheel = [];
    this.betZone = new BetZone(this.scene);
    this.stats = new Stats();
    this.colors = new Colors();
    this.notifications = new Notifications();
  }

  createWheel = () => {
    const radius = 200;
    const graphicsForWheel = this.scene.add.graphics();

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

      this.textWheel.push(text);
    }

    graphicsForWheel.lineStyle(8, 0xffffff).strokeCircle(0, 0, radius);

    this.containerWheel = this.scene.add.container(this.scene.x / 2, 250);
    this.containerWheel.add(graphicsForWheel);
    this.containerWheel.add(this.textWheel);
  };

  createButtonOnWheel = () => {
    this.buttonOnWheel = this.scene.add
      .circle(0, 0, 50, 0xffa500)
      .setStrokeStyle(8, 0xffffff);

    this.buttonOnWheelText = this.scene.add
      .text(0, 0, "SPIN", {
        font: "bold 30px Arial",
        fill: "white",
      })
      .setOrigin(0.5);

    this.containerButtonOnWheel = this.scene.add
      .container(this.scene.x / 2, 250, [
        this.buttonOnWheel,
        this.buttonOnWheelText,
      ])
      .setSize(85, 85)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.spin(this.scene);
        },
        this.scene
      );
  };

  createArrowForWheel = () => {
    const triangle = new Phaser.Geom.Triangle(
      this.scene.x / 2,
      70,
      this.scene.x / 2 - 30,
      20,
      this.scene.x / 2 + 30,
      20
    );

    const graphicsForTriangle = this.scene.add
      .graphics({
        fillStyle: { color: 0xffa500 },
      })
      .fillTriangleShape(triangle)
      .lineStyle(8, 0xffffff)
      .strokeTriangleShape(triangle);
  };

  spin = (context) => {
    if (context.state.balance && !context.state.currentBet) {
      this.notifications.infoNotification("Place your bet!");
      return;
    }

    if (!context.state.valueChip.length) {
      this.notifications.infoNotification("Place your chip!");
      return;
    }

    if (!context.state.currentBet) {
      this.notifications.alertNotification("Not enough funds to bet!");
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
      randomWinNumber === 7 ||
      randomWinNumber === 10
    ) {
      context.state.valueWheel = {
        value: randomWinNumber,
        color: "red",
      };
    } else if (
      randomWinNumber === 1 ||
      randomWinNumber === 2 ||
      randomWinNumber === 5 ||
      randomWinNumber === 6 ||
      randomWinNumber === 9
    ) {
      context.state.valueWheel = {
        value: randomWinNumber,
        color: "black",
      };
    }

    this.onSetDefaultTextButton();

    this.targetAngle = 360 + this.currentAngleRotate(randomWinNumber);

    if (!this.isSpinning) {
      this.isSpinning = true;

      context.tweens.add({
        targets: this.containerWheel,
        angle: this.targetAngle,
        duration: this.spinDuration,
        ease: "Cubic.easeOut",
        onComplete: () => {
          this.isSpinning = false;
          this.buttonOnWheelText.setText(randomWinNumber);
          this.buttonOnWheel.fillColor =
            this.colors.currentColorHex(randomWinNumber);
          this.valueWheelChange(context);
          context.autoStart.startAutoSpinInterval();
          if (!context.state.autoStart) {
            this.betZone.destroyBets(context);
          }
        },
      });
    }
  };

  onSetDefaultTextButton = () => {
    this.buttonOnWheelText.setText("SPIN");
    this.buttonOnWheel.fillColor = "0xffa500";
  };

  currentAngleRotate(number) {
    if (number === 0) {
      return 610;
    } else if (number === 1) {
      return 575;
    } else if (number === 2) {
      return 450;
    } else if (number === 3) {
      return 545;
    } else if (number === 4) {
      return 495;
    } else if (number === 5) {
      return 745;
    } else if (number === 6) {
      return 520;
    } else if (number === 7) {
      return 715;
    } else if (number === 8) {
      return 775;
    } else if (number === 9) {
      return 675;
    } else if (number === 10) {
      return 645;
    }
  }

  valueWheelChange = (context) => {
    context.state.valueChip.forEach((object) => {
      if (object?.value === context.state.valueWheel?.value) {
        (context.state.balance += object.currentBet * 8),
          (context.state.currentWin = object.currentBet * 8),
          this.stats.createStats(this.scene);
        this.notifications.successNotification(object, 8);
      } else if (
        object?.value !== context.state.valueWheel?.value &&
        object?.color === context.state.valueWheel.color
      ) {
        (context.state.balance += object.currentBet * 2),
          (context.state.currentWin = object.currentBet * 2),
          this.stats.createStats(this.scene);
        this.notifications.successNotification(object, 2);
        return;
      } else if (object?.value !== context.state.valueWheel?.value) {
        context.state.currentWin = 0;
        this.notifications.errorNotification(object);

        return;
      }
    });

    if (context.state.autoStart) {
      context.state.balance -= context.state.generalBetSum;
      if (
        context.state.balance === 0 &&
        context.state.balance < context.state.currentBet
      ) {
        this.notifications.alertNotification(
          "Top up your balance to continue playing!"
        )((context.state.autoStart = false)),
          (context.state.balance = 0),
          (context.state.currentBet = 0),
          (context.state.valueChip = []);
        return;
      }
    } else {
      context.state.valueChip = [];
      context.state.generalBetSum = 0;
    }
  };
}
