export default class Stats {
  constructor(scene) {
    this.scene = scene;
  }

  createStats() {
    const statsRectangle = this.scene.add.rectangle(this.scene.x / 2, 510, 875, 80, 0xffffff);

    const balanceText = this.scene.add.text(this.scene.x / 2 - 400, this.scene.y / 2 - 50, 'Your balance \n' + this.scene.state.balance, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentBetText = this.scene.add.text(this.scene.x / 2 - 200, this.scene.y / 2 - 50, 'Your selected bet \n' + this.scene.state.currentBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const totalBetText = this.scene.add.text(this.scene.x / 2 + 40, this.scene.y / 2 - 50, 'Your total bet \n' + this.scene.state.generalBetSum, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentWinText = this.scene.add.text(this.scene.x / 2 + 240, this.scene.y / 2 - 50, 'Your current win \n' + this.scene.state.currentWin, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });
  }
}
