title = "Docker Hell";

description = `
`;

characters = [
  `
llllll
l    l
l    l
llllll 
  ll
llllll
`,
  `
      
  ll  
   l
   l
   l

`,
  `

  ll  
 l  l
 l  l
 l  l
  ll

`
];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,
  STAR_SPRITE: "b",
  LOADINGSPEED: 1
};
// an array that feels shaky
const shakeArray = [-0.1, 0.2, -0.3, 0.4, -0.5, 0.6, -0.7, 0.8, -0.9, 1.0, -0.9, 0.8, -0.7, 0.6, -0.5, 0.4, -0.3, 0.2, -0.1, 0.0, 0.1, -0.2, 0.3, -0.4, 0.5, -0.6, 0.7, -0.8, 0.9, -1.0];
let shakeindex = 0;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  theme: "dark",
  isShowingScore: false,
//   isShowingTime: true,
//   isCapturing: true,
   //captureCanvasScale: .2,
//   isCapturingGameCanvasOnly: true
};

/**
* @typedef { object } Star - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
*/
let stars;
let loadingTime = 0;
let difficultyFlag = true;

let leveldata = { // OBS lazy setting of data again in setup etc osv.
  level: 1,
  speed: G.LOADINGSPEED,
  isLoadingPhase: true,
  safeZone: 25
};
let barColor = "blue";


// ================== GAME LOOP ==================
function update() {
  if (!ticks) {
    setup();
  }

  
  drawBgr();

  color("light_cyan");
  if (input.isPressed){
    color("black");
    if (ticks%4==0)shakeindex ++;
  } 

  char("a", G.WIDTH/2+(shakeArray[shakeindex%shakeArray.length]), 40+(shakeArray[(shakeindex+20)%shakeArray.length]));
  color(barColor);
  box(G.WIDTH / 2, G.HEIGHT / 2, calculateBarValue(), 4);
  color("black");
  
  if (leveldata.isLoadingPhase) {
    loadingPhase();
  } else {
    updatePhase();
  }
  placeBarAnim();
  
  // if (input.isJustReleased && loadingTime < 100) {
  //   loadingTime = 0;
  // }

  // text("safex: " + safex, 5, 5);
  // text("safezone: " + leveldata.safeZone, 5, 10);
  // text("LoadTime: " + loadingTime, 5, 15);

  checkEndContitions();
}

// ================== FUNCTIONS ==================

let animCounter = 0;
let safex = 0;
//let TMPbool = true;
function placeBarAnim() {
  //let TMP = true;

  animCounter += ((animCounter * 0.3) + 0.01);
  if (animCounter > 1) {
    animCounter = 1;
  }

  // if (input.isJustPressed){
  //   TMPbool = true;
  //   TmpCounter = 0;
  // }
  // if (input.isJustReleased){
  //   TMPbool = false;
  //   TmpCounter = 0;
  // }


  if (leveldata.isLoadingPhase) {
    safex = lerp(0, leveldata.safeZone / 2, animCounter);
  } else {
    safex = lerp(leveldata.safeZone / 2, 0, animCounter);
  }

  //text (""+safex, 5, 5);

  // draw the loading zones
  color("green");
  box((G.WIDTH + 1) - safex, G.HEIGHT / 2, 1, 10);
  box(safex - 1, G.HEIGHT / 2, 1, 10);
  color("red");
  box(G.WIDTH, G.HEIGHT / 2, 1, safex + 10); // 30 is a good height
  box(1, G.HEIGHT / 2, 1, safex + 10);

  // draw the update zone
  color("red");
  box(G.WIDTH / 2, G.HEIGHT / 2, 1, 10-safex);

  color("green");
  box(G.WIDTH / 2 - (leveldata.safeZone / 2 - safex), G.HEIGHT / 2, 1, 10);
  box(G.WIDTH / 2 + (leveldata.safeZone / 2 - safex), G.HEIGHT / 2, 1, 10);

  //  rect(G.WIDTH/2-leveldata.safeZone/2, G.HEIGHT/2-4, leveldata.safeZone, 8);



}

function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};

