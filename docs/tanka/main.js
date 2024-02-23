
title = "Tanka";

description = `Ett spel om att tanka.
`;

characters = [
`
 www
 wwl
wwwwww
wwwwww
 l  l

`, `
 llll 
 lGGl
 lllll
 llll
 llll
llllll
`, `
  ll  
 llll
llllll
llllll
 llll
  ll
`,`
  lll
llllll
llLll
 ll
`
];

const G = {
  WIDTH: 250,
  HEIGHT: 250,
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  //isReplayEnabled: true,
  isShowingScore: false,
  seed: 6,
  theme: "shape",
};

let lowScore = 0;

let currentKR = 0;
let currentL = 0;

let tankaTimer = 0;
const literpris = 18.57;

const goals = [
  {kr: 10*literpris, l: 10},
  {kr: 300, l: parseFloat((300/literpris).toFixed(2))},//  totalPoint = parseFloat((totalPoint).toFixed(2));
  {kr: 1000, l:  parseFloat((1000/literpris).toFixed(2))}
];

let currentGoal = goals[0];

// let currentGoal = {
//   kr: 185.70,
//   l: 10
// };

let handleReleased = false;

let statefunk = tanka;
let day = 0;
let introTimer = 0;
let _intro = true;
Object.defineProperty(this, "intro", {
  get: function() {
    return _intro;
  
  },
  set: function(value) {
    _intro = value;
    console.log("intro: " + _intro);
    if (value == true) {
      introTimer = 0;
    }
  }
});

function update() {  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< UPDATE
  if (!ticks) {
    setup();
    this.intro = true;
  }
  
// Jahapp. Det går alltså inte rita partiklar ovanpå rektanlar.
//  let pos = vec(ticks%G.WIDTH,150);
//  particle(pos,10,1);

  if (day > 3) {
    EndScreen();
    return;
  }
  
  if (this.intro == true) {
    drawIntro();
    showScoreText();
    return;
  }

  drawBgr2();
  drawGasPumpHandle();
  drawDisplay();
  
  drawCurrentGoal();
  statefunk();

  if (handleReleased) {
    calculateScore();
  }

}

function showScoreText(){
  color("black");
  text("" + score, 5, 5);
//  text("Day: " + day, 3, 20);
  color("black");
  text("LO: " + lowScore, G.WIDTH-50, 5);
}

function setup() {

  clouds = times(3, () => {
    return {
      pos: vec(rnd(0, G.WIDTH-100), rnd(0, G.HEIGHT)),
      speed: 0.5,
      verticalSpeed: 0.01         
    };
  });
  clouds[0].speed = 0.3;
  clouds[1].speed = 0.5;
  clouds[2].speed = 0.2;

  console.log("setup" +day);
  day++;
  handleReleased = false;
  currentKR = 0;
  currentL = 0;
  tankaTimer = 0;
  this.intro = true;
  statefunk = tanka;
  currentGoal = goals[day-1];
}

function EndScreen() {
  play("powerUp");
  color("black");
  rect(0,0, G.WIDTH, G.HEIGHT);
  color("red");
  text("You have reached the end of your journey!",5, G.HEIGHT/2-40, {scale:{x:1 , y:1}});
  color("white");
  text("Score: " + score, G.WIDTH/2-80, G.HEIGHT/2-20, {scale:{x:2 , y:2}});
  day = 0;

  if (score < lowScore || lowScore == 0) {
    lowScore = score;
  }

  complete();

}

function getReady()
{
  handleReleased = false; // Inte bra, men handle sätts i drawGasPumpHandle, så jag ids inte...
  color("white");
  rect(0,0, G.WIDTH, G.HEIGHT);
  
  color("red");
  text("Get ready", G.WIDTH/2-60, G.HEIGHT/2-40, {scale:{x:3 , y:3}});
  text("to tanka!", G.WIDTH/2-60, G.HEIGHT/2-20, {scale:{x:3 , y:3}});
  color("blue");
  text("Goal: " + currentGoal.kr + " kr", G.WIDTH/2-70, G.HEIGHT/2+30, {scale:{x:2 , y:2}});
  text("Goal: " + currentGoal.l + " liter", G.WIDTH/2-70, G.HEIGHT/2+50, {scale:{x:2 , y:2}});
  color("black");
}

