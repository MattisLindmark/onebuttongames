
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
  

  drawBgr();
  statefunk();
  drawDisplay();

}

function setup() {

}

function drawBgr() {
  color("black");
  rect(50, 50, 100,50);
  //arc(100, 120, 60, 12, 0, PI);
  color("white");
  arc(100, 85, 60, 15, 0, -1.8);
} 


function tanka(){

  /*
  if (input.isPressed){
    tankaTimer++;
    currentKR+=0.1;    
    currentKR = parseFloat((currentKR + 0.01).toFixed(2));
    currentL = parseFloat((currentKR/literpris).toFixed(2));
  }
  */
  if (input.isPressed) {
    tankaTimer++;
    if (tankaTimer % 6 == 0) {
      currentL += 0.1;
      currentKR = Math.round(currentL * literpris*100)/100;
      currentL = parseFloat((currentL + 0.01).toFixed(2));
      currentKR = parseFloat((currentKR).toFixed(2));
    }
  }

}

function drawDisplay(){
  color("black");
  text("Kronor: " + currentKR, G.WIDTH/2-30, G.HEIGHT/2-10);
  text("Liter: " + currentL, G.WIDTH/2-30, G.HEIGHT/2);
}