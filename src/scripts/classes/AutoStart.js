import Wheel from "../classes/Wheel";

export default class AutoStart {
  constructor(scene) {
    this.scene = scene;
    this.interval = null;
    this.wheel = new Wheel(this.scene);
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

  stopAutoSpinInterval() {
    clearInterval(this.interval);
  }

  createAutoStartPanel = () => {
    const startAutoStartRectangle = this.scene.add
      .rectangle(
        this.scene.x / 2 + 370,
        this.scene.y / 2 + 110,
        180,
        80,
        0xffffff
      )
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.scene.state.autoStart = true;
          this.startAutoSpinInterval();
        },
        this.scene
      );

    const startAutoStartText = this.scene.add
      .text(this.scene.x / 2 + 300, this.scene.y / 2 + 100, "Start Auto Spin", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.scene.state.autoStart = true;
          this.startAutoSpinInterval();
        },
        this.scene
      );

    const spinViaRectangle = this.scene.add.rectangle(
      this.scene.x / 2 + 370,
      this.scene.y / 2 + 210,
      180,
      80,
      0xffffff
    );

    this.scene.spinViaText = this.scene.add.text(
      this.scene.x / 2 + 290,
      this.scene.y / 2 + 200,
      `SPIN VIA ${this.scene.state.timer} secs`,
      {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      }
    );

    const stopAutoStartRectangle = this.scene.add
      .rectangle(
        this.scene.x / 2 + 370,
        this.scene.y / 2 + 310,
        180,
        80,
        0xffffff
      )
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.scene.state.autoStart = false;
          this.stopAutoSpinInterval();
        },
        this.scene
      );

    const stopAutoStartText = this.scene.add
      .text(this.scene.x / 2 + 300, this.scene.y / 2 + 300, "Stop Auto Spin", {
        font: "bold 20px Arial",
        fill: "black",
        align: "center",
      })
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          this.scene.state.autoStart = false;
          this.stopAutoSpinInterval();
        },
        this.scene
      );
  };
}
