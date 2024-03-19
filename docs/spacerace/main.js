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

const G = {
  WIDTH: 140,
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

let shieldcount = 0;

let shieldBonus ={
  pos: vec(50,50),
  speed: 1,
  isActive: false,
  size: vec(1, 1),
  rotation: 0
};


let DEBUGG = 0;
function update() {
  if (!ticks) {
    setup();
    //setupRocks();
  }

  if (ticks % 60 == 0 && shieldBonus.isActive == false && rnd(0, 10) > 9) {
    shieldBonus.isActive = true;
    shieldBonus.pos.y = rnd(-20,-40);    
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
  testArcB();
  text("PLy: " + player.pos.y, 3, 10);
  drawGoalLine();



}
let goalY = -10;
function drawGoalLine() {
  color ("light_green");
  let posy = 40+player.pos.y*-1;
  goalY = lerp(goalY, posy, 0.05);

  rect (G.WIDTH-10, goalY, 10, 10); // G.HEIGHT-(G.HEIGHT/4) = 120 ca just nu
  rect(10, goalY, 10, 10);
  // line between the two rects
  color("green");
  line(G.WIDTH-10, goalY+5, 10, goalY+5, 1);
  color("black");  
}

function drawShieldBonusItem() {
  if (shieldBonus.isActive) {
    shieldBonus.pos.y += shieldBonus.speed;
    if (shieldBonus.pos.y > G.HEIGHT) {
      shieldBonus.pos.y = rnd(-20,-40);
      shieldBonus.pos.x = rnd(2, G.WIDTH-2);
      shieldBonus.isActive = false;
    }
    color(LoopColor(4));
    if (char("k", shieldBonus.pos).isColliding.char.a) {
      shieldBonus.isActive = false;
      shieldcount += 120;
      play("coin");
      color("yellow");
      particle(player.pos, 5, 3, 33, 0.5);
      color("black");
      particle(player.pos, 5, 2, 33, 0.2);
    }

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
  addRocksB(2);
  addBoosters(3);
}

let rot = 0;
let rot2 = 45;

let bigBoulder = {
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
  size: 10,
  rotation: 0
};

let angle = 0;
function testArcB(r = 1) {
  color("light_red");

  //  bigBoulder.pos.x = G.WIDTH/2 + 10 * Math.cos(angle);
  //  bigBoulder.pos.y = G.HEIGHT/2 + 20 * Math.sin(angle);
  let offset = vec(5, 3);
  bigBoulder.pos.x -= 0.1;
  bigBoulder.pos.y += 0.2;
  angle += 0.01;

  let col = [];
  let modPos = vec(bigBoulder.pos.x + offset.x, bigBoulder.pos.y + offset.y);
  col.push(arc(modPos, bigBoulder.size, bigBoulder.size * 2));
  modPos = vec(bigBoulder.pos.x - offset.x, bigBoulder.pos.y - offset.y);
  col.push(arc(modPos, bigBoulder.size, bigBoulder.size * 2));

  /*
  
    col.push(arc(G.WIDTH-arcY, G.HEIGHT/14+arcY, 10, 30));
    col.push(arc(G.WIDTH-5-arcY, G.HEIGHT/14+arcY-5, 10, 30));
    //  arc(-35+(arcY/2), G.HEIGHT/2+arcY, 10, 60);
    */
    if (col[0].isColliding.char.a || col[1].isColliding.char.a) {
      play("hit");
      particle(player.pos, 1, 1);
      player.pos.y += 10;
      score --;
    }
  arcY += 0.1;
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
    rocks: 10,
    boosters: 3,
    globalspeed: 1,  
  };
  shieldcount = 0;
  shieldBonus.isActive = false;
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
        speed: (t==ammount-1)? 0.5:1,  //1+(ammount*0.5)-value,
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