function lerp(start, end, time) {
  return (1 - time) * start + time * end;
}


function calculateBarValue() {
  if (!input.isPressed) {
    loadingTime -= leveldata.speed;
  } else {
    loadingTime += leveldata.speed;
  }
  if (loadingTime < 0) {
    loadingTime = 0;
  }

  return loadingTime;
}

function drawBgr() {
  stars.forEach((s) => {
    // Move the star downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_green");
    if (loadingTime > 100) {
      color("light_red");
    };
    // Draw the star as a square of size 1    
    //text("1", s.pos);
    //    box(s.pos, 1);    
    char(s.sprite, s.pos);
  });
}

function loadingPhase() {
  if (ticks % 4 === 0) {
    loopColor();
  }
  if (input.isPressed && loadingTime < G.WIDTH) {
    color("cyan");
    text("Installing docker", 1, 30);
    play("laser");
  }
  /* draw the loading zones
    color("green")
    box(G.WIDTH-leveldata.safeZone/2, G.HEIGHT/2, 1, 10);
    box(leveldata.safeZone/2, G.HEIGHT/2, 1, 10);
    color("red");
    box(G.WIDTH, G.HEIGHT/2, 1, 30);
    box(1, G.HEIGHT/2, 1, 30);
  */


  //  text("loading time: " + loadingTime, 5, 5);

  if (input.isJustReleased) {
    if (loadingTime >= G.WIDTH - leveldata.safeZone) {
      play("powerUp");
      score++;
      leveldata.isLoadingPhase = false;
      animCounter = 0;
    }
  }

  /*
    if (loadingTime >= 100) {
      score = -100;
      color("black");
      text("docker installed", 5, 60);
  
      color("red");
      box(50, 50, 100, 10);
      loadingTime += 1;
    }
    */
}


function updatePhase() {
  if (ticks % 10 === 0) {
    loopColor();
  }
  if (loadingTime > 1) {
    color("yellow");
    text("Update pending!", 10, 30);
  }
  /* draw the zones
  color("green");

  color("green")
  box(G.WIDTH/2-leveldata.safeZone/2, G.HEIGHT/2, 1, 10);
  box(G.WIDTH/2+leveldata.safeZone/2, G.HEIGHT/2, 1, 10);
  color("red");
  box(G.WIDTH/2, G.HEIGHT/2, 1, 10);
  color("black");
*/
  if (input.isJustPressed) {
    if (loadingTime <= leveldata.safeZone+2) { // +1 to make visual and press-lag feel better
      play("powerUp");
      score++;

      leveldata.level++;
      if (difficultyFlag) {
        leveldata.speed += 0.2;
      } else {
        leveldata.safeZone -= 2;
        if (leveldata.safeZone < 3) {
          leveldata.safeZone = 3;
        }
      }
      difficultyFlag = !difficultyFlag;
      leveldata.isLoadingPhase = true;
      animCounter = 0;
    }
  }
}

function checkEndContitions() {
  if (loadingTime > G.WIDTH) {
    color("black");
    text("Install error!", 14, 70);
    reset();
    end("");
  } else if (leveldata.isLoadingPhase === false && loadingTime < 1) {
    color("black");
    text("Update Failed!", 14, 60);
    reset();
    end("");
  }
}

function setup() {
  stars = times(20, () => {
    // rnd( min, max )
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(0, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, posY),
      speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
      sprite: rnd(1) < 0.6 ? "b" : "c"
    };
  });

  difficultyFlag = true;
  animCounter = 0;

  leveldata = {
    level: 1,
    speed: G.LOADINGSPEED,
    isLoadingPhase: true,
    safeZone: 25
  };

}

function reset() {
  // Reset your variables and game state here
  loadingTime = 0;
  G.STAR_SPEED_MAX = 1.0;
  // Reset other variables as needed...
}
let allColors = ["red", "green", "blue", "yellow", "cyan", "purple"];
function loopColor() {
  let index = allColors.indexOf(barColor);
  index++;
  if (index >= allColors.length) {
    index = 0;
  }
  barColor = allColors[index];
}