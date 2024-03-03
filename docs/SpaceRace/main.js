title = "SpceRace";

description = ` Drive throu the space debris field stuff.
`;

characters = [
  ` 
  ll
  ll  
l ll l
llllll
ll  ll
yy  yy
`,`
llll
llllll
 lllll
  lll
`,`
 lll
lllll
 lllll
  lll
`,`
  lll
lllll
lllll
 lll
`,`
  lll
lllll
  lllll
    lll
`,
`
   g
   g
  gyg
  gyg
 gyryg
 yr ry
`
];

const G = {
  WIDTH: 115,
  HEIGHT: 190,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "crt",
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

let player = {
  pos: vec(G.WIDTH * 0.5, G.HEIGHT),
  speed: 1,
  direction: 1
};

let rockTemplate = {
  pos: vec(50, 50),
  speed: 1,
  isActive: false,
  size: (vec(1, 1)),
  rotation: 0
};

let rocks = [];


function update() {
  if (!ticks) {
    setup();
    //setupRocks();
  }

  //drawStarfield();

  movePlayer();
  drawPlayer();
  moveRocks();
  drawRocks();
}

function setup() {
  player = {
    pos: vec(G.WIDTH * 0.5, G.HEIGHT-(G.HEIGHT/4)),
    speed: 1,
    direction: 1
  };
  rocks = [];
  addRocks(10);
  addBoosters(3);
}

function addRocks(ammount = 10) {

  let rocksprites = ["b","c","d","e"];

  for (let i = 0; i < ammount; i++) {
  
    let rndvalue = rndi(2, 6) * 0.5;
    //let rndScale = rnd(1, 3); // <--- TODO: RND mellan några fasta världen. med 0.5 steg.
    // pick the next rock-sprite
    let spr = rocksprites[i % rocksprites.length];
    let rock = {
      pos: vec(rnd(0, G.WIDTH), rnd(G.HEIGHT*-1, 0)),
      speed: rnd(0.5, 1.5),
      isActive: true,
      size: vec(rndvalue, rndvalue),
      rotation: rndi(0,3),//rnd(-1, 0.5),
      sprite: spr
    };
    rocks.push(rock);
  }  
}

function addBoosters(ammount = 3) {
  //this are added in to the rock array.
  // they have sprite f. and 1 rotation. 1 scale.
  for (let i = 0; i < ammount; i++) {
    let rock = {
      pos: vec(rnd(0, G.WIDTH), rnd(G.HEIGHT*-1, 0)),
      speed: rnd(0.5, 1),
      isActive: true,
      size: vec(2, 1),
      rotation: 0,
      sprite: "f"
    };
    rocks.push(rock);
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function drawStarfield() {
// TODO
}

function movePlayer()
{
  if (input.isJustPressed) {
    player.direction *= -1;
  }
  player.pos.x += player.speed * player.direction;
  //player.pos.x = clamp(player.pos.x, 0, G.WIDTH);
  player.pos.x = wrap(player.pos.x, 0, G.WIDTH);

}

function drawPlayer()
{
  color("black");
  char("a", player.pos);
}

function moveRocks()
{
  rocks.forEach((rock) => {
    rock.pos.y += rock.speed;
    if (rock.pos.y > G.HEIGHT) {
      rock.pos.y = rnd(-50, 0);
      rock.pos.x = rnd(0, G.WIDTH);
    }
  });
}

let rotation = 0;
let coldata = {
  rock: null,
  col: null
}
function drawRocks()
{
  rotation += 0.1;
  coldata = {
    rock: null,
    col: null
  }
  
  rocks.forEach((rock) => {
    color("black");
    let tmpcol = char(rock.sprite, rock.pos, {scale: {x: rock.size.x, y: rock.size.y}, rotation: rock.rotation});
    if (tmpcol.isColliding.char.a) {
      coldata.col = tmpcol;
      coldata.rock = rock;
    }
//    char(rock.sprite, rock.pos, {scale: {x: rock.size.x, y: rock.size.y}, rotation: rotation*rock.rotation});
  });
  if (coldata.col != null) {
    checkCollisions(coldata);
}



function checkCollisions(coldata)
{
  if (coldata.col.isColliding.char.a) {
    if (coldata.rock.sprite == "f") {
      play("coin");
      player.pos.y -= 10;
      particle(player.pos, 10, 3);
    } else {
      play("hit");
      player.pos.y += 10;
      particle(player.pos, 10, 2);
    }
    coldata.rock.pos.y = rnd(G.HEIGHT*-1, 0);  
  }
}
}
