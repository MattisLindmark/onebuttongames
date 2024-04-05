title = "Cat Rescue";

description = ` Click to change direction\n Hold to slow down
`;

characters = [
  `
l  l l 
 ll  l
 llll  
  lll
  l l
   
  `,
  `
  ll
 llll
llllll
llllll
 llll   
`,
  `
llllll
llllll
`,
  `
l l l
lll l
lllll
  lll
  l l
  `
];

const G = {
  WIDTH: 240,
  HEIGHT: 200,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
  theme: "crt",
  //    theme: "shapeDark",
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

// Spawnpoints stuff
let spawnpoints =
{
  instansiated: false,
  points: [
    { pos: vec(0, 0), timer: 0, ready: false, direction: 1 },
  ]
  /*
  leftPoints: [
    { pos: vec(0, 0), timer: 0, ready: false, direction: 1 },
    { pos: vec(0, 0), timer: 0, ready: false, direction: 1},
    { pos: vec(0, 0), timer: 0, ready: false, direction: 1}
  ],
  rightPoints: [
    { pos: vec(0, 0), timer: 0, ready: false, direction: -1},
    { pos: vec(0, 0), timer: 0, ready: false, direction: -1},
    { pos: vec(0, 0), timer: 0, ready: false, direction: -1}
  ]
  */
}
  ;

const TreeOffsetLeft = vec(0, 20);
const TreeOffsetRight = vec(-G.WIDTH, 10);

let leveldata_org = {
  level: 1,
  plattaSpeed: 2,
  plattaLength: G.WIDTH / 5+20,
  spawnRate: 300,
  totalSavedCats: 0,
};
class LevelData {
  constructor(data) {
    this.level = data.level;
    this.plattaSpeed = data.plattaSpeed;
    this.plattaLength = data.plattaLength;
    this.spawnRate = data.spawnRate;
    this.totalSavedCats = data.totalSavedCats;
  }
}

let leveldata = new LevelData(leveldata_org); // Aha, det är såhär man kan göra...

let playerPlatta = {
  pos: vec(G.WIDTH/2-(leveldata.plattaLength/2), G.HEIGHT - 8),
  thick: 10,
  length: leveldata.plattaLength,
  speed: 2,
  isJumped: false, // is it jumped this time?
  number: 0,
  direction: 1,
};


let orgCat = {
  startPos: vec(G.WIDTH, G.HEIGHT / 4),
  pos: vec(G.WIDTH * 0.4, G.HEIGHT / 4),
  isActive: false,
  speed: 1,
  vel: vec(0, 0),
  color: "black",
  bounce: 0.8,
  bounceX: false,
  bounceY: false,
};

let catPool = [];
let lastCollission = 0;

// ==== div viktiga settings ================================================= SETTINGS STUFF
const Base_GRAVITY = 0.1;
let GRAVITY = Base_GRAVITY;

const RNDRNG_Bounce = vec(.8, 1.2);

let savedCats = 3;
const maxSavedCats = 4;

//====
const WBS = { // WALL BOUNCE SETTINGS
  bouncheX: false,
  bouncheY: false,
  returnToPool: true,
}


let wantedSpeed = 0;
let dir = 1;
let clickTimer = 0;

let LifeRemoveFX = false;
// ================================================== Main Loop
function update() {
  if (!ticks) {
    sss.setVolume(0.05);
    sss.setSeed(5);

    leveldata = new LevelData(leveldata_org);
    setupCatPool();
    setupSpawpoints();
    playerPlatta.length = leveldata.plattaLength;
    playerPlatta.speed = leveldata.plattaSpeed;
    dir = 1;
    GRAVITY = Base_GRAVITY;
    LifeRemoveFX = false;
    savedCats = 3;
  }

  if (ticks < 2)
  {
    return;
  }

//  particle(20,20, 10, 2, 11, 1.4);
  //  console.log("L-Speed: ", leveldata.plattaSpeed, "P-Speed:"+playerPlatta.speed);
  for (let i = 0; i < savedCats; i++) {
    color("green");
    char("a", 50 + (15 * i), 10, { scale: { x: 2, y: 2 } });
    if (LifeRemoveFX && i === savedCats - 1) {
      color("yellow");
      particle(50 + (15 * (i + 1)), 10, 30);
      LifeRemoveFX = false;
      //    char("a", 50+(15*i), 10, { scale: { x: 2, y: 2 } });
    }
  }
  LifeRemoveFX = false;
/* safe zone debugg
  rect(0, G.HEIGHT - 5, 5, 5);
  rect(G.WIDTH-5, G.HEIGHT - 5, 5, 5);
*/

  if (input.isJustPressed) {
    //  if (clickTimer > 10) {
    //    dir *= -1;
    //  }
    clickTimer = 0;
  }

  if (input.isPressed) {
    clickTimer++;
    wantedSpeed = 0;//leveldata.plattaSpeed * 0.1;//leveldata.plattaSpeed;  
  }
  if (input.isJustReleased) {
     if (clickTimer < 15) {
       dir *= -1;
     }
    clickTimer = 0;
    wantedSpeed = leveldata.plattaSpeed * dir;
  }

  playerPlatta.speed = lerp(playerPlatta.speed, wantedSpeed, 0.2);

  drawTreesXY(TreeOffsetLeft.x, TreeOffsetLeft.y);
  drawTreesXYmirror(TreeOffsetRight.x, TreeOffsetRight.y);

//  handleSpawning();

  movePlatta(playerPlatta);
  drawPlatta();

  // light black rect for ground
  color("light_black");
  rect(0, G.HEIGHT - 2, G.WIDTH, 2);
  color("black");

  /*
  color("green");
  let col = rect(playerPlatta.pos.x, playerPlatta.pos.y, playerPlatta.length, playerPlatta.thick);
  color("black");
*/
  drawCats();

  color("black");
  if (dir > 0) {
    text(">", playerPlatta.pos.x + playerPlatta.length / 2, playerPlatta.pos.y + 3);//, {scale: {x:2, y:2}});
  } else {
    text("<", playerPlatta.pos.x + playerPlatta.length / 2, playerPlatta.pos.y + 3);//, {scale: {x:2, y:2}});
  }

  if (ticks % leveldata.spawnRate === 0) {
    // find a random spawnPoint that is not ready and set it to ready
    let rnd = Math.floor(Math.random() * spawnpoints.points.length);
    if (!spawnpoints.points[rnd].ready) {
      spawnpoints.points[rnd].ready = true;
    }
  }

  handleSpawning();

/* Debuggtest for cats
  if (ticks % 120 === 0) {
    //    catPool.forEach(e => {if (e.bounceX) e.color = "light_blue";});
    let cat = catPool.find(e => !e.isActive);
    if (cat) {
      cat.isActive = true;
      cat.pos = vec(30, G.HEIGHT / 4);
      cat.vel = vec(-0.1, -1);
    }

  }
  */


}

//================================================== Main Functions

function drawPlatta() {
  color("green");
  rect(playerPlatta.pos.x, playerPlatta.pos.y, playerPlatta.length, playerPlatta.thick);

  // If the platform is crossing the left edge of the screen
  if (playerPlatta.pos.x < 0) {
    // Draw it again at the right edge of the screen
    rect(playerPlatta.pos.x + G.WIDTH, playerPlatta.pos.y, playerPlatta.length, playerPlatta.thick);
  }
  // If the platform is crossing the right edge of the screen
  else if (playerPlatta.pos.x + playerPlatta.length > G.WIDTH) {
    // Draw it again at the left edge of the screen
    rect(playerPlatta.pos.x - G.WIDTH, playerPlatta.pos.y, playerPlatta.length, playerPlatta.thick);
  }
 
  color("black");

}

function handleSpawning() {
  // for each spawnpoint, check if it is ready to spawn a cat
  // if so, add time to timer. At < 10, draw a cat at the spawnpoint
  // if timer > 10 but <20, draw a cat that is scale 2.
  // if timer > 30, debugg-logg : spawning. and set timer to 0 and ready to false

  for (let i = 0; i < spawnpoints.points.length; i++) {
    let sp = spawnpoints.points[i];
    if (sp.ready) {
      sp.timer++;
      let mirrorX = sp.direction*-1;
      if (sp.timer < 60) {
        color("black");
        char("a", sp.pos, { scale: { x: 1, y: 1 }, mirror: { x: mirrorX, y: 1 } });
      } else if (sp.timer < 120) {
        color("black");
        char("a", sp.pos, { scale: { x: 2, y: 2 }, mirror: { x: mirrorX, y: 1 } });
      } else {
        console.log("spawning");
        spawnCat(sp);
        sp.timer = 0;
        sp.ready = false;
      }
    }
  }
}

function spawnCat(spawnpoint) {
  let x = spawnpoint.pos.x;
  let y = spawnpoint.pos.y;
  // random between -0.1 and 0.1
  //  let velY = (Math.random() - 0.5) * 0.2;
   // let velX = (Math.random() - 0.5 *0.4); // mellan -0.2 och 0.2
   let velX = rnd(RNDRNG_Bounce.x, RNDRNG_Bounce.y);//rnd(0.8,1);
   velX *= spawnpoint.direction;

// XXX IMPORTANT: Här sätts flera katt-värden vid spawn.

  let cat = catPool.find(e => !e.isActive); 
  if (cat) {
    cat.pos = vec(x,y);
    cat.vel = vec(velX, rnd(1) - 2);
    cat.isActive = true;
  }
}

function drawCats() {
  for (let i = 0; i < catPool.length; i++) {
    const cat = catPool[i];
    if (!cat.isActive) continue;
    bounceCat(cat);
    color(cat.color);
    let mirrorX = cat.vel.x < 0 ? 1 : -1;
    let collission = char("a", cat.pos, { scale: { x: 2, y: 2 }, mirror: { x: mirrorX, y: 1 } });
    cat.pos.add(cat.vel);
    checkPlattaCollission(cat, collission);
    smplCheckCatExitScreen(cat);
//    checkWallBounce(cat); // har ej några katter som studsar mot väggar och golv så denna behövs ej.
  }
}

function checkPlattaCollission(cat, collission) {

  if (collission.isColliding.rect.green) {
    /*
    if (lastCollission === 0) {
      lastCollission = 1;
    } else {
      lastCollission = 0;
    }
    */
    play("jump");
    score++;
    cat.bounceY = true;
    cat.pos.y = playerPlatta.pos.y - 8;
  }
  /*
  if (cat.pos.y > playerPlatta.pos.y) { // && egg.pos.y < playerPlatta.pos.y+playerPlatta.thick+egg.vel.y) { // AIn verkar ha lagt till en koll för att undvika att ägget studsar flera ggr
    if (cat.pos.x > playerPlatta.pos.x && cat.pos.x < playerPlatta.pos.x + playerPlatta.length) {
      cat.bounceY = true;
      cat.pos.y = playerPlatta.pos.y - 8;
    }
  }
  */
}
let tmp = -1;
function smplCheckCatExitScreen(cat) {
  if (cat.pos.x < 5 || cat.pos.x > G.WIDTH-5) {
    play("coin");
    score +=2;
    // savedCats++;
    // if (savedCats > maxSavedCats) savedCats = maxSavedCats;
    leveldata.totalSavedCats++;
    levelUpCheck();
    resetCat(cat);
  }
  if (cat.pos.y > G.HEIGHT+20) {
    play("hit");
    color("red");
    particle(cat.pos.x,cat.pos.y-22,30,1.5, 11, 1.4);
    //    rect(cat.pos.x-4,cat.pos.y-30,8,8);
    if (savedCats > 0) { 
      arc(cat.pos.x,cat.pos.y-30, 3, 3, 0, 3.14);
    };
    LifeRemoveFX = true;
    savedCats--;
    resetCat(cat);
  }
 // tmp++;
  if (savedCats < 0) {
 //   leveldata.totalSavedCats = tmp;
    let sc = leveldata.totalSavedCats;
    let endStr = "Oh nooo! Cat-astrophe!";
    if (sc > 0) endStr = "Every Cat Counts!";
    if (sc > 1) endStr = "Feline Fine Job!";
    if (sc > 10) endStr = "Cat-tastic! You are a Hero!";
    if (sc > 20) endStr = "Pawsitively Purrr-fect!";
    if (sc > 30) endStr = "Jesus Cat Superstar!";
    if (sc > 40) endStr = "You are the Cat's Meow!";
    if (sc > 60) endStr = "Optimus Prime salutes you.";
    if (sc > 65) endStr = "I'm speechless!(Cat got my tongue)";
    let c = getRandomColor();
    color(c);
    let xpos = G.WIDTH / 2 - (endStr.length * 3);
    let xpos2 = G.WIDTH / 2 - 50;
    text(endStr, xpos, 50);
    if (sc === 1) text("you saved " + sc + " cat!", xpos2, 60);
    else text("you saved " + leveldata.totalSavedCats+" cats!", xpos2, 60);
    end("Game Over!");
  }

}

// XXX viktig levelup settings
function levelUpCheck() {
  if (leveldata.totalSavedCats % 2 === 0) {
    if (savedCats < maxSavedCats) play("powerUp");
    savedCats++;
    if (savedCats > maxSavedCats) savedCats = maxSavedCats;
    leveldata.plattaSpeed += 0.05;
    if (GRAVITY < .2) GRAVITY += 0.002;
    leveldata.spawnRate -= 30;
    if (leveldata.spawnRate < 60) leveldata.spawnRate = 60;
    leveldata.plattaLength -= 2;
    if (leveldata.plattaLength < 30) leveldata.plattaLength = 30;
    leveldata.level++;
    //dir = leveldata.plattaSpeed;
    playerPlatta.length = leveldata.plattaLength;
//    playerPlatta.speed = leveldata.plattaSpeed;
//    catPool.forEach(e => { e.speed = leveldata.plattaSpeed; });
  }

}

function checkWallBounce(cat) {
  if (!WBS.bouncheX && !WBS.bouncheY) {
    if (!WBS.returnToPool) {
      return;
    }
  }
  
  if (cat.pos.y > G.HEIGHT) {
    if (WBS.bouncheY) {
      cat.pos.y = G.HEIGHT;
      cat.bounceY = true;
    } else {
      resetCat(cat);
    }
  }
  if (cat.pos.x > G.WIDTH || cat.pos.x < 0 && WBS.bouncheX) {
    if (WBS.bouncheX) {
      cat.bounceX = true;
      if (cat.pos.x > G.WIDTH) cat.pos.x = G.WIDTH;
      if (cat.pos.x < 0) cat.pos.x = 0;
    } else {
      resetCat(cat);
    }
  }

}

function bounceCat(cat) {
  // Apply gravity
  cat.vel.y += GRAVITY;

  // Bounce off the edges
  if (cat.bounceX) {
    cat.vel.x *= -cat.bounce;
    cat.bounceX = false;
  }
  if (cat.bounceY) {
//        cat.vel.y = -cat.vel.y * cat.bounce;//(Math.random() - 1) * 0.2;
    cat.vel.y *= -cat.bounce;
    cat.bounceY = false;
  }
}


function movePlatta(platta) {
  // when platta exit screen to the left, wrap it to the right and reduce its lenth by 0.2 and increase its speed by 0.1
  platta.pos.x += platta.speed * platta.direction;

  if (platta.pos.x + platta.length < 0) {
    //platta.pos.x = G.WIDTH;
    platta.pos.x += G.WIDTH;
  }  else if (platta.pos.x > G.WIDTH) {
    //    platta.pos.x = playerPlatta.length * -1;
    platta.pos.x = 0;
  }

}

//================================================== Setup Functions
function resetCat(cat) {
  cat.isActive = false;
  cat.pos = vec(cat.startPos.x, cat.startPos.y); // Eftertanke: egentligen hade vi kunnat placera ut startpositioner och klara oss delvis utan spawnpoints.
  cat.vel = vec(-1, rnd(2) - 1); 
  cat.bounceX = false;
  cat.bounceY = false;
  cat.color = getRandomColor();
}

function setupCatPool() {
  catPool = [];
  for (let i = 0; i < 10; i++) {
    let colstr = getRandomColor();
    let startPos = vec(rnd(G.WIDTH, G.WIDTH - 5), rnd(G.HEIGHT / 5));

    catPool.push({
      isActive: false,
      startPos: startPos,
      pos: vec(startPos.x, startPos.y),//vec(rnd(100,G.WIDTH), rnd(G.HEIGHT/2)),
      speed: 1,//rnd(1, 2),
      vel: vec(-1, rnd(2) - 1),
      color: colstr,
      bounce: rnd(0.8, 0.9),
      bounceX: false,
      bounceY: false, // should eg bounce comming frame?
    });
  }
  // find all eggs with bounceX true and make them lightBlue
}

function setupSpawpoints() {
  // if (!spawnpoints.instansiated) {
  //   spawnpoints.leftPoints = spawnPointsLeft(TreeOffsetLeft.x, TreeOffsetLeft.y);
  //   spawnpoints.rightPoints = spawnPointsRight(TreeOffsetRight.x, TreeOffsetRight.y);
  //   spawnpoints.instansiated = true;
  // }
//  if (!spawnpoints.instansiated) { // behövs snyggas till, onödigt att spawnpoints left och right genereras såhär...
    spawnpoints.points =[];
    let tmpL = spawnPointsLeft(TreeOffsetLeft.x, TreeOffsetLeft.y);
    let tmpR = spawnPointsRight(TreeOffsetRight.x, TreeOffsetRight.y);
    for (let i = 0; i < tmpL.length; i++) {
      // push a new point
      spawnpoints.points.push({ pos: tmpL[i], timer: 0, ready: false, direction: 1 });
//      spawnpoints.leftPoints[i].pos = tmpL[i];
    }
    for (let i = 0; i < tmpR.length; i++) {
      // push a new point
      spawnpoints.points.push({ pos: tmpR[i], timer: 0, ready: false, direction: -1 });
      //      spawnpoints.rightPoints[i].pos = tmp[i];
    }
    spawnpoints.instansiated = true;
//  }
//console.log("spawnpoints------------");

}

//================================================== cosmetics
/* ==== OLD tree functuions ====
function drawTrees() {
let adjustY = 0;
let xx = Math.sin(ticks * 0.1) * 0.1;
color("light_yellow");
// draw the trunk
line(-2, 110, 10, 30,6);
// draw the branches
line(5, 90, 40, 80,4);
line(8, 70, 30, 60,4);
line(10, 50, 25, 40,4);
// draw the leaves
color("light_green");
  arc(20, 45, 5, 3, 0.95- xx,0);
  arc(30, 80, 5, 5, 4.8+xx);
  arc(12, 90, 5, 3, 0.95- xx,0);
  arc(12, 72, 3+(5*xx), 4, 5.5);
  
  // create spawnpoints at the tip of each bracnh
  let spawnpointsLeft = [
    vec(25, 35),
    vec(28, 55),
    vec(30, 80),
  ];
  // put char a at each spawnpoint
  color("red");
  spawnpointsLeft.forEach(spawnpoint => {
    char("a", spawnpoint);
  });

}


function drawTreesY(adjustY = 0) {
  //let adjustY = 0; // adjust this value to move everything up or down
  let xx = Math.sin(ticks * 0.1) * 0.1;
  color("light_yellow");
  // draw the trunk
  line(-2, 110 - adjustY, 10, 30 - adjustY, 6);
  // draw the branches
  line(5, 90 - adjustY, 40, 80 - adjustY, 4);
  line(8, 70 - adjustY, 30, 60 - adjustY, 4);
  line(10, 50 - adjustY, 25, 40 - adjustY, 4);
  // draw the leaves
  color("light_green");
  arc(20, 45 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(30, 80 - adjustY, 5, 5, 4.8 + xx);
  arc(12, 90 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(12, 72 - adjustY, 3 + (5 * xx), 4, 5.5);

  // create spawnpoints at the tip of each branch
  let spawnpointsLeft = [
    vec(25, 35 - adjustY),
    vec(28, 55 - adjustY),
    vec(30, 80 - adjustY),
  ];
  // put char a at each spawnpoint
  color("red");
  spawnpointsLeft.forEach(spawnpoint => {
    char("a", spawnpoint);
  });
}
*/

function drawTreesXY(adjustX = 0, adjustY = 0) {
  let xx = Math.sin(ticks * 0.1) * 0.1;
  color("light_yellow");
  // draw the trunk
  line(-2 + adjustX, 110 - adjustY, 10 + adjustX, 30 - adjustY, 6);
  // draw the branches
  line(5 + adjustX, 90 - adjustY, 40 + adjustX, 80 - adjustY, 4);
  line(8 + adjustX, 70 - adjustY, 30 + adjustX, 60 - adjustY, 4);
  line(10 + adjustX, 50 - adjustY, 25 + adjustX, 40 - adjustY, 4);
  // draw the leaves
  color("light_green");
  arc(20 + adjustX, 45 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(30 + adjustX, 80 - adjustY, 5, 5, 4.8 + xx);
  arc(12 + adjustX, 90 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(12 + adjustX, 72 - adjustY, 3 + (5 * xx), 4, 5.5);

  // create spawnpoints at the tip of each branch
  // let spawnpointsLeft = [
  //   vec(25 + adjustX, 35 - adjustY),
  //   vec(28 + adjustX, 55 - adjustY),
  //   vec(30 + adjustX, 80 - adjustY),
  // ];
/*
  color("yellow");
  spawnpoints.leftPoints.forEach(spawnpoint => {
    char("a", spawnpoint.pos);
  });
  */
}

// ================================================== Helper Functions
function getRandomColor() {
  color("black");
  let avColors = ["black", "red", "blue", "green", "yellow", "purple", "cyan"];
  return avColors[Math.floor(Math.random() * avColors.length)];
}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

/*
  | "transparent"
  | "white"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "purple"
  | "cyan"
  | "black"
  | "light_black"
  */



function spawnPointsRight(adjustX = 0, adjustY = 0) {
  let tSpawnpoints = [
    vec(-(25 + adjustX), 35 - adjustY),
    vec(-(28 + adjustX), 55 - adjustY),
    vec(-(30 + adjustX), 80 - adjustY),
  ];
  return tSpawnpoints;
}

function spawnPointsLeft(adjustX = 0, adjustY = 0) {
  let tSpawnpoints = [
    vec(25 + adjustX, 35 - adjustY),
    vec(28 + adjustX, 55 - adjustY),
    vec(30 + adjustX, 80 - adjustY),
  ];
  return tSpawnpoints;
}


function drawTreesXYmirror(adjustX = 0, adjustY = 0) {
  let xx = Math.sin(ticks * 0.1) * 0.1;
  color("light_yellow");
  // draw the trunk
  line(-(-2 + adjustX), 110 - adjustY, -(10 + adjustX), 30 - adjustY, 6);
  // draw the branches
  line(-(5 + adjustX), 90 - adjustY, -(40 + adjustX), 80 - adjustY, 4);
  line(-(8 + adjustX), 70 - adjustY, -(30 + adjustX), 60 - adjustY, 4);
  line(-(10 + adjustX), 50 - adjustY, -(25 + adjustX), 40 - adjustY, 4);
  // draw the leaves
  color("light_green");
  arc(-(20 + adjustX), 45 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(-(30 + adjustX), 80 - adjustY, 5, 5, 4.8 + xx);
  arc(-(12 + adjustX), 90 - adjustY, 5, 3, 0.95 - xx, 0);
  arc(-(12 + adjustX), 72 - adjustY, 3 + (5 * xx), 4, 5.5);

  // create spawnpoints at the tip of each branch
  // let spawnpointsLeft = [
  //   vec(-(25 + adjustX), 35 - adjustY),
  //   vec(-(28 + adjustX), 55 - adjustY),
  //   vec(-(30 + adjustX), 80 - adjustY),
  // ];
  // // put char a at each spawnpoint
  //let spawnpointLeft = spawnpoints.leftPoints;
  /*
  color("red");
  spawnpoints.rightPoints.forEach(spawnpoint => {
    char("a", spawnpoint.pos);
  });
  */
}