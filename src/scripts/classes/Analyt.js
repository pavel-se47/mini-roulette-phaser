import payTable from '../../payTable.json';
import payTableDice from '../../payTableDice.json';

export default class Analyt {
  constructor(scene) {
    this.scene = scene;
  }

  getValue(endValue) {
    if (this.scene.gameMode === 'roulette') {
      return Phaser.Utils.Array.GetRandom(payTable, 2, endValue);
    } else if (this.scene.gameMode === 'dice') {
      return Phaser.Utils.Array.GetRandom(payTableDice, 0, endValue);
    }
  }
}
