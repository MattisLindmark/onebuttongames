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

// 180x160
const G = {
  WIDTH: 200,
  HEIGHT: 200,
};
const GRAVITY = 0.1;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "crt",
   // theme: "shapeDark",
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
  pos: vec(G.WIDTH * 0.5, G.HEIGHT/4),
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
  orgEgg.pos = vec(G.WIDTH * 0.5, G.HEIGHT/4);
  orgEgg.vel = vec(0, 0);
  orgEgg.bounce = 0.8;
  orgEgg.bounceX = false;
  orgEgg.bounceY = false;
  setupEggPool();
  platta.pos = vec(G.WIDTH+50, G.HEIGHT-8);
  //platta.thick = 5;
  platta.length = G.WIDTH / 5;
  platta.speed = 3;
  score = 0;
  lastCollission = 0;
}
let houseCenterX = G.WIDTH;
// ================================================== Main Loop
function update() {
  if (!ticks) {
    houseCenterX = G.WIDTH;
    reset();
    orgEgg.color = "black";
    setupEggPool();
    setupNightSky();    
  }

  if (score % 5 == 0 && score > 0) {
    score ++;
    play("powerUp");
    orgEgg.color = getRandomColor();
  }

  drawStars();
  drawHouse();
  drawHills();

  bounceEgg(orgEgg);
  drawOneEgg(orgEgg);

//  line(0, G.HEIGHT-20, G.WIDTH, G.HEIGHT-20, 1);
  
  if (input.isJustPressed) {
    if (orgEgg.pos.y < G.HEIGHT-20)
      orgEgg.vel.y = 5;// = vec(0, rnd(5,6));
    }    

  color("green");
  movePlatta(platta);
//  let col = rect(G.WIDTH / 2 - 20, G.HEIGHT - 11, G.WIDTH / 5, 5);
  let col = rect(platta.pos.x, platta.pos.y, platta.length, platta.thick);
  if (col.isColliding.char.a) {
    if (ticks - lastCollission > 10) {
      score ++;
      play("jump");
      orgEgg.bounceY = true;
      lastCollission = ticks;
    }
  }
  if (orgEgg.pos.y > G.HEIGHT+20) {
    end();
  }
  //text("Easter Egg - \nthe eggiest easter there is", 3, 8);
  //draw();
}

function movePlatta(platta) {
  // when platta exit screen to the left, wrap it to the right and reduce its lenth by 0.2 and increase its speed by 0.1
  platta.pos.x -= platta.speed;
  if (platta.pos.x+platta.length < 0) {
    platta.pos.x = G.WIDTH;
    platta.length -= 0.2;
    platta.speed += 0.1;
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
      egg.pos.y -= 5;
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


function drawHouse() {
  let housetype = 1;
  if (housetype == 0) {
    houseCenterX -= 0.2;
    color("light_black");
    rect(houseCenterX - 17, G.HEIGHT - 20, 34, 20);
    //  color("red");
    rect(houseCenterX - 15, G.HEIGHT - 30, 30, 10);
    //  color("light_blue");
    rect(houseCenterX - 10, G.HEIGHT - 40, 20, 10);
    color("yellow");

    // draw windows
    rect(houseCenterX - 10, G.HEIGHT - 15, 5, 5);
    rect(houseCenterX + 5, G.HEIGHT - 15, 5, 5);
    rect(houseCenterX - 10, G.HEIGHT - 25, 5, 5);
    rect(houseCenterX + 5, G.HEIGHT - 25, 5, 5);
    color("black");
  } else
    drawHouse2();
}

function drawHouse2() {
  //move house to the left
  houseCenterX -= 0.5;

  color("light_red");
  rect(houseCenterX - 17, G.HEIGHT - 21, 34, 20);
  line(houseCenterX - 17, G.HEIGHT - 17, houseCenterX, G.HEIGHT - 25, 8);
  line(houseCenterX + 17, G.HEIGHT - 17, houseCenterX, G.HEIGHT - 25, 8);
  color("yellow");
  rect(houseCenterX - 12, G.HEIGHT - 15, 5, 5);
  rect(houseCenterX + 7, G.HEIGHT - 15, 5, 5);
  color("light_black");
  rect(houseCenterX-3, G.HEIGHT -10, 7, 10);
}

function drawHills()
{
  drawFence();
  // dra hills using arcs, light green. bottom of the screen.
  
  // draw a hill
   color("light_green");
   arc(houseCenterX-50, G.HEIGHT+15, 20, 15, 5, -3.14);
   arc(houseCenterX+80, G.HEIGHT+25, 30, 15, 5, -3.14);
   
   // just a rect at the bottom of the screen. 5 heigh
    color("light_green");
    rect(-5, G.HEIGHT-2, G.WIDTH+5, 2);
   
}
function drawFence() {
  let fX = houseCenterX-110;

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
function setupNightSky() {
  stars = [];
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