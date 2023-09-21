import Phaser from "phaser";
import mainLogo from "../../assets/mainLogo.png";
import chipboard from "../../assets/chipboard.png";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    this.load.image("logo", mainLogo);
    this.load.image("chipboard", chipboard);
  }

  create() {
    this.scene.start("Preload");
  }
}
