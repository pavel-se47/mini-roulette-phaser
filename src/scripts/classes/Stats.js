export default class Stats {
  #balance;
  #currentBet;
  #currentWin;
  #totalBet;
  constructor(scene) {
    this.scene = scene;
    this.#balance = 1000;
    this.#currentBet = 10;
    this.#currentWin = 0;
    this.#totalBet = 0;
    this.create();
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

  get totalBet() {
    return this.#totalBet;
  }

  set totalBet(newTotalBet) {
    this.#totalBet = newTotalBet;
  }

  createStats() {
    const statsRectangle = this.scene.add.rectangle(this.scene.x / 2, 510, 875, 80, 0xffffff);

    this.balanceText = this.scene.add.text(this.scene.x / 2 - 400, this.scene.y / 2 - 50, 'Your balance \n' + this.balance, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    this.currentBetText = this.scene.add.text(this.scene.x / 2 - 200, this.scene.y / 2 - 50, 'Your selected bet \n' + this.currentBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    this.totalBetText = this.scene.add.text(this.scene.x / 2 + 40, this.scene.y / 2 - 50, 'Your total bet \n' + this.totalBet, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    this.currentWinText = this.scene.add.text(this.scene.x / 2 + 240, this.scene.y / 2 - 50, 'Your current win \n' + this.currentWin, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });
  }

  setBalanceValue(value) {
    this.balance = value;
    this.balanceText.setText('Your balance \n' + this.balance);
  }

  setCurrentBetValue(value) {
    this.currentBet = value;
    this.currentBetText.setText('Your selected bet \n' + this.currentBet);
  }

  setTotalBetValue(value) {
    this.totalBet = value;
    this.totalBetText.setText('Your total bet \n' + this.totalBet);
  }

  setCurrentWinValue(value) {
    this.currentWin = value;
    this.currentWinText.setText('Your current win \n' + this.currentWin);
  }
}
