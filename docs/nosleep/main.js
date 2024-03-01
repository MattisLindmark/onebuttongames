 title = "NoSleep";

 description = `Dont let your focus\n escape your head circle!
 `;

characters = [
  `
  rr  
 rrrr
rrrrrr
 rrrr
  rr
`
];

const G = {
  WIDTH: 150,
  HEIGHT: 150
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  theme: "shapeDark",
  //    isCapturing: true,
  //  isCapturingGameCanvasOnly: true,
  //  captureCanvasScale: .2
  seed: 5
};

let ball = {
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2+5),
  radius: 5,
  dir: vec(1, 1).normalize(),
  speed: 1
};

let segments = [];

let levelData = {
  level: 0,
  nrofSegments: 8,
  nrofGreenSegments: 4,
  ballspeed: 1,
  rotateSpeed: 0.04
};


const CHEATMODE = false;
let leveltransition = false;


function update() { //<-- -------------------------------------------------------- Main loop
  if (!ticks) {
    Setup();
  }

  /* debugg, show the level
  color("black");
  text("Level: " + levelData.level, 3, 10);
  text("BallSpeed: " + ball.speed.toFixed(2), 3, 20);
  text("RotateSpeed: " + rotateSpeed.toFixed(2), 3, 30);
  text("Segments: " + segments.length, 3, 40);
*/
if (leveltransition) {
 color(LoopColor(3));
 text("Level " + levelData.level, G.WIDTH / 2 - 35, G.HEIGHT / 2-20, {scale: {x: 2, y: 2}});
 text("Get ready", G.WIDTH / 2 - 25, G.HEIGHT / 2 );
  return;
}

  if (ticks%200 == 0 && ticks > 0) {
    // remove one green segment
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].green && segments[i].visible) {
        segments[i].green = false;
        play("hit");
        break;
      }
    }
  }


  moveBall();
  draArc();

  // Check if there are any visible segments left
  let allVisibleSegments = true;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].visible) {
      allVisibleSegments = false;
      break;
    }
  }
  if (allVisibleSegments) {
    play("powerUp");
    particle(ball.pos, 100, 3, 1, 1.5);
    nextLevel();
  }
  

}

function Setup() {
  if (levelData.level < 1) {
   resetStuffToStartValues();
  }
  
  // Initialize the line segments
  for (let i = 0; i < levelData.nrofSegments; i++) { // Loop 50 times
    // Add the line segment to the array
    segments.push({
      start: vec(0, 0),
      end: vec(0, 0),
      visible: true, // All segments are visible at the start
      green: false
    });
  }
/*
  for (let i = 0; i < levelData.nrofGreenSegments; i++) {
    segments[i].green = true;
  }
*/
  // distribute the green segments at random positions in the segments array
  // Make sure that there enought segments to distribute
  if (levelData.nrofGreenSegments > levelData.nrofSegments) {
    levelData.nrofGreenSegments = levelData.nrofSegments-1;
  }
  for (let i = 0; i < levelData.nrofGreenSegments; i++) {
    let index = Math.floor(Math.random() * segments.length);
    if (segments[index].green) {
      i--;
    } else {
      segments[index].green = true;
    }
  }


  rotateSpeed = levelData.rotateSpeed;
  ball.speed = levelData.ballspeed;
  radius = G.WIDTH / 2;
  

}

function nextLevel() {
  segments = [];
  ball.pos = vec(G.WIDTH / 2, G.HEIGHT / 2+5);
  ball.dir = vec(1, 1).normalize();


  levelData.level++;
  levelData.nrofSegments += 2;
  levelData.nrofGreenSegments++;
  levelData.ballspeed += 0.1;
  levelData.rotateSpeed += 0.001;
  leveltransition = true;
  setTimeout(function() {
    leveltransition = false;
    Setup();
  }, 3000);

}


