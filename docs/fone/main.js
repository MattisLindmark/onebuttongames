// title = "Formula One";

// description = `F1 for One.
// `;

characters = [
`
  ll
l ll
 lllll
llllll
 l   l

`
];

const G = {
  WIDTH: 200,
  HEIGHT: 200,    
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  //isReplayEnabled: true,
  seed: 1,
};

let angle = 10;
let speed = 0.01;
let throttle = 0;

function update() {
  if (!ticks) {
  }
  drawTrack2();
}

function drawTrack() {
  color("green");
  rect(0, 0, G.WIDTH, G.HEIGHT);
  color("black");
  rect(0, 0, G.WIDTH, G.HEIGHT, 5);
  color("light_black");
  arc(100, 100, 50, 50, 0, 2 * PI, { thickness: 0.1 });
}


function drawTrack2() {

  if (input.isPressed) {
    throttle += 0.01;
  }else{
    throttle -= 0.01;
  }

  throttle = clamp(throttle,0,3);


  // arc(100,100,80,3,Math.sin(ticks/30*PI),Math.sin(ticks/60*PI));
  // arc(100,100,80,3,3,5);

  // box(50,50,10,2);
  color("black");
  arc(100, 85, 60, 3, PI, 2 * PI);
  color("red");
  arc(100, 120, 60, 3, 0, PI);

  color("green");
  // Draw the left side of the oval
  line(40, 85, 40, 120);

  // Draw the right side of the oval
  line(160, 85, 160, 120);

  let x = 100 + (30 * throttle) * Math.cos(angle);
  let y = 103 + (30 * throttle) * Math.sin(angle);

  // Draw the character at the new position
  char("a", x, y, { scale:{x: 2, y: 2} });
//  char("a", x, y, { scale:{x: 2, y: 2}, rotation: angle });


  // Update the angle
  angle += speed * 2;

}