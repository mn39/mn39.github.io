import { JM } from './jm.js';
class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    this.mouseX = 0;
    this.mouseY = 0;

    // 마우스 움직임 이벤트 등록
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this.JM = new JM(50, this.stageWidth / 2, this.stageHeight / 2 - 100);

    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);
  }

  handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect(); // 캔버스의 위치 가져오기
    this.mouseX = (event.clientX - rect.left) * 2; // 캔버스 기준 X 좌표
    this.mouseY = (event.clientY - rect.top) * 2; // 캔버스 기준 Y 좌표
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.JM.draw(this.ctx, this.mouseX, this.mouseY);
  }
}

window.onload = () => {
  new App();
};
