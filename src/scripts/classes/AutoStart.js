import textStyle from '../../textStyle.json';

export default class AutoStart {
  constructor(scene, sectors) {
    this.scene = scene;
    this.sectors = sectors;
    this.interval = null;
    this.autoStartTime = 10;
    this.containerStartAutoStart = null;
    this.containerStopAutoStart = null;
    this.create();
  }

  create() {
    this.createAutoStartPanel();
  }

  startAutoSpinInterval() {
    if (!this.interval) {
      if (this.scene.state.autoStart) {
        this.interval = setInterval(() => {
          this.scene.state.timer = this.scene.state.timer === 0 ? this.autoStartTime : this.scene.state.timer - 1;
          this.spinViaText.setText(`SPIN VIA ${this.scene.state.timer} secs`);

          if (this.scene.state.timer === 0) {
            this.scene.spin(this.sectors);
            this.stopAutoSpinInterval();
            this.interval = null;
          }
        }, 1000);
      }
    }
  }

  stopAutoSpinInterval() {
    clearInterval(this.interval);
    this.interval = null;
  }

  createAutoStartPanel() {
    const startAutoStartRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);
    const startAutoStartText = this.scene.add.text(0, 0, 'Start Auto Spin', textStyle.startAutoStartText).setOrigin(0.5);
    this.containerStartAutoStart = this.scene.add
      .container(this.scene.x / 2 + 400, this.scene.y / 2 + 115, [startAutoStartRectangle, startAutoStartText])
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

    this.spinViaRectangle = this.scene.add.rectangle(this.scene.x / 2 + 400, this.scene.y / 2 + 215, 180, 80, 0xffffff);
    this.spinViaText = this.scene.add.text(
      this.scene.x / 2 + 320,
      this.scene.y / 2 + 205,
      `SPIN VIA ${this.scene.state.timer} secs`,
      textStyle.spinViaText
    );

    const stopAutoStartRectangle = this.scene.add.rectangle(0, 0, 180, 80, 0xffffff);
    const stopAutoStartText = this.scene.add.text(0, 0, 'Stop Auto Spin', textStyle.stopAutoStartText).setOrigin(0.5);
    this.containerStopAutoStart = this.scene.add
      .container(this.scene.x / 2 + 400, this.scene.y / 2 + 315, [stopAutoStartRectangle, stopAutoStartText])
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
  }

  destroyClass() {
    this.containerStartAutoStart.destroy();
    this.spinViaRectangle.destroy();
    this.spinViaText.destroy();
    this.containerStopAutoStart.destroy();
  }
}
