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
    this.scene.state.valueChip.forEach(object => {
      if (object?.value === this.scene.state.valueWheel?.value) {
        (this.scene.state.balance += object.currentBet * 8),
          (this.scene.state.currentWin = object.currentBet * 8),
          this.scene.stats.createStats(this.scene);
        this.notifications.successNotification(object, 8);
      } else if (object?.value !== this.scene.state.valueWheel?.value && object?.color === this.scene.state.valueWheel.color) {
        (this.scene.state.balance += object.currentBet * 2),
          (this.scene.state.currentWin = object.currentBet * 2),
          this.scene.stats.createStats(this.scene);
        this.notifications.successNotification(object, 2);
        return;
      } else if (object?.value !== this.scene.state.valueWheel?.value) {
        this.scene.state.currentWin = 0;
        this.notifications.errorNotification(object);

        return;
      }
    });

    if (this.scene.state.autoStart) {
      this.scene.state.balance -= this.scene.state.generalBetSum;
      if (this.scene.state.balance === 0 && this.scene.state.balance < this.scene.state.currentBet) {
        this.notifications.alertNotification('Top up your balance to continue playing!')((this.scene.state.autoStart = false)),
          (this.scene.state.balance = 0),
          (this.scene.state.currentBet = 0),
          (this.scene.state.valueChip = []);
        return;
      }
    } else {
      this.scene.state.valueChip = [];
      this.scene.state.generalBetSum = 0;
    }
  }
}
