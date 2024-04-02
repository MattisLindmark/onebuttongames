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
`,
`
llllll
llllll
`  
];

const G = {
  WIDTH: 200 ,
  HEIGHT: 200,
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

let playerPlatta = {
  pos: vec(G.WIDTH, G.HEIGHT-8),
  thick: 10,
  length: G.WIDTH / 5,
  speed: 2,
  isJumped: false, // is it jumped this time?
  number: 0,
  direction: 1,
};

let orgEgg = {
  startPos: vec(G.WIDTH, G.HEIGHT/4),
  pos: vec(G.WIDTH * 0.4, G.HEIGHT/4),
  isActive: false,
  speed: 1,
  vel: vec(0, 0),
  color: "black",
  bounce: 0.8,
  bounceX: false,
  bounceY: false,
};

let eggPool = [];
let lastCollission = 0;
const GRAVITY = 0.1;

const WBS = { // WALL BOUNCE SETTINGS
  bouncheX: false,
  bouncheY: false,
  returnToPool: true,    
}

// ================================================== Main Loop
function update() {
  if (!ticks) {
    setupEggPool();  
  }

  movePlatta(playerPlatta);
  color("green");
  let col = rect(playerPlatta.pos.x, playerPlatta.pos.y, playerPlatta.length, playerPlatta.thick);
  color("black");
  drawEggs();

  if (ticks % 120 === 0) {
//    eggPool.forEach(e => {if (e.bounceX) e.color = "light_blue";});
    let egg = eggPool.find(e => !e.isActive);
    if (egg) {
      egg.isActive = true;
   //   egg.pos = vec(50, 50);
   //   egg.vel = vec(1, -2);
    }

    // if (!egg) {
    //   console.log("No more eggs in pool");
    //   eggPool = [];
    //   setupEggPool();
    // }
  }


}

//================================================== Main Functions
function drawEggs() {
  
  for (let i = 0; i < eggPool.length; i++) {    
    const egg = eggPool[i];
    if (!egg.isActive) continue;
    bounceEgg(egg);
    color(egg.color);
    let collission = char("a", egg.pos, {scale: {x:1, y:1.5}});
    egg.pos.add(egg.vel);
    checkPlattaCollission(egg, collission);
    checkWallBounce(egg); 
  }
}

function checkPlattaCollission(egg, collission) {
 // rect(0,playerPlatta.pos.y,10,1);
  if (egg.pos.y > playerPlatta.pos.y){ // && egg.pos.y < playerPlatta.pos.y+playerPlatta.thick+egg.vel.y) { // AIn verkar ha lagt till en koll för att undvika att ägget studsar flera ggr
    if (egg.pos.x > playerPlatta.pos.x && egg.pos.x < playerPlatta.pos.x + playerPlatta.length) {
      egg.bounceY = true;
      egg.pos.y = playerPlatta.pos.y-8;
    }
  }
}


function checkWallBounce(egg) {
  if (!WBS.bouncheX && !WBS.bouncheY) {
    if (!WBS.returnToPool){
      return;
    }
  }
  
  if (egg.pos.y > G.HEIGHT) {
    if (WBS.bouncheY){
      egg.pos.y = G.HEIGHT;
      egg.bounceY = true;
    } else {
      resetEgg(egg);
    }
  }
  if (egg.pos.x > G.WIDTH || egg.pos.x < 0 && WBS.bouncheX) {
    if (WBS.bouncheX) {
      egg.bounceX = true;
      if (egg.pos.x > G.WIDTH) egg.pos.x = G.WIDTH;
      if (egg.pos.x < 0) egg.pos.x = 0;
    } else {
      resetEgg(egg);
    }
  }
  
}

function bounceEgg(egg) {
  // Apply gravity
  egg.vel.y += GRAVITY;
  
  
  // Bounce off the edges
  if (egg.bounceX) {
    egg.vel.x *= -egg.bounce;
    egg.bounceX = false;
  }
  if (egg.bounceY) {
    egg.vel.y *= -egg.bounce;
    //egg.pos.y -= 5; // this one is replaced by setting new pos.y in collission check
    //    egg.vel.y = -egg.vel.y * egg.bounce;//(Math.random() - 1) * 0.2;
    egg.bounceY = false;
  }
}


function movePlatta(platta) {
  // when platta exit screen to the left, wrap it to the right and reduce its lenth by 0.2 and increase its speed by 0.1
  platta.pos.x += platta.speed * platta.direction;
  
  if (platta.pos.x+platta.length < 0) {
    platta.pos.x = G.WIDTH;
    //    platta.number ++;
  }
  if (platta.pos.x > G.WIDTH) {
    platta.pos.x = playerPlatta.length*-1;
  }  
  
  if (input.isJustPressed) {
    platta.direction *= -1;
  }  
}


//================================================== Setup Functions
function resetEgg(egg) {
//  console.log("reset egg"+ egg.startPos.y);
  egg.isActive = false;
  egg.pos = vec(egg.startPos.x, egg.startPos.y);
  egg.vel = vec(-1, rnd(2) - 1);
  egg.bounceX = false;
  egg.bounceY = false;
  egg.color = getRandomColor(); 
}

function setupEggPool() {
  for (let i = 0; i < 10; i++) {
    let colstr = getRandomColor();
    let startPos = vec(rnd(G.WIDTH,G.WIDTH-5), rnd(G.HEIGHT/5));
    
    eggPool.push({
      isActive: false,
      startPos: startPos,
      pos: vec(startPos.x, startPos.y),//vec(rnd(100,G.WIDTH), rnd(G.HEIGHT/2)),
      speed: rnd(1, 2),
      vel: vec(-1, rnd(2)-1),
      color: colstr,
      bounce: rnd(0.8, 0.9),
      bounceX: false,
      bounceY: false, // should eg bounce comming frame?
    });
  }
  
  // find all eggs with bounceX true and make them lightBlue




}


// ================================================== Helper Functions
function getRandomColor()
{
  color("black");
  let avColors = ["black", "red", "blue", "green", "yellow", "purple", "cyan"];
  return avColors[Math.floor(Math.random() * avColors.length)];
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