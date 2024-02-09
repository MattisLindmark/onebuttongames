// title = "Formula One";

// description = `F1 for One.
// `;

characters = [
`
  
r rr
 llr
llllll
 l  l

`,`
  ll
 lLLl 
lL LLl
lLL Ll
 lLLl
  ll
`,`
 llll 
 l  l
l l  l
l    l
 l  l
 llll
`,`
 llll 
 lGGl
 lllll
 llll
 llll
llllll
`,`
LLLL
L l l
Ll l l
L l l
LLLL
`,

];

const G = {
  WIDTH: 200,
  HEIGHT: 200,    
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  seed: 1,
  theme: "shape",
};

let angle = 0;
let speed = 0.01;
let throttle = 0;

let nrOfLaps = 0;

let innerTrackColor = "green";

let baseCarStats = {
  tire: 100,
  fule: 100
};

function car( tire, fule) {
  this.tire = tire;
  this.fule = fule;
}

let playerCar;
// ======================================================Update========================
function update() {
  if (!ticks) {
    fullReset();
    playerCar = new car(100, 100);
    sss.setVolume(0.1);
  }
  playerCar.fule = clamp(playerCar.fule, 0, 100);
  playerCar.tire = clamp(playerCar.tire, 0, 100);


  //char("b", 98, 103, {scale: {x: 1.2, y: 1}});
  
  drawTrack2();
  text("Laps: " + nrOfLaps, 50, 3);
 
  if (char("b", 180, 100, {scale: {x: 2, y: 2}}).isColliding.char.a) {  
    play("powerUp", {volume: 0.4});
    playerCar.tire += 10;
  }
  if (char("d", 20, 100, {scale: {x: 2, y: 2}}).isColliding.char.a) {  
    play("coin", {volume: 0.4});
    playerCar.fule += 10;
  }
  char("b",75, 72);
  char("d",75, 79);  
  rect(80, 70, playerCar.tire/2, 4);
  rect(80, 76, playerCar.fule/2, 4);


  if (playerCar.tire < 1 || playerCar.fule < 1)
  {
    play("explosion", {volume: 0.3});
    end();
//    fullReset();
  }
}

function drawTrack() {
  color("green");
  rect(0, 0, G.WIDTH, G.HEIGHT);
  color("black");
  rect(0, 0, G.WIDTH, G.HEIGHT, 5);
  color("light_black");
  arc(100, 100, 50, 50, 0, 2 * PI, { thickness: 0.1 });
}


let speedModifier = 1;
let firstRound = true;

function drawTrack2() {
  
  if (input.isPressed) {
    speedModifier += 0.1;
    throttle += 0.008;
  }else{
    speedModifier -= 0.01;
    throttle -= 0.01;
  }
  speedModifier = clamp(speedModifier,1.5,2.5);
  
    if (firstRound)
    {
      nrOfLaps = -1;
      speedModifier = 0;
      angle = 12.2;
      throttle = 2.15;
      if (input.isJustPressed)
      {
        firstRound = false;
        speedModifier = 0.01;
        //throttle = 2;
       // angle = 0;
      }
    }
  

  throttle = clamp(throttle,0,3);
  color("light_black");
  arc(100, 85, 60, 12, PI, 2 * PI);
  arc(100, 120, 60, 12, 0, PI);
  // Draw the left and right side of the oval
  line(40, 85, 40, 120, 12);
  line(160, 85, 160, 120, 12);

color("light_black");
arc(45, 102, 20, 4, PI / 1.5, 3 * PI / 2.2);
arc(155, 102, 20, 4, PI / 1.5 + PI, 3 * PI / 2.2 + PI);


  drawThinTrack(100, 85, 60,1); 
  
  let x = 100 + (30 * throttle) * Math.cos(angle);
  let y = 103 + (30 * throttle) * Math.sin(angle);

  color("black");
  // Draw the character at the new position
  let col = char("a", x, y, { scale:{x: 2, y: 2} });
//  char("a", x, y, { scale:{x: 2, y: 2}, rotation: angle });

if (firstRound)
{
  color("black");
  text("press any key", G.WIDTH/2-30, 90);
  return;
}

  checkCollisions(col);

  if (ticks % 10 == 0)
  {
    playerCar.tire -= 0.5;
    playerCar.fule -= 1;
  }
  
  // Update the angle
  angle += speed * 2;//speedModifier;

  if (angle > 2 * PI) {
    angle -= 2 * PI;
    nrOfLaps++;
  }

}

let coltimer = 0;
let offTrack = false;
function checkCollisions(colData){

  if (colData.isColliding.rect.light_black || colData.isColliding.rect.green)
  {
    if (offTrack == true) {
      coltimer = 0;
      offTrack = false;
    }

    coltimer++;
    // if (coltimer % 160 == 0)
    // {
    //   offTrack = false;
    //   score += 1;
    // }
    if (colData.isColliding.rect.green || colData.isColliding.rect.yellow)// && coltimer % 40 == 0)
    {
      //play("coin", {volume: 0.1});
      innerTrackColor = "yellow";
      if (coltimer % 80 == 0)
      {
        play("coin", {volume: 0.1});
        score += 1;
      }

    } else {
      innerTrackColor = "green";
      coltimer = 0;
    }
  } else {
    if (offTrack == false) {
      coltimer = 19;
      offTrack = true;
    }
    coltimer ++;
    if (coltimer % 20 == 0){
      play("click", {pitch: -500, volume: 0.3, note: "c"});
      score -= 1;
    }
   }
/*
    if (offTrack == true) {
//      play("explosion", {volume: 0.3});
      play("click", {pitch: -500, volume: 0.3, note: "c"});
      score -= 1;
      return;
    }
    offTrack = true;
    coltimer = 0;
    //score -= 10;
  }*/  
}


function drawThinTrack(cx, cy, rad, thick) {
//  throttle = clamp(throttle,0,3);
  color(innerTrackColor);
  arc(cx, cy, rad, thick, PI, 2 * PI);
  arc(cx, cy + 35, rad, thick, 0, PI);
//  arc(100, 85, 60, 1, PI, 2 * PI);
//  arc(100, 120, 60, 1, 0, PI);
  // Draw the left and right side of the oval
  line(40, 85, 40, 120, thick);
  line(160, 85, 160, 120, thick);

}

function drawDepoes(){

}

function fullReset()
{
  speedModifier = 1;
  throttle = 0;
  angle = 10;
  coltimer = 0;
  score = 0;
  nrOfLaps = 0;
  firstRound = true;
}