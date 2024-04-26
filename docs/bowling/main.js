title = "";

description = `
`;

characters = [
  `
  ll  
 llll
llllll
llllll
 llll
  ll
`,
  `
llllll
llllll
`
];

const G = {
  WIDTH: 210,
  HEIGHT: 190,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
  //  theme: "crt",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
};

/*
* @typedef { object } player - It is a dude.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
*/

class bowlingBall {
  constructor() {
    this.pos = vec(G.WIDTH * 0.5, G.HEIGHT * 0.5);
    this.vel = vec(0, 0);
    this.acc = vec(0, 0);
    this.angle = 0;
    this.speed = 0;
    this.radius = 3;
    this.isLaunched = false;
  }

  launch() {
    this.isLaunched = true;
    this.vel = vec(this.speed * Math.cos(this.angle), this.speed * Math.sin(this.angle));
  }

  update() {
    if (this.isLaunched) {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.acc.set(0, 0);
      if (this.pos.x < 0 || this.pos.x > G.WIDTH) {
        this.vel.x *= -1;
      }
      if (this.pos.y < 0 || this.pos.y > G.HEIGHT) {
        this.vel.y *= -1;
      }
    }
  }

  draw() {
    color("black");
    char("a", this.pos);
    //arc(this.pos, this.radius, 1,1, 2 * PI);
  }
}

let ball;
function update() {
  if (!ticks) {
    //    sss.setSeed(5);
    //    sss.setVolume(0.05);
    ball = new bowlingBall();
  }

  ball.update();
  ball.draw();

  drawAim();

  if (input.isJustReleased) {
    // ball.angle = input.pos.angle;
    console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
  }
}

let swayAngle = 0;

function drawAimOLD() {
  const aimLength = 20;
  swayAngle += 0.05; // Adjust this value to change the speed of the sway
  const sway = Math.sin(swayAngle) * 0.5; // Adjust the multiplier to change the range of the sway
  const aimEnd = vec(G.WIDTH / 2, G.HEIGHT - 50).addWithAngle(Math.PI / 2 + sway, aimLength);
  line(vec(G.WIDTH / 2, G.HEIGHT - 50), aimEnd, 2);

  if (input.isJustReleased) {
    //    ball.angle = aimEnd.angle;

    ball.angle = Math.PI / 2 + sway; // Update the ball's angle with the aim's angle
    console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
  }

}
function drawAim() {
  const aimLength = 20;
  swayAngle += 0.05; // Adjust this value to change the speed of the sway
  const sway = Math.sin(swayAngle) * 0.5; // Adjust the multiplier to change the range of the sway
  const aimStart = vec(G.WIDTH / 2, G.HEIGHT - 50);
  const aimEnd = vec(aimStart).addWithAngle(-Math.PI / 2 - sway, aimLength);
  line(aimStart, aimEnd, 2);

  if (input.isJustReleased) {
    ball.angle = -Math.PI / 2 - sway; // Update the ball's angle with the aim's angle
    console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
  }
}