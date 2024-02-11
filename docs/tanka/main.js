
//title = "Tanka";

//description = `Ett spel om att tanka.
//`;

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

let statefunk = tanka;

function update() {
  if (!ticks) {
    setup();
  }
  

  drawBgr2();
  statefunk();
  drawDisplay();

}

function setup() {

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
  rect(G.WIDTH * 1/3, G.HEIGHT * 1/6, G.WIDTH * 1/3, G.HEIGHT * 3/10);
  color("white");
  arc(G.WIDTH / 2, G.HEIGHT * 17/60, G.WIDTH * 1/5, G.HEIGHT * 1/20, 0, -1.8);
  arc(G.WIDTH / 2, G.HEIGHT * 17/60, G.WIDTH * 1/5, G.HEIGHT * 1/20, 3, 5);
  color("green");
  rect(G.WIDTH * 37/100, G.HEIGHT * 7/30, G.WIDTH * 8/30, G.HEIGHT * 1/10);
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