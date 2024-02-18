 title = "F-One";

 description = `The speed is the limit!
 `;

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
`
wwwwww
 lwwl  
 lLLl
  ww  
 lwwl
 lyyl 
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
//  isCapturing: true,
//  isCapturingGameCanvasOnly: true,
//  captureCanvasScale: .25
};

let angle = 0;
let speed = 0.01;
let throttle = 0;

let nrOfLaps = 0;
let maxNrOfLaps = 5;

let innerTrackColor = "green";

let baseCarStats = {
  tire: 100,
  fule: 100
};


function car( tire, fule) {
  this.tire = tire;
  this.fule = fule;
}

/* Ljudtest */
// Create an AudioContext

let audioContext;// = new (window.AudioContext || window.webkitAudioContext)();
let motorsound;// = audioContext.createOscillator();
let detuneValue;// = 1000;
let gainNode;// = audioContext.createGain();
/*
motorsound.type = 'sawtooth';
motorsound.frequency.value = 60;
motorsound.detune.value = detuneValue;
motorsound.connect(gainNode);
gainNode.connect(audioContext.destination);
gainNode.gain.value = 0; // 50% volume
motorsound.start();
*/

// motorsound.start();
// setTimeout(() => {
//     motorsound.stop();
// }, 5000);
let detuneMod = 0;
let playerCar;
// ======================================================Update========================
function update() {
  if (!ticks) {
    AudioSetup();
    detuneMod = 0;
    fullReset();
    playerCar = new car(100, 100);
    sss.setVolume(0.3);
    sss.setSeed(1);
    console.log("THIS is the first");
  }

  
  playerCar.fule = clamp(playerCar.fule, 0, 100);
  playerCar.tire = clamp(playerCar.tire, 0, 100);
  
  // green background
  color("light_green");
  rect(0, 0, G.WIDTH, G.HEIGHT);
  color("black");
  
  
  if (firstRound){
    drawTrack2();
    return;
  }
  
  //char("b", 98, 103, {scale: {x: 1.2, y: 1}});
 
  drawTrack2();

  if (nrOfLaps >= maxNrOfLaps) {
    color("white");
    char("e", 155, 100, { scale: { x: 2, y: 2 } });
    color("black");
  } else {
    color("black");
    char("e", 150, 100, { scale: { x: 1, y: 1 } });
  }

  let fixEndLap = nrOfLaps>maxNrOfLaps?maxNrOfLaps:nrOfLaps;
  text("Laps: " + fixEndLap+" / "+maxNrOfLaps, 50, 3);
 
  if (char("b", 180, 100, {scale: {x: 2, y: 2}}).isColliding.char.f) {  
    play("powerUp", {volume: 0.4});
    playerCar.tire += 10;
  }
  if (char("d", 20, 100, {scale: {x: 2, y: 2}}).isColliding.char.f) {  
    play("coin", {volume: 0.4});
    playerCar.fule += 10;
  }
  char("b",75, 72);
  char("d",75, 79);
  let tcolor = playerCar.tire > 40 ? "green" : "red";
  let fcolor = playerCar.fule > 40 ? "green" : "red";
  color(tcolor);
  rect(80, 70, playerCar.tire/2, 4);
  color(fcolor);
  rect(80, 76, playerCar.fule/2, 4);
  color("black");

  if (playerCar.tire < 1 || playerCar.fule < 1)
  {
    motorsoundOnOff(false);
    play("explosion", {volume: 0.3});
    end();
//    fullReset();
  }

  if (nrOfLaps > maxNrOfLaps)
  {
    motorsoundOnOff(false);
    play("powerUp", {volume: 0.3});
    complete();
  }
}

function AudioSetup() {
  // Create an AudioContext
  audioContext = null;


  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  motorsound = audioContext.createOscillator();
  detuneValue = 1000;
  gainNode = audioContext.createGain();
  motorsound.type = 'sawtooth';
  motorsound.frequency.value = 60;
  motorsound.detune.value = detuneValue;
  motorsound.connect(gainNode);
  gainNode.connect(audioContext.destination);
  gainNode.gain.value = 0; // 50% volume
  motorsound.start();

  /*
  let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let motorsound = audioContext.createOscillator();
let detuneValue = 1000;
let gainNode = audioContext.createGain();
motorsound.type = 'sawtooth';
motorsound.frequency.value = 60;
motorsound.detune.value = detuneValue;
motorsound.connect(gainNode);
gainNode.connect(audioContext.destination);
gainNode.gain.value = 0; // 50% volume
motorsound.start();

  */

}



function motorsoundOnOff(onOff) {
  if (onOff)
  {
//    motorsound.start();
    gainNode.gain.value = 0.05;
  } else {
//    motorsound.stop();
    gainNode.gain.value = 0;
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
    detuneMod += 2;
    speedModifier += 0.1;
    throttle += 0.008;
  }else{
    detuneMod -= 1;
    speedModifier -= 0.01;
    throttle -= 0.01;
    motorsound.detune.value = detuneValue;
  }

  detuneMod = clamp(detuneMod, 0, 300);
  motorsound.detune.value = detuneValue + detuneMod;
    

  speedModifier = clamp(speedModifier,1.5,2.5);
  
    if (firstRound)
    {
      nrOfLaps = 1;
      speedModifier = 0;
      angle = 0;//12.2;
      throttle = 2.15;
      if (input.isJustPressed)
      {
        firstRound = false;
        speedModifier = 0.01;
//        motorsound.start();
        if (audioContext.state === 'suspended') {
          AudioSetup();          
        }
        motorsoundOnOff(true);
        //throttle = 2;
       // angle = 0;
      }
    }
  

  throttle = clamp(throttle, 0, 3);
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

// Calculate the derivative of the oval function at the current angle
/*
let dx =100 + (-30 * throttle) * Math.sin(angle);
let dy = 103 + (30 * throttle) * Math.cos(angle);
let rotation = Math.atan2(dy, dx);
*/

color("black");
let col = char("f", x, y, { scale:{x: 2, y: 2}, rotation: calcRotation(angle) });


  // Draw the character at the new position
  //let col = char("a", x, y, { scale:{x: 2, y: 2} }); <----
  // let col =  char("a", x, y, { scale:{x: 2, y: 2}, rotation: rotation });

if (firstRound)
{
  color("black");
  text("press any key", G.WIDTH/2-30, 90);
  return;
}

  checkCollisions(col);

  if (ticks % 5 == 0)
  {
    playerCar.tire -= 0.5; // <--- NOTE: is also reduced when going off track. Lins 123-126
    if (input.isPressed){
        playerCar.fule -= 1;
       }
  }
  
  // Update the angle
  angle += speed * 2;//speedModifier;

  if (angle > 2 * PI) {
    angle -= 2 * PI;
    nrOfLaps++;
  }

}

let prevRotation = 0;
function calcRotation(angle) {

//  let dx = 100+ (-30 * throttle) * Math.sin(angle);
//  let dy = 103+ (30 * throttle) * Math.cos(angle);
//  let rotation = Math.atan2(dy, dx);

  let rotation = (angle / 6) * 4;

  if (angle == 12.2){
    rotation = 1;
  } // magic number ftw, orkar inte förklara. den är satt att starta där tidigare.
 
//  if (Math.abs(rotation - prevRotation) > Math.PI) {
//    rotation += 2 * Math.PI * (rotation < prevRotation ? 1 : -1);
//  }
  prevRotation = rotation;
  return rotation;
}



let coltimer = 0;
//let comboBonus = 0;
let offTrack = false;
function checkCollisions(colData){
  
  // // a bar that shows comboBonus
  // color("black");
  // rect(20, 20, 100, 5);
  // color("yellow");
  // rect(20, 20, comboBonus * 10, 2);
  // color("black");



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
      if (coltimer % 40 == 0 && coltimer > 0)
      {
//        play("coin", {volume: 0.1});
        coltimer = 0;
//        comboBonus+=0.2;
//        comboBonus = clamp(comboBonus,0,1);
        score += 1;// + Math.floor(comboBonus);
      }

    } else {
      innerTrackColor = "green";
      coltimer = -40;      
//      play("hit", {volume: 0.5});
    }
  } else {
    if (offTrack == false) {
      coltimer = 19;
     // comboBonus = -1;
      offTrack = true;
    }
    coltimer ++;
    if (coltimer % 20 == 0){
      play("click", {pitch: -500, volume: 0.3, note: "c"});
      score -= 1;
      playerCar.tire -= 1;
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