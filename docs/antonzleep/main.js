title = "Anton zleep";

description = `
`;

characters = [
  `
    rr
llllll
l    l

`,
  `  
  lllll
     l
    l
   l
  lllll
`,
  `
yyyy
y 
 y
  y
yyyy
`
  ,
  `
ll  ll
 llll
lll ll
ll lll
 llll
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
  Z_SPEED: 0.5,
  Z_SPEED_MAX: 1.0,
  Z_SPRITE: "b"
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isReplayEnabled: false,
  isCapturing: true,
  seed: 55,
  theme: "dark",
  
// s2 = använde nyss (hit och explotion). seed 44 ganska bra select och laser. s53 random. s55 coin/jump alarm. click sleep. Random gameover.
};

/**
* @typedef { object } zsymbol - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The upward floating speed of this object
*/
let zsymbol;
let alarmClock;
let alarmPosition = 50;
let sleepTime = 0;
let day = 1;
let baseAx = 0.01;
let ax = 0.01;
let isInTheGreen = false;

/**
 * @typedef { object } GameState - What is the state of current dayloop
 * @property { number } state - 1- set alarm, 2- sleep, 3- wake up
 */

let gameState = 1;
let transitionFunc = switchStateScreen;

function update() {
  if (!ticks) {
    setupCharacters();
    //playBgm();
  }

  if (gameState == 1) {
    handleAlarmstate();
  } else if (gameState == 2) {
    writeZleepFX();
    handleSleepstate();
  } else if (gameState == 3) {
    handleWakeupstate();
  } else if (gameState == 0) {
    transitionFunc();
  }


}

function handleSleepstate() {
  
  color("blue");
  char("a", sleepTime+1, 45);

  color("light_yellow");
  char(alarmClock.sprite, alarmClock.pos);
  color("light_green");
  box(alarmPosition, 50, 7, 7);
  color("red");
  box(alarmPosition+5, 50, 4, 7);

  if (input.isPressed && sleepTime < 101) {
    if (sleepTime < 30) {
      color("light_black");
    } else if (sleepTime < 70) {
      color("green");
    } else {
      color("light_red");
    }

    text(getSovaText(), 1, 60);
    sleepTime += .2 + ax;
    ax += baseAx;
    //    box(50, 50, sleepTime, 10);
    let stapel = bar(2, 50, sleepTime, 5, 0, 0);

    if (stapel.isColliding.rect.light_green) {
         isInTheGreen = true;
    }
    if (stapel.isColliding.rect.red) {
      play("powerUp");
      isInTheGreen = false;
      sleepTime = 101;
    }


    play("explosion", { volume: 0.5 });
  }

  if (sleepTime >= 101) {
    color("black");
    text("DU HAR JU JOUR", 5, 60);


    color("red");
    bar(2, 50, 100, 10, 0, 0);
    //    box(50, 50, 100, 10);
    sleepTime += 1;
  }

  if (sleepTime == 110) {
    play("random");
  }

  if (sleepTime > 170) {
    color("black");
    text("for helvete", 9, 70);
    reset();
    end("");
  }

  if (input.isJustReleased && sleepTime < 30) {
    sleepTime = 0;
    ax = baseAx;
  }

  if (input.isJustReleased && sleepTime > 30 && sleepTime < 101 && isInTheGreen == true) {
    score += (sleepTime*10);
    isInTheGreen = false;
    transition(3, "RIIiiiiiing riiing...");
    //gameState = 3;
    // reset();
    // play("powerUp");
    // text("sovtid: " + score, 3, 70);
    // end("Du vaknade!");
  } else if (input.isJustReleased && sleepTime > 30 && sleepTime < 101 && isInTheGreen == false) {
    score -= (sleepTime*5);
    transition(2, "snooze");
    //gameState = 2;
  }


}


function transition(newState, text) {
  transitionFunc = switchStateScreen.bind(null, text);
  gameState = 0;
  // Paus execution for 1 second
  setTimeout(() => { gameState = newState; }, 1000);

  // play("powerUp");
}

function quickTransition(newState) {
  gameState = -1;
  setTimeout(() => { gameState = newState; }, 100);
}

function switchStateScreen(txt = "waitforit") {
 // console.log("switchStateScreen");
  play("coin");
  color("light_black");
  text(txt, 15, 40);
}

function setupCharacters() {
  zsymbol = times(20, () => {
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(G.HEIGHT, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, posY),
      speed: rnd(G.Z_SPEED, G.Z_SPEED_MAX),
      sprite: rnd(1) < 0.6 ? "b" : "c"
    };
  });

  alarmClock = {
    pos: vec(G.WIDTH - 50, 42),
    speed: 1,
    sprite: "d"
  };
}
function writeZleepFX() {
  // if (!ticks) {
  //   // A CrispGameLib function
  //   // First argument (number): number of times to run the second argument
  //   // Second argument (function): a function that returns an object. This
  //   // object is then added to an array. This array will eventually be
  //   // returned as output of the times() function.
  //   zsymbol = times(20, () => {
  //     const posX = rnd(0, G.WIDTH);
  //     const posY = rnd(G.HEIGHT, G.HEIGHT);
  //     return {
  //       // Creates a Vector
  //       pos: vec(posX, posY),
  //       speed: rnd(G.Z_SPEED, G.Z_SPEED_MAX),
  //       sprite: rnd(1)<0.6? "b" : "c"
  //     };
  //   });
  // }

  zsymbol.forEach((s) => {
    s.pos.y -= s.speed;
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT); // warps to top of screen when it reaches bottom
    color("light_green");
    if (sleepTime > 100) {
      color("light_red");
    };
    char(s.sprite, s.pos);
  });
}

function getSovaText() {
  if (sleepTime < 50) return "sover sover sover";
  if (sleepTime < 80) return "sover liiite till";
  if (sleepTime < 90) return "...";
  return "";
}

function reset() {
  // Reset your variables and game state here
  sleepTime = 0;
  G.Z_SPEED_MAX = 1.0;
  gameState = 1;
  ax = baseAx;
  // Reset other variables as needed...
}

function handleWakeupstate() {
  reset();
//  play("powerUp");
  text("sovtid: " + score, 3, 70);
  end("Du vaknade!");
}
function handleAlarmstate() {
  color("light_yellow");
  text("set alarm", 30, rnd(26, 28));

  // char c going back and forth over the screen
  color("yellow");
  alarmClock.pos.x -= alarmClock.speed;
  if (alarmClock.pos.x < 35 || alarmClock.pos.x > G.WIDTH - 2) {
    alarmClock.speed *= -1;
  }
  char(alarmClock.sprite, alarmClock.pos);

  if (input.isJustPressed) {
    alarmPosition = alarmClock.pos.x;
    play("hit", { volume: 0.5 });
//    gameState = 2;
    quickTransition(2);
  }
}

