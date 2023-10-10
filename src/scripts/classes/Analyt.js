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

    this.scene.state.valueChip.forEach(object => {
      let valueCh = object?.value;
      let colorCh = object?.color;
      let bet = object?.currentBet;

      for (let i = 0; i < payTable.length; i += 1) {
        let valuePt = payTable[i].value;
        let valueCoef = payTable[i].coef;
        if (
          (valueCh === valuePt && valueCh === valueWh) ||
          (valueCh === valuePt && valueCh !== valueWh && colorCh === colorWh && typeof valueCh === 'string')
        ) {
          (this.scene.state.balance += bet * valueCoef), (this.scene.state.currentWin = bet * valueCoef), this.scene.stats.createStats(this.scene);
          this.notifications.successNotification(object, valueCoef);
        }
      }

      if ((valueCh !== valueWh && typeof valueCh === 'number') || colorCh !== colorWh) {
        this.scene.state.currentWin = 0;
        this.scene.state.generalBetSum = 0;
        this.scene.stats.createStats(this.scene);
        this.notifications.errorNotification(object);
      }
    });

    if (this.scene.state.autoStart) {
      this.scene.state.balance -= this.scene.state.generalBetSum;
      if (this.scene.state.balance === 0 && this.scene.state.balance < this.scene.state.currentBet) {
        this.notifications.alertNotification('Top up your balance to continue playing!')((this.scene.state.autoStart = false)),
          (this.scene.state.balance = 0),
          (this.scene.state.currentBet = 0),
          (this.scene.state.generalBetSum = 0);
        this.scene.state.valueChip = [];
        this.scene.stats.createStats(this.scene);
        return;
      }
    } else {
      this.scene.state.valueChip = [];
      this.scene.state.generalBetSum = 0;
      this.scene.stats.createStats(this.scene);
    }
  }
}
