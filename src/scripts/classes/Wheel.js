import Colors from './Colors';

export default class Wheel {
  constructor(scene) {
    this.scene = scene;
    this.isSpinning = false;
    this.spinDuration = 3000;
    this.containerWheel = null;
    this.textWheel = [];
    this.colors = new Colors();
  }

  createWheel() {
    const radius = 200;
    const graphicsForWheel = this.scene.add.graphics();

    for (let i = 0; i < this.scene.sectors; i += 1) {
      const startAngle = (i / this.scene.sectors) * Phaser.Math.PI2;
      const endAngle = ((i + 1) / this.scene.sectors) * Phaser.Math.PI2;
      const color = this.scene.valueColorsWheel[i];

      graphicsForWheel.fillStyle(color);
      graphicsForWheel.beginPath();
      graphicsForWheel.moveTo(0, 0);
      graphicsForWheel.arc(0, 0, radius, startAngle, endAngle);
      graphicsForWheel.closePath();
      graphicsForWheel.fillPath();

      const centerX = radius * 0.8 * Math.cos((startAngle + endAngle) / 2);
      const centerY = radius * 0.8 * Math.sin((startAngle + endAngle) / 2);

      const text = this.scene.add
        .text(centerX, centerY, this.scene.valueNumbersWheel[i], {
          font: 'bold 26px Arial',
          fill: 'white',
        })
        .setOrigin(0.5)
        .setRotation(startAngle + (endAngle - startAngle) / 2);

      this.textWheel.push(text);
    }

    graphicsForWheel.lineStyle(8, 0xffffff).strokeCircle(0, 0, radius);

    this.containerWheel = this.scene.add.container(this.scene.x / 2, 250);
    this.containerWheel.add(graphicsForWheel);
    this.containerWheel.add(this.textWheel);
  }

  createButtonOnWheel() {
    this.buttonOnWheel = this.scene.add.circle(0, 0, 50, 0xffa500).setStrokeStyle(8, 0xffffff);

    this.buttonOnWheelText = this.scene.add
      .text(0, 0, 'SPIN', {
        font: 'bold 30px Arial',
        fill: 'white',
      })
      .setOrigin(0.5);

    this.containerButtonOnWheel = this.scene.add
      .container(this.scene.x / 2, 250, [this.buttonOnWheel, this.buttonOnWheelText])
      .setSize(85, 85)
      .setInteractive()
      .on(
        'pointerdown',
        () => {
          this.spin(this.scene);
        },
        this.scene
      );
  }

  createArrowForWheel() {
    const triangle = new Phaser.Geom.Triangle(this.scene.x / 2, 70, this.scene.x / 2 - 30, 20, this.scene.x / 2 + 30, 20);

    const graphicsForTriangle = this.scene.add
      .graphics({
        fillStyle: { color: 0xffa500 },
      })
      .fillTriangleShape(triangle)
      .lineStyle(8, 0xffffff)
      .strokeTriangleShape(triangle);
  }

  spin() {
    if (!this.scene.state.valueChip.length) {
      this.scene.notifications.infoNotification('Place your chip!');
      return;
    }

    this.scene.setValueWheel();
    this.onSetDefaultTextButton();
    this.targetAngle = this.currentAngleRotate(this.scene.state.valueWheel.value);

    if (!this.isSpinning) {
      this.isSpinning = true;

      this.scene.tweens.add({
        targets: this.containerWheel,
        angle: this.targetAngle,
        duration: this.spinDuration,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          this.isSpinning = false;
          this.buttonOnWheelText.setText(this.scene.state.valueWheel.value);
          this.buttonOnWheel.fillColor = this.scene.state.valueWheel.colorHex;
          this.scene.pay();
          this.scene.autoStart.startAutoSpinInterval();
          if (!this.scene.state.autoStart) {
            this.scene.chipZone.chipArray.forEach(obj => {
              if (obj.value) {
                obj.value = 0;
                obj.valueText.setText('');
              }
            });
          }
        },
      });
    }
  }

  onSetDefaultTextButton() {
    this.buttonOnWheelText.setText('SPIN');
    this.buttonOnWheel.fillColor = '0xffa500';
  }

  currentAngleRotate(number) {
    const startAngle = 265;
    const currAngle = 360 / this.scene.sectors;

    for (let i = 0; i < this.scene.sectors; i += 1) {
      if (this.scene.valueNumbersWheel[i] === number) {
        return 360 + startAngle - currAngle * i;
      }
    }
  }
}
