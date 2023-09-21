import Phaser from "phaser";

export default class Stats extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, balance, currentBet, currentWin) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.balance = balance;
    this.currentBet = currentBet;
    this.currentWin = currentWin;
    this.create();
  }

  create() {
    this.createStats(
      this.x,
      this.y,
      this.balance,
      this.currentBet,
      this.currentWin
    );
  }

  createStats(x, y, balance, bet, win) {
    const statsRectangle = this.scene.add.rectangle(
      x / 2,
      510,
      650,
      80,
      0xffffff
    );

    const balanceText = this.scene.add.text(
      x / 2 - 300,
      y / 2 - 50,
      "Your balance: \n" + balance,
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const currentBetText = this.scene.add.text(
      x / 2 - 90,
      y / 2 - 50,
      "Your current bet: \n" + bet,
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const currentWinText = this.scene.add.text(
      x / 2 + 140,
      y / 2 - 50,
      "Your current win: \n" + win,
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );
  }
}
