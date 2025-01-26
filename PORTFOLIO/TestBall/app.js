import { Ball } from './ball.js';
import { Block } from './block.js';
class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    this.Ball = new Ball(this.stageWidth, this.stageHeight, 60, 15);
    this.Block = new Block(700, 30, 300, 450);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.Block.draw(this.ctx);
    this.Ball.draw(this.ctx, this.stageWidth, this.stageHeight, this.Block);
  }
}

window.onload = () => {
  new App();
};
