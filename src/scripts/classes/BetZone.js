import Stats from "../classes/Stats";

export default class BetZone {
  constructor(scene) {
    this.scene = scene;
    this.stats = new Stats();
  }

  createBet = () => {
    const betText = this.scene.add.text(
      this.scene.x / 2 - 230,
      this.scene.y / 2 + 30,
      "Your bet",
      {
        font: "bold 30px Arial",
        fill: "white",
        align: "center",
      }
    );

    for (let i = 0; i < 5; i += 1) {
      const x = this.scene.x / 2 - 170;
      const y = 650 + i * 80;

      const bet = this.scene.add
        .circle(x, y, 36, this.scene.valueColorsBet[i])
        .setInteractive()
        .on(
          "pointerdown",
          () => {
            this.scene.state.currentBet = parseInt(text.text);
            this.stats.createStats(this.scene);
          },
          this.scene
        );

      const text = this.scene.add
        .text(x, y, this.scene.valueNumberBet[i], {
          font: "bold 24px Arial",
          fill: "white",
        })
        .setOrigin(0.5)
        .setInteractive()
        .on(
          "pointerdown",
          () => {
            this.scene.state.currentBet = parseInt(text.text);
            this.stats.createStats(this.scene);
          },
          this.scene
        );
    }
  };

  onSetBet = () => {
    let x;
    let y;
    let colorCurrentBet;

    this.scene.state.valueChip.forEach((object) => {
      if (object.value === 0) {
        x = 940;
        y = 630;
      } else if (object.value === 1) {
        x = 940;
        y = 710;
      } else if (object.value === 3) {
        x = 940;
        y = 790;
      } else if (object.value === "AB") {
        x = 940;
        y = 870;
      } else if (object.value === 6) {
        x = 1020;
        y = 630;
      } else if (object.value === 4) {
        x = 1020;
        y = 710;
      } else if (object.value === 2) {
        x = 1020;
        y = 790;
      } else if (object.value === 8) {
        x = 1100;
        y = 630;
      } else if (object.value === 5) {
        x = 1100;
        y = 710;
      } else if (object.value === 7) {
        x = 1100;
        y = 790;
      } else if (object.value === "AR") {
        x = 1060;
        y = 870;
      }

      if (object.currentBet === 10) {
        colorCurrentBet = this.scene.valueColorsBet[0];
      } else if (object.currentBet === 20) {
        colorCurrentBet = this.scene.valueColorsBet[1];
      } else if (object.currentBet === 50) {
        colorCurrentBet = this.scene.valueColorsBet[2];
      } else if (object.currentBet === 100) {
        colorCurrentBet = this.scene.valueColorsBet[3];
      } else if (object.currentBet === 150) {
        colorCurrentBet = this.scene.valueColorsBet[4];
      }

      const bet = this.scene.add
        .circle(x, y, 12, colorCurrentBet)
        .setOrigin(0.5)
        .setStrokeStyle(1, 0xffffff);

      this.scene.bets.push(bet);
    });
  };

  calculateGeneralBetSum = () => {
    const currBet = this.scene.state.valueChip.map(
      (object) => object.currentBet
    );
    const genBet = currBet.reduce((acc, number) => acc + number, 0);
    this.scene.state.generalBetSum = genBet;
  };

  destroyBets = (context) => {
    context.bets.forEach((object) => {
      object.destroy();
    });
  };
}
