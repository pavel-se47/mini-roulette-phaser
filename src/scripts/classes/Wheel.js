import Colors from './Colors';
import textStyle from '../../textStyle.json';

export default class Wheel {
  constructor(scene, sectors, numbers, colors) {
    this.scene = scene;
    this.sectors = sectors;
    this.colorSector = colors;
    this.numbers = numbers;
    this.isPlay = false;
    this.spinDuration = 3000;
    this.containerWheel = null;
    this.create();
  }

  create() {
    this.colors = new Colors();
    this.createWheel();
    this.createButtonOnWheel();
    this.createArrowForWheel();
  }

  createWheel() {
    const radius = 200;
    const graphicsForWheel = this.scene.add.graphics();

    this.containerWheel = this.scene.add.container(this.scene.x / 2, 250);

    for (let i = 0; i < this.sectors; i += 1) {
      const startAngle = (i / this.sectors) * Phaser.Math.PI2;
      const endAngle = ((i + 1) / this.sectors) * Phaser.Math.PI2;
      const color = this.colorSector[i];

      graphicsForWheel.fillStyle(color).beginPath().moveTo(0, 0).arc(0, 0, radius, startAngle, endAngle).closePath().fillPath();

      const centerX = radius * 0.8 * Math.cos((startAngle + endAngle) / 2);
      const centerY = radius * 0.8 * Math.sin((startAngle + endAngle) / 2);

      const text = this.scene.add
        .text(centerX, centerY, this.numbers[i], textStyle.textInSectorWheel)
        .setOrigin(0.5)
        .setRotation(startAngle + (endAngle - startAngle) / 2);

      this.containerWheel.add(graphicsForWheel).add(text).setRotation(80);
    }
    graphicsForWheel.lineStyle(8, 0xffffff).strokeCircle(0, 0, radius);
  }

  createButtonOnWheel() {
    this.buttonOnWheel = this.scene.add.circle(0, 0, 50, this.scene.defaultColorButton).setStrokeStyle(8, 0xffffff);
    this.buttonOnWheelText = this.scene.add.text(0, 0, this.scene.defaultTextButton, textStyle.buttonOnWheelText).setOrigin(0.5);
    this.containerButtonOnWheel = this.scene.add
      .container(this.scene.x / 2, 250, [this.buttonOnWheel, this.buttonOnWheelText])
      .setSize(85, 85)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          if (!this.isPlay) {
            this.scene.spin();
          }
        },
        this.scene
      );
  }

  createArrowForWheel() {
    const triangle = new Phaser.Geom.Triangle(this.scene.x / 2, 70, this.scene.x / 2 - 30, 20, this.scene.x / 2 + 30, 20);
    this.graphicsForTriangle = this.scene.add
      .graphics({
        fillStyle: { color: 0xffa500 },
      })
      .fillTriangleShape(triangle)
      .lineStyle(8, 0xffffff)
      .strokeTriangleShape(triangle);
  }

  rotation() {
    let targetAngle = this.currentAngleRotate(this.scene.state.valueWheel.value);
    if (!this.isPlay) {
      this.isPlay = true;
      this.tween = this.scene.tweens.add({
        targets: this.containerWheel,
        angle: targetAngle,
        duration: this.spinDuration,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.isPlay = false;
        },
      });
    }
  }

  currentAngleRotate(number) {
    const startAngle = 265;
    const currAngle = 360 / this.sectors;

    for (let i = 0; i < this.sectors; i += 1) {
      if (this.numbers[i] === number) {
        return 360 + startAngle - currAngle * i;
      }
    }
  }

  destroyClass() {
    this.colors = null;
    this.containerWheel?.destroy();
    this.containerButtonOnWheel?.destroy();
    this.graphicsForTriangle?.destroy();
    this.tween?.destroy();
  }
}
