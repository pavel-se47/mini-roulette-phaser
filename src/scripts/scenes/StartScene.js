import textStyle from '../../textStyle.json';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super('Start');
  }

  create() {
    this.x = this.sys.game.config.width;
    this.y = this.sys.game.config.height;
    this.createBackground();
    this.buttonStartRoulette();
    this.buttonStartDice();
  }

  createBackground() {
    this.add.sprite(this.x / 2, this.y / 2, 'bg0');
  }

  buttonStartRoulette() {
    const buttonStartRouletteRectangle = this.add.rectangle(0, 0, 200, 80, 0xffffff);
    const buttonStartRouletteText = this.add.text(0, 0, 'Start Roulette', textStyle.startGameButton).setOrigin(0.5);

    const containerButtonStartRoulette = this.add
      .container(this.x / 2, this.y / 2 - 50, [buttonStartRouletteRectangle, buttonStartRouletteText])
      .setSize(200, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.playRoulette();
        },
        this
      );
  }

  buttonStartDice() {
    const buttonStartDiceRectangle = this.add.rectangle(0, 0, 200, 80, 0xffffff);
    const buttonStartDiceText = this.add.text(0, 0, 'Start Dice', textStyle.startGameButton).setOrigin(0.5);

    const containerButtonStartDice = this.add
      .container(this.x / 2, this.y / 2 + 50, [buttonStartDiceRectangle, buttonStartDiceText])
      .setSize(200, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.playDice();
        },
        this
      );
  }

  playRoulette() {
    this.scene.start('GameScene', { key: 'roulette' });
  }

  playDice() {
    this.scene.start('GameScene', { key: 'dice' });
  }
}
