import { Tree } from './tree.js';

class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // this.tree = new Tree(
    //   0,
    //   document.body.clientHeight / 4,
    //   '#000000',
    //   20,
    //   -0,
    //   'F',
    //   [
    //     // { l: 'F', r: 'F{F}' },
    //     // { l: 'X', r: 'F{-[[X]+X]+F[+FX]-X}' },
    //   ]
    // );

    this.tree = new Tree(
      document.body.clientWidth / 8,
      document.body.clientHeight / 4,
      '#000000',
      60,
      -0,
      'F++F++F',
      [{ l: 'F', r: 'F{-F++F-F}' }]
    );

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.tree.resize(this.stageWidth, this.stageHeight);
  }

  animate(t) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.tree.draw(this.ctx);
    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};
