export class Point {
  constructor(cur, x, y, speed = 0.1) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = speed;
    this.cur = cur;
    this.max = Math.random() * 100 + 150;
    // this.max = 200;
  }

  update() {
    this.cur += this.speed;
    this.y = this.fixedY + Math.sin(this.cur) * this.max;
  }
}
