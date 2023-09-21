import BetZone from "./BetZone";
import { alert, info, error, success } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

export default class Wheel {
  constructor(scene) {
    this.scene = scene;
    this.betZone = new BetZone(this);
  }

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

    context.onSetDefaultTextButton();

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
            context.currentColorHex(randomWinNumber);
          this.valueWheelChange(context);
          context.autoStart.startAutoSpinInterval();
          if (!context.state.autoStart) {
            this.betZone.destroyBets(this.scene);
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
          context.createStatsPanel(
            context,
            context.x,
            context.y,
            context.state.balance,
            context.state.currentBet,
            context.state.currentWin
          );
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
          context.createStatsPanel(
            context,
            context.x,
            context.y,
            context.state.balance,
            context.state.currentBet,
            context.state.currentWin
          );
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
            context.createStatsPanel(
              context,
              context.x,
              context.y,
              context.state.balance,
              context.state.currentBet,
              context.state.currentWin
            );
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
          context.createStatsPanel(
            context,
            context.x,
            context.y,
            context.state.balance,
            context.state.currentBet,
            context.state.currentWin
          );
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
            context.createStatsPanel(
              context,
              context.x,
              context.y,
              context.state.balance,
              context.state.currentBet,
              context.state.currentWin
            );
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
    context.createStatsPanel(
      context,
      context.x,
      context.y,
      context.state.balance,
      context.state.currentBet,
      context.state.currentWin
    );
  }
}
