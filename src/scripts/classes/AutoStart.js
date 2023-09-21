import Wheel from "../classes/Wheel";

export default class AutoStart {
  constructor(scene) {
    this.scene = scene;
    this.interval = null;
    this.wheel = new Wheel(this);
  }

  startAutoSpinInterval() {
    if (this.scene.state.autoStart) {
      this.interval = setInterval(() => {
        this.scene.state.timer =
          this.scene.state.timer === 0 ? 10 : this.scene.state.timer - 1;
        this.scene.spinViaText.setText(
          `SPIN VIA ${this.scene.state.timer} secs`
        );
        if (this.scene.state.timer === 0) {
          this.wheel.spin(this.scene);
          this.stopAutoSpinInterval();
        }
      }, 1000);
    }
  }

  stopAutoSpinInterval = () => {
    clearInterval(this.interval);
  };
}
