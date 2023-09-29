import Wheel from './Wheel';

export default class AutoStart {
  constructor(scene) {
    this.scene = scene;
    this.interval = null;
    this.containerStartAutoStart = null;
    this.containerStopAutoStart = null;
    this.wheel = new Wheel();
  }

  startAutoSpinInterval = () => {
    if (!this.interval) {
      if (this.scene.state.autoStart) {
        this.interval = setInterval(() => {
          this.scene.state.timer = this.scene.state.timer === 0 ? 10 : this.scene.state.timer - 1;
          this.scene.spinViaText.setText(`SPIN VIA ${this.scene.state.timer} secs`);

          if (this.scene.state.timer === 0) {
            this.scene.wheel.spin(this.scene);
            this.stopAutoSpinInterval();
            this.interval = null;
          }
        }, 1000);
      }
    }
  };

  stopAutoSpinInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  createAutoStartPanel = () => {
    const startAutoStartRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);

    const startAutoStartText = this.scene.add
      .text(0, 0, 'Start Auto Spin', {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      })
      .setOrigin(0.5);

    this.containerStartAutoStart = this.scene.add
      .container(this.scene.x / 2 + 220, this.scene.y / 2 + 115, [startAutoStartRectangle, startAutoStartText])
      .setSize(180, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.state.autoStart = true;
          this.startAutoSpinInterval();
        },
        this.scene
      );

    const spinViaRectangle = this.scene.add.rectangle(this.scene.x / 2 + 220, this.scene.y / 2 + 215, 180, 80, 0xffffff);

    this.scene.spinViaText = this.scene.add.text(this.scene.x / 2 + 140, this.scene.y / 2 + 205, `SPIN VIA ${this.scene.state.timer} secs`, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const stopAutoStartRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);

    const stopAutoStartText = this.scene.add
      .text(0, 0, 'Stop Auto Spin', {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      })
      .setOrigin(0.5);

    this.containerStopAutoStart = this.scene.add
      .container(this.scene.x / 2 + 220, this.scene.y / 2 + 315, [stopAutoStartRectangle, stopAutoStartText])
      .setSize(180, 80)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.scene.state.autoStart = false;
          this.stopAutoSpinInterval();
        },
        this.scene
      );
  };
}
