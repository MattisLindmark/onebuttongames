
title = "Tanka";

description = `Ett spel om att tanka.
`;

characters = [
`
 lll
 llL
llllll
llllll
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
  WIDTH: 300,
  HEIGHT: 300,
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  seed: 1,
  theme: "shape",
};



let currentKR = 0;
let currentL = 0;

let tankaTimer = 0;
const literpris = 18.57;

const goals = [
  {kr: 10*literpris, l: 10},
  {kr: 300, l: 300/literpris},
  {kr: 1000, l: 1000/literpris}
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

function update() {
  if (!ticks) {
    setup();
    this.intro = true;
  }
  if (this.intro == true) {
   drawIntro();
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

function setup() {
  console.log("setup" +day);
  day++;
  handleReleased = false;
  currentKR = 0;
  currentL = 0;
  tankaTimer = 0;
  this.intro = true;
  statefunk = tanka;
}

function getReady()
{
  handleReleased = false; // Inte bra, men handle sätts i drawGasPumpHandle, så jag ids inte...
  color("red");
  rect(0,0, G.WIDTH, G.HEIGHT);
  
  color("black");
  text("Get ready", G.WIDTH/2-50, G.HEIGHT/2-30, {scale:{x:3 , y:3}});
  text("to tanka!", G.WIDTH/2-50, G.HEIGHT/2, {scale:{x:3 , y:3}});
  text("Goal: " + currentGoal.kr + " kr", G.WIDTH/2-50, G.HEIGHT/2+30, {scale:{x:2 , y:2}});
  text("Goal: " + currentGoal.l + " liter", G.WIDTH/2-50, G.HEIGHT/2+40, {scale:{x:2 , y:2}});
}

let introX = 0;
function drawIntro() {
  introTimer++;
  let animValue = clamp(introTimer * 0.01, 0, 1);
  drawIntroEnvironment();
  //move char a from left to the middle of the screen.
  color("black");
  text("Day " + day, G.WIDTH/2-30, easeOutCubic(animValue,-10,G.HEIGHT/2-80), {scale:{x:2 , y:2}});
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

function drawClouds(ticks) {
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

function calculateScore() {
  // the cloaser to the goal the more points
  let krDiff = Math.abs(currentGoal.kr - currentKR);
  let lDiff = Math.abs(currentGoal.l - currentL);
  let krPoints = 100 - krDiff;
  let lPoints = 100 - lDiff;
  
  statefunk = function() {
    color("white");
    text("Points: " + (krPoints + lPoints), G.WIDTH/2-30, G.HEIGHT/2+10);
    text("It was " + krDiff + " kr from the goal", G.WIDTH/2-30, G.HEIGHT/2+20);
    end();
  };
}

function drawCurrentGoal() {
  color("white");
  text("Goal: " + currentGoal.kr + " kr", G.WIDTH/2-35, G.HEIGHT/2-30);
  text("Goal: " + currentGoal.l + " liter", G.WIDTH/2-35, G.HEIGHT/2-20);

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
  


  if (input.isPressed) {
  line(227, 112, 218, 122,3);
  } else {
  line(225, 115, 217, 115,3);
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
      currentKR+=0.15;    
      //currentKR = parseFloat((currentKR + 0.01).toFixed(2));
      currentL = parseFloat((currentKR/literpris).toFixed(2));
    //}
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
  color("black");
  text("Kronor: " + currentKR, G.WIDTH/2-30, G.HEIGHT/2-10);
  text("Liter: " + currentL, G.WIDTH/2-30, G.HEIGHT/2);
  color("blue");

  
  // text("Kr: " + roundKR.toFixed(2), G.WIDTH/2-30, G.HEIGHT/2-70);
  // text("L : " + roundL.toFixed(2), G.WIDTH/2-30, G.HEIGHT/2-60);

  text("Kr: " + roundKR.toFixed(2), G.WIDTH/2 - G.WIDTH * 1/10, G.HEIGHT/2 - G.HEIGHT * 7/30);
  text("L : " + roundL.toFixed(2), G.WIDTH/2 - G.WIDTH * 1/10, G.HEIGHT/2 - G.HEIGHT * 1/5);

}