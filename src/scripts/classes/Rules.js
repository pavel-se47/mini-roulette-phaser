import limits from '../../limits.json';

export default class Rules {
  constructor(scene) {
    this.scene = scene;
    this.containerRules = null;
  }

  create() {
    this.createButtonRulesAndLimits();
  }

  createButtonRulesAndLimits() {
    const buttonRules = this.scene.add.circle(1200, 420, 30, '0xffffff').setInteractive();

    const buttonRulesText = this.scene.add.text(1196, 405, 'i', {
      font: 'bold 30px Arial',
      fill: 'black',
      align: 'center',
    });

    buttonRules.on('pointerdown', this.createRulesAndLimits, this.scene);
  }

  createRulesAndLimits() {
    const statsRectangle = this.add.rectangle(1494, 315, 650, 270, 0xffffff);

    const rulesText = this.add.text(
      this.x / 2 + 220,
      this.y / 2 - 350,
      'Правила игры.\n\nВыберите фишку в поле "Your Bet", которую хотите поставить.\nСделайте ставку в "Chip Zone".\nНажмите кнопку "SPIN" или "Start Auto Spin".\nКолесо начнет крутится и укажет на выигрышный сектор.\nНомер и цвет выпавшего сектора отобразится в центре круга \nдо следующей Вашей ставки.',
      {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      }
    );

    const limitsNumbersText = this.add.text(this.x / 2 + 270, this.y / 2 - 150, `Limits 'AR' and 'AB' bet \nmax ${limits.colors} credits`, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const limitsColorsText = this.add.text(this.x / 2 + 600, this.y / 2 - 150, `Limits numbers bet \nmax ${limits.numbers} credits`, {
      font: 'bold 20px Arial',
      fill: 'black',
      align: 'center',
    });

    const closeText = this.add
      .text(this.x / 2 + 830, this.y / 2 - 350, 'X', {
        font: 'bold 20px Arial',
        fill: 'black',
        align: 'center',
      })
      .setInteractive();

    this.containerRules = this.add.container(0, 0, [statsRectangle, rulesText, limitsNumbersText, limitsColorsText, closeText]);

    closeText.on(
      'pointerdown',
      () => {
        this.containerRules.destroy();
      },
      this
    );
  }
}
