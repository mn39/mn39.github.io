export class Card {
  constructor(stageWidth, stageHeight, x, y, facedUp, cardNumber) {
    this.facedUp = facedUp;
    this.flipProgress = facedUp ? 1 : 0;
    this.cardNumber = cardNumber;
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    this.width = 100;
    this.height = 250;

    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
  }

  flip() {
    this.facedUp = !this.facedUp;
  }

  draw(ctx) {
    // 애니메이션 처리
    if (this.facedUp && this.flipProgress < 1) {
      this.flipProgress += 0.1;
    }
    if (!this.facedUp && this.flipProgress > 0) {
      this.flipProgress -= 0.1;
    }

    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(Math.abs(this.flipProgress - 0.5) * 2, 1); // X축으로 크기 변화
    ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));

    // 카드 색상
    ctx.fillStyle = this.facedUp ? 'white' : 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // 카드 숫자 (절반 이상 열렸을 때만 보이도록)
    if (this.facedUp && this.flipProgress > 0.5) {
      ctx.fillStyle = 'black';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        this.cardNumber,
        this.x + this.width / 2,
        this.y + this.height / 2
      );
    }

    ctx.restore();
  }
}