let introX = 0;
function drawIntro() {
  introTimer++;
  let animValue = clamp(introTimer * 0.01, 0, 1);
  drawIntroEnvironment();
  //move char a from left to the middle of the screen.
  let daytext = day>goals.length-1 ? "Last day!" : "Day " + day;
  color("black");
  text("" + daytext, G.WIDTH/2-30, easeOutCubic(animValue,-10,G.HEIGHT/2-80), {scale:{x:2 , y:2}});
  if (animValue > 0.9) {
    color("blue");
    text("You ned to tanka!", G.WIDTH/2-50, G.HEIGHT/2-50);
    text("Drive to the mack!", G.WIDTH/2-50, G.HEIGHT/2-40);
  }
  color("black");
  char("a", introX, 155, {scale: {x: 4, y: 4}});
  let col = char("b", G.WIDTH-100, 150, {scale: {x: 4, y: 4}});
  if (input.isPressed) {
    introX++;
    color("white");
    char("d", introX-20, 155, {scale: {x: rnd(0.5,2), y: 1}});
    color("black");
  }

  introX = wrap(introX, 0, G.WIDTH);

  if (col.isColliding.char.a) {
    if (input.isJustReleased) {
      this.intro = false;
      introX = 0;
      // Set statefunk to getReady() for 1 second, then set it back to tanka
      statefunk = getReady;
      setTimeout(() => {
        statefunk = tanka;
      }, 2000);
    }
  }
}