function resetStuffToStartValues() {
  segments = [];
  ball.pos = vec(G.WIDTH / 2, G.HEIGHT / 2+5);
  ball.dir = vec(1, 1).normalize();
  ball.speed = 1;
  radius = G.WIDTH / 2;
  rotateSpeed = 0.04;
  rotation = 0;
  lastCollision = 0;

  levelData = {
    level: 1,
    nrofSegments: 6,
    nrofGreenSegments: 3,
    ballspeed: 1,
    rotateSpeed: 0.04
  };

}


function moveBall() {

  let tmp = vec(ball.dir).mul(ball.speed);
  ball.pos.add(tmp);
//  ball.speed += difficulty * 0.0002;

if (CHEATMODE) {
  if (ball.pos.x < ball.radius || ball.pos.x > G.WIDTH - ball.radius) {
    play("hit");
    ball.dir.x *= -1;
  }
  if (ball.pos.y < ball.radius || ball.pos.y > G.HEIGHT - ball.radius) {
    play("hit");
    ball.dir.y *= -1;
  }
}

  // If ball exit the screen
  if (ball.pos.x < 0 || ball.pos.x > G.WIDTH - 0 || ball.pos.y < 0 || ball.pos.y > G.HEIGHT - 0) {
    levelData.level = 0;
    end();
  }

  color(LoopColor());
  char("a", ball.pos);
  color("black");
  // draw a light black line to show the direction of the ball
  


  // Calculate the position of the ball relative to the center of the screen
let ballPosRelativeToCenter = vec(ball.pos.x - G.WIDTH / 2, ball.pos.y - G.HEIGHT / 2);
let distanceToCenter = Math.sqrt(Math.pow(ballPosRelativeToCenter.x, 2) + Math.pow(ballPosRelativeToCenter.y, 2));
let distanceFromOuterHull = radius - distanceToCenter;

  color("purple");  
  line(vec(ball.pos).add(vec(ball.dir).mul(4)), vec(ball.pos).add(vec(ball.dir).mul(distanceFromOuterHull)), 1);


  // if (ball.pos.distanceTo(vec(G.WIDTH / 2, G.HEIGHT / 2)) > G.WIDTH / 2) {
  //   ball.dir.x *= -1;
  //   ball.dir.y *= -1;
  //   ball.dir.normalize();
  // }


}

function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

let radius = G.WIDTH / 2;
let rotateSpeed = 0.04;
let rotation = 0;
let gap = 0;
let lastCollision = 0;
//let rotateDir = 1;
function draArc() {
  lastCollision++;
  // using arc, draw a circle in the middle of the screen, as big as it can be without going off screen
  // Every 100 thick the circle will get smaller
  // there should be an opening in the circle that moves around the circle

  let wantedRotationSpeed = levelData.rotateSpeed;

  if (input.isPressed) { // Annars *= -1
    wantedRotationSpeed = (levelData.rotateSpeed)*-1;
  } else {
    wantedRotationSpeed = levelData.rotateSpeed;
  }

  // if (input.isJustPressed) {
  //   rotateDir *= -1;
  // }

  rotateSpeed = lerp(rotateSpeed, wantedRotationSpeed, 0.1);
 
  // if (input.isJustPressed) {
  //   rotDamp = 0;
  // } else if (input.isJustReleased){
  //   rotDamp = 0;
  // }


  //gap += difficulty*0.001;


  radius -= difficulty * 0.001;
  if (radius < 0) {
    radius = G.WIDTH / 2;
  }

  // arc is rotating with speed
  // if (input.isPressed) {
  //   rotation += rotateSpeed;
  // }
  rotation += rotateSpeed;
  color("black");
  //let col = arc(G.WIDTH / 2, G.HEIGHT / 2, radius, 3, rotation, rotation + gap - 1.9 * PI,);
//let col = rect(0, 0, 10, 10);
  let col = DrawCircleOfLines(radius, rotation);

  


  
//  if (col.isColliding.char.a && lastCollision > 2) {
  if (col > -1 && lastCollision > 2) {
    score++;
    if (segments[col].green == true) {
      score += 2;
      play("jump");
      particle(ball.pos, 20, 3, 1, 1.5);
    } else {
      play("coin");
    }
    segments[col].visible = false;
    // Set a random direction that is at the oposit of the current direction
    //ball.dir = vec(-ball.dir.x, -ball.dir.y);
    // Reverse the direction
    /*
        let newDir = vec(-ball.dir.x, -ball.dir.y);
    //  let angle = (Math.random() * (160 * Math.PI / 180)) - (80 * Math.PI / 180); -80 to 80
        let angle = (Math.random() * (140 * Math.PI / 180)) - (70 * Math.PI / 180);
    */
    // Calculate the direction towards the middle of the screen
    let newDir = vec(G.WIDTH / 2 - ball.pos.x, G.HEIGHT / 2 - ball.pos.y).normalize();

    let minAngle = -40 * (Math.PI / 180);
    let maxAngle = 40 * (Math.PI / 180);
    let angle = Math.random() * (maxAngle - minAngle) + minAngle;


    // 90 grader    let angle = (Math.random() * Math.PI) - Math.PI / 2;

    // Rotate the reversed direction by the random angle
    ball.dir = vec(
      newDir.x * Math.cos(angle) - newDir.y * Math.sin(angle),
      newDir.x * Math.sin(angle) + newDir.y * Math.cos(angle)
    );
    ball.dir.normalize();
    lastCollision = 0;
  }
  
  //   ball.dir.x *= -1;
  //   ball.dir.y *= -1;
  //   ball.dir.normalize();
  // }


  //arc(G.WIDTH / 2, G.HEIGHT / 2, radius, 2, 0, 1.9 * PI,);

}

