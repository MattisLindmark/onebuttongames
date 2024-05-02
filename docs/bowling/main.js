title = "simple\n BOWLING";

description = `strike 10p\n spare 5p\n 5 rounds
`;

characters = [
  `
  ll  
 llll
llllll
llllll
 llll
  ll
`,
  `
llllll
llllll
`,
  `
  ll  
  ll
 llll
 llll
  ll
`,
  `
    ll  
   ll
 llll
llll
ll
`

];

const G = {
  WIDTH: 110,
  HEIGHT: 190,
  NrOfRounds: 5
};

const ballStartY = G.HEIGHT - 40;

let GutterLeft = 30;
let GutterRight = G.WIDTH - 30;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    //theme: "shapeDark",
    theme: "simple",
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

class bowlingPin {
  constructor() {
    this.pos = vec(G.WIDTH * 0.5, G.HEIGHT * 0.5);
    this.vel = vec(0, 0);
    // this.acc = vec(0, 0);
    this.drag = 0.1;
    this.angle = 0;
    this.speed = 0;
    this.radius = 3;
    this.hasFallen = false;
    this.inPlay = true;
  }

  hit(direction) {
    this.hasFallen = true;
    this.angle = direction;
    this.speed = 1;
    this.vel = vec(this.speed * Math.cos(this.angle), this.speed * Math.sin(this.angle));
  }

  update() {
    if (!this.inPlay)
      return;
    if (this.hasFallen) {
      this.pos.add(this.vel);
      this.vel.x *= 1 - this.drag;
      this.vel.y *= 1 - this.drag;
      //this.vel.add(this.acc);
      // this.acc.set(0, 0);
      if (this.pos.x < 0 || this.pos.x > G.WIDTH) {
        this.vel.x *= -1;
      }
      if (this.pos.y < 0 || this.pos.y > G.HEIGHT) {
        this.vel.y *= -1;
      }
    }
  }
  draw() {
    if (!this.inPlay)
    return;
    let c = "c";
    if (this.hasFallen) {
      c = "d";
    }
    color("black");
    let col = char(c, this.pos);

    // Check against the ball
    if (!this.hasFallen) {
      if (col.isColliding.char.a && !this.hasFallen) {
        this.hasFallen = true;
        play("hit");
        // set this angel to the direction of the ball
        let angel = calculateAngle(ball.pos, this.pos);
        // normalize the angle      
        this.hit(angel);// + Math.PI);
      }
    }

    // If has fallen, check against other pins
    if (!this.hasFallen) {
      if (col.isColliding.char.d) {
        this.hasFallen = true;
        console.log("hit");
        // set this angel to the direction of the ball
        let angel = calculateAngle(ball.pos, this.pos);
        // normalize the angle      
        this.hit(angel);// + Math.PI);
      }
    } else {
      pins.forEach((pin) => {
        if (pin != this && !pin.fallen) {
          if (this.pos.distanceTo(pin.pos) < this.radius * 2) {
            // Bounce off the other pin
            let angel = calculateAngle(pin.pos, this.pos);
            pin.hit(angel + Math.PI);
          }
        }
      });
    }
  }
}

class bowlingBall {
  constructor() {
    this.pos = vec(G.WIDTH * 0.5, ballStartY);
    this.vel = vec(0, 0);
    this.acc = vec(0, 0);
    this.angle = 0;
    this.speed = 0;
    this.radius = 3;
    this.isLaunched = false; 
  }

  launch() {
    this.isLaunched = true;
    this.vel = vec(this.speed * Math.cos(this.angle), this.speed * Math.sin(this.angle));
  }

  update() {
    if (this.isLaunched) {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.acc.set(0, 0);

      if (this.pos.x < GutterLeft-3 || this.pos.x > GutterRight+3) {
        if ( CHEATMODE){
          this.vel.x *= -1;
        }else{
          this.vel.x = 0;
        }
        if (this.pos.y > 5)
        {
          if (!Gutterflag) {
            play("explosion");
          }
          Gutterflag = true;
        }
      }

      if (this.pos.y < -100) {
        console.log("ball out of bounds");
        this.isLaunched = false;
        FinishTurn = true;

        if (this.pos.x < GutterLeft-3 || this.pos.x > GutterRight+3) {
          if (Gutterflag){
            gameStats.totalGutterBalls++;
            Gutterflag = false;
          }
        }

      }
      // if (this.pos.x < 0 || this.pos.x > G.WIDTH) {
      //   this.vel.x *= -1;
      // }
      // if (this.pos.y < 0 || this.pos.y > G.HEIGHT) {
      //   this.vel.y *= -1;
      // }
    }
  }

  draw() {
    if (!this.isLaunched)
      return;
    color("black");
    let col = char("a", this.pos);
  }
}



let pins = [];
let ball;

let FinishTurn = false;
let runda = 1;
let turn = 1;

let vTimer = {
  strikeText: 0,
  spareText: 0,
  roundText: 0,
  pinsleftText: 0
};

let gameStats = {
  totalPins: 0,
  totalStrikes: 0,
  totalSpares: 0,
  totalGutterBalls: 0,    
}
let Gutterflag = false;
let GOtimer = 0;
let CHEATMODE = false;

 //================================================================= MAIN LOOP MARK: update
function update() {
  if (!ticks) {
    sss.setSeed(8);
    sss.setVolume(0.05);
    Gutterflag = false;
    GOtimer = 0;
    resetGameStats();
    resetStuff();
    //    sss.setSeed(5);
    //    sss.setVolume(0.05);
    ball = new bowlingBall();
    setupPind();
  }
  if (ticks < 20) {
    return;
  }

  // if (input.isJustReleased) {
  //   play("select");
  // }
  if (runda > G.NrOfRounds) {
    GOtimer++;
    let y = G.HEIGHT*0.2;
    text("GOOD JOB!", 6,y-5,{scale:{x:2,y:2}});
    text("Score:   " + score, G.WIDTH * 0.2, y+10);
    text("Pins:    " + gameStats.totalPins, G.WIDTH * 0.2, y+20);
    text("Strikes: " + gameStats.totalStrikes, G.WIDTH * 0.2, y+30);
    text("Spares:  " + gameStats.totalSpares, G.WIDTH * 0.2, y+40);
    if (gameStats.totalGutterBalls > 0)
    {
    color("light_black")
    text("(" + gameStats.totalGutterBalls+" in the gutter)", G.WIDTH * 0.1, G.HEIGHT-20);
    }
    color("black");
    if (input.isJustPressed || GOtimer > 300) {
      text("  press\n any key", G.WIDTH * 0.5-20, G.HEIGHT * 0.5);
      end("");
    }
    return;
  }
    

  //text("y"+ball.pos.y, 3, 13);
  text(runda+"/5", 3, 15);


  if (FinishTurn) {
    handleEndOfTurn();
    ball = new bowlingBall();
    FinishTurn = false;
  }
color ("light_black");
  text("^",G.WIDTH / 2, ballStartY - 35);
  text("^ ^",G.WIDTH / 2-6, ballStartY - 30);
  text("^   ^",G.WIDTH / 2-12, ballStartY - 25);
  color("black");
  

//  color("light_red");
  color("red");
  rect(GutterLeft-10, 0, 10, G.HEIGHT);
  rect(GutterRight, 0,10, G.HEIGHT);


  ball.update();
  ball.draw();

  pins.forEach((pin) => {
    pin.update();
    pin.draw();
  });
  drawAim();

  if (input.isJustReleased) {
    // ball.angle = input.pos.angle;
    console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
  }


  // Show Stuff
  // if (ticks <2)
  // {
  //   vTimer.pinsleftText = 100;
  //   pinsleft = 5;
  //   vTimer.strikeText = 100;
  //   vTimer.spareText = 100;
  // }


  if (vTimer.roundText > 0) {
    vTimer.roundText--;
    let t = Math.floor(vTimer.roundText / 5) % 4;
    color("green");
    text("Round: " + runda, (G.WIDTH * 0.5)-20, G.HEIGHT*0.3);
    color("black");
  }

  if (vTimer.spareText > 0) {
    vTimer.spareText--;
    let t = Math.floor(vTimer.spareText / 5) % 4;
    color(colors[t]);
    text("SPARE", (G.WIDTH * 0.5)-25, G.HEIGHT*0.15,{scale: {x: 2, y: 2}});
    color("black");
  }


  if (vTimer.strikeText > 0) {
    vTimer.strikeText--;
    let t = Math.floor(vTimer.strikeText / 5) % 4;
    let y = lerp(10,80,vTimer.strikeText * 0.01);
    color(colors[t]);
    text("STRIKE", (G.WIDTH * 0.5)-30, y,{scale: {x: 2, y: 2}});
  }
  if (vTimer.pinsleftText > 0) {
    vTimer.pinsleftText--;
//    let y = lerp(10,80,Math.sin(ticks * 0.05));
    color("black");
    text("Pins\nleft:" + pinsleft, (G.WIDTH * 0.5)-20, G.HEIGHT*0.3);
  }

}


let swayAngle = 0;

function drawAimOLD() {
  const aimLength = 20;
  swayAngle += 0.05; // Adjust this value to change the speed of the sway
  const sway = Math.sin(swayAngle) * 0.5; // Adjust the multiplier to change the range of the sway
  const aimEnd = vec(G.WIDTH / 2, G.HEIGHT - 50).addWithAngle(Math.PI / 2 + sway, aimLength);
  line(vec(G.WIDTH / 2, G.HEIGHT - 50), aimEnd, 2);

  if (input.isJustReleased) {
    //    ball.angle = aimEnd.angle;

    ball.angle = Math.PI / 2 + sway; // Update the ball's angle with the aim's angle
    console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
  }

}
let x;
let tmp = false;
function drawAim() {
  if (ball.isLaunched) {
    return;
  }

  
  if (!input.isPressed && !tmp) {
    x = G.WIDTH / 2;
    // move x side to side using cos sin
    x += Math.cos(ticks * 0.1) * 10;
  }
  char("a", x, ballStartY);
//  ball.pos.x = x;
  
  const aimLength = 20;
  swayAngle += 0.05; // Adjust this value to change the speed of the sway
  const sway = Math.sin(swayAngle) * 0.5; // Adjust the multiplier to change the range of the sway
  const aimStart = vec(x, ballStartY);
  const aimEnd = vec(aimStart).addWithAngle(-Math.PI / 2 - sway, aimLength);
  if (input.isPressed) {
    tmp = true;
    line(aimStart, aimEnd, 2);
  }
  
  if (input.isJustReleased) {
    ball.angle = -Math.PI / 2 - sway; // Update the ball's angle with the aim's angle
    ball.pos.set(x, ballStartY);
    //console.log("angle: " + ball.angle);
    ball.speed = 1;
    ball.launch();
    tmp = false;
  }
}

let pinsleft = 10;
function handleEndOfTurn() {
  // if (runda == 1) {
  //   runda = 2;
  // } else {
  //   runda = 1;
  //   turn++;
  // }

  pins.forEach((pin) => {
    if (pin.hasFallen && pin.inPlay) {
      score++;
      gameStats.totalPins++;
      pin.inPlay = false;
    }
  });

  // check if there is any more pins in play
  let pinsInPlay = pins.filter((pin) => pin.inPlay);
  if (pinsInPlay.length == 0) {
    if (turn == 1) {
      score += 10;
//      console.log("Strike");
      vTimer.strikeText = 60;
      play("powerUp");
      gameStats.totalStrikes++;
      turn = 2;
    } else {
      score += 5;
      vTimer.spareText = 60;
      play("select");
      gameStats.totalSpares++;
      console.log("Spare");
    }
  } else if (turn == 1) {
    console.log("Pins left: " + pinsInPlay.length);
    vTimer.pinsleftText = 60;
    pinsleft = pinsInPlay.length;
  }

  if (turn > 1) {
    vTimer.roundText = 100;
    console.log("End of turn");
    console.log("Score: " + score);
    console.log("Turn: " + turn);
    // Reset the pins
    setupPind();
    ball = new bowlingBall();
    turn = 1;
    runda ++;
   } else {
    turn ++;
    ball = new bowlingBall();
   }
}

//========================================================= setups MARK: setup
function setupPind() {
  pins = [];
  for (let i = 0; i < 10; i++) {
    const pin = new bowlingPin();
    pins.push(pin);
  }

  // Place the pins in a triangle formation with 4 rows
  const pinRadius = 2;
  const pinSpacing = 8;
  const pinOffset = 8;
  for (let row = 0; row < 4; row++) {
    const pinsInRow = 4 - row;
    const startX = G.WIDTH / 2 - (pinRadius * 2 + pinSpacing) * (pinsInRow - 1) / 2;
    const startY = 5 + pinRadius * 2 + pinSpacing * row + pinOffset;
    for (let i = 0; i < pinsInRow; i++) {
      const pin = pins.shift();
      pin.pos.set(startX + (pinRadius * 2 + pinSpacing) * i, startY);
      pins.push(pin);
    }
  }
}

function resetGameStats() {
  gameStats.totalPins = 0;
  gameStats.totalStrikes = 0;
  gameStats.totalSpares = 0;
  gameStats.totalGutterBalls = 0;
}

function resetStuff() {
  score = 0;
  runda = 1;
  turn = 1;
  FinishTurn = false;
  vTimer = {
    strikeText: 0,
    spareText: 0,
    roundText: 0,
    pinsleftText: 0
  };
}

//========= MARK: - helpers
function calculateAngle(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x);
}

const colors = ["red", "blue", "green", "yellow", "purple", "cyan", "black"];
const allColors = ["red", "blue", "green", "yellow", "purple", "cyan", "black", "light_red", "light_blue", "light_green", "light_yellow", "light_purple", "light_cyan", "light_black"];

function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

function easInOut (t) {
  return t<.5 ? 2*t*t : -1+(4-2*t)*t;
} 

/*
      pins.forEach((pin) => {
        if (pin != this) {
          if (this.pos.distanceTo(pin.pos) < this.radius * 2) {
            // Bounce off the other pin
            const angle = this.pos.angleTo(pin.pos);
            const overlap = this.radius * 2 - this.pos.distanceTo(pin.pos);
            this.pos.addWithAngle(angle, overlap * 0.5);
            pin.pos.addWithAngle(angle + Math.PI, overlap * 0.5);
          }
        }
      });
*/