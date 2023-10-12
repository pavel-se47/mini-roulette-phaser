import payTable from '../../payTable.json';
import Notifications from '../classes/Notifications';

export default class Analyt {
  constructor(scene) {
    this.scene = scene;
    this.notifications = new Notifications();
  }

  getValue() {
    const num = Phaser.Utils.Array.GetRandom(this.scene.valueNumbersWheel);

    if (this.scene.greenValue.includes(num)) {
      return {
        value: num,
        color: 'green',
        colorHex: '0x00cc00',
      };
    } else if (this.scene.redValue.includes(num)) {
      return {
        value: num,
        color: 'red',
        colorHex: '0xff0000',
      };
    } else if (this.scene.blackValue.includes(num)) {
      return {
        value: num,
        color: 'black',
        colorHex: '0x000000',
      };
    }
  }

  valueWheelCheck() {
    let valueWh = this.scene.state.valueWheel?.value;
    let colorWh = this.scene.state.valueWheel?.color;
    let allBets = this.scene.state.valueChip;
    let possibleCombs = [];

    for (let j = 0; j < payTable.length; j += 1) {
      let colorPt = payTable[j].color;
      let valuePt = payTable[j].value;

      if (valueWh === valuePt) {
        possibleCombs.push(payTable[j]);
        if (colorPt === 'red') {
          possibleCombs.push(payTable.find(obj => obj.value === 'AR'));
        } else if (colorPt === 'black') {
          possibleCombs.push(payTable.find(obj => obj.value === 'AB'));
        }
      }
    }

    allBets.forEach(objectVc => {
      let valueCh = objectVc?.value;
      let colorCh = objectVc?.color;
      let bet = objectVc?.currentBet;

      for (let i = 0; i < possibleCombs.length; i += 1) {
        let balance = this.scene.stats.balance;
        let currentWin = this.scene.stats.currentWin;
        let valuePc = possibleCombs[i].value;
        let colorPc = possibleCombs[i].color;
        let valuePcCoef = possibleCombs[i].coef;
        let winValue = bet * valuePcCoef;

        if (valueCh === valuePc) {
          this.scene.stats.setBalanceValue((balance += winValue));
          this.scene.stats.setCurrentWinValue((currentWin = winValue));
          this.notifications.successNotification(objectVc, valuePcCoef);
        }
      }
      if ((valueCh !== valueWh && colorCh !== colorWh) || (valueCh !== valueWh && colorCh === colorWh && typeof valueCh !== 'string')) {
        if (!this.scene.state.autoStart) {
          this.scene.stats.setTotalBetValue(0);
        }
        this.scene.stats.setCurrentWinValue(0);
        this.notifications.errorNotification(objectVc);
      }
    });

    if (this.scene.state.autoStart) {
      if (this.scene.stats.balance === 0 && this.scene.stats.balance < this.scene.stats.currentBet) {
        this.notifications.alertNotification('Top up your balance to continue playing!');
        this.scene.state.autoStart = false;
        this.scene.state.valueChip = [];
        this.scene.stats.setBalanceValue(0);
        this.scene.stats.setCurrentBetValue(0);
        this.scene.stats.setTotalBetValue(0);
      }
    }
  }
}
