title = "";

description = `
`;

characters = [
` 
  ll
lllll 
  ll l
l ll
 l  l
  l  l
`,
`  l
  ll
 llll
llllll
  ll
`

];


const G = {
  WIDTH: 200,
  HEIGHT: 300,  
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  //isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
};
/*
* @typedef { object } player - It is a rock.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
* @property { bool } direction - true right false left.
* @property { string } sprite - it has a sprite.
*/


let player;
let tree;
let goal = { pos: vec(G.WIDTH/2, 700) };

let trees = [];
let skiTrack = [];

let skeespeed = -1;


function fullReset() {
  trees = [];
  skiTrack = [];
  skeespeed = -1;
  console.log("reset");
  goal = { pos: vec(G.WIDTH/2, 700) };
}

//
// ====================== MAIN LOOP ======================
//

function update() {
  if (!ticks) {
    fullReset();
    init();
  }

  // white rect over screen
  color("white");
  rect(0, 0, G.WIDTH, G.HEIGHT);
  
  drawTrees();
  drawPlayer();
  drawStuff();
}

function init() {
  player = {
    pos: vec(100, 120),
    speed: 1,
    maxSpeed: 1,
    direction: true,
    sprite: "a"
  };
  tree = {
    pos: vec(100, 100),
    sprite: "b"
  };
  trees = times(10, () => {
    return {
      pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)),
      sprite: "b"
    };
  });

  skiTrack = [{ x: player.pos.x, y: player.pos.y }];
}

// function drawPlayer() {
//   // player movement
//   if (input.isJustPressed) {
//     player.direction = !player.direction;
//   }
//   if (player.direction) {
//     player.pos.x += player.speed;
//   } else {
//     player.pos.x -= player.speed;
//   }

//   // Varriabel speed om man håller inte. Får se om det blir bra.
//   if (input.isPressed) {
//     player.speed += 0.1;
//     skeespeed -= 0.01;
//   } else {
//     player.speed -= 0.1;
//     skeespeed += 0.01;
//   }
//   player.speed = clamp(player.speed, 1, 3);
//   skeespeed = clamp(skeespeed, -2, -1);

//   // player sprite
//   color("blue");
//   let mirror = player.direction ? 1 : -1;
//   char(player.sprite, player.pos.x, player.pos.y, { scale: { x: 2, y: 2 }, mirror: { x: mirror} });

//   // player speed indicator
//   color("black");
//   rect(0, 0, player.speed * 10, 3);


// }

// Initialize the ski track

function drawStuff() {
  goal.pos.y += skeespeed;
  if (goal.pos.y < G.HEIGHT) {
    color("red");
    let col = line(0, goal.pos.y, G.WIDTH, goal.pos.y, 3);
    if (col.isColliding.char.a) {
      complete();      
    }

  }


}


function drawPlayer() {
  // player movement
  if (input.isJustPressed) {
    player.direction = !player.direction;
    // Add a point to the ski track when the player changes direction
    //skiTrack.push({ x: player.pos.x, y: player.pos.y, dir: player.direction});
  }
  if (player.direction) {
    player.pos.x += player.speed;
  } else {
    player.pos.x -= player.speed;
  }

  // Variable speed if not holding. We'll see if it's good.
  if (input.isPressed) {
    player.speed += 0.1;
    skeespeed -= 0.04;
  } else {
    player.speed -= 0.1;
    skeespeed += 0.02;
  }
  player.speed = clamp(player.speed, 1, 3);
  skeespeed = clamp(skeespeed, -2, -1); // XXX TODO: make min max speed constants

  // Add a point to the ski track every 10 pixels of movement
  let lastPoint = skiTrack[skiTrack.length - 1];
  if (Math.abs(player.pos.y - lastPoint.y) > 10) {
    skiTrack.push({ x: player.pos.x, y: player.pos.y,dir: player.direction });
  }

  // Move the ski track up at the same speed as the player
  skiTrack.forEach(point => point.y += skeespeed);

  // Remove points that have moved off the screen
//  let tmp = skiTrack.length;  
  skiTrack = skiTrack.filter(point => point.y >= 0);
//  if (skiTrack.length < tmp) {
//    console.log("removed " + (tmp - skiTrack.length) + " points");
//  }

  // Draw the ski track
  color("light_blue");
  for(let i = 1; i < skiTrack.length; i++) {
    line(skiTrack[i-1].x, skiTrack[i-1].y, skiTrack[i].x, skiTrack[i].y, 2);
    //let tt = skiTrack[i].dir ? "\\\\" : "//";
    //text(tt, skiTrack[i-1].x, skiTrack[i-1].y, {scale: {x: 2, y: 2}});
  }


  // player sprite
  color("blue");
  let mirror = player.direction ? 1 : -1;
  char(player.sprite, player.pos.x, player.pos.y, { scale: { x: 2, y: 2 }, mirror: { x: mirror} });

  // player speed indicator
  color("black");
  rect(0, 0, player.speed * 10, 3);
  rect(0, 4, Math.abs(skeespeed) * 10, 3);
  // debug info
  color("black");
  text('track: ' + skiTrack.length, 3, 10);

}

function drawTrees() {

  trees.forEach((t) => {
    t.pos.y += skeespeed;
//    color("green");
//    char("a", t.pos);
    color("green");
    char(t.sprite,t.pos.x, t.pos.y, { scale: { x: 2, y: 3 } });

    if (t.pos.y < 0) {
      t.pos.y = G.HEIGHT;
      t.pos.x = rnd(0, G.WIDTH);
    }
  });
    
}







/*
  // dottet lines at left and right borders
  color("black");
  times(50, (i) => {
    const y = i * 6 - ticks % 6;
    line(0, y, 5, y);
    line(G.WIDTH, y, G.WIDTH - 5, y);
  });
*/

/*
--- Varriant där man trycker för att åka. 
// player movement
  if (input.isJustPressed) {
    player.direction = !player.direction;
  }
  if (player.direction) {
    player.pos.x += player.speed;
  } else {
    player.pos.x -= player.speed;
  }

  // player speed
  if (input.isPressed) {
    player.speed += 0.1;
  } else {
    player.speed -= 0.1;
  }
  player.speed = clamp(player.speed, 0, 3);

  // player sprite
  color("blue");
  let mirror = player.direction ? 1 : -1;
  char(player.sprite, player.pos.x, player.pos.y, { scale: { x: 2, y: 2 }, mirror: { x: mirror} });

  // player speed indicator
  color("black");
  rect(0, 0, player.speed * 10, 3);


*/


