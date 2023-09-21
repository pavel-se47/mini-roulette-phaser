import Chip from "../classes/Chip";
import Stats from "../classes/Stats";
import BetZone from "../classes/BetZone";
import { alert, info } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";

export default class ChipZone {
  constructor(scene) {
    this.scene = scene;
    this.betZone = new BetZone(this.scene);
    this.stats = new Stats();
  }

  createChipZone = () => {
    const chipZoneText = this.scene.add.text(
      this.scene.x / 2 + 5,
      this.scene.y / 2 + 30,
      "Chip zone",
      {
        font: "bold 30px Arial",
        fill: "white",
        align: "center",
      }
    );

    for (let i = 0; i < this.scene.sectors; i += 1) {
      const w = 70;
      const h = 70;
      let x;
      let y;

      if (i <= 2) {
        x = this.scene.x / 2 - 0;
        y = 650 + i * 80;
      } else if (i <= 5) {
        x = this.scene.x / 2 + 80;
        y = 410 + i * 80;
      } else {
        x = this.scene.x / 2 + 160;
        y = 170 + i * 80;
      }

      const chipNumber = new Chip(
        this.scene,
        x,
        y,
        w,
        h,
        this.scene.valueColorsWheel[i],
        this.scene.valueNumbersWheel[i]
      )
        .setSize(w, h)
        .setOrigin(0.5)
        .setInteractive()
        .on(
          "pointerdown",
          () => {
            this.onSetChip(chipNumber.n);
          },
          this.scene
        );
    }

    const chipAR = new Chip(this.scene, 1100, 890, 110, 70, "0xff0000", "AR")
      .setSize(110, 70)
      .setOrigin(0.5)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.onSetChip(chipAR.n);
        },
        this.scene
      );

    const chipAB = new Chip(this.scene, 980, 890, 110, 70, "0x000000", "AB")
      .setSize(110, 70)
      .setOrigin(0.5)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.onSetChip(chipAB.n);
        },
        this.scene
      );
  };

  onSetChip = (value) => {
    let foundMatch = false;

    if (value === "AB" || value === "AR") {
      this.scene.state.limit = 100;
      if (this.scene.state.currentBet > 100) {
        alert({
          title: "You have exceeded the current limit!",
          delay: 1000,
          hide: true,
          width: "400px",
        });
        return;
      }
    } else {
      this.scene.state.limit = 20;

      if (this.scene.state.currentBet > 20) {
        alert({
          title: "You have exceeded the current limit!",
          delay: 1000,
          hide: true,
          width: "400px",
        });
        return;
      }
    }

    if (this.scene.state.currentBet > this.scene.state.balance) {
      alert({
        title: "Not enough funds to bet!",
        delay: 1000,
        hide: true,
        width: "400px",
      });
      this.scene.state.currentBet = 0;
      return;
    }

    this.scene.state.valueChip.forEach((object) => {
      if (object.value === value) {
        alert({
          title: "You have already placed a bet on this zone!",
          delay: 1000,
          hide: true,
          width: "400px",
        });
        foundMatch = true;
      }
    });

    if (!this.scene.state.currentBet) {
      info({
        title: "Place your bet!",
        delay: 1000,
        hide: true,
        width: "400px",
      });
      return;
    }

    if (!foundMatch) {
      (this.scene.state.valueChip = [
        ...this.scene.state.valueChip,
        {
          value: value,
          color: this.currentColor(value),
          colorHex: this.currentColorHex(value),
          currentBet: this.scene.state.currentBet,
        },
      ]),
        (this.scene.state.balance -= this.scene.state.currentBet),
        this.stats.createStats(this.scene);

      this.scene.state.valueWheel = null;
    }

    this.betZone.onSetBet();
    this.betZone.calculateGeneralBetSum();
    this.onSetDefaultTextButton();
  };

  createButtonClearChipZone = () => {
    const clearChipZoneRectangle = this.scene.add
      .rectangle(this.scene.x / 2 + 80, 980, 230, 80, 0xffffff)
      .setInteractive();

    const clearChipZoneText = this.scene.add
      .text(this.scene.x / 2 - 10, this.scene.y / 2 + 430, "CLEAR CHIP ZONE", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive();

    clearChipZoneRectangle.on(
      "pointerdown",
      () => {
        this.scene.state.balance += this.scene.state.generalBetSum;
        this.scene.state.valueChip = [];
        this.scene.state.valueWheel = null;
        this.scene.state.generalBetSum = 0;
        this.scene.state.currentBet = 10;
        this.scene.state.limit = 20;
        this.scene.state.currentWin = 0;
        this.betZone.destroyBets(this.scene);
        this.onSetDefaultTextButton();
        this.stats.createStats(this.scene);
      },
      this
    );
    clearChipZoneText.on(
      "pointerdown",
      () => {
        this.scene.state.balance += this.scene.state.generalBetSum;
        this.scene.state.valueChip = [];
        this.scene.state.valueWheel = null;
        this.scene.state.generalBetSum = 0;
        this.scene.state.currentBet = 10;
        this.scene.state.limit = 20;
        this.scene.state.currentWin = 0;
        this.betZone.destroyBets(this.scene);
        this.onSetDefaultTextButton();
        this.stats.createStats(this.scene);
      },
      this.scene
    );
  };

  currentColor = (value) => {
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
  };

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
}
