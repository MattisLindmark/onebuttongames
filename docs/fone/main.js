// title = "Formula One";

// description = `F1 for One.
// `;

characters = [
`
  
r rr
 llr
llllll
 l  l

`
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


function update() {
  if (!ticks) {
  }
  drawTrack2();
  text("Laps: " + nrOfLaps, 50, 3);
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

  drawThinTrack(100, 85, 60,1);


  let x = 100 + (30 * throttle) * Math.cos(angle);
  let y = 103 + (30 * throttle) * Math.sin(angle);

  color("black");
  // Draw the character at the new position
  let col = char("a", x, y, { scale:{x: 2, y: 2} });
//  char("a", x, y, { scale:{x: 2, y: 2}, rotation: angle });

  checkCollisions(col);

  // Update the angle
  angle += speed * 2;//speedModifier;

  if (angle > 2 * PI) {
    angle -= 2 * PI;
    nrOfLaps++;
  }

}

let coltimer = 0;
function checkCollisions(colData){
  if (colData.isColliding.rect.light_black || colData.isColliding.rect.green)
  {
    coltimer++;
    if (coltimer % 20 == 0)
    {
      score += 1;
    }
    if (colData.isColliding.rect.green || colData.isColliding.rect.yellow && coltimer %20 == 0)// && coltimer % 40 == 0)
    {
      //play("coin", {volume: 0.1});
      innerTrackColor = "yellow";
      score += 10;
    } else {
      innerTrackColor = "green";
    }
  }  
}


function drawThinTrack(cx, cy, rad, thick) {
  throttle = clamp(throttle,0,3);
  color(innerTrackColor);
  arc(cx, cy, rad, thick, PI, 2 * PI);
  arc(cx, cy + 35, rad, thick, 0, PI);
//  arc(100, 85, 60, 1, PI, 2 * PI);
//  arc(100, 120, 60, 1, 0, PI);
  // Draw the left and right side of the oval
  line(40, 85, 40, 120, thick);
  line(160, 85, 160, 120, thick);

}

function fullReset()
{
  speedModifier = 1;
  throttle = 0;
  angle = 10;
  coltimer = 0;
  score = 0;
  nrOfLaps = 0;
}