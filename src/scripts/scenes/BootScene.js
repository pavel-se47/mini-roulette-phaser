import bg0 from '../../assets/bg0.png';
import bg1 from '../../assets/bg1.png';
import dice from '../../assets/dice.png';
import dice1 from '../../assets/dice1.png';
import dice2 from '../../assets/dice2.png';
import dice3 from '../../assets/dice3.png';
import dice4 from '../../assets/dice4.png';
import dice5 from '../../assets/dice5.png';
import dice6 from '../../assets/dice6.png';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    this.load.image('bg0', bg0);
    this.load.image('bg1', bg1);
    this.load.image('dice', dice);
    this.load.image('dice1', dice1);
    this.load.image('dice2', dice2);
    this.load.image('dice3', dice3);
    this.load.image('dice4', dice4);
    this.load.image('dice5', dice5);
    this.load.image('dice6', dice6);
  }

  create() {
    this.scene.start('Preload');
  }
}
