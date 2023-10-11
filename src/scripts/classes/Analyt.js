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
        let valuePtCoef = payTable[i].coef;
        if (
          (valueCh === valuePt && valueCh === valueWh) ||
          (valueCh === valuePt && valueCh !== valueWh && colorCh === colorWh && typeof valueCh === 'string')
        ) {
          (this.scene.stats.balance += bet * valuePtCoef), (this.scene.stats.currentWin = bet * valuePtCoef), this.scene.stats.create();
          this.notifications.successNotification(object, valuePtCoef);
        }
      }

      if ((valueCh !== valueWh && typeof valueCh === 'number') || colorCh !== colorWh) {
        if (!this.scene.state.autoStart) {
          this.scene.stats.generalBetSum = 0;
        }
        this.scene.stats.currentWin = 0;
        this.scene.stats.create();
        this.notifications.errorNotification(object);
      }
    });

    if (this.scene.state.autoStart) {
      if (this.scene.stats.balance === 0 && this.scene.stats.balance < this.scene.stats.currentBet) {
        this.notifications.alertNotification('Top up your balance to continue playing!')((this.scene.state.autoStart = false)),
          (this.scene.stats.balance = 0),
          (this.scene.stats.currentBet = 0),
          (this.scene.stats.generalBetSum = 0);
        this.scene.state.valueChip = [];
        this.scene.stats.create();
      }
    }
  }
}