function DrawCircleOfLines(radius, rotation) {
  let angle = 0;

  for (let i = 0; i < segments.length; i++) { 
    let x = G.WIDTH / 2 + radius * Math.cos(angle + rotation); // Add rotation to the angle
    let y = G.HEIGHT / 2 + radius * Math.sin(angle + rotation); // Add rotation to the angle
    let pos = vec(x, y);

    if (i > 0) {
      // Update the line segment
      segments[i].start = segments[i - 1].end;
      segments[i].end = pos;
    } else {
      segments[i].start = pos;
      segments[i].end = pos;
    }
    angle += 2 * Math.PI / segments.length; // Divide the circle into equal segments
  }
  // adjust the first segment
  segments[0].start = segments[segments.length - 1].end;

  // Draw the line segments
  let col = -1;
  for (let i = 0; i < segments.length; i++) {
    if (segments[i].visible) {
      color(segments[i].green ? "green" : "black");
      if (line(segments[i].start, segments[i].end,2).isColliding.char.a && col < 0) {
        //console.log("COLLISION"+i);
        col = i;
       // segments[i].visible = false;
     }
    }
  }
  return col;
}

const colors = ["red", "blue", "green", "yellow", "purple", "cyan", "light_red", "light_blue", "light_green", "light_yellow", "light_purple", "light_cyan"];
function LoopColor(speed = 2) {
  let index = parseInt(ticks / speed) % colors.length;
  return colors[index];
}

/* OLD
function DrawCircleOfLines(radius, rotation) {
  let angle = 0;
  let lastPos = vec(G.WIDTH / 2, G.HEIGHT / 2); // Start at the center of the screen
  for (let i = 0; i <= 25; i++) { // Loop 50 times
    let x = G.WIDTH / 2 + radius * Math.cos(angle + rotation); // Add rotation to the angle
    let y = G.HEIGHT / 2 + radius * Math.sin(angle + rotation); // Add rotation to the angle
    let pos = vec(x, y);
    if (i > 0 && i!=25) {
      line(lastPos, pos);
    }
    lastPos = pos;
    angle += 2 * Math.PI / 25; // Divide the circle into 50 segments
  }
}
*/


/* Kul funktioner
rör boll mot mus 
function drawBall() {
  color("black");
  char("a", ball.pos);
  color("red");
  const p = vec(input.pos.x, input.pos.y);
  line(ball.pos, p, 2);
  const v = vec(p).sub(ball.pos).div(10);
  ball.pos.add(v);
}
*/