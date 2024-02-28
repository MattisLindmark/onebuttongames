//title = "";

//description = `
//`;

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
  theme: "shapeDark"
  //    isCapturing: true,
  //  isCapturingGameCanvasOnly: true,
  //  captureCanvasScale: .2
};

let ball = {
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2+5),
  radius: 10,
  dir: vec(1, 1).normalize(),
  speed: 1
};

let segments = [];


function update() {
  if (!ticks) {
    Setup();
  }

  if (ticks%120 == 0) {
    // remove one green segment
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].green) {
        segments[i].green = false;
        play("hit");
        break;
      }
    }
  }

  moveBall();
  draArc();

  

}

function Setup() {
  // Initialize the line segments
  for (let i = 0; i < 25; i++) { // Loop 50 times
    // Add the line segment to the array
    segments.push({
      start: vec(0, 0),
      end: vec(0, 0),
      visible: true, // All segments are visible at the start
      green: false
    });
  }

  for (let i = 0; i < 10; i++) {
    segments[i].green = true;
  }
}


function moveBall() {

  let tmp = vec(ball.dir).mul(ball.speed);
  ball.pos.add(tmp);
  ball.speed += difficulty * 0.0002;

  // if (ball.pos.x < ball.radius || ball.pos.x > G.WIDTH - ball.radius) {
  //   ball.dir.x *= -1;
  // }
  // if (ball.pos.y < ball.radius || ball.pos.y > G.HEIGHT - ball.radius) {
  //   ball.dir.y *= -1;
  // }

  // If ball exit the screen
  if (ball.pos.x < 0 || ball.pos.x > G.WIDTH - 0 || ball.pos.y < 0 || ball.pos.y > G.HEIGHT - 0) {
    end();
  }

  color("black");
  char("a", ball.pos);
  
  // draw a light black line to show the direction of the ball
  


  // Calculate the position of the ball relative to the center of the screen
let ballPosRelativeToCenter = vec(ball.pos.x - G.WIDTH / 2, ball.pos.y - G.HEIGHT / 2);
let distanceToCenter = Math.sqrt(Math.pow(ballPosRelativeToCenter.x, 2) + Math.pow(ballPosRelativeToCenter.y, 2));
let distanceFromOuterHull = radius - distanceToCenter;

  color("light_red");  
  line(vec(ball.pos).add(vec(ball.dir).mul(4)), vec(ball.pos).add(vec(ball.dir).mul(distanceFromOuterHull)), 1);


  // if (ball.pos.distanceTo(vec(G.WIDTH / 2, G.HEIGHT / 2)) > G.WIDTH / 2) {
  //   ball.dir.x *= -1;
  //   ball.dir.y *= -1;
  //   ball.dir.normalize();
  // }


}

let radius = G.WIDTH / 2;
let rotateSpeed = 0.04;
let rotation = 0;
let gap = 0;
let lastCollision = 0;
function draArc() {
  lastCollision++;
  // using arc, draw a circle in the middle of the screen, as big as it can be without going off screen
  // Every 100 thick the circle will get smaller
  // there should be an opening in the circle that moves around the circle

  if (input.isPressed) { // Annars *= -1
    rotateSpeed = -0.04;
  } else {
    rotateSpeed = 0.04;
  }
  //gap += difficulty*0.001;


  radius -= difficulty * 0.01;
  if (radius < 0) {
    radius = G.WIDTH / 2;
  }

  // arc is rotating with speed
  rotation += rotateSpeed;
  color("black");
  //let col = arc(G.WIDTH / 2, G.HEIGHT / 2, radius, 3, rotation, rotation + gap - 1.9 * PI,);
//let col = rect(0, 0, 10, 10);
  let col = DrawCircleOfLines(radius, rotation);

  


  
//  if (col.isColliding.char.a && lastCollision > 2) {
  if (col > -1 && lastCollision > 2) {  
    score ++;
    gap += 0.1;
    play("coin");
    if (segments[col].green == false) {
    segments[col].visible = false;
    }
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
      if (line(segments[i].start, segments[i].end).isColliding.char.a && col < 0) {
        console.log("COLLISION"+i);
        col = i;
       // segments[i].visible = false;
     }
    }
  }
  return col;
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