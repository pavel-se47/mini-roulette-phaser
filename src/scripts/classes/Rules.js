import limits from '../../limits.json';

export default class Rules extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    this.create();
  }

  create() {
    this.createButtonRulesAndLimits();
    this.createRulesAndLimits();
  }

  createButtonRulesAndLimits() {
    const buttonRules = this.scene.add.circle(1200, 420, 30, '0xffffff').setInteractive();

    const buttonRulesText = this.scene.add.text(1196, 405, 'i', {
      font: 'bold 30px Arial',
      fill: 'black',
      align: 'center',
    });

    buttonRules.on('pointerdown', () => {
      this.toggleRulesAndLimits();
    });
  }

  createRulesAndLimits() {
    const statsRectangle = this.scene.add.rectangle(0, 0, 650, 270, 0xffffff);

    const rulesText = this.scene.add.text(
      -315,
      -130,
      'Правила игры.\n\nВыберите фишку в поле "Your Bet", которую хотите поставить.\nСделайте ставку в "Chip Zone".\nНажмите кнопку "SPIN" или "Start Auto Spin".\nКолесо начнет крутится и укажет на выигрышный сектор.\nНомер и цвет выпавшего сектора отобразится в центре круга \nдо следующей Вашей ставки.',
      {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      }
    );

    const limitsNumbersText = this.scene.add.text(-270, 80, `Limits 'AR' and 'AB' bet \nmax ${limits.colors} credits`, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const limitsColorsText = this.scene.add.text(80, 80, `Limits numbers bet \nmax ${limits.numbers} credits`, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const closeText = this.scene.add
      .text(300, -130, 'X', {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      })
      .setInteractive();

    this.add([statsRectangle, rulesText, limitsNumbersText, limitsColorsText, closeText]).setVisible(!this.visible);

    closeText.on('pointerdown', () => {
      this.toggleRulesAndLimits();
    });
  }

  toggleRulesAndLimits() {
    this.setVisible(!this.visible);
  }
}
