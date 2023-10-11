import Colors from './Colors';

export default class Wheel {
  constructor(scene) {
    this.scene = scene;//TODO scene здесь нужна, чтобы создавать объекты, а не брать какую то инфу из scene. Например (this.scene.sectors), можно только (this.scene.add)
    this.isSpinning = false;
    this.spinDuration = 3000;
    this.containerWheel = null;
    this.colors = new Colors();
    this.create();
  }

  create() {
    this.createWheel();
    this.createButtonOnWheel();
    this.createArrowForWheel();
  }

  createWheel() {
    let textWheel = []; //TODO  бессмысленно делать здесь массив, если в дальнейшем ты не собираешься его использоват
                        // а если собираешься, то не сможешь, т.к. этот массив будет находится только в этой области кода
    const radius = 200;
    const graphicsForWheel = this.scene.add.graphics();

    for (let i = 0; i < this.scene.sectors; i += 1) {//TODO он должен получить массив с секторами извне
      const startAngle = (i / this.scene.sectors) * Phaser.Math.PI2;
      const endAngle = ((i + 1) / this.scene.sectors) * Phaser.Math.PI2;
      const color = this.scene.valueColorsWheel[i]; //TODO он должен получить массив с значениями и цветами извне, через передаваемое значение в конструкторе и присваивать его себе

      graphicsForWheel.fillStyle(color).beginPath().moveTo(0, 0).arc(0, 0, radius, startAngle, endAngle).closePath().fillPath();

      const centerX = radius * 0.8 * Math.cos((startAngle + endAngle) / 2);
      const centerY = radius * 0.8 * Math.sin((startAngle + endAngle) / 2);

      const text = this.scene.add
        .text(centerX, centerY, this.scene.valueNumbersWheel[i], {
          font: 'bold 26px Arial',
          fill: 'white',
        })
        .setOrigin(0.5)
        .setRotation(startAngle + (endAngle - startAngle) / 2);

      textWheel.push(text);
    }

    graphicsForWheel.lineStyle(8, 0xffffff).strokeCircle(0, 0, radius);

    this.containerWheel = this.scene.add
      .container(this.scene.x / 2, 250)
      .add(graphicsForWheel)
      .add(textWheel)
      .setRotation(80);
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

  spin() { //TODO спин должен работать только со своими свойствами, вынеси всё что с ним не связано в главный класс, и используй спин оттуда
    if (this.checkBeforeSpin()) {//TODO
      this.scene.stats.setBalanceValue((this.scene.stats.balance -= this.scene.stats.totalBet));//TODO
      this.scene.setValueWheel();//TODO
      this.scene.onSetTextButton(this.scene.defaultTextButton, this.scene.defaultColorButton);//TODO

      let targetAngle = this.currentAngleRotate(this.scene.state.valueWheel.value); //TODO

      if (!this.isSpinning) {
        this.isSpinning = true;
        this.scene.tweens.add({
          targets: this.containerWheel,
          angle: targetAngle,
          duration: this.spinDuration,
          ease: 'Cubic.easeOut',
          onComplete: () => {
            this.isSpinning = false;
            this.scene.onSetTextButton(this.scene.state.valueWheel.value, this.scene.state.valueWheel.colorHex);//TODO
            this.scene.pay();//TODO
            this.scene.autoStart.startAutoSpinInterval();//TODO
            if (!this.scene.state.autoStart) {//TODO
              this.scene.state.valueChip = [];//TODO
              this.scene.chipZone.deleteValue();//TODO
            }
          },
        });
      }
    }
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

  checkBeforeSpin() {
    if (!this.scene.state.valueChip.length) {
      this.scene.notifications.infoNotification('Place your chip!');
      return;
    }
    return true;
  }
}
