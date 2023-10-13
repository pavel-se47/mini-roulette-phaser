import limits from '../../limits.json';
import textStyle from '../../textStyle.json';

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

    const buttonRulesText = this.scene.add.text(1196, 405, 'i', textStyle.buttonRulesText);

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
      textStyle.rulesText
    );

    const limitsNumbersText = this.scene.add.text(-270, 80, `Limits 'AR' and 'AB' bet \nmax ${limits.colors} credits`, textStyle.limitsNumbersText);

    const limitsColorsText = this.scene.add.text(80, 80, `Limits numbers bet \nmax ${limits.numbers} credits`, textStyle.limitsColorsText);

    const closeText = this.scene.add.text(300, -130, 'X', textStyle.closeText).setInteractive();

    this.add([statsRectangle, rulesText, limitsNumbersText, limitsColorsText, closeText]).setVisible(!this.visible);

    closeText.on('pointerdown', () => {
      this.toggleRulesAndLimits();
    });
  }

  toggleRulesAndLimits() {
    this.setVisible(!this.visible);
  }
}
