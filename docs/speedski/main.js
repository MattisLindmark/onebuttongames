title = "===> SpeedSkii <===";

description = `Press to turn\nHold to go faster.\n\n
Based on the game\nSpeedski for Vic20\n
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
`,
`
llll
llllll
llll
l
l
l
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
  isShowingScore: false,
//  isShowingTime: true,
  //isCapturing: true,
  //captureCanvasScale: 1,
  //isCapturingGameCanvasOnly: true
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
let trackLength = 1500;
let gate = { pos: vec(0,0) };
let numerOfGates = 5;
let gateDistance = Math.floor(trackLength / numerOfGates);
let gateWidth = 30;
let goal = { pos: vec(G.WIDTH/2, trackLength+gateDistance) }; // Add gate distance to make sure all goals is before goal.

let gateScore = 0;
let gatePenelty = 1.5;

let trees = [];
let skiTrack = [];
let gates= [];

let GLOBAL_PAUSE = false;
let IS_REPLAYING = false;

let skeespeed = -1;
let trackTimer;

let ScoreBoard = {
  lastTime: 100000,
  bestTime: 100000,
  newLastTime: 100000
};

let StartValues = {
  skeespeed: -1,
  playerSpeed: 1,
  playerMaxSpeed: 1,
  playerDirection: true,
  trackLength: 1500,
  numerOfGates: 5,
  gateWidth: 30
};

function fullReset() {
  trees = [];
  skiTrack = [];
  skeespeed = -1;
  console.log("reset");
  goal = { pos: vec(G.WIDTH/2, trackLength+gateDistance) };
  gateScore = 0;
}

//
// ====================== MAIN LOOP ======================
//

function update() {
  if (!ticks) {
    trackTimer = 0;
    fullReset();
    init();
    sss.setSeed(options.seed);
  }

    // white rect over screen
    color("white");
  rect(0, 0, G.WIDTH, G.HEIGHT);
  if (GLOBAL_PAUSE) {
    skeespeed = 0;
    player.speed = 0;    
  }
  
  drawTrees();
  drawPlayer();
  drawStuff();
  getReadyScreen();
  
  if (isReplaying) {
    color("light_red");
    if (ticks % 60 > 20) {
      text("R", G.WIDTH-45, 35, { scale: { x: 5, y: 6 } });
    }
  }

  color("black");
  text("Time:\n" + trackTimer.toFixed(2), (G.WIDTH/2)-30, 10);
  trackTimer += 1/60;
  if (ScoreBoard.lastTime < 100000) {
  text("Best\n" + ScoreBoard.bestTime, (G.WIDTH)-50, 10);  
  text("Last\n" + ScoreBoard.lastTime, 10, 10);
  }
  /*
  if (ticks % 100 == 0) {    
    play("click", {pitch: -2000, volume: 0.3, note: "c"});
//    play("click", {freq: 3000, pitch: -2000, volume: 0.5});
//   play("click", {freq: 3000, detune: 100, volume: 0.5, loop: true, pich: 0.5});

  }
  */
}

function beginComplete() {
  let tmp = trackTimer.toFixed(3);
  let gatesMissed = numerOfGates - gateScore;
  let total = ((tmp*1)+(gatesMissed*gatePenelty));

  color("white");
  rect(30, 80, G.WIDTH-50, G.HEIGHT-200);
  color("cyan");
  text("FINISH!", 50, 77, {scale: {x: 2, y: 2}});
  color("black");
  text("Time:"+tmp, 50, 90, {scale: {x: 1, y: 1}});
  text("Missed Gates:"+gatesMissed, 50, 100, {scale: {x: 1, y: 1}});
  text("TimePenelty:"+gatesMissed*gatePenelty, 50, 110, {scale: {x: 1, y: 1}});
  color("blue");
  text("Total:"+(total).toFixed(3), 50, 122, {scale: {x: 1, y: 1}});  
  if (total < ScoreBoard.bestTime) {
    color("red");
    text("New Record!", 48, 135, {scale: {x: 2, y: 2}});
    color("black");
    ScoreBoard.bestTime = total;
  } else if (total < ScoreBoard.lastTime) {
    color("red");
    text("Better then\n last time!", 50, 135, {scale: {x: 1, y: 1}});
    color("black");
  }
  ScoreBoard.newLastTime = total;


  
  play("lucky");
  complete("good job!");
}

function getReadyScreen() {
  if (!ticks || ticks < 1){
    return; 
  }
  if (GLOBAL_PAUSE) {
    trackTimer = 0;
  }
  if (!isReplaying) {
    if (ticks == 1 || ticks == 55) {
      play("select", { freq: 350 });
    }
    if (ticks == 115) {
      play("select", { freq: 460 });
    }
  }

  if (ticks < 60) {    
    GLOBAL_PAUSE = true;
    skeespeed = 0;
    player.speed = 0;
    color("black");
    text("GET READY!", 50, 100, {scale: {x: 2, y: 2}});
  } else if (ticks < 120) {
    skeespeed = 0;
    player.speed = 0;
    color("red");
    text("GET MORE READY!", 20, 100, {scale: {x: 2, y: 2}});
  } else if (ticks < 180) {
    color("green");
    text("GO!", (G.WIDTH/2)-2, 100, {scale: {x: 2, y: 2}});
  } 
  if (ticks > 121 && GLOBAL_PAUSE) {
    skeespeed = StartValues.skeespeed;
    player.speed = StartValues.playerSpeed;
    GLOBAL_PAUSE = false;    
  }


}

function init() {
  if (ScoreBoard.newLastTime != ScoreBoard.lastTime) { // Workaround to keep last time until restart.
    ScoreBoard.lastTime = ScoreBoard.newLastTime;
  }
  // Setup Player -------
  player = {
    pos: vec(100, 120),
    speed: 1,
    maxSpeed: 1,
    direction: true,
    sprite: "a"
  };

  // Setup Trees -------
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
  // Setup Gates -------
  gates = times(numerOfGates, (i) => {
    return {
      pos: vec(rnd(3, G.WIDTH-30), (i+1) * gateDistance),
      sprite: "c"
    };
  });

  // Setup Ski Track -------
  skiTrack = [{ x: player.pos.x, y: player.pos.y }];

  trackTimer = 0;

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
  if (GLOBAL_PAUSE) {
    skeespeed = 0;
    player.speed = 0;
  }
  goal.pos.y += skeespeed;
  if (goal.pos.y < G.HEIGHT) {
    color("red");
    let col = line(0, goal.pos.y, G.WIDTH, goal.pos.y, 3);
    if (col.isColliding.char.a) {
      play("powerUp");
      beginComplete();      
    }
  }

  // gates
  gates.forEach((g) => {
    g.pos.y += skeespeed;
    
    if (g.pos.y < G.HEIGHT) {
      color("cyan");
      char(g.sprite, g.pos.x, g.pos.y, { scale: { x: 1.4, y: 1.4 } });
      char(g.sprite, g.pos.x + gateWidth, g.pos.y, { scale: { x: 1.4, y: 1.4 } });
      let col = line(g.pos.x-1, g.pos.y+4, g.pos.x + gateWidth-7, g.pos.y+4, 2);

      if (col.isColliding.char.a && !g.hascollided) {
        score += 1;
        gateScore += 1;
        play("coin");
        g.hascollided = true;
      }
    }
  });

  // a light_red line at left and right side of the screen.
  color("light_red");
  let tmp = ticks % 10;
  if (GLOBAL_PAUSE){
    tmp = 0;
  }
  let col1 = line(1, tmp, 1, G.HEIGHT-tmp, 4);
  let col2 = line(G.WIDTH-1, tmp, G.WIDTH-1, G.HEIGHT-tmp, 4);

  // if any of the lines are colliding with the player, end the game
  if (col1.isColliding.char.a || col2.isColliding.char.a) {
    play("explosion");
    end();
  }
  
}


function drawPlayer() {
  drawSkitracks(); // Draw the tracks first to avoid drifting when colliding with trees due to ... stuff.

  // player movement
  if (input.isJustPressed) {
    player.direction = !player.direction;
    play("click", {pitch: -2000, volume: 0.3, note: "c"});

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
    skeespeed -= 0.02;
  } else {
    player.speed -= 0.1;
    skeespeed += 0.03;
  }

  // NOtes: skeespeed: -0.04 |> +0.02 = värdena jag hade innan.
  player.speed = clamp(player.speed, 1, 3);
  skeespeed = clamp(skeespeed, -2.5, -1); // XXX TODO: make min max speed constants

  if (GLOBAL_PAUSE)
  {
    skeespeed = 0;
    player.speed = 0;
  }

  // player sprite
  color("blue");
  let mirror = player.direction ? 1 : -1;
  let plCol = char(player.sprite, player.pos.x, player.pos.y, { scale: { x: 2, y: 2 }, mirror: { x: mirror} });

  // player speed indicator
  color("black");
  rect(0, 20, player.speed * 10, 3);
  rect(0, 24, Math.abs(skeespeed) * 10, 3);
  // debug info
  // color("black");
  // text('track: ' + skiTrack.length, 3, 10);

  // check for collisions
  if (plCol.isColliding.char.b) {
    player.speed -= .3;
    skeespeed += 0.2;
  }

  // if player collided with red line <-- Handle in draw stuff becaus of draw order.
//  if (plCol.isColliding.rect.light_red) {
//    play("explosion");
//    end();
//  }

}

function drawSkitracks() {
  // Add a point to the ski track every 10 pixels of movement
let lastPoint = skiTrack[skiTrack.length - 1];
if (Math.abs(player.pos.y - lastPoint.y) > 10) {
  //let newY = lerp(lastPoint.y, player.pos.y, 0.5);
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
}

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function drawTrees() {

  // due to when everything is drawn ans suff we need to draw a transparent rectangel at every gate to avoid  trees in that area.
  gates.forEach((g) => {
    color("blue");
    rect(g.pos.x-10, g.pos.y-15, gateWidth+20, 30);
    color("white");
    rect(g.pos.x-10, g.pos.y-15, gateWidth+20, 30);
  });

  trees.forEach((t) => {
    t.pos.y += skeespeed;
//    color("green");
//    char("a", t.pos);
    color("green");
    let col = char(t.sprite,t.pos.x, t.pos.y, { scale: { x: 2, y: 3 } });

     if (col.isColliding.rect.blue) {
       // move tree 10 down.
      // play("hit");
       t.pos.x += 100;
     }

    if (t.pos.y < 0) {
      t.pos.y = G.HEIGHT+rnd(0, 100);
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


