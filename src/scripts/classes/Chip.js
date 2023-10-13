import textStyle from '../../textStyle.json';

export default class Chip extends Phaser.GameObjects.Container {
  constructor(scene, x, y, w, h, color, number) {
    super(scene);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.value = 0;
    this.color = color;
    this.number = number;
    this.createChipZone(this.scene, w, h, color, number);
  }

  createChipZone(context, w, h, color, number) {
    this.rec = context.add.rectangle(0, 0, w, h, color);
    this.text = context.add.text(0, 0, number, textStyle.textInChip).setOrigin(0.5);
    this.valueText = context.add.text(-20, -20, '', textStyle.textValueInChip).setOrigin(0.5);

    this.add(this.rec);
    this.add(this.text);
    this.add(this.valueText);
  }

  setCallback(cb, cbContext) {
    this.rec.setInteractive().on('pointerdown', cb, cbContext);
  }
}
