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

      let bet = this.scene.add.circle(0, 0, 36, this.scene.valueColorsBet[i]);

      let text = this.scene.add
        .text(0, 0, this.scene.valueNumberBet[i], {
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
            this.scene.stats.currentBet = this.scene.valueNumberBet[i];     //TODO эту часть можно закинуть в отдельну. фукнцию
            this.scene.stats.currentBetText.setText('Your selected bet \n' + this.scene.stats.currentBet);
          },
          this.scene
        );
    }
  }

  calculateGeneralBetSum() {
    const currBet = this.scene.state.valueChip.map(object => object.currentBet);
    const genBet = currBet.reduce((acc, number) => acc + number, 0);
    this.scene.stats.totalBet = genBet;
  }
}
