title = "SpceRace";

description = `Race the space!
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
`,`
 llll  
ll  ll
l    l

l    l
  ll
`,`
  ll  
llllll
  ll
`
];


// === Mest testade värden: w: 140 h: 160 ===
const G = {
  WIDTH: 90,
  HEIGHT: 160,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "shapeDark",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
  //isDrawingParticleFront: true
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

let bigbosterTemplate = {
  pos: vec(0, 0),
  speed: .7,
  isActive: false,
};

let levelData = { // ******* OBS denna är som fucked up. den sätts i ResetStuff.
  level: 1,
  score: 0,
  lives: 3,
  rocks: 1,
  boosters: 3,
  globalspeed: 1,
  shieldtime: 160,
  bigBoulderIndex: 0
};

let starts = [];

let rocks = [];

let bigBosters = [];

let shieldcount = 0;

let shieldBonus ={
  pos: vec(50,50),
  speed: 1,
  isActive: false,
  size: vec(1, 1),
  rotation: 0
};

let leveltransition = false;
let timer = 0;
let PL_MaxReachedStep = 0; // <-- Håller reda på hur högt PL någonsin klättrat.
let DEBUGG = 0;
let CHEATMODE = false;
// ==================================================================================================== MAIN ===
function update() {
  if (!ticks) {
    sss.setSeed(0);
    console.log("No Ticks");
    setup();
    timer = -1;
    PL_MaxReachedStep = player.pos.y;
    //setupRocks();
  }
  
  
  // drawBigBoulder(bigBoulders[4]);
  // drawBigBoulder(bigBoulders[5]);
  // return;
  
  
  text("T:"+timer,2,10); 
  
  if (leveltransition)
  {
    color ("yellow")
    text("TimeBonus "+checkTimeBonus(),15,35);
    let clr = LoopColor(3);
    color(clr);
    let tmp = levelData.level+1;
    char("a", player.pos);
    text("Level " + tmp, G.WIDTH / 2 - 35, G.HEIGHT / 2-20, {scale: {x: 2, y: 2}});
    text("Get ready", G.WIDTH / 2 - 25, G.HEIGHT / 2 );
    return;
  }

  color("black");
  text("Lvl:"+levelData.level,G.WIDTH/2-18,3);
 
  if (ticks % 60 == 0 && shieldBonus.isActive == false && rnd(0, 10) > 8) {
    shieldBonus.isActive = true;
    shieldBonus.pos.y = rnd(-20,-40);
    shieldBonus.pos.x = rnd(3, G.WIDTH-3);
  }

/* //=== What the heck is up with the particles? Find out here! ===
  if (input.isJustPressed) {
    DEBUGG ++;
  }
  color("yellow");
  particle(50,50, 5, 2,33,DEBUGG);
  color("black");
  text("Dbg: " + DEBUGG, 3, 10);
*/

  // if (input.isJustPressed) {
  //   shieldcount = 100;
  // }

  if (PL_MaxReachedStep > player.pos.y) {
    PL_MaxReachedStep = player.pos.y;
  }  
  
  
  drawBgr();
  movePlayer();
  drawPlayer();
  drawShieldBonusItem();
  moveRocks();
  drawRocks();
  if (shieldcount > 0) {
    shieldcount--;
    drawShield();
  }

  if (ticks % 60 == 0) {
    timer ++;
    checkBigBosters();
  }
  drawBigBosters();

  stepBoulderDic.forEach((stepBoulder) => {    
    if (PL_MaxReachedStep < stepBoulder.step) {
      drawBigBoulder(bigBoulders[stepBoulder.boulder+levelData.bigBoulderIndex]);
    }
  });
/*
  if (PL_MaxReachedStep < 101) {
    drawBigBoulder(bigBoulder);
  }

  if (PL_MaxReachedStep < 119) {
    drawBigBoulder(bigBoulder2);
  }
*/
//  text("MaxStep: " + PL_MaxReachedStep, 3, 10);
  drawGoalLine();
  drawDeathZone();
}

function drawDeathZone() {
  let posy = G.HEIGHT -(timer/2)*levelData.level;

  // ---- om man vill ha den statiskt längst ned och synas bara när pl är nära.
 // let posy = G.HEIGHT +135 - player.pos.y-5; //<-- make it go up
  //if (player.pos.y < G.HEIGHT-20) {
  //  return;
 // }
  //let posy = player.pos.y< G.HEIGHT-11? G.HEIGHT : G.HEIGHT-2;
  //---
  
  color("light_red");
  //let col = line(G.WIDTH, posy, 0, posy, 3);
  let col = rect(-5, posy, G.WIDTH+15, G.HEIGHT-posy);

  if (col.isColliding.char.a) {
    play("explosion");
    // player.pos.y = G.HEIGHT-(G.HEIGHT/4);
    // levelData.lives --;
    // if (levelData.lives < 1) {
       end();
    // }
  }
}

let goalY = -10;
function drawGoalLine() {
  color ("light_green");
  let posy = 40+player.pos.y*-1;
  goalY = lerp(goalY, posy, 0.05);

  rect (G.WIDTH-10, goalY, 10, 5); // G.HEIGHT-(G.HEIGHT/4) = 120 ca just nu
  rect(10, goalY, 10, 5);
  // line between the two rects
  color("green");
  line(G.WIDTH-10, goalY+5, 20, goalY+5, 1);
  color("black");
  if (player.pos.y < goalY+5) {    
    play("powerUp");
    leveltransition = true;
    // set to false in 3 seconds
    setTimeout(() => {
      nextLevel();     
    }, 3000);

    //goalY = -10;
    //levelData.level ++;
    //addRocksB(2);
    //player.pos.y = G.HEIGHT-(G.HEIGHT/4);
    //addBoosters(3);
  }
}

function checkBigBosters() {
  let inactiveBoster = bigBosters.find(bigBoster => !bigBoster.isActive);

  if (inactiveBoster) {
    inactiveBoster.isActive = true;
    inactiveBoster.pos.y = rnd(-10, 0);
    inactiveBoster.pos.x = rnd(6, G.WIDTH-15);
  }
}

function drawBigBosters() {
  bigBosters.forEach((bigBoster) => {
    if (!bigBoster.isActive) {
      return;
    }
    let speedMod = player.pos.y < 40 && bigBoster.pos.y-5 < player.pos.y ? 0.6 : 1;

    bigBoster.pos.y += bigBoster.speed*speedMod;
    if (bigBoster.pos.y > G.HEIGHT+5) {
//      bigBoster.pos.y = rnd(-50, 0);
//      bigBoster.pos.x = rnd(2, G.WIDTH-2);
      bigBoster.isActive = false;
    }
    let colA = null;
    let colB = null;
    color("green");
    let left = bigBoster.pos.x - 5;
    let right = bigBoster.pos.x + 5;
    let down = bigBoster.pos.y + 5;
    colA = line(bigBoster.pos.x, bigBoster.pos.y,left, down, 2);
    colB = line(bigBoster.pos.x, bigBoster.pos.y,right, down, 2);

    if (colA.isColliding.char.a || colB.isColliding.char.a) {
      play("laser");//,{numberOfSounds: 3}
      shieldcount += 40;
      player.pos.y -= 10; //5, 2,33,DEBUGG
      color("yellow");
      particle(player.pos, 5, 3, 33, 0.5);
      color("black");
      particle(player.pos, 5, 2, 33, 0.2);
      score ++;
      bigBoster.isActive = false;
    }
  });
}

function drawShieldBonusItem() {
  if (shieldBonus.isActive) {
    shieldBonus.pos.y += shieldBonus.speed;
    color(LoopColor(4));
    if (char("k", shieldBonus.pos).isColliding.char.a) {
      shieldBonus.isActive = false;
      shieldcount += levelData.shieldtime;
      play("powerUp");
      color("yellow");
      particle(player.pos, 5, 3, 33, 0.5);
      color("black");
      particle(player.pos, 5, 2, 33, 0.2);
    }
  }
  
  if (shieldBonus.pos.y > G.HEIGHT) {
//    shieldBonus.pos.y = rnd(-10,-40);
//    shieldBonus.pos.x = rnd(5, G.WIDTH-5);
    shieldBonus.isActive = false;
  }
}

function drawShield() {
  let clr = "light_cyan";
  if (shieldcount > 25) {
    clr = LoopColor(3);
  }
 // ((shieldcount > 50? ct = 5 : ct = 60;
  color(clr);//LoopColor(ct));
  char("j", player.pos,{scale: {x: 1.5, y: 1.5}});
  color("black");
  if (shieldcount % 10 == 0) {
    particle(player.pos, 1, 1);
  }
}

const colors = ["red", "blue", "green", "yellow", "purple", "cyan", "light_red", "light_blue", "light_green", "light_yellow", "light_purple", "light_cyan"];
function LoopColor(speed = 2) {
  let index = parseInt(ticks / speed) % colors.length;
  return colors[index];
}

function drawBgr() {
  drawStarfield();
}

function drawStarfield() {
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
  
// ==================================================================================================== SETUP ===
function setup() {

  ResetStuff();
  
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
  addRocksB(levelData.rocks);
  //  addBoosters(3);
  
  setupBigBoulders();
  PL_MaxReachedStep = player.pos.y;  

  bigBosters = [];
  times(4, () => {
    bigBosters.push(deepCopy(bigbosterTemplate));
  });
  bigBosters.forEach((bigBoster) => { // Detta verkar ej ha effekt. sätts nån annanstanns.
    bigBoster.pos.x = rnd(10, G.WIDTH-15);
    bigBoster.pos.y = rnd(50, 0);
  });
}

function checkTimeBonus() {
  let timeBonus = 0;
  console.log("LevelTimer = "+timer);
  if (timer < 30) {
    timeBonus = 2;
  } 
  if (timer < 20) {
    timeBonus = 4;
  } 
  if (timer < 16) {
    timeBonus = 6;
  } 
  if (timer < 13) {
    timeBonus = 8;
  }
  if (timer < 11) {
    timeBonus = 10;
  }
  return timeBonus;
}

function nextLevel() {
  score += 5;
  score += checkTimeBonus();

  levelData.level ++;
  levelData.rocks += 1;
  levelData.globalspeed += 0.2;
  player.pos = vec(G.WIDTH/2, G.HEIGHT-(G.HEIGHT/4));
  player.direction = 1;
  
  levelData.bigBoulderIndex = (levelData.bigBoulderIndex + 2)%bigBoulders.length;
  // if (levelData.bigBoulderIndex > 2) {
  //   levelData.bigBoulderIndex = 0;
  //   console.log("boulderindex: " + levelData.bigBoulderIndex +" of"+ bigBoulders.length);
  // }

  rocks = [];
  addRocksB(levelData.rocks);

  // reset bigbosters
  bigBosters.forEach((bigBoster) => {
//    bigBoster.pos.x = rnd(10, G.WIDTH-15);
//    bigBoster.pos.y = rnd(G.HEIGHT/2, 10);
    bigBoster.isActive = false;
  });
  //----

  bigBoulders.forEach((bigBoulder) => {
    bigBoulder.pos = vec(bigBoulder.s_pos.x, bigBoulder.s_pos.y);
  });
//  levelData.shieldtime += 20;
  timer = 0;
  shieldcount = 0;
  shieldBonus.isActive = false;
  PL_MaxReachedStep = player.pos.y;
  leveltransition = false;  
}


function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}


let stepBoulderDic = [{step: 120, boulder: 0}, {step: 90, boulder: 1}];
let bigBoulders = [];

function setupBigBoulders(){
let rot = 0;
let rot2 = 45;

bigBoulders = [];
let bigBoulder = {
  pos: vec(G.WIDTH+30, G.HEIGHT / 2),
  s_pos: vec(G.WIDTH+30, G.HEIGHT / 2),
  size: 9,
  rotation: 0,
  dir: vec(-0.15,0.2)
};

let bigBoulder2 = {
  pos: vec(-30, G.HEIGHT / 5),
  s_pos: vec(-30, G.HEIGHT / 5),
  size: 9,
  rotation: 2,
  dir: vec(0.15,0.2)
};

let bigBoulder3 = {
  pos: vec(G.WIDTH/2, -20),
  s_pos: vec(G.WIDTH/2, -20),
  size: 7,
  rotation: 2,
  dir: vec(0.01,0.5)
};
let bigBoulder4 = {
  pos: vec(G.WIDTH, -20),
  s_pos: vec(G.WIDTH, -20),
  size: 7,
  rotation: 2,
  dir: vec(-0.2,0.7)
};
let bigBoulder5 = {
  pos: vec(-40, 20),
  s_pos: vec(-40, 20),
  size: 7,
  rotation: 2,
  dir: vec(0.3,0.15)
};
let bigBoulder6 = {
  pos: vec(-30, G.HEIGHT/4),
  s_pos: vec(-30, G.HEIGHT/4),
  size: 9,
  rotation: 2,
  dir: vec(0.15,-0.03)
};
let bigBoulder7 = {
  pos: vec(G.WIDTH/4, -20),
  s_pos: vec(G.WIDTH/4, -20),
  size: 11,
  rotation: 2,
  dir: vec(0.05,0.5)
};
let bigBoulder8 = {
  pos: vec(G.WIDTH-20, -20),
  s_pos: vec(G.WIDTH-20, -20),
  size: 7,
  rotation: 2,
  dir: vec(-0.05,0.6)
};


bigBoulders.push(bigBoulder);
bigBoulders.push(bigBoulder2);
bigBoulders.push(bigBoulder3);
bigBoulders.push(bigBoulder4);
bigBoulders.push(bigBoulder5);
bigBoulders.push(bigBoulder6);
bigBoulders.push(bigBoulder7);
bigBoulders.push(bigBoulder8);
}


let angle = 0;
function drawBigBoulder(obj = bigBoulder) {
  color("light_red");
  //  bigBoulder.pos.x = G.WIDTH/2 + 10 * Math.cos(angle);
  //  bigBoulder.pos.y = G.HEIGHT/2 + 20 * Math.sin(angle);
  obj.pos.x += obj.dir.x;//0.1;
  obj.pos.y += obj.dir.y;//0.2;
  angle += 0.01;

  // --- No rotation:
//  let offset = vec(5, 3); 
// --- Use rotation:
  let A = Math.cos(angle) * obj.size*0.3;
  let B = Math.sin(angle) * obj.size*0.3;
  let offset = vec(A, B);
  
  let col = [];
  
  let modPos = vec(obj.pos.x + offset.x, obj.pos.y + offset.y);
  col.push(arc(modPos, obj.size, obj.size * 2));
  modPos = vec(obj.pos.x - offset.x, obj.pos.y - offset.y);
  col.push(arc(modPos, obj.size, obj.size * 2));

  /*
  
    col.push(arc(G.WIDTH-arcY, G.HEIGHT/14+arcY, 10, 30));
    col.push(arc(G.WIDTH-5-arcY, G.HEIGHT/14+arcY-5, 10, 30));
    //  arc(-35+(arcY/2), G.HEIGHT/2+arcY, 10, 60);
    */
    if (col[0].isColliding.char.a || col[1].isColliding.char.a) {
      play("hit");
      particle(player.pos, 1, 1);

      if (CHEATMODE) {
        player.pos.y -= 10;
      }

      player.pos.y += 10;
      score --;
    }
  arcY += 0.1;
  if (obj.pos.x < -50 || obj.pos.x > G.WIDTH+50 || obj.pos.y > G.HEIGHT+50) {
    obj.isActive = false;
  }

}


let arcY = 0;
function testArc() {
  text("ay  " + arcY, 3, 10);
  arcY += 0.1;
  // Draw an arc that takse up 1/4 of the right side of the screen.
  color("light_red");
    arc(G.WIDTH+15-arcY, G.HEIGHT/14+arcY, G.WIDTH/5, 15);
    // same but on the left side
    arc(-25+arcY, G.HEIGHT/2+arcY, G.WIDTH/4, 25);
}

function ResetStuff() {
  levelData = {
    level: 1,
    score: 0,
    lives: 3,
    rocks: 1,
    boosters: 3,
    globalspeed: 1,
    shieldtime: 120,
    bigBoulderIndex: 0
  };
  shieldcount = 0;
  shieldBonus.isActive = false;
  levelData.bigBoulderIndex = 0;
}

// function pseudoRandom(seed) {
//   const x = Math.sin(seed++) * 10000;
//   return x - Math.floor(x);
// }

function addRocksB(ammount = 3) {
  let rocksprites = ["b","c","d","e"];
  let value = 1;// rndi(2, 6) * 0.5; // 1-3 with 0.5 steps.
  
  for (let t = 0; t < 3; t++) {    
    for (let i = 0; i < ammount; i++) {
      // pick the next rock-sprite
      let spr = rocksprites[i % rocksprites.length];
      let rock = {
        pos: vec(rnd(0, G.WIDTH), rnd(G.HEIGHT * -1, 0)),
        speed:(value==1)?1:0.5,//(t==ammount-1)? 0.5:1,  //1+(ammount*0.5)-value,
        isActive: true,
        size: vec(value, value),
        rotation: rndi(0, 3),
        sprite: spr,
        isBig: false
      };
      console.log(rock.speed);
      rocks.push(rock);
    }
    value += 0.5;
  }

}

function addRocks(ammount = 10) {

  // Documentation for the rocksprites
  // 2024-03-06: Stenarna slumpas. I andra loopen får de stora lägst fart medan andra får global-speed i fart.

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
      sprite: spr,
      isBig: false
    };
    rocks.push(rock);
  }
  // loop through rocks and make rocks with speed <0.01 have a speed of 1 instead and use the sprite "h" (for debugg)

  rocks.forEach((rock) => {
    console.log(rock.size.x);
    if (rock.speed > 0) {
      rock.speed = levelData.globalspeed;
    }

    if (rock.speed == 0) {
      rock.isBig = true;
      rock.speed = levelData.globalspeed* 0.5;
      rock.rotation = 0;
      rock.pos.y = rnd(-60, 0);
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
      pos: vec(rnd(0, G.WIDTH), ((i*100)+G.HEIGHT)*-1),// rnd(G.HEIGHT*-1, 0)),
      speed: rnd(0.8, 1),
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

  // not used??
//  let t = 0.25;
//  t = easeInOutCubic(t);
  
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
//    rock.speed = rock.isBig? difficulty * 0.5 : difficulty;
//    char(rock.sprite, rock.pos, {scale: {x: rock.size.x, y: rock.size.y}, rotation: rotation*rock.rotation});
  });
  if (coldata.col != null) {
    checkCollisions(coldata);
}



function checkCollisions(coldata)
{
  if (coldata.col.isColliding.char.a) {
    if (coldata.rock.sprite == "f") { // ==== BOOSTER ====
      play("coin");
      shieldcount += 40;
      player.pos.y -= 10; //5, 2,33,DEBUGG    
      color("yellow");
      particle(player.pos, 5, 3, 33, 0.5);
      color("black");
      particle(player.pos, 5, 2, 33, 0.2);
      score ++;

    } else {
      if (shieldcount < 1) {// === Rock - NO SHIELD ===
        play("hit");

        if (CHEATMODE) {
          player.pos.y -= 20;
        }

        player.pos.y += 10;
        score --;
        //play("click")
      } else {             // === Rock - SHIELD ===
        play("click");
        score ++;
      }
      particle(player.pos, 10, 2);
    }
    coldata.rock.pos.y = rnd(G.HEIGHT*-1, 0);
  }
}
}
