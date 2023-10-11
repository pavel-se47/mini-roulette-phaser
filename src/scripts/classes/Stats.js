export default class Stats {
  #balance;
  #currentBet;
  #currentWin;
  #generalBetSum;
  constructor(scene) {
    this.scene = scene;
    this.#balance = 1000;
    this.#currentBet = 10;
    this.#currentWin = 0;
    this.#generalBetSum = 0;
  }

  create() {
    this.createStats();
  }

  get balance() {
    return this.#balance;
  }

  set balance(newBalance) {
    this.#balance = newBalance;
  }

  get currentBet() {
    return this.#currentBet;
  }

  set currentBet(newCurrentBet) {
    this.#currentBet = newCurrentBet;
  }

  get currentWin() {
    return this.#currentWin;
  }

  set currentWin(newCurrentWin) {
    this.#currentWin = newCurrentWin;
  }

  get generalBetSum() {
    return this.#generalBetSum;
  }

  set generalBetSum(newGeneralBetSum) {
    this.#generalBetSum = newGeneralBetSum;
  }

  createStats() {
    const statsRectangle = this.scene.add.rectangle(this.scene.x / 2, 510, 875, 80, 0xffffff);

    const balanceText = this.scene.add.text(this.scene.x / 2 - 400, this.scene.y / 2 - 50, 'Your balance \n' + this.balance, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentBetText = this.scene.add.text(this.scene.x / 2 - 200, this.scene.y / 2 - 50, 'Your selected bet \n' + this.currentBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const totalBetText = this.scene.add.text(this.scene.x / 2 + 40, this.scene.y / 2 - 50, 'Your total bet \n' + this.generalBetSum, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const currentWinText = this.scene.add.text(this.scene.x / 2 + 240, this.scene.y / 2 - 50, 'Your current win \n' + this.currentWin, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });
  }
}
