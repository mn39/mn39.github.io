import { Point } from './point.js';

export class Tree {
  constructor(
    initX,
    initY,
    color = '#ffffff',
    dAngle = 20,
    angle = 90,
    axiom = 'X',
    rules = []
  ) {
    this.initX = initX;
    this.initY = initY;
    this.color = color;
    this.axiom = axiom;
    this.sentence = axiom;
    this.angle = angle * (Math.PI / 180);
    this.angleChange = dAngle * (Math.PI / 180);
    this.currentIteration = 0;
    this.growingProgress = 1;
    this.rules = rules;
    this.time = Date.now();
  }

  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.size = Math.min(this.stageWidth, this.stageHeight) / 200;
    this.init();
  }

  applyRules(sentence) {
    let nextSentence = '';
    for (let i = 0; i < sentence.length; i++) {
      let current = sentence.charAt(i);
      let found = false;
      for (let j = 0; j < this.rules.length; j++) {
        if (current == this.rules[j].l) {
          nextSentence += this.rules[j].r;
          found = true;
          break;
        }
      }
      if (!found && current != '{' && current != '}') {
        nextSentence += current;
      }
    }
    return nextSentence;
  }

  init() {}

  setIteration(iteration) {
    if (Math.floor(iteration) != this.currentIteration) {
      let sentence = this.axiom;
      for (let i = 0; i < Math.floor(iteration); i++) {
        sentence = this.applyRules(sentence);
      }

      this.sentence = sentence;
    }
    this.growingProgress = iteration - Math.floor(iteration);
  }

  draw(ctx) {
    // this.setIteration(2);
    this.setIteration(Math.min((Date.now() - this.time) / 1000, 5));
    // console.log(Math.min((Date.now() - this.time) / 1000, 5));
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    ctx.moveTo(this.initX, this.initY);
    let x = this.initX;
    let y = this.initY;
    let angle = this.angle;
    let stack = [];
    let growingMode = false;

    for (let i = 0; i < this.sentence.length; i++) {
      let current = this.sentence.charAt(i);
      let growingVariable = growingMode
        ? Math.pow(this.growingProgress, 1.2)
        : 1;

      if (current == 'F' || current == 'X') {
        x += Math.cos(angle) * this.size * growingVariable;
        y += Math.sin(angle) * this.size * growingVariable;
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (current == '+') {
        angle += this.angleChange * growingVariable;
      } else if (current == '-') {
        angle -= this.angleChange * growingVariable;
      } else if (current == '[') {
        stack.push({
          x: x,
          y: y,
          angle: angle,
        });
      } else if (current == ']') {
        let state = stack.pop();
        x = state.x;
        y = state.y;
        angle = state.angle;
        ctx.moveTo(x, y);
      } else if (current == '{') growingMode = true;
      else if (current == '}') growingMode = false;
    }
  }
}
