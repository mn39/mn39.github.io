export class Pendulum {
  constructor(canvas) {
    // === (1) 캔버스 & 컨텍스트 설정 ===
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    // === (2) 물리 파라미터 (간소화 버전) ===
    // 중력 가속도(약간 크게 잡음), 시뮬레이션 dt
    this.G = 9.81 * 10;
    this.dt = 0.04;

    // --- 막대 A (길이 10 중 pivot~끝 = 3) ---
    //     예: 7:3 중 실제 '회전부' 3만을 그려본다.
    //     픽셀로 환산 (예: 1 → 30px)
    this.lA = 3 * 30; // 3 => 90px
    this.mA = 10; // 질량(임의)

    // --- 막대 B (길이 7 중 pivot~끝 = 4) ---
    //     3:4 중 회전부는 4
    this.lB = 4 * 30; // 4 => 120px
    this.mB = 10;

    // 초기 각도(라디안), 각속도
    this.thetaA = Math.PI / 4; // 45도 정도
    this.omegaA = 0;
    this.thetaB = -Math.PI / 6; // -30도 정도
    this.omegaB = 0;

    // === (3) 고정 축 (막대 A의 7:3 지점)을 화면 어디에 둘지 ===
    // 예: 캔버스 중앙 위쪽( x: width/2, y: 200 )
    this.origin = {
      x: this.canvas.width / 2,
      y: 200,
    };

    // === (4) 마우스 드래그 관련 ===
    this.dragging = false; // 드래그 중인지
    this.dragIndex = null; // A, B 어느 질량인지 (1 => A 끝, 2 => B 끝)
    this.mouse = { x: 0, y: 0 };

    // (마우스 이벤트 등록)
    canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
    });
    canvas.addEventListener('mousedown', (e) => {
      // A의 끝 좌표, B의 끝 좌표
      const { x: ax, y: ay } = this.getPendulumPos(1);
      const { x: bx, y: by } = this.getPendulumPos(2);

      // 클릭한 지점이 어느 질량과 가까운지
      if (this.distance(this.mouse, { x: bx, y: by }) < 15) {
        this.dragging = true;
        this.dragIndex = 2; // B 질량
      } else if (this.distance(this.mouse, { x: ax, y: ay }) < 15) {
        this.dragging = true;
        this.dragIndex = 1; // A 질량
      }
    });
    canvas.addEventListener('mouseup', () => {
      this.dragging = false;
      this.dragIndex = null;
    });
  }

  /**
   * 화면 리사이즈 시 호출 (메인에서 사용 가능)
   */
  resize(width, height) {
    this.origin.x = width / 2;
    this.origin.y = 200;
  }

  /**
   * 두 점 거리
   */
  distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  }

  /**
   * 펜들럼 끝(질량) 위치
   * index=1 => A 막대 끝
   * index=2 => B 막대 끝
   */
  getPendulumPos(index) {
    // A 끝점:
    //   A의 pivot( this.origin )에서
    //   길이 lA, 각도 thetaA 만큼 이동
    const Ax = this.origin.x + this.lA * Math.sin(this.thetaA);
    const Ay = this.origin.y + this.lA * Math.cos(this.thetaA);

    if (index === 1) {
      // 막대 A의 끝
      return { x: Ax, y: Ay };
    }

    // 막대 B 끝점:
    //   B의 pivot은 "A 끝"과 연결
    //   거기서 길이 lB, 각도 thetaB 추가
    const Bx = Ax + this.lB * Math.sin(this.thetaB);
    const By = Ay + this.lB * Math.cos(this.thetaB);
    return { x: Bx, y: By };
  }

  /**
   * 물리 업데이트(간소화된 이중진자 토크)
   */
  updatePendulum() {
    // (1) 만약 드래그 중이면, 마우스로 각도 강제
    if (this.dragging) {
      // 원점(또는 A 끝) 기준으로 각도 재계산
      if (this.dragIndex === 1) {
        // A 막대 pivot은 this.origin
        const dx = this.mouse.x - this.origin.x;
        const dy = this.mouse.y - this.origin.y;
        this.thetaA = Math.atan2(dx, dy);
        this.omegaA = 0;
      } else {
        // B 막대 pivot은 "A 끝"
        const { x: Ax, y: Ay } = this.getPendulumPos(1);
        const dx = this.mouse.x - Ax;
        const dy = this.mouse.y - Ay;
        this.thetaB = Math.atan2(dx, dy);
        this.omegaB = 0;
      }
      return;
    }

    // (2) 간단 토크 모델 (소진폭 가정x, 조금 단순화)
    //     실제로는 라그랑주 전개가 복잡하지만, 예시로 간략화

    // --- A 막대 ---
    // 중력 토크: τA = -m*g*(lA/2)*sin(thetaA) ... 등등
    // 여기서는 "끝에 질량 mA가 모여있다" 비슷하게 단순화:
    //   τA ≈ -mA*g*lA*sin(thetaA)
    // B 막대가 A 끝을 당기는 효과(상호 작용)도 완전히 정확히 반영하려면,
    // (thetaB, ωB)에 의한 관성항이 들어가야 하나 여기선 생략 혹은 간단 처리.
    const torqueA = -this.mA * this.G * this.lA * Math.sin(this.thetaA);

    // --- B 막대 ---
    // pivot은 "A 끝".
    // 중력 토크: -mB*g*lB*sin(thetaB)
    const torqueB = -this.mB * this.G * this.lB * Math.sin(this.thetaB);

    // 관성모멘트(간략화): I = m * l^2
    // (균일 막대가 아니라 "끝에 질량" 근사)
    const IA = this.mA * this.lA ** 2;
    const IB = this.mB * this.lB ** 2;

    // 각가속도
    const alphaA = torqueA / IA;
    const alphaB = torqueB / IB;

    // 각속도, 각도 업데이트 (오일러법)
    this.omegaA += alphaA * this.dt;
    this.omegaB += alphaB * this.dt;
    this.thetaA += this.omegaA * this.dt;
    this.thetaB += this.omegaB * this.dt;
  }

  /**
   * 그리기
   */
  draw(ctx) {
    // 1) 화면 지우기
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 2) A 막대 끝 좌표
    const { x: Ax, y: Ay } = this.getPendulumPos(1);

    // 3) B 막대 끝 좌표
    const { x: Bx, y: By } = this.getPendulumPos(2);

    // ----- A 막대 그리기 -----
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(Ax, Ay);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // A pivot 표시(원)
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();

    // A 끝(질량)
    ctx.beginPath();
    ctx.arc(Ax, Ay, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // ----- B 막대 그리기 -----
    ctx.beginPath();
    ctx.moveTo(Ax, Ay);
    ctx.lineTo(Bx, By);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    // B 끝(질량)
    ctx.beginPath();
    ctx.arc(Bx, By, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'green';
    ctx.fill();

    // ----- 마지막: 물리 업데이트 -----
    this.updatePendulum();
  }
}
