
title = "Tanka";

description = `Ett spel om att tanka.
`;

characters = [];

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

let currentGoal = {
  kr: 185.70,
  l: 10
};

let handleReleased = false;

let statefunk = tanka;

function update() {
  if (!ticks) {
    setup();
  }
  

  drawBgr2();
  drawGasPumpHandle();
  statefunk();
  drawDisplay();

  drawCurrentGoal();

  if (handleReleased) {
    calculateScore();
  }


}

function setup() {

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