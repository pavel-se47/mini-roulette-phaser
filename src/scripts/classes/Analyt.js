import payTable from '../../payTable.json';
import Notifications from '../classes/Notifications';

export default class Analyt {
  constructor(scene) {
    this.scene = scene;
    this.notifications = new Notifications();
  }

  getValue(endValue) {
    return Phaser.Utils.Array.GetRandom(payTable, 2, endValue);
  }

  valueWheelCheck(winValue, allBets) {
    let valueWh = winValue.value;
    let colorWh = winValue.color;
    let possibleCombs = [];

    payTable.forEach(objectPt => {
      let valuePt = objectPt.value;

      if (valueWh === valuePt) {
        possibleCombs.push(objectPt);

        payTable.forEach(obj => {
          if (colorWh === obj.color && typeof obj.value === 'string') {
            possibleCombs.push(obj);
          }
        });
      }
    });

    allBets.forEach(objectVc => {
      let valueCh = objectVc?.value;
      let colorCh = objectVc?.color;
      let bet = objectVc?.currentBet;

      possibleCombs.forEach(objectPc => {
        let balance = this.scene.stats.balance;
        let currentWin = this.scene.stats.currentWin;
        let valuePc = objectPc.value;
        let valuePcCoef = objectPc.coef;
        let winValue = bet * valuePcCoef;

        if (valueCh === valuePc) {
          this.scene.stats.setBalanceValue((balance += winValue));
          this.scene.stats.setCurrentWinValue((currentWin = winValue));
          this.notifications.successNotification(objectVc, valuePcCoef);
        }
      });

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
        this.scene.state.timer = 10;
        this.scene.autostart.spinViaText.setText(`SPIN VIA ${this.scene.state.timer} secs`);
        this.scene.stats.setBalanceValue(0);
        this.scene.stats.setCurrentBetValue(0);
        this.scene.stats.setTotalBetValue(0);
      }
    }
  }
}
