import Phaser from "phaser";

export default class Chip extends Phaser.GameObjects.Sprite {
  constructor(context, x, y, w, h, c, n) {
    super(context);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    this.n = n;
    this.createChipZone(
      context,
      this.x,
      this.y,
      this.w,
      this.h,
      this.c,
      this.n
    );
  }

  createChipZone(context, x, y, w, h, c, n) {
    const rec = context.add.rectangle(x, y, w, h, c);
    const text = context.add
      .text(x, y, n, {
        font: "bold 24px Arial",
        fill: "white",
      })
      .setOrigin(0.5);
  }
}
