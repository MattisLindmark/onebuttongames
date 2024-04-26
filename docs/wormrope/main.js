title = "WormRope";

description = `Eat burgers\nAvoid bees and birds
`;

characters = [
  `
l
`,
  `
 yyy
yyyyy
lllll
yyyyy
`,
  `
  ll
 lyyl
llllll
 lyyl
  ll
`,`
    l
 l ll
ylllll


`,
`

 l
ylllll
   ll
    l
`,  `
  ll
 llll  
lYllYl
 llll
  ll
  ll
`,
  `
  ll
 yyyy
 llll
 lyyl
  ll
`

];

const G = {
//  WIDTH: 210,
//  HEIGHT: 190,
  WIDTH: 160,
  HEIGHT: 140,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
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
rope.gravity = 0;//0.05;
rope.stiffness = 0.1;
rope.damping = 0.87;//0.85; // 0.91
rope.wind = 0.5;
rope.tension = 0.5;
rope.friction = 0.5;
rope.drag = 0.5;

let force = 4;

let directionVector = [vec(2, 0), vec(-2, 0), vec(0, 1), vec(0, -2)];
let currentDirection = directionVector[2];
let index = 0;



let food = {
  pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
  isActive: true
};

// let poison = {
//   pos: vec(G.WIDTH / 2, G.HEIGHT / 2),
//   isActive: true
// };

let bees = [];

class Bird {
  constructor() {
    this.pos = vec(0,0);
    this.direction = 1;
    this.speed = rnd(0.2, 0.7);
    this.char = "d";
    this.isActive = false;
    this.randomness = rnd(0.1, 1);
  }  
}
let levelStartData = {
  birdAmmount: 2,
  beesAmmount: 2,
  speedMod : 1,
}
let currentSpeedMod = levelStartData.speedMod;

let birds = [];

let removedPoints = [];
let removedPointsTimer = 0;
let safe = false;
let totalNumberOfBurgers = 0;
let longestRope = 0;

let theEnd = false;
let endTimer = 0;
let endMessage = "Out of rope...";
//MARK: - Main
function update() {
  if (!ticks) {
    removedPointsTimer =0;


//    sss.setVolume(0.5);
    sss.setVolume(0.2);
    sss.setSeed(4); 
    theEnd = false;
    endMessage = "Out of rope...";
    endTimer = 0;
    totalNumberOfBurgers = 0;   
    currentSpeedMod = levelStartData.speedMod;
    currentDirection = directionVector[2];
    GLOBALDIRECTION = vec(0, 0);
    angle = 1.5;
    tmp = 1;
    GLOBALDIRECTION = directionVector[2];
    //currentDirection = GLOBALDIRECTION
    setupBees();
//    console.log("bees: " + bees.length);
    setupBirds();
    // set food position to random on screen
    food.pos = vec(rnd(10, G.WIDTH - 10), rnd(10, G.HEIGHT - 10));
    rope.points = [];
    for (let i = 0; i < rope.pointCount; i++) {
      let point = {
        pos: vec((G.WIDTH / 2)+i, i * rope.pointSpacing),
        prevPos: vec((G.WIDTH / 2)-i, i * rope.pointSpacing),
        //        pmass: rope.pointMass-i*0.1,
      };
      rope.points.push(point);

      longestRope = rope.points.length;
    }
  }

  if (theEnd) {
    color("blue");
    text(endMessage, 50, G.HEIGHT / 2-20);
    text("Score: " + score, 50, G.HEIGHT / 2-10)
    text("Longest Worm: " + longestRope, 30, G.HEIGHT / 2 + 10);
    text("Total Burgers: " + totalNumberOfBurgers,30, G.HEIGHT / 2 + 20);    
    endTimer++;
    if (endTimer > 100) {
      end();
    }
    color("black");
    return;
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

 
  //text("length: " + rope.points.length, G.WIDTH/2-30, 3);

   if (ticks % 800 === 0 && totalNumberOfBurgers > 0) {
      play("laser");
      addOneBee();
      birds.push(new Bird());
      currentSpeedMod += 0.1;
   }


  // if (input.isJustReleased) {
  // }

  applyForce(currentDirection);//vec(-force,1));
  if (input.isPressed) {
    currentDirection = GLOBALDIRECTION;
  }
  //  if (input.isJustReleased) {    
  //    index++;
  //    currentDirection = directionVector[index % directionVector.length];
  //  }


  // constrain the first point to the mouse position
  //  rope.points[0].pos = vec(input.pos.x, input.pos.y);
  // Constraint the first point to the top center of the screen
  //applayGravity();

  if (rope.points.length < 2) {

    text("Game Over", G.WIDTH / 2, G.HEIGHT / 2);
    //end();
  }

  //safe = removedPointsTimer > 10 ? true : false;

  
  applyConstraints();
  //applayGravity();
  updateRope();
  drawFood();
  drawBees();
  drawBirds();
  directionMarker();
  drawRope();

  if (removedPoints.length > 0 && removedPointsTimer > 0) {
    removedPointsTimer --;
    // just draw the points
    for (let i = 0; i < removedPoints.length - 1; i++) {
      let point1 = removedPoints[i];
      let point2 = removedPoints[i + 1];
      let clr = removedPointsTimer > 30 ? "red" : "light_red";
      color(clr);
      line(point1.pos, point2.pos, 1);
    }
  }
//MARK: BURGER COLLISION
  if (burgerCol) {
    totalNumberOfBurgers++;
    rope.points.push({ pos: vec(food.pos.x, food.pos.y), prevPos: vec(food.pos.x, food.pos.y) });
    if (rope.points.length > longestRope) {
      longestRope = rope.points.length;
    }
    play("coin");
    let scoreCalculation = Math.floor(rope.points.length/2);
    addScore(scoreCalculation, food.pos);
    particle(food.pos,10,1);
    food.isActive = false;
    burgerCol = false;
  }

  //  let x = sin(ticks * .12) * 10;
  //  let y = cos(ticks * .12) * 5;
  //  rope.points[0].pos = vec(x+50, y+50);

 // text("pl: " + rope.points.length, 3, 3);
}

//MARK: - Draw
function drawBirds() {
  let offset = ticks % 60 > 30 ? 1 : 0;
  birds.forEach(b => {
    if (!b.isActive) {
      b.pos = getRandomPositionLeftRight();
      b.isActive = true;
      if (b.pos.x < 0) {
        b.direction = 1;
      } else {
        b.direction = -1;
      }
    }

    b.pos.x += b.speed * b.direction;
    b.pos.y = b.pos.y + sin(ticks * 0.1) * (b.randomness * 0.5);
    color("black");
    char(addWithCharCode(b.char, offset), b.pos, { scale: { x: 2, y: 2 }, mirror: { x: b.direction * -1, y: 1 } });

     if (b.pos.x > G.WIDTH + 50 || b.pos.x < -50) {
       b.isActive = false;
     }
  });
}


function drawBees() {

  for (let i = 0; i < bees.length; i++) {
    if (!bees[i].isActive) {

      bees[i].pos = getRandomPositionOutsideScreen(); //  vec(rnd(0, G.WIDTH *-1), rnd(10, G.HEIGHT - 10));
      bees[i].direction = vec(rnd(-1, 1), rnd(-1, 1));
      bees[i].speed = rnd(.2, 1);
      adjustOnePoisonDirection(bees[i]);
      bees[i].isActive = true;
    }

    bees[i].pos.x += bees[i].direction.x; // poinsons[i].speed;
    bees[i].pos.y += bees[i].direction.y; // poinsons[i].speed;

    color("black");
    char("c", bees[i].pos);

    if (bees[i].pos.x > G.WIDTH + 10 || bees[i].pos.x < -10 || bees[i].pos.y > G.HEIGHT + 10 || bees[i].pos.y < -10) {
      bees[i].isActive = false;
    }
  }

  // if (!poison.isActive)
  // { 
  //   poison.pos = vec(rnd(10, G.WIDTH - 10), rnd(10, G.HEIGHT - 10));
  //   poison.isActive = true;
  //   return;
  // }

  // color("black");
  // char("c", poison.pos);

}



function adjustOnePoisonDirection(p) {
  p.direction.normalize();
  p.direction.mul(p.speed);
  if (p.pos.x > G.WIDTH && p.direction.x > 0) {
    p.direction.x = -p.direction.x;
  }
  if (p.pos.x < 0 && p.direction.x < 0) {
    p.direction.x = -p.direction.x;
  }
  if (p.pos.y > G.HEIGHT && p.direction.y > 0) {
    p.direction.y = -p.direction.y;
  }
  if (p.pos.y < 0 && p.direction.y < 0) {
    p.direction.y = -p.direction.y;
  }
}

function AdjustPoisonDirection() {
  bees.forEach(p => {
    p.direction.normalize();
    p.direction.mul(p.speed);
    if (p.pos.x > G.WIDTH && p.direction.x > 0) {
      p.direction.x = -p.direction.x;
    }
    if (p.pos.x < 0 && p.direction.x < 0) {
      p.direction.x = -p.direction.x;
    }
    if (p.pos.y > G.HEIGHT && p.direction.y > 0) {
      p.direction.y = -p.direction.y;
    }
    if (p.pos.y < 0 && p.direction.y < 0) {
      p.direction.y = -p.direction.y;
    }
  });
}

function drawFood() {
  if (!food.isActive) {
    food.pos = vec(rnd(20, G.WIDTH - 20), rnd(20, G.HEIGHT - 20));
    food.isActive = true;
    return;
  }

  color("black");
  let col = char("b", food.pos);
  /* check if player is colliding with food // kan ej kollidera med line.
  if (col.isColliding.char.a) {
    rope.points.push({ pos: vec(food.pos.x, food.pos.y), prevPos: vec(food.pos.x, food.pos.y) });
    food.isActive = false;
  }
  */
}


let GLOBALDIRECTION = vec(0,0);
let radius = 5;
let angle = 1.5;
let tmp = 1;
//let timer = 0;
function directionMarker() {
  //  if (input.isJustPressed) { 
  //     timer = 0;     
  //  }
  //   timer++;
  //  if (input.isJustReleased) {
  //   if (timer < 10) {
  //    tmp = -tmp;
  //   }
  //   timer = 0;
  //  }

  // let x = rope.points[rope.points.length - 1].pos.x;
  // let y = rope.points[rope.points.length - 1].pos.y;

  // XXX dir alternatives Lets see what happens if we use the last point as the center of the circle instead of the first point.
  let x = rope.points[0].pos.x;
  let y = rope.points[0].pos.y;


  let xx = x + radius * Math.cos(angle);
  let yy = y + radius * Math.sin(angle);
  if (input.isPressed) {
    angle += 0.1 * tmp;
    // if (angle > Math.PI) {
    //   tmp = -1;
    // }
    // if (angle < 0) {
    //   tmp = 1;
    // }
  }

  // global direction should be set to the direction of the last point to the marker position, that is xx,yy
  GLOBALDIRECTION = vec(xx - x, yy - y);
  GLOBALDIRECTION.normalize();

  let damp = rope.points.length > 3 ? 1 : 0.5; // Some magic number to make the rope slower when short
  GLOBALDIRECTION.x *= damp;
  GLOBALDIRECTION.y *= damp;

  //char("c", xx, yy,{rotation: angle});
  color("green");
  let col = line(x, y, xx, yy, 2); // dras i fel ordning, kan ej kolla kollision med line.
  //bar(G.WIDTH/2-3,G.HEIGHT, 4, 4, angle*-1, 1);
  color("black");

  if (x > G.WIDTH+25 || x < -25 || y > G.HEIGHT +25 || y < -25) {
    theEnd = true;
    endMessage = "Out of bounds...";
    play("explosion");
  }

   if (col.isColliding.char.c || col.isColliding.char.d || col.isColliding.char.e) {
     theEnd = true;
     endMessage = "Head got eaten...";
     play("explosion");
   }

   if (col.isColliding.char.b) {
     burgerCol = true;
   }

}


function applayGravity() {
  // First point is fixed, the rest of the rope is affected by gravity.
  // But the rope can't stretch infinitely, so we need to add some constraints.

  for (let i = 1; i < rope.points.length; i++) {
    let point = rope.points[i];
    let force = { x: 0, y: rope.gravity };
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
    let translate = { x: distance.x * 0.5 * difference, y: distance.y * 0.5 * difference };
    point1.pos.x -= translate.x;
    point1.pos.y -= translate.y;
    point2.pos.x += translate.x;
    point2.pos.y += translate.y;
  }
}

function updateRope_NoLimit() {
  for (let i = 0; i < rope.points.length; i++) {
    let point = rope.points[i];
    let force = {
      x: (point.pos.x - point.prevPos.x) * rope.damping,
      y: (point.pos.y - point.prevPos.y) * rope.damping
    };
    point.prevPos = { x: point.pos.x, y: point.pos.y };
    point.pos = {
      x: point.pos.x + force.x,
      y: point.pos.y + force.y
    };
  }
}

function updateRope() {
  let maxSpeed = .5; // Set your maximum speed here

  for (let i = 0; i < rope.points.length; i++) {
    let point = rope.points[i];
    let force = {
      x: (point.pos.x - point.prevPos.x) * rope.damping,
      y: (point.pos.y - point.prevPos.y) * rope.damping
    };

    // Calculate the magnitude of the force vector
    let forceMagnitude = Math.sqrt(force.x * force.x + force.y * force.y);

    // If the magnitude is greater than the maximum speed, scale it back to the maximum speed
    if (forceMagnitude > maxSpeed) {
      let scale = maxSpeed / forceMagnitude;
      force.x *= scale;
      force.y *= scale;
    }

    point.prevPos = { x: point.pos.x, y: point.pos.y };
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

  let pulsingForceMod = Math.sin(ticks * 0.1) * 0.9;
  let modifiedForce = {
    x: force.x * (1 + pulsingForceMod),
    y: force.y * (1 + pulsingForceMod)
  };

  //text("modforce: " + modifiedForce.x + " " + modifiedForce.y, 3, 20);


  /* Detta är uträkning för pulserande som inte är i local direction så att säga. (då bör också 0.9 ändras till tex 0.5)
      x: force.x + pulsingForceMod,
      y: force.y + pulsingForceMod
  */

  // XXXXXXXX force to last or first point? Spelar det nån roll?
  //rope.points[rope.points.length - 1].pos.x += modifiedForce.x;
  //rope.points[rope.points.length - 1].pos.y += modifiedForce.y;
  rope.points[0].pos.x += modifiedForce.x;
  rope.points[0].pos.y += modifiedForce.y;

  /*
    for (let i = 0; i < rope.points.length; i++) {
      let point = rope.points[i];
      point.pos.x += force.x;
      point.pos.y += force.y;
    }
    */
}


let burgerCol = false;

function drawRope() {
  let RemoveFrom = -1;
  for (let i = 0; i < rope.points.length - 1; i++) {
    let point1 = rope.points[i];
    let point2 = rope.points[i + 1];
    if (i == rope.points.length - 2) {
      color("green");
    } else {
      color("black");
    }
    let col = line(point1.pos, point2.pos, 1);
    if (col.isColliding.char.b) {
      burgerCol = true;
    }
    if (col.isColliding.char.c || col.isColliding.char.d || col.isColliding.char.e) {
      RemoveFrom = i;
      particle(rope.points[i].pos, 10, 1);
      play("hit");
      //poison.isActive = false;
      break;
    }
  }
  // if (safe) {
  //   RemoveFrom = -1;
  // }
  if (RemoveFrom > 1) {
    if (RemoveFrom < rope.points.length - 1) {
      removedPoints =rope.points.splice(RemoveFrom, rope.points.length - RemoveFrom);
      removedPointsTimer = 60;
    }
  } else if (RemoveFrom == 0) {
    theEnd = true;
    play("explosion");
    //end(); // MARK: END IS HERE END IS HERE
  }

}


// MARK: - Setup
function setupBees() {
  bees = [];
  for (let i = 0; i < levelStartData.beesAmmount; i++) {
    addOneBee();
  }
  // bees.forEach(p => {
  //   p.pos = getRandomPositionOutsideScreen();
  //   adjustOnePoisonDirection(p);
  // });
}

function setupBirds() {
  birds = [];
  for (let i = 0; i < levelStartData.birdAmmount; i++) {
    birds.push(new Bird());
  }

  birds.forEach(b => {
    b.isActive = true;
    b.pos = getRandomPositionLeftRight();
    if (b.pos.x < 0) {
      b.direction = 1;
    } else {
      b.direction = -1;
    }
  });
}

function addOneBee() {
  let bee = {
    pos: vec(0,0),//vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)),
    direction: vec(rnd(-1, 1), rnd(-1, 1)),
    speed: rnd(.2, 1),
    isActive: true
  };

  bee.pos = getRandomPositionOutsideScreen();
  adjustOnePoisonDirection(bee);

  bees.push(bee);
  /*
      bees.push({
      pos: vec(rnd(10, G.WIDTH - 10), rnd(10, G.HEIGHT - 10)),
      direction: vec(rnd(-1, 1), rnd(-1, 1)),
      speed: rnd(.2, 1),
      isActive: true
    });
  */
  
}

function getRandomPositionOutsideScreen() {
  let side = Math.floor(Math.random() * 4);
  let pos;

  switch (side) {
    case 0: // Top
      pos = vec(rnd(0, G.WIDTH), -rnd(10, G.HEIGHT));
      break;
    case 1: // Bottom
      pos = vec(rnd(0, G.WIDTH), G.HEIGHT + rnd(10, G.HEIGHT));
      break;
    case 2: // Left
      pos = vec(-rnd(10, G.WIDTH), rnd(0, G.HEIGHT));
      break;
    case 3: // Right
      pos = vec(G.WIDTH + rnd(10, G.WIDTH), rnd(0, G.HEIGHT));
      break;
  }
  return pos;
}

function getRandomPositionLeftRight() {
  let side = Math.floor(Math.random() * 2);
  let pos;

  switch (side) {
    case 0: // Left
      pos = vec(-rnd(10, G.WIDTH), rnd(0, G.HEIGHT));
      break;
    case 1: // Right
      pos = vec(G.WIDTH + rnd(10, G.WIDTH), rnd(0, G.HEIGHT));
      break;
  }

  return pos;
}