import payTable from '../../payTable.json';
import payTableDice from '../../payTableDice.json';

export default class Analyt {
  constructor(scene, gameMode, sectors) {
    this.scene = scene;
    this.sectors = sectors;
    this.payTableList = {
      roulette: payTable,
      dice: payTableDice,
    };
    this.startIndexList = { roulette: 2, dice: 0 };
    this.currentPayTable = this.payTableList[gameMode];
    this.currentStartIndex = this.startIndexList[gameMode];
  }

  getValue() {
    return Phaser.Utils.Array.GetRandom(this.currentPayTable, this.currentStartIndex, this.sectors);
  }

  deal(allBets, valueWh, colorWh) {
    let possibleCombs = [];
    let winCombs = [];

    this.currentPayTable.forEach(objectPt => {
      let valuePt = objectPt.value;

      if (valueWh === valuePt) {
        possibleCombs.push({ ...objectPt, coef: objectPt.coef });

        if (colorWh) {
          this.currentPayTable.forEach(obj => {
            if (colorWh === obj.color && typeof obj.value === 'string') {
              possibleCombs.push({ ...obj, coef: obj.coef });
            }
          });
        }
      }
    });

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
