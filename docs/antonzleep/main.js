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
  seed: 2,
  theme: "dark"

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
/**
 * @typedef { object } GameState - What is the state of current dayloop
 * @property { number } state - 1- set alarm, 2- sleep, 3- wake up
 */

let gameState = 1;

function update() {
  if (!ticks) {
    setupCharacters();
  }
  
  if (gameState == 1) {
    handleAlarmstate();
  } else if (gameState == 2) {
    writeZleepFX();
    handleSleepstate();
  } else if (gameState == 3) {
    handleWakeupstate();
  } else {
    switchStateScreen();
  }


}

function handleSleepstate() {
  color("light_yellow");
  char(alarmClock.sprite, alarmClock.pos);

  color("blue");
  char("a", 50, 42);

  if (input.isPressed && sleepTime < 101) {
    if (sleepTime < 40) {
      color("light_black");
    } else if (sleepTime < 70) {
      color("green");
    } else {
      color("light_red");
    }

    text(getSovaText(), 1, 60);
    sleepTime += 1;
    box(50, 50, sleepTime, 10);
    play("hit");
  }

  if (sleepTime >= 101) {
    color("black");
    text("DU HAR JU JOUR", 5, 60);


    color("red");
    box(50, 50, 100, 10);
    sleepTime += 1;
  }

  if (sleepTime == 110) {
    play("explosion");
  }

  if (sleepTime > 170) {
    color("black");
    text("for helvete", 9, 70);
    reset();
    end("");
  }

  if (input.isJustReleased && sleepTime < 40) {
    sleepTime = 0;
  }

  if (input.isJustReleased && sleepTime > 40 && sleepTime < 101) {
    score += sleepTime;
    switchState(3, "Heeejjjaaa hej!!");
    //gameState = 3;
    // reset();
    // play("powerUp");
    // text("sovtid: " + score, 3, 70);
    // end("Du vaknade!");
  }
}

function switchState(newState, text)
{
  gameState = 0;  
  // Paus execution for 1 second
  setTimeout(() => {gameState = newState;}, 1000);
  
 // play("powerUp");
}

function switchStateScreen()
{
  color("light_black");
  text("Wait for it!", 15, 40);
  
}
function setupCharacters(){
  zsymbol = times(20, () => {
    const posX = rnd(0, G.WIDTH);
    const posY = rnd(G.HEIGHT, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, posY),
      speed: rnd(G.Z_SPEED, G.Z_SPEED_MAX),
      sprite: rnd(1)<0.6? "b" : "c"
    };
  });

  alarmClock = {
    pos: vec(G.WIDTH-5, 42),
    speed: 1,
    sprite: "d"
  };
}
function writeZleepFX(){
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
    if (sleepTime > 100){
      color("light_red");
    };
    char(s.sprite, s.pos);
  });
}

function getSovaText(){
  if (sleepTime < 50) return "sover sover sover";
  if (sleepTime < 80 ) return "sover liiite till";
  if (sleepTime < 90) return "...";
  return "";
}

function reset() {
  // Reset your variables and game state here
  sleepTime = 0;
  G.Z_SPEED_MAX = 1.0;
  gameState = 1;
  // Reset other variables as needed...
}

function handleWakeupstate() {
       reset();
       play("powerUp");
       text("sovtid: " + score, 3, 70);
       end("Du vaknade!");
}
function handleAlarmstate() {
  color("light_yellow");
  text("Press set alarm", 5, rnd(25,28));

  // char c going back and forth over the screen
  color("yellow");
  alarmClock.pos.x -= alarmClock.speed;
  if (alarmClock.pos.x < 10 || alarmClock.pos.x > G.WIDTH-5) {
    alarmClock.speed *= -1;
  }
  char(alarmClock.sprite, alarmClock.pos);

  if (input.isJustPressed) {
    alarmPosition = alarmClock.pos.x;
    gameState = 2;
    play("lucky");
  }
}

