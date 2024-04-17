title = "";

description = `
`;

characters = [
  `
  rr
  rr
 gggg
 ggg g
 g g
 g g
`,
`
llllll
llllll
`  
];

const G = {
  WIDTH: 110,
  HEIGHT: 90,
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

let worldPhysics = {
  gravity: 0.3,
  friction: 0.9,
  jump: -2,
  maxSpeed: 5,
  gravity: 0.3
};

class player {
  constructor() {
    this.pos = vec(G.WIDTH * 0.5, G.HEIGHT * 0.5);
    this.speed = 0;
    this.jump = 0;
  }

  update() {
    this.pos.x += this.speed;
    this.pos.x = clamp(this.pos.x, 0, G.WIDTH);
    this.speed *= 0.9;
    this.pos.y += this.jump;
    this.jump += worldPhysics.gravity;  
//    this.jump = Math.min(0, 2);  
  }
}

let pl = new player();

/*
* @typedef { object } player - It is a dude.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
*/

function update() {
  if (!ticks) {
//    sss.setSeed(5);
//    sss.setVolume(0.05);
  }
  pl.update();
  char("a", pl.pos);

  if (input.isPressed) {
    pl.speed = 1;
  } else {  
    pl.speed = -1;
  }

  if (input.isJustPressed) {
    pl.jump = worldPhysics.jump;
  }

  // Check ground level
  if (pl.pos.y > G.HEIGHT - 5) {
    pl.pos.y = G.HEIGHT - 5;
    pl.jump = 0;
  }

}
