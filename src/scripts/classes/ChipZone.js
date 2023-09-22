import Chip from "./Chip";
import Stats from "./Stats";
import BetZone from "./BetZone";
import Colors from "./Colors";
import Notifications from "./Notifications";

export default class ChipZone {
  constructor(scene) {
    this.scene = scene;
    this.containerButtonClearChipZone = null;
    this.betZone = new BetZone(this.scene);
    this.stats = new Stats();
    this.colors = new Colors();
    this.notifications = new Notifications();
  }

  createChipZone = () => {
    const chipZoneText = this.scene.add.text(
      this.scene.x / 2 - 90,
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
        x = this.scene.x / 2 - 100;
        y = 650 + i * 80;
      } else if (i <= 5) {
        x = this.scene.x / 2 - 20;
        y = 410 + i * 80;
      } else if (i <= 8) {
        x = this.scene.x / 2 + 60;
        y = 170 + i * 80;
      } else {
        x = this.scene.x / 2 - 100;
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

    const chipAR = new Chip(this.scene, 980, 970, 150, 70, "0xff0000", "AR")
      .setSize(150, 70)
      .setOrigin(0.5)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.onSetChip(chipAR.n);
        },
        this.scene
      );

    const chipAB = new Chip(this.scene, 980, 890, 150, 70, "0x000000", "AB")
      .setSize(150, 70)
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

    if (typeof value !== "number") {
      this.scene.state.limit = 100;
      if (this.scene.state.currentBet > 100) {
        this.notifications.alertNotification(
          "You have exceeded the current limit!"
        );
        return;
      }
    } else {
      this.scene.state.limit = 20;
      if (this.scene.state.currentBet > 20) {
        this.notifications.alertNotification(
          "You have exceeded the current limit!"
        );
        return;
      }
    }

    if (this.scene.state.currentBet > this.scene.state.balance) {
      this.notifications.alertNotification("Not enough funds to bet!");
      this.scene.state.currentBet = 0;
      return;
    }

    this.scene.state.valueChip.forEach((object) => {
      if (object.value === value) {
        this.notifications.alertNotification(
          "You have already placed a bet on this zone!"
        );
        foundMatch = true;
      }
    });

    if (!this.scene.state.currentBet) {
      this.notifications.infoNotification("Place your bet!");
      return;
    }

    if (!foundMatch) {
      (this.scene.state.valueChip = [
        ...this.scene.state.valueChip,
        {
          value: value,
          color: this.colors.currentColor(value),
          colorHex: this.colors.currentColorHex(value),
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
    const clearChipZoneRectangle = this.scene.add.rectangle(
      0,
      0,
      180,
      80,
      0xffffff
    );

    const clearChipZoneText = this.scene.add
      .text(0, 0, "Clear chip zone", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setOrigin(0.5);

    this.containerButtonClearChipZone = this.scene.add
      .container(this.scene.x / 2 + 220, 965, [
        clearChipZoneRectangle,
        clearChipZoneText,
      ])
      .setSize(180, 80)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          if (!this.scene.wheel.isSpinning) {
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
          }
        },
        this.scene
      );
  };

  onSetDefaultTextButton = () => {
    this.scene.wheel.buttonOnWheelText.setText("SPIN");
    this.scene.wheel.buttonOnWheel.fillColor = "0xffa500";
  };
}
