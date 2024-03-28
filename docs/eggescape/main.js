title = "Egg Escape";

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
`,`
   LyL
   Ly
   yL
yLyLy
LyLyL
L   L
`
];

// 180x160
const G = {
  WIDTH: 200,
  HEIGHT: 200,
};
let GRAVITY = 0.1;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
      theme: "crt",
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

let orgEgg = {
  pos: vec(G.WIDTH * 0.4, G.HEIGHT/4),
  speed: 1,
  vel: vec(0, 0),
  color: "black",
  bounce: 0.8,
  bounceX: false,
  bounceY: false,
};

let platta = {
  pos: vec(G.WIDTH, G.HEIGHT-8),
  thick: 10,
  length: G.WIDTH / 5,
  speed: 3,
  isJumped: false, // is it jumped this time?
  number: 0,
};

let Player = {
  pos: vec(G.WIDTH * 0.5, G.HEIGHT+10),
  speed: 1,
  vel: vec(0, 0),
  color: "black",
};

let eggPool = [];
let lastCollission = 0;

function reset() {
  orgEgg.pos = vec(G.WIDTH * 0.4, G.HEIGHT/4);
  orgEgg.vel = vec(0, 0);
  orgEgg.bounce = 0.8;
  orgEgg.bounceX = false;
  orgEgg.bounceY = false;
  setupEggPool();
  platta.pos = vec(G.WIDTH+40, G.HEIGHT-8);
  //platta.thick = 5;
  platta.length = G.WIDTH / 5;
  platta.speed = 3;
  platta.isJumped = false;
  platta.number = 0;
  score = 0;
  lastCollission = 0;
}
let globalBGRCenterX = G.WIDTH;
let bgrState = 0;

let CHEATMODE = false;

//let debuggMaxHeight = 1000;
let levelUp = 0;
//let tmpSeed = 0;

// ================================================== Main Loop
function update() {
  if (!ticks) {
    sss.setSeed(6); // eller 7
    sss.setVolume(0.04);
    GRAVITY = 0.1;
    globalBGRCenterX = G.WIDTH;
    reset();
  //debuggMaxHeight = 1000;
    orgEgg.color = "black";
    levelUp = 0;
    bgrState = 0;
    setupEggPool();
    setupNightSky();
    setupGiraffs();
  }

  // text("seed: " + tmpSeed, 3, 3);
  // if (ticks % 100 == 0) {
  //   tmpSeed ++;
  //   sss.setSeed(6);   // 17 eller 18. 6, 7 9
  // }

//  if (orgEgg.pos.y < debuggMaxHeight) {
//     debuggMaxHeight = orgEgg.pos.y;
//   }
//   text("DH " + debuggMaxHeight, 3, 3);

//  text("Platta: " + platta.number, 3, 6);

  if (orgEgg.pos.y < 1 && ticks % 5 == 0){
    score ++;
    play("coin");
  }

  if (platta.number % 5 == 0 && score > 0 && levelUp < platta.number) {
    levelUp = platta.number;
    score ++;
    play("powerUp");
    orgEgg.color = getRandomColor();
  }

  drawStars();

  if (globalBGRCenterX < -140) {
    globalBGRCenterX = G.WIDTH;
    bgrState ++;
  }

  if (bgrState == 0)
  {
//    drawSavannah();
    backgroundA();
  } else if (bgrState == 1) {
//    justEmptySpace();
    drawTheCity();
  } else if (bgrState == 2) {
    drawSavannah();
  } else if (bgrState > 2) {
    justEmptySpace();
    orgEgg.vel.y *= 0.5;
      GRAVITY -= 0.01 ;//-= 0.001;
    
    text("GRAVITY: " + GRAVITY, 3, 15);
    // if (orgEgg.vel.y > 2) {
    //   orgEgg.vel.y =2;    
    // }
    // if (orgEgg.vel.y < -2) {
    //   orgEgg.vel.y = -2;
    // }
    if (orgEgg.pos.y < -200)
    {
//      score = score + 100;
      complete("You have escaped!");
    }
  }

//  drawHills();

  bounceEgg(orgEgg);
  drawOneEgg(orgEgg);

//  line(0, G.HEIGHT-20, G.WIDTH, G.HEIGHT-20, 1);
  
  if (input.isJustPressed) {
    if (GRAVITY < 0.1) {
      return;
    }
    if (orgEgg.pos.y < G.HEIGHT-20)
    {
//      particle(orgEgg.pos, 10, 2,5,3);
      color("black");
      particle(orgEgg.pos, rnd(8,11), 1.5);
      play("hit", {volume: 0.5});
      orgEgg.vel.y = 5;// = vec(0, rnd(5,6)); // <- Stor del av speltestande var den 5
    }
    }    

  color("green");
  movePlatta(platta);
//  let col = rect(G.WIDTH / 2 - 20, G.HEIGHT - 11, G.WIDTH / 5, 5);
  let col = rect(platta.pos.x, platta.pos.y, platta.length, platta.thick);
  if (col.isColliding.char.a) {
    if (ticks - lastCollission > 10 && GRAVITY == 0.1) {
      score ++;
      play("jump");
      platta.isJumped = true;
      orgEgg.bounceY = true;
      orgEgg.pos.y = platta.pos.y - 3; // XXX hmm.
      lastCollission = ticks;
    }
  }
  if (orgEgg.pos.y > G.HEIGHT+20) {
    if (CHEATMODE) {
      orgEgg.pos.y = G.HEIGHT-20;
      orgEgg.bounceY = true;
      lastCollission = ticks;
      console.log("vy "+orgEgg.vel.y);
      orgEgg.vel.y -= 2.5;
    } else {
      play("explosion");
      end();
    }
  }
  //text("Easter Egg - \nthe eggiest easter there is", 3, 8);
  //draw();
}

function movePlatta(platta) {
  // when platta exit screen to the left, wrap it to the right and reduce its lenth by 0.2 and increase its speed by 0.1
  platta.pos.x -= platta.speed;
  if (platta.pos.x+platta.length < 0) {
    platta.pos.x = G.WIDTH;
    platta.number ++;
    if (!platta.isJumped) {
      play("coin");
    }
    platta.isJumped = false;
    platta.length -= 0.2;
    platta.speed += 0.1;
//    platta.speet = rnd(2, 4);

  }
  
}

function draw() {
  for (let i = 0; i < eggPool.length; i++) {
    const egg = eggPool[i];
    bounceEgg(egg);
    color(egg.color);
    char("a", egg.pos, {scale: {x:1, y:1.5}});
    egg.pos.add(egg.vel);
//    egg.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
  }
}

function drawOneEgg(egg) {
  color(egg.color);
  char("a", egg.pos, {scale: {x:1, y:1.5}});
  egg.pos.add(egg.vel);
}

function checkEggCollission(egg) {
  if (egg.pos.x < 0 || egg.pos.x > G.WIDTH) {
    egg.vel.x *= -1;
  }
  if (egg.pos.y < 0 || egg.pos.y > G.HEIGHT) {
    egg.vel.y *= -1;
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


// blir som en najs floaty feeling...
//
// function bounceEgg(egg) {
//   if (egg.pos.x < 0 || egg.pos.x > G.WIDTH) {
//     egg.vel.x *= -1;
//   }
//   if (egg.pos.y < 0 || egg.pos.y > G.HEIGHT) {
//     egg.vel.y *= -1;
//   }
// }



// ===============================================   cosmetics



function drawStars() {
  stars.forEach((star) => {
    star.pos.x -= star.speed;
    color (star.color);
    rect(star.pos, 1, 1);
    color("black");
    if (star.pos.x < 0) {
      star.pos.y = rnd(G.HEIGHT-50,0);
      star.pos.x = rnd(G.WIDTH, G.WIDTH+50);
    }
  });
}

function backgroundA() {
  drawHouseFarm();
  drawHills();
}

function drawTheCity() {
  globalBGRCenterX -= 1;
  drawHouseCity();
  drawHouseCity2(55);
  drawHouseCity3(95);
//  drawHouseCity2(115);
  drawHouseCity4(115);  
  color("light_yellow");    
  rect(globalBGRCenterX+130, G.HEIGHT-2, G.WIDTH+5, 10);
}



let giraff = {
  pos: vec(G.WIDTH, G.HEIGHT-20),
  speed: 1,
};
let giraffs = [];

function setupGiraffs(){
  giraffs = [];
  // an array of 5 giraffs that has position X from G.WIDTH to G.WIDTH+100
  // and y at G.HEIGHT-20
  // and speed 1  
  let initialX = G.WIDTH;
  times(5, () => {
    giraffs.push({
      pos: vec(initialX+rnd(-10,10), G.HEIGHT-8),
      speed: rnd (1, 1.5),
    });
    initialX += 40; // Increment the x-position by 20 units for each new giraffe
  });
  
}

function justEmptySpace() {
    endingStars.forEach((star) => {
      star.pos.x -= star.speed;
      color (star.color);
      rect(star.pos, 2, 2);
      color("black");
      if (star.pos.x < 0) {
        star.pos.y = rnd(G.HEIGHT-10,0);
        star.pos.x = rnd(G.WIDTH, G.WIDTH+50);
      }
    });  
}

function drawSavannah(){
  globalBGRCenterX -= .5;
  color("light_yellow");
  if (globalBGRCenterX > 0) {  
  rect(-5, G.HEIGHT-2, G.WIDTH+5, 2);
  } else {
    rect(globalBGRCenterX, G.HEIGHT-2, G.WIDTH+globalBGRCenterX, 10);
  }
  drawGiraffs();

  if (globalBGRCenterX < -50) {
    justEmptySpace();
  }
}

function drawGiraffs() {
  for (let i = 0; i < giraffs.length; i++) {
    const giraff = giraffs[i];
    color("black");
//    char("c", giraff.pos, {mirror: {x: -1, y: 1}}); // draw giraff
    char("c", giraff.pos, {scale: {x: 2, y: 2}, mirror: {x: -1, y: 1}});
    giraff.pos.x -= giraff.speed;
    if (giraff.pos.x < -10 && globalBGRCenterX > 50) {
      giraff.pos.x = G.WIDTH + rnd(0, 50);
    }
  }
}



function drawHouseCity() {
  let mod = 15;
  let housetype = 0;
  if (housetype == 0) {
//    globalBGRCenterX = G.WIDTH;
    color("light_black");
    rect(globalBGRCenterX+mod - 17, G.HEIGHT - 20, 34, 20);
    //  color("red");
    rect(globalBGRCenterX+mod - 15, G.HEIGHT - 30, 30, 10);
    //  color("light_blue");
    rect(globalBGRCenterX+mod - 10, G.HEIGHT - 40, 20, 10);
    color("yellow");

    // draw windows
    rect(globalBGRCenterX+mod - 10, G.HEIGHT - 15, 5, 5);
    rect(globalBGRCenterX+mod + 5, G.HEIGHT - 15, 5, 5);
    rect(globalBGRCenterX+mod - 10, G.HEIGHT - 25, 5, 5);
    rect(globalBGRCenterX+mod + 5, G.HEIGHT - 25, 5, 5);
    color("black");
  }
  color("light_black");
  rect(-5, G.HEIGHT-2, G.WIDTH+5, 2);   
}

function drawHouseCity2(mod = 40) {
  //let mod = 40;
  color("light_black");
  rect(globalBGRCenterX+mod - 15, G.HEIGHT - 60, 30, 60);
  color("yellow");
  rect(globalBGRCenterX+mod - 10, G.HEIGHT - 20, 5, 5);
  rect(globalBGRCenterX+mod + 5, G.HEIGHT - 25, 5, 5);
  rect(globalBGRCenterX+mod + 5, G.HEIGHT - 25, 5, 5);
  rect(globalBGRCenterX+mod - 8, G.HEIGHT - 35, 5, 5);
  rect(globalBGRCenterX+mod + 5, G.HEIGHT - 45, 5, 5);
  rect(globalBGRCenterX+mod - 10, G.HEIGHT - 55, 5, 5);
}

function drawHouseCity3(mod = 50) {
  color("light_black");
  rect(globalBGRCenterX+mod - 15, G.HEIGHT - 45, 20, 45);
  color("yellow");
  rect(globalBGRCenterX+mod -3, G.HEIGHT - 17, 5, 5);
  rect(globalBGRCenterX+mod - 11, G.HEIGHT - 35, 5, 5);
}

function drawHouseCity4(mod = 60) {
  color("light_black");
  rect(globalBGRCenterX+mod - 15, G.HEIGHT - 25, 20, 45);
  color("yellow");
  rect(globalBGRCenterX+mod - 3, G.HEIGHT - 15, 5, 5);
}


function drawHouseFarm() {
  //move house to the left
  globalBGRCenterX -= 0.5;

  color("light_red");
  rect(globalBGRCenterX - 17, G.HEIGHT - 21, 34, 20);
  line(globalBGRCenterX - 17, G.HEIGHT - 17, globalBGRCenterX, G.HEIGHT - 25, 8);
  line(globalBGRCenterX + 17, G.HEIGHT - 17, globalBGRCenterX, G.HEIGHT - 25, 8);
  color("yellow");
  rect(globalBGRCenterX - 12, G.HEIGHT - 15, 5, 5);
  rect(globalBGRCenterX + 7, G.HEIGHT - 15, 5, 5);
  color("light_black");
  rect(globalBGRCenterX-3, G.HEIGHT -10, 7, 10);
}

function drawHills()
{
  drawFence();
  // dra hills using arcs, light green. bottom of the screen.
  
  // draw a hill
   color("light_green");
   arc(globalBGRCenterX-50, G.HEIGHT+15, 20, 15, 5, -3.14);
   arc(globalBGRCenterX+80, G.HEIGHT+25, 30, 15, 5, -3.14);
   
   
   // just a rect at the bottom of the screen. 5 heigh
   color("light_green");
   rect(-5, G.HEIGHT-2, G.WIDTH+5, 2);   
   
   // dra a rect after the last arc, that follows it.
   color("light_black");    
   rect(globalBGRCenterX+130, G.HEIGHT-2, G.WIDTH+5, 10);
}
function drawFence() {
  let fX = globalBGRCenterX-110;

  // rect to the left of the fence
  color("light_red");
  rect(fX-54, G.HEIGHT-20, 30, 20);
  color("light_yellow");
  rect(fX-54, G.HEIGHT-25, 30, 10);


  
  // draw a fence at the bottom of the screen
  color("light_black");
//  rect(0, G.HEIGHT-5, G.WIDTH, 5);
  color("light_yellow");
  rect(fX-18, G.HEIGHT-11, 36,2);
  for (let i = fX-18; i < fX+18; i += 10) {
    rect(i+2, G.HEIGHT-11, 2, 10);
  }
}




//================================================== Setup Functions

function setupEggPool() {
  for (let i = 0; i < 10; i++) {
    let colstr = getRandomColor();
    eggPool.push({
      pos: vec(rnd(100,G.WIDTH), rnd(G.HEIGHT/2)),
      speed: rnd(1, 2),
      vel: vec(-1, rnd(2) - 1),
      color: colstr,
      bounce: rnd(0.8, 0.9),
      bounceX: false,
      bounceY: false, // should eg bounce comming frame?
    });
  }    
}



let stars = [];
let endingStars = [];
function setupNightSky() {
  stars = [];
  endingStars = [];
  // fill with 10 stars using times
  times(20, () => {
    stars.push({
      pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT+50)),
      speed: rnd(0.2, 0.5),
      color: rnd(0, 2)>1 ? "light_yellow" : "light_blue"
    });
  });
  
  // make one random star black
  stars[rndi(0, stars.length)].color = "black";
  // make one random star yellow
  stars[rndi(0, stars.length)].color = "yellow";

  times(20, () => {
    endingStars.push({
      pos: vec(rnd(G.WIDTH, G.WIDTH+200), rnd(0, G.HEIGHT+20)),
      speed: rnd(1, 2),
      color: getRandomColor()//rnd(0, 2)>1 ? "yellow" : "blue"
    });
  });

}



// ================================================== Helper Functions
function getRandomColor()
{
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
  */