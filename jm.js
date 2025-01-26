export class Eye {
  constructor(x, y, xGap, yGap, radius) {
    this.x = x;
    this.y = y;
    this.xGap = xGap;
    this.yGap = yGap;
    this.radius = radius;

    this.maxSense = 300;
  }

  draw(ctx, mouseX, mouseY) {
    let dx = mouseX / 2 - this.x;
    let dy = mouseY / 2 - this.y;
    dx = Math.min(dx, this.maxSense);
    dy = Math.min(dy, this.maxSense);
    dx = Math.max(dx, -this.maxSense);
    dy = Math.max(dy, -this.maxSense); // dx, dy의 값이 maxSense를 넘지 않도록 제한

    ctx.beginPath();
    ctx.arc(
      this.x + (dx * this.xGap) / this.maxSense,
      this.y + (dy * this.yGap) / this.maxSense,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'black';
    ctx.fill();
  }
}

export class JM {
  constructor(fontsize, x, y) {
    this.fontsize = fontsize;
    this.x = x;
    this.y = y;

    this.eye1 = new Eye(this.x + 77, this.y + 12, 5, 7, 5);
    this.eye2 = new Eye(this.x + 105, this.y + 12, 5, 7, 5);
  }

  draw(ctx, mouseX, mouseY) {
    const text = 'Jihwan Moon';
    const textWidth = ctx.measureText(text).width;
    const textHeight = this.fontsize;

    ctx.font = this.fontsize.toString() + 'px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(text, this.x - textWidth / 2, this.y + textHeight / 2);

    this.eye1.draw(ctx, mouseX, mouseY);
    this.eye2.draw(ctx, mouseX, mouseY);
  }
}
