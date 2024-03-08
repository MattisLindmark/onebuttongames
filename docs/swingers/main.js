title = "";

description = `
`;

characters = [
`
llllll
llllll
llllll
llllll
llllll
llllll
`,
`
llllll
llllll
`  
];

const G = {
  WIDTH: 110,
  HEIGHT: 90,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "shape",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
};

/*
* @typedef { object } player - It is a dude.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
*/
let rope = {};
rope.points = [];
rope.length = 40;
rope.pointCount = 10;
rope.pointSpacing = rope.length / rope.pointCount;
rope.pointMass = 1;
rope.gravity = 0.05;
rope.stiffness = 0.1;
rope.damping = 0.91;
rope.wind = 0.5;
rope.tension = 0.5;
rope.friction = 0.5;
rope.drag = 0.5;

let force = 4;

let directionVector = [vec(2, 0), vec(-2, 0), vec(0, 1), vec(0, -2)];
let currentDirection = directionVector[0];
let index = 0;
function update() {
  if (!ticks) {
    rope.points = [];
    for (let i = 0; i < rope.pointCount; i++) {
      let point = {
        pos: vec(G.WIDTH / 2, i * rope.pointSpacing),
        prevPos: vec(G.WIDTH / 2, i * rope.pointSpacing),
//        pmass: rope.pointMass-i*0.1,
      };
      rope.points.push(point);
    }
  }
  // if (input.isJustPressed) {
  //   rope.points = [];
  //   for (let i = 0; i < rope.pointCount; i++) {
  //     let point = {
  //       pos: vec(G.WIDTH / 2, i * rope.pointSpacing),
  //       prevPos: vec(G.WIDTH / 2, i * rope.pointSpacing),
  //     };
  //     rope.points.push(point);
  //   }
  // }

  text("cdir: " + currentDirection.x + " " + currentDirection.y, 3, 10);
  // if (ticks % 100 === 0) {
  //   index++;
  //   currentDirection = directionVector[index % directionVector.length];
  //   currentDirection.normalize();
  // }
  if (input.isPressed) {
    applyForce(currentDirection);//vec(-force,1));
  }
  if (input.isJustReleased) {
    index++;
    currentDirection = directionVector[index % directionVector.length];
  }

  
  // constrain the first point to the mouse position
  //  rope.points[0].pos = vec(input.pos.x, input.pos.y);
  // Constraint the first point to the top center of the screen
  applayGravity();
  
  applyConstraints();
  updateRope();
  drawRope();
  let x = sin(ticks * .12) * 10;
  let y = cos(ticks * .12) * 5;
  rope.points[0].pos = vec(x+50, y+50);

  text("pl: " + rope.points.length, 3, 3);
}


function applayGravity() {
  // First point is fixed, the rest of the rope is affected by gravity.
  // But the rope can't stretch infinitely, so we need to add some constraints.
  for (let i = 1; i < rope.points.length; i++) {
    let point = rope.points[i];
    let force = {x: 0, y: rope.gravity};
    point.pos.x += force.x;
    point.pos.y += force.y;
  }


  // Apply wind force to the last point
  //rope.points[rope.points.length - 1].pos.x += rope.wind;

/*   Apply tension force to the last point
  let tension = vec(rope.points[rope.points.length - 1].pos.x - rope.points[rope.points.length - 2].pos.x, rope.points[rope.points.length - 1].pos.y - rope.points[rope.points.length - 2].pos.y);
  let length = Math.sqrt(tension.x * tension.x + tension.y * tension.y);
  tension.x = tension.x / length;
  tension.y = tension.y / length;
  tension.x *= rope.tension;
  tension.y *= rope.tension;
  rope.points[rope.points.length - 1].pos.x += tension.x;
  rope.points[rope.points.length - 1].pos.y += tension.y;


// put a weight on the last point
//  rope.points[rope.points.length - 1].pos.y += 0.1;

/*
  // Apply friction force to the last point
  let friction = vec(rope.points[rope.points.length - 1].pos.x - rope.points[rope.points.length - 2].pos.x, rope.points[rope.points.length - 1].pos.y - rope.points[rope.points.length - 2].pos.y);
  length = Math.sqrt(friction.x * friction.x + friction.y * friction.y);
  friction.x = friction.x / length;
  friction.y = friction.y / length;
  friction.x *= rope.friction;
  friction.y *= rope.friction;
  rope.points[rope.points.length - 1].pos.x -= friction.x;
  rope.points[rope.points.length - 1].pos.y -= friction.y;


  // Apply drag force to the last point
  let drag = vec(rope.points[rope.points.length - 1].pos.x - rope.points[rope.points.length - 2].pos.x, rope.points[rope.points.length - 1].pos.y - rope.points[rope.points.length - 2].pos.y);
  length = Math.sqrt(drag.x * drag.x + drag.y * drag.y);
  drag.x = drag.x / length;
  drag.y = drag.y / length;
  drag.x *= rope.drag;
  drag.y *= rope.drag;
  rope.points[rope.points.length - 1].pos.x -= drag.x;
  rope.points[rope.points.length - 1].pos.y -= drag.y;
*/


}

function applyConstraints() {
  for (let i = 0; i < rope.points.length - 1; i++) {
    let point1 = rope.points[i];
    let point2 = rope.points[i + 1];
    let distance = vec(point2.pos.x - point1.pos.x, point2.pos.y - point1.pos.y);
    let length = Math.sqrt(distance.x * distance.x + distance.y * distance.y);
    let difference = (rope.pointSpacing - length) / length;
    let translate = {x: distance.x * 0.5 * difference, y: distance.y * 0.5 * difference};
    point1.pos.x -= translate.x;
    point1.pos.y -= translate.y;
    point2.pos.x += translate.x;
    point2.pos.y += translate.y;
  }
}

function updateRope() {
  for (let i = 0; i < rope.points.length; i++) {
    let point = rope.points[i];
    let force = {
      x: (point.pos.x - point.prevPos.x) * rope.damping,
      y: (point.pos.y - point.prevPos.y) * rope.damping
    };
    point.prevPos = {x: point.pos.x, y: point.pos.y};
    point.pos = {
      x: point.pos.x + force.x,
      y: point.pos.y + force.y
    };
  }
}

function applyForce(force) {

  // the first point is fixed
  //rope.points[0].pos.x += force.x;
  //rope.points[0].pos.y += force.y;
  // applay force to the last point
  rope.points[rope.points.length - 1].pos.x += force.x;
  rope.points[rope.points.length - 1].pos.y += force.y;

/*
  for (let i = 0; i < rope.points.length; i++) {
    let point = rope.points[i];
    point.pos.x += force.x;
    point.pos.y += force.y;
  }
  */
}

function drawRope() {  
  for (let i = 0; i < rope.points.length - 1; i++) {
    let point1 = rope.points[i];
    let point2 = rope.points[i + 1];
    if (i == rope.points.length - 2) {
      color("green");
    } else {
      color("black");
    }
    line(point1.pos, point2.pos, 1);
  }
}
