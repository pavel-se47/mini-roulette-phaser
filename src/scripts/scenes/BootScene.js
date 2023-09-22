import bg0 from "../../assets/bg0.png";
import bg1 from "../../assets/bg1.png";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("bg0", bg0);
    this.load.image("bg1", bg1);
  }

  create() {
    this.scene.start("Preload");
  }
}
