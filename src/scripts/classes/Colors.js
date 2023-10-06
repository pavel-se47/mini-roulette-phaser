export default class Colors {
  constructor(scene) {
    this.scene = scene;
  }

  currentColor(value) {
    if (this.scene.scene.greenValue.includes(value)) {
      return 'green';
    } else if (this.scene.scene.redValue.includes(value)) {
      return 'red';
    } else if (this.scene.scene.blackValue.includes(value)) {
      return 'black';
    }
  }

  currentColorHex(value) {
    if (this.scene.scene.greenValue.includes(value)) {
      return '0x00cc00';
    } else if (this.scene.scene.redValue.includes(value)) {
      return '0xff0000';
    } else if (this.scene.scene.blackValue.includes(value)) {
      return '0x000000';
    }
  }
}
