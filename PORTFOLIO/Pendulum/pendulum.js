export class Pendulum {
  constructor(canvas) {
    // 캔버스 참조
    this.canvas = canvas;

    // 기본 물리 상수 및 시뮬레이션 파라미터
    this.G = 9.81 * 10; // 중력가속도
    this.dt = 0.01; // 시뮬레이션에서 한 프레임당 시간 간격

    // 이중진자 기본값: 질량, 길이, 각도, 각속도 등
    this.m1 = 10;
    this.m2 = 10;
    this.l1 = 350;
    this.l2 = 100;
    this.theta1 = Math.PI / 2;
    this.theta2 = Math.PI / 2;
    this.omega1 = 0;
    this.omega2 = 0;

    // 드래그(마우스 조작) 관련 상태
    this.dragging = false;
    this.draggingSpeed = 0;
    this.dragIndex = null;

    // 마우스 좌표
    this.mouse = { x: 0, y: 0 };

    // 진자의 고정점(원점) 위치 (초기값으로 캔버스 중심 근처)
    this.origin = {
      x: canvas.width / 2,
      y: 200,
    };

    // 마우스 이벤트 등록
    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });

    canvas.addEventListener('mousedown', (e) => {
      this.dragging = true;

      const { x: x1, y: y1 } = this.getPendulumPos(1);
      const { x: x2, y: y2 } = this.getPendulumPos(2);

      // 첫 번째 질량/두 번째 질량 중 어느 쪽을 클릭했는지 판별
      const dx = x1 - this.origin.x;
      const dy = y1 - this.origin.y;

      // 2) atan2(dx, dy)는 "수직 아래가 0도"일 때, dy 축이 아래쪽(양의 코사인)인 기존 코드와 맞추기 위함
      //    만약 "수평이 0도" 형태로 사용하고 싶다면 atan2(dy, dx) 등을 조절해야 합니다.
      let angleRad =
        Math.atan2(dx, dy) -
        Math.atan2(this.mouse.x - this.origin.x, this.mouse.y - this.origin.y);

      console.log(angleRad);
      if (this.distance(this.mouse, { x: x2, y: y2 }) < 10) {
        this.dragging = true;
        this.dragIndex = 2;
      } else if (this.distance(this.mouse, { x: x1, y: y1 }) < 10) {
        this.dragging = true;
        this.dragIndex = 1;
      }
    });

    canvas.addEventListener('mouseup', () => {
      this.dragging = false;
      this.dragIndex = null;
    });
  }

  /**
   * 리사이즈 시 고정점(origin) 등 다시 세팅
   */
  resize(width, height) {
    this.origin.x = width / 2;
    this.origin.y = 200;
    // 필요에 따라 this.l1, this.l2 등을 조정해도 됨
  }

  /**
   * 두 점 사이 거리 계산
   */
  distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  /**
   * 진자(index=1/2)의 끝점 좌표 계산
   */
  getPendulumPos(index) {
    // 첫 번째 진자 끝점
    const x1 = this.origin.x + this.l1 * Math.sin(this.theta1);
    const y1 = this.origin.y + this.l1 * Math.cos(this.theta1);

    if (index === 1) {
      return { x: x1, y: y1 };
    }

    // 두 번째 진자 끝점
    const x2 = x1 + this.l2 * Math.sin(this.theta2);
    const y2 = y1 + this.l2 * Math.cos(this.theta2);
    return { x: x2, y: y2 };
  }

  /**
   * 이중진자 상태 갱신
   */
  updatePendulum() {
    console.log(this.omega1);
    // 드래그 상태면, 마우스 위치로 각도를 강제 지정
    if (this.dragging) {
      const { x, y } = this.getPendulumPos(this.dragIndex);

      // origin과 마우스의 상대 위치로부터 각도 구하기
      const dx = this.mouse.x - this.origin.x;
      const dy = this.mouse.y - this.origin.y;
      const angle = Math.atan2(dx, dy);

      if (this.dragIndex === 1) {
        this.theta1 = angle;
      } else if (this.dragIndex === 2) {
        this.theta2 = angle;
      }
      // 드래그 중에는 각속도를 0으로 리셋
      this.omega1 = 0;
      this.omega2 = 0;
      return;
    }

    // 라그랑주 역학 공식을 이용한 이중 진자 운동 업데이트
    const num1 = -this.G * (2 * this.m1 + this.m2) * Math.sin(this.theta1);
    const num2 = -this.m2 * this.G * Math.sin(this.theta1 - 2 * this.theta2);
    const num3 = -2 * Math.sin(this.theta1 - this.theta2) * this.m2;
    const num4 =
      this.omega2 ** 2 * this.l2 +
      this.omega1 ** 2 * this.l1 * Math.cos(this.theta1 - this.theta2);
    const den =
      this.l1 *
      (2 * this.m1 +
        this.m2 -
        this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));

    const alpha1 = (num1 + num2 + num3 * num4) / den;

    const num5 = 2 * Math.sin(this.theta1 - this.theta2);
    const num6 =
      this.omega1 ** 2 * this.l1 * (this.m1 + this.m2) +
      this.G * (this.m1 + this.m2) * Math.cos(this.theta1) +
      this.omega2 ** 2 *
        this.l2 *
        this.m2 *
        Math.cos(this.theta1 - this.theta2);
    const den2 =
      this.l2 *
      (2 * this.m1 +
        this.m2 -
        this.m2 * Math.cos(2 * this.theta1 - 2 * this.theta2));

    const alpha2 = (num5 * num6) / den2;

    this.omega1 += alpha1 * this.dt;
    this.omega2 += alpha2 * this.dt;
    this.theta1 += this.omega1 * this.dt;
    this.theta2 += this.omega2 * this.dt;
  }

  /**
   * 이중진자 그리기
   */
  draw(ctx) {
    // 1. 각 진자 끝점 좌표 계산
    const { x: x1, y: y1 } = this.getPendulumPos(1);
    const { x: x2, y: y2 } = this.getPendulumPos(2);

    // 2. 고정점(원점) 그리기
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'black';
    ctx.fill();

    // 3. 첫 번째 막대
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. 첫 번째 질량
    ctx.beginPath();
    ctx.arc(x1, y1, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();

    // 5. 두 번째 막대
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 6. 두 번째 질량
    ctx.beginPath();
    ctx.arc(x2, y2, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // 마지막으로 물리 시뮬레이션 업데이트
    this.updatePendulum();
  }
}
