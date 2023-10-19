import textStyle from '../../textStyle.json';

export default class BetZone {
  constructor(scene, numbers, colors) {
    this.scene = scene;
    this.numbers = numbers;
    this.colors = colors;
    this.betsArray = [];
    this.create();
  }

  create() {
    this.createBet();
  }

  createBet() {
    this.betText = this.scene.add.text(this.scene.x / 2 - 470, this.scene.y / 2 + 30, 'Your bet', textStyle.betText);

    for (let i = 0; i < this.numbers.length; i += 1) {
      let x = this.scene.x / 2 - 400;
      let y = 650 + i * 80;
      let betColor = this.colors[i];
      let betNumber = this.numbers[i];

      let bet = this.scene.add.circle(0, 0, 36, betColor);
      let text = this.scene.add.text(0, 0, betNumber, textStyle.textInBet).setOrigin(0.5);

      this.betsArray.push(
        (this.containerBet = this.scene.add
          .container(x, y, [bet, text])
          .setSize(72, 72)
          .setInteractive()
          .on(
            'pointerdown',
            () => {
              this.scene.stats.setCurrentBetValue(betNumber);
            },
            this.scene
          ))
      );
    }
  }

  destroyClass() {
    this.betText.destroy();
    this.betsArray.forEach(obj => {
      obj.destroy();
    });
  }
}
