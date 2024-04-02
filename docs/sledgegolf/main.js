title = "";

description = `
`;

characters = [
  `
 llll
lll ll
ll lll
ll  ll
 lll l
 llll
`,
  `
llllll
llllll
`, `
 YY
YLLY
 bb
b  b
 `,
 `
  g
  gg
 gggg
gggggg
  ll
 `,`
  gg
 gggg
gggggg
 gggg
  ll
  ll   
 `,
 `
 llll
 llllll
 llll
 l
 l
 l
 ` 
];

const G = {
  WIDTH: 200,
  HEIGHT: 150,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
  theme: "simple",
  //  theme: "shapeDark",
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

let sledgePlayer_base = {
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
  speed: 1,
  vel: vec(0, 0),
  thrust: 0,
};

let player = null;

let plutt_base = {
  char: "b",
  value: 1,
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
  speed: 1,
  vel: vec(0, 0)
};

let tree_base = {
  char: "c",
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
};

let trees = [];

let pluttar = [];

let WORLDPOS = vec(0, 0);

const dampMin = 0.94;
const dampMax = 0.98;


function update() {
  if (!ticks) {
    setup();
  }
  drawBgr();
  drawPlayer();
  drawTrees();
}


function setup() {
  /* setup 10 pluttar at random positions over the screen
  for (let i = 0; i < 10; i++) {
    pluttar.push({ ...plutt_base, pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)) });
  }
  */

  // setup 10 trees at random positions over the screen, and random char between c and d.
  for (let i = 0; i < 10; i++) {
    trees.push({ ...tree_base, pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)), char: ["d", "e"][Math.round(Math.random())] });
  }
  
  player = { ...sledgePlayer_base };

}

function drawBgr() {
  // draw the background
  color("light_green");
  rect(0, 0, G.WIDTH, G.HEIGHT);

}


let collisionCooldown = 0;

function drawTrees() {
  // draw the trees
  color("black");
  let colls = [];
  trees.forEach((t) => {
    let col = char(t.char, t.pos, {scale: {x: 2, y: 2}});
    if (col.isColliding.char.a) {
      let tmp = {col: col, direction: vec(player.pos.x - t.pos.x, player.pos.y - t.pos.y)};
        tmp.direction.normalize();
      colls.push(tmp);
    }
  });

  if (collisionCooldown > 0) {
    collisionCooldown--;
    return;
  }  
  // check if player is colliding with a tree
  if (colls.length > 0) {
    collisionCooldown = 10;
    play("hit");
    /*
    player.vel.x *= (colls[0].direction.x * 2); 
    player.vel.y *= (colls[0].direction.y * 2);
    */
    player.vel.x = colls[0].direction.x; 
    player.vel.y = colls[0].direction.y;
  }

}

let angle = 0;
let radius = 5;
let spinDirection = 1;
function drawPlayer() {
  color ("black");
  // draw the player
  char("a", player.pos);
  /* <- Version 1: funkar så den puttar på typ nästan ungefär, inte riktigt. Den normaliseras, behöver dot.produkt?
    if (input.isJustReleased){
      spinDirection *= -1;
    }
    if (!input.isPressed){
      angle += (0.1*spinDirection);
    }
  */
  if (input.isPressed) {
    radius += 0.1;
  } else {
    radius -= 0.5;
  }

  if (radius < 5) {
    radius = 5;
  }
  if (radius > 15) {
    radius = 15;
  }

  angle += 0.1;

  // around the player a small dot should be circling

  let x = player.pos.x + radius * Math.cos(angle);
  let y = player.pos.y + radius * Math.sin(angle);
  char("c", x, y);

  // calculate a vector based on player position and the dot
  let forceDirection = vec(x - player.pos.x, y - player.pos.y);
  forceDirection.normalize();


  // calculate player position
  //calculatePlayerPosition(forceDirection.x, forceDirection.y);
  calculatePLposBasedOnRadius(forceDirection.y, forceDirection.x, radius * 0.01);
}

function drawWorld() {
  // draw the pluttar
  pluttar.forEach((p) => {
    char(p.char, p.pos);
  });
}

let DMP = 0;
function calculatePLposBasedOnRadius(dirY, dirX, rad = 5) {
  let forceDirection = vec(dirX, dirY);
  if (input.isPressed) {
    player.vel.x += forceDirection.x * rad;
    player.vel.y += forceDirection.y * rad;
    DMP = dampMin;
  } else {
    DMP = 0.99;
  }

  player.vel.mul(DMP);
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

}


let dampening = 0;
function calculatePlayerPosition(dirY, dirX) {
  let forceDirection = vec(dirX, dirY);
  if (input.isPressed) {
    dampening = dampMin;
    player.thrust += 0.001;
  } else {
    dampening = dampMax;
    player.thrust = 0;
  }
  // move player in the direction of the force based on thrust
  player.vel.x += forceDirection.x * player.thrust;
  player.vel.y += forceDirection.y * player.thrust;
  // apply dampening

  player.thrust *= dampening;
  // adjust force direction by dampening
  player.vel.mul(dampening);

  // update player position
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;
  text("thr: " + player.thrust, 10, 20);
  text("vel: " + player.vel.x + ", " + player.vel.y, 10, 30);


  // player.pos.add(forceDirection);
  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

}