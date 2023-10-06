export default class Stats {
  constructor(scene) {
    this.scene = scene;
  }

  createStats() {
    const statsRectangle = this.scene.add.rectangle(this.scene.x / 2, 510, 650, 80, 0xffffff);

    const balanceText = this.scene.add.text(this.scene.x / 2 - 300, this.scene.y / 2 - 50, 'Your balance: \n' + this.scene.state.balance, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentBetText = this.scene.add.text(this.scene.x / 2 - 90, this.scene.y / 2 - 50, 'Your current bet: \n' + this.scene.state.currentBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentWinText = this.scene.add.text(this.scene.x / 2 + 140, this.scene.y / 2 - 50, 'Your current win: \n' + this.scene.state.currentWin, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });
  }
}
