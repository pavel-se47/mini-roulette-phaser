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

  deal(allBets, valueWh, colorWh) {
    let possibleCombs = [];
    let winCombs = [];

    if (this.scene.gameMode === 'roulette') {
      payTable.forEach(objectPt => {
        let valuePt = objectPt.value;

        if (valueWh === valuePt) {
          possibleCombs.push({ ...objectPt, coef: objectPt.coef });

          payTable.forEach(obj => {
            if (colorWh === obj.color && typeof obj.value === 'string') {
              possibleCombs.push({ ...obj, coef: obj.coef });
            }
          });
        }
      });
    } else if (this.scene.gameMode === 'dice') {
      payTableDice.forEach(objectPt => {
        let valuePt = objectPt.value;

        if (valueWh === valuePt) {
          possibleCombs.push(objectPt);
        }
      });
    }

    allBets.forEach(objectVc => {
      let valueCh = objectVc.value;

      possibleCombs.forEach(objectPc => {
        let valuePc = objectPc.value;

        if (valueCh === valuePc) {
          winCombs.push({ ...objectVc, coef: objectPc.coef });
        }
      });
    });

    return winCombs.length ? winCombs : null;
  }
}
