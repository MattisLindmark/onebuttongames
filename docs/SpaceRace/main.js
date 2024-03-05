//title = "SpceRace";

//description = ` Drive throu the space debris field stuff.
//`;

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
`,`
   ll
  llll
   ll
 yylll
  llll
   ll   
`,`
  rbbl
byyyll
  rbbl
`,`
   ll
lllll
   ll
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

let levelData = {
  level: 1,
  score: 0,
  lives: 3,
  rocks: 10,
  boosters: 3,
  globalspeed: 1,  
};

let starts = [];

let rocks = [];


function update() {
  if (!ticks) {
    setup();
    //setupRocks();
  }

  //drawStarfield();
//  particle(50,50, .5, 1,3,.5);

  drawBgr();
  movePlayer();
  drawPlayer();
  moveRocks();
  drawRocks();
  
}

function drawBgr() {
  starts.forEach((star) => {
    star.pos.y += star.speed;
    color (star.color);
    rect(star.pos, 1, 1);
    color("black");
    if (star.pos.y > G.HEIGHT) {
      star.pos.y = 0;
      star.pos.x = rnd(0, G.WIDTH);
    }
  });



}

function setup() {
  player = {
    pos: vec(G.WIDTH * 0.5, G.HEIGHT-(G.HEIGHT/4)),
    speed: 1.2,
    direction: 1
  };
  starts = [];
  // fill with 10 stars using times
  times(20, () => {
    starts.push({
      pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT+50)),
      speed: rnd(0.2, 0.5),
      color: rnd(0, 2)>1 ? "light_yellow" : "light_blue"
    });
  });

  // make one random star black
  starts[rndi(0, starts.length)].color = "black";
  // make one random star yellow
  starts[rndi(0, starts.length)].color = "yellow";

  rocks = [];
  addRocks(10);
  addBoosters(3);
}

function addRocks(ammount = 10) {

  let rocksprites = ["b","c","d","e"];
  
  for (let i = 0; i < ammount; i++) {  
    let rndvalue = rndi(2, 6) * 0.5; // 1-3 with 0.5 steps.
  //  console.log(rndvalue);
    //let rndScale = rnd(1, 3); // <--- TODO: RND mellan några fasta världen. med 0.5 steg.
    // pick the next rock-sprite
    let spr = rocksprites[i % rocksprites.length];
    let rock = {
      pos: vec(rnd(0, G.WIDTH), rnd(G.HEIGHT*-1, 0)),
      speed: 2.5-rndvalue,//rnd(0.4, 1.2),
      isActive: true,
      size: vec(rndvalue, rndvalue),
      rotation: rndi(0,3),
      sprite: spr
    };
    rocks.push(rock);
  }
  // loop through rocks and make rocks with speed <0.01 have a speed of 1 instead and use the sprite "h"
  rocks.forEach((rock) => {
    console.log(rock.speed);
    if (rock.speed == 0) {
      rock.speed = .5;
      rock.rotation = 0;
      rock.pos.y = rnd(-30, 0);
//      rock.sprite = "h";
    }
    if (rock.speed > 1.4) {
      rock.speed = 1.2;
    }
  });
  
}

function addBoosters(ammount = 3) {
  //this are added in to the rock array.
  // they have sprite f. and 1 rotation. 1 scale.
  for (let i = 0; i < ammount; i++) {
    let rock = {
      pos: vec(rnd(0, G.WIDTH), rnd(G.HEIGHT*-1, 0)),
      speed: rnd(0.6, 1.2),
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

let currentDirection = player.direction;
function movePlayer()
{
//  input.isPressed? player.speed = 1.2 : player.speed = 0.8;

  if (input.isJustPressed) {
    player.speed = 0.5;
  }
  if (input.isPressed) {
    player.speed += 0.03;
    if (player.speed > 1.5) {
      player.speed = 1.5;
    }
  } else {
    player.speed -= 0.04;
    if (player.speed < 0.5) {
      player.speed = 0.5;
    }
  }

  if (input.isJustPressed) {
    player.direction *= -1;
  }

  let t = 0.25;
  t = easeInOutCubic(t);
  currentDirection = player.direction;//= lerp(currentDirection, player.direction, t);
 
 //  currentDirection = lerp(currentDirection,player.direction, 0.2);

  player.pos.x += player.speed * currentDirection;
  //player.pos.x = clamp(player.pos.x, 0, G.WIDTH);
  player.pos.x = wrap(player.pos.x, 0, G.WIDTH);

}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

function drawPlayer()
{
  color("black");
  let pc = player.direction > 0 ? -1 : 1;
  let flame = vec(player.pos.x+6*pc,player.pos.y);
  char("a", player.pos);//, {mirror: {x: pc, y: 1}});
  if (input.isJustPressed) {
    let ang = player.direction > 0 ? 3 : 0; 
    color("yellow");
    particle(flame, 5.5, 1,ang,.5);
//    particle(flame, 1, 1,10);
  } else if (input.isPressed) {
    color("black");
    let spr = "h";
    if (ticks % 4 == 0){
      spr = "i";
    }
    char(spr, flame, {mirror: {x: player.direction, y: 1}});
  }
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
