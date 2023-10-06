export default class BetZone {
  constructor(scene) {
    this.scene = scene;
    this.bets = [];
    this.containerBet = null;
  }

  createBet() {
    const betText = this.scene.add.text(this.scene.x / 2 - 470, this.scene.y / 2 + 30, 'Your bet', {
      font: 'bold 30px Arial',
      fill: 'white',
      align: 'center',
    });

    for (let i = 0; i < this.scene.valueNumberBet.length; i += 1) {
      const x = this.scene.x / 2 - 400;
      const y = 650 + i * 80;
      const bet = this.scene.add.circle(0, 0, 36, this.scene.valueColorsBet[i]);
      const text = this.scene.add
        .text(0, 0, this.scene.valueNumberBet[i], {
          font: 'bold 24px Arial',
          fill: 'white',
        })
        .setOrigin(0.5);

      this.containerBet = this.scene.add
        .container(x, y, [bet, text])
        .setSize(36, 36)
        .setInteractive()
        .on(
          'pointerdown',
          () => {
            this.scene.state.currentBet = parseInt(text.text);
            this.scene.stats.createStats(this.scene);
          },
          this.scene
        );
    }
  }

  onSetBet() {
    let x;
    let y;
    let colorCurrentBet;

    this.scene.state.valueChip.forEach(object => {
      for (let i = 0; i < 40; i += 1) {
        if (object.value === 0) {
          x = 830;
          y = 630;
        } else if (object.value === 1) {
          x = 990;
          y = 630;
        } else if (object.value === 3) {
          x = 840;
          y = 790;
        } else if (object.value === 9) {
          x = 840;
          y = 870;
        } else if (object.value === 10) {
          x = 840;
          y = 950;
        } else if (object.value === 'AB') {
          x = 920;
          y = 870;
        } else if (object.value === 6) {
          x = 920;
          y = 630;
        } else if (object.value === 4) {
          x = 920;
          y = 710;
        } else if (object.value === 2) {
          x = 910;
          y = 630;
        } else if (object.value === 'AR') {
          x = 920;
          y = 950;
        } else if (object.value === 8) {
          x = 1000;
          y = 630;
        } else if (object.value === 5) {
          x = 1000;
          y = 710;
        } else if (object.value === 7) {
          x = 1000;
          y = 790;
        }
      }

      for (let i = 0; i < this.scene.valueColorsBet.length; i += 1) {
        if (object.currentBet === this.scene.valueNumberBet[i]) {
          colorCurrentBet = this.scene.valueColorsBet[i];
        }
      }

      const bet = this.scene.add.circle(x, y, 12, colorCurrentBet).setOrigin(0.5).setStrokeStyle(1, 0xffffff);

      this.bets.push(bet);
    });
  }

  calculateGeneralBetSum() {
    const currBet = this.scene.state.valueChip.map(object => object.currentBet);
    const genBet = currBet.reduce((acc, number) => acc + number, 0);
    this.scene.state.generalBetSum = genBet;
  }

  destroyBets() {
    this.bets.forEach(object => {
      object.destroy();
    });
  }
}