// eas in out function
function easeInOutCubic(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
// eas in with start and end values
function easeInCubic(x, start, end) {
  return start + (end - start) * x * x * x;
}

function easeOutCubic(x, start, end) {
  x = x - 1;
  return start + (end - start) * (x * x * x + 1);
}


function drawIntroEnvironment() {
  // Draw grass and hills at the middle half of screen
  color("green");
  rect(0, 160, G.WIDTH, G.HEIGHT);
  color("light_blue");
  rect(0, 0, G.WIDTH, 160);
  // Draw the sun
  color("yellow");
  // Draw the sun
  const sunX = G.WIDTH - 50;// wrap(ticks, 0, G.WIDTH);
  const sunY = 50;//30 + 10 * Math.sin(ticks * 0.01);
  let rotationSpeed = Math.PI / 180;
  let rotation = (ticks * rotationSpeed) % (Math.PI * 2);  
  char("c", sunX, sunY, {scale: {x:3,y:3}, rotation: rotation});

  // clouds
  drawClouds(ticks);
  return;
  color("white");
  let cloudSpeed = 0.5;
  let cloudX = (ticks * cloudSpeed) % G.WIDTH;
  let cloudY = 20;
  char("c", cloudX, cloudY, {scale: {x:3,y:2}});
  char("d", cloudX + 50, cloudY, {scale: {x:3,y:3}});
  char("d", cloudX + 100, cloudY, {scale: {x:6,y:4}, rotation: 90});

}

// let cloud = {
//   pos: vec(0, 0),
//   speed: 0.5,
//   verticalSpeed: 0.01
// };

let clouds = [];

function drawClouds(ticks) {

  color("white");
  let verticalSpeed = 0.01;
  let cloudYY = 20 + Math.sin(ticks * verticalSpeed*-1) * 5; // slapp lösning för varriation.
  for (let i = 0; i < clouds.length; i++) {
    if (clouds[i].pos.x > G.WIDTH+40) {
      clouds[i].pos.x = rnd(-40,-15);    
    }
    clouds[i].pos.x = (clouds[i].pos.x + clouds[i].speed);
    clouds[i].pos.y = 20 + Math.sin(ticks * verticalSpeed) * 10;
  }

      char("d", clouds[0].pos.x, cloudYY, {scale: {x:6, y:4}, rotation: 90});
      char("d", clouds[1].pos.x, clouds[2].pos.y+10, {scale: {x:3, y:3}});
      char("d", clouds[2].pos.x, 30-clouds[2].pos.y*0.2, {scale: {x:6, y:1},rotation: 3});
}

/*
    let cloud = clouds[i];
    cloud.pos.x = (ticks * cloud.speed) % G.WIDTH;
    cloud.pos.y = 20 + Math.sin(ticks * verticalSpeed) * 10;
    if (i === 0) {
      char("d", cloud.pos.x, cloud.pos.y, {scale: {x:6, y:4}, rotation: 90});
    } else if (i === 1) {
      char("d", cloud.pos.x, cloud.pos.y+10, {scale: {x:3, y:3}});
    } else {
      char("d", cloud.pos.x, 30-cloud.pos.y*0.2, {scale: {x:6, y:1},rotation: 3});
    }
  }
  */



function drawClouds_old(ticks) {
  color("white");

  // Define the speeds for the three clouds
  let cloudSpeeds = [0.5, 0.7, 0.3];

  // Define the vertical motion speed
  let verticalSpeed = 0.01;
  
  // Draw the three clouds
  for (let i = 0; i < 3; i++) {
    let cloudX = (ticks * cloudSpeeds[i]) % G.WIDTH;
    let cloudY = 20 + Math.sin(ticks * verticalSpeed) * 10; // Subtle up and down motion
    let cloudYY = 20 + Math.sin(ticks * verticalSpeed*-1) * 5; // Subtle up and down motion

    if (i === 0) {
      char("d", cloudX, cloudYY, {scale: {x:6, y:4}, rotation: 90});
    } else if (i === 1) {
      char("d", cloudX, cloudY+10, {scale: {x:3, y:3}});
    } else {
      char("d", cloudX, 30-cloudY*0.2, {scale: {x:6, y:1},rotation: 3});
    }
  }
}

// TODO: Poängräkningen blir ju helt fel... Måste göras om.
function calculateScore() {
  // the cloaser to the goal the more points
  let krDiff = Math.abs(currentKR- currentGoal.kr);
  let lDiff = Math.abs(currentL - currentGoal.l);
  //console.log("krDiff: " + krDiff);
  //console.log("lDiff: " + lDiff);

//  let krPoints = Math.abs(100 - krDiff);
//  let lPoints = Math.abs(100 - lDiff);

  let totalPoint = krDiff + lDiff;
  // make this to 2 decmals
  totalPoint = parseFloat((totalPoint).toFixed(2));

  score += totalPoint;
  play("coin");

  statefunk = function() {
    handleReleased = false;
    scoreScreen("" + parseFloat((krDiff).toFixed(2)) + " kr from goal\n\n"+parseFloat((lDiff).toFixed(2))+" l from goal", "Total: " + totalPoint); // ja, världens slappaste lösning för att visa skärm ett tag, jag veet...
  };
  // set statefunk to NextLevel in 2 seconds
  setTimeout(() => {
    setup();
    statefunk = tanka;
  }, 3000);

}

function scoreScreen(diffText, totalPointText) {
  color("purple");
  rect(0,0, G.WIDTH, G.HEIGHT);
  drawCurrentGoal();
  drawDisplay();
  color("white");
  text(diffText, G.WIDTH/2-30, G.HEIGHT/2+10);
  text(totalPointText, G.WIDTH/4, G.HEIGHT/2+40, {scale:{x:2 , y:2}});
}

function drawCurrentGoal() {
  //color("white");
  //rect(G.WIDTH/2-40, G.HEIGHT/2-40, 80, 60);
  color("white");
  text("Goal: ", G.WIDTH/2-15, G.HEIGHT/2-30);
  text("" + currentGoal.kr + " kr", G.WIDTH/2-25, G.HEIGHT/2-20);
  text("" + currentGoal.l + " litre", G.WIDTH/2-25, G.HEIGHT/2-10);

}

function drawGasPumpHandle() {
  // line(130, 60, 160, 100,10);
  // line(155, 100, 155, 140,20);
  // arc(146, 115, 10, 4, 0, PI*2);
  let distance = -20;

  color ("black");
  line(G.WIDTH * 2/3 + distance + 55, 140, G.WIDTH * 2/3 + distance + 55, 160, 5);
  line(G.WIDTH * 2/3 + distance + 55, 160, G.WIDTH * 2/3 + distance + 50, 170, 5);
  line(G.WIDTH * 2/3 + distance + 50, 170, G.WIDTH * 2/3 + distance + 40, 180, 5);
  line(G.WIDTH * 2/3 + distance + 40, 180, G.WIDTH * 2/3 + distance + 30, 175, 5);
  line(G.WIDTH * 2/3 + distance + 30, 175, G.WIDTH * 2/3 + distance + 20, 150, 5);

  color ("black");
  line(G.WIDTH * 2/3 + distance + (130 - 100), 60, G.WIDTH * 2/3 + distance + (160 - 100), 100, 10);
  color ("light_black");
  line(G.WIDTH * 2/3 + distance + (155 - 100), 100, G.WIDTH * 2/3 + distance + (155 - 100), 140, 20);
  arc(G.WIDTH * 2/3 + distance + (146 - 100), 115, 10, 4, 0, PI*2);
  // an arc that goes like a tube from the handle in to the pump
  
  let x1 = G.WIDTH * 2/3 + distance + (146 - 100);
  let x2 = G.WIDTH * 2/3 + distance + (146 - 105); // 82
/*
  color("red");
  line(x1, 114, x1-10, 114, 3);
  color("blue");
  line(x1, 114, x2, 122, 3);
  color("black");
*/
  if (input.isPressed) {
    line(x1, 114, x2, 122, 3);    
    // for 300 = line(227, 112, 218, 122,3);
    //line(227, 112, 218, 122,3);
  } else {
    line(x1, 114, x1-10, 114, 3);
    // for 300 = line(225, 115, 217, 115,3)
    //line(225, 115, 217, 115,3);
    //line(225-31, 115, 217-31, 115,3);
  }

  if (input.isJustReleased && handleReleased == false) {
    handleReleased = true;
  }
}

function drawBgr() {
  color("black");
  rect(100, 50, 100,90);
  color("white");
  arc(150, 85, 60, 15, 0, -1.8);
  arc(150, 85, 60, 15, 3, 5);
  color("green");
  rect(112, 70, 80, 30);

} 

function drawBgr2() {
  color("black");
  rect(G.WIDTH * 1/3, G.HEIGHT * 1/6, G.WIDTH * 1/3, G.HEIGHT * 5/10);
  color("white");
  arc(G.WIDTH / 2, G.HEIGHT * 17/60, G.WIDTH * 1/5, G.HEIGHT * 1/20, 0, -1.8);
  arc(G.WIDTH / 2, G.HEIGHT * 17/60, G.WIDTH * 1/5, G.HEIGHT * 1/20, 3, 5);
  color("green");
  rect(G.WIDTH * 37/100, G.HEIGHT * 7/30, G.WIDTH * 8/30, G.HEIGHT * 1/10);

  color("light_black");
// Calculate the dimensions of the base
let baseX = G.WIDTH * 1/3 - 10; // 10 units wider on each side
let baseY = G.HEIGHT * 1/6 + G.HEIGHT * 5/10; // Bottom of the first rectangle
let baseWidth = G.WIDTH * 1/3 + 20; // 20 units wider in total
let baseHeight = 10; // Small height

// Draw the base
rect(baseX, baseY, baseWidth, baseHeight);
  
}

function tanka(){

  if (input.isJustReleased){
    //somthing or nothing
  }
  
  if (input.isPressed){
    tankaTimer++;
    //if(tankaTimer % 6 == 0){
      currentKR+=0.25;
      //currentKR = parseFloat((currentKR + 0.01).toFixed(2));
      currentL = parseFloat((currentKR/literpris).toFixed(2));
    //}
      if (currentKR % 1 == 0){
//        console.log(currentKR);
        play("hit", {volume: .4});
//        playMml("C4E4G4C4");    
      }
  }
  /*
  if (input.isPressed) {
    tankaTimer++;
    if (tankaTimer % 6 == 0) {
      currentL += 0.1;
      currentKR = currentL*literpris;//Math.round(currentL * literpris*100)/100;
      currentL = parseFloat((currentL + 0.01).toFixed(2));
//      currentKR = parseFloat((currentKR).toFixed(2));
    }
  } */

}

function drawDisplay(){
  let roundL = parseFloat((currentL ).toFixed(2));
  let roundKR = parseFloat((currentKR ).toFixed(2));

//  color("black");
//  text("Kronor: " + currentKR, G.WIDTH/2-30, G.HEIGHT/2-10);
//  text("Liter: " + currentL, G.WIDTH/2-30, G.HEIGHT/2);
  color("blue");

  
  // text("Kr: " + roundKR.toFixed(2), G.WIDTH/2-30, G.HEIGHT/2-70);
  // text("L : " + roundL.toFixed(2), G.WIDTH/2-30, G.HEIGHT/2-60);

  text("Kr: " + roundKR.toFixed(2), G.WIDTH/2 - G.WIDTH * 1/10, G.HEIGHT/2 - G.HEIGHT * 7/30);
  text("L : " + roundL.toFixed(2), G.WIDTH/2 - G.WIDTH * 1/10, G.HEIGHT/2 - G.HEIGHT * 1/5);

}