export default class BetZone {
  constructor(scene) {
    this.scene = scene;
    this.create();
  }

  create() {
    this.createBet();
  }

  createBet() {
    const betText = this.scene.add.text(this.scene.x / 2 - 470, this.scene.y / 2 + 30, 'Your bet', {
      font: 'bold 30px Arial',
      fill: 'white',
      align: 'center',
    });

    for (let i = 0; i < this.scene.valueNumberBet.length; i += 1) {
      let x = this.scene.x / 2 - 400;
      let y = 650 + i * 80;
      let betColor = this.scene.valueColorsBet[i];
      let betNumber = this.scene.valueNumberBet[i];

      let bet = this.scene.add.circle(0, 0, 36, betColor);

      let text = this.scene.add
        .text(0, 0, betNumber, {
          font: 'bold 24px Arial',
          fill: 'white',
        })
        .setOrigin(0.5);

      let containerBet = this.scene.add
        .container(x, y, [bet, text])
        .setSize(72, 72)
        .setInteractive()
        .on(
          'pointerdown',
          () => {
            this.scene.stats.setCurrentBetValue(betNumber);
          },
          this.scene
        );
    }
  }

  calculateTotalBet() {
    const currBet = this.scene.state.valueChip.map(object => object.currentBet);
    const totalBet = currBet.reduce((acc, number) => acc + number, 0);
    this.scene.stats.totalBet = totalBet;
  }
}
