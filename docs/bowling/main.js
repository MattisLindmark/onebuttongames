title = "";

description = `
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
};

const ballStartY = G.HEIGHT - 50;

let GutterLeft = 30;
let GutterRight = G.WIDTH - 30;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
  //  theme: "crt",
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

      if (this.pos.x < GutterLeft || this.pos.x > GutterRight) {
        if ( CHEATMODE){
          this.vel.x *= -1;
        }else{
          this.vel.x = 0;
        }    
      }

      if (this.pos.y < -100) {
        console.log("ball out of bounds");
        this.isLaunched = false;
        FinishTurn = true;
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

let CHEATMODE = false;

 //================================================================= MAIN LOOP MARK: update
function update() {
  if (!ticks) {
    //    sss.setSeed(5);
    //    sss.setVolume(0.05);
    ball = new bowlingBall();
    setupPind();
  }

  text("y"+ball.pos.y, 3, 13);

  if (FinishTurn) {
    handleEndOfTurn();
    ball = new bowlingBall();
    FinishTurn = false;
  }

  text("^",G.WIDTH / 2, G.HEIGHT/2-15);

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


function handleEndOfTurn() {
  // if (runda == 1) {
  //   runda = 2;
  // } else {
  //   runda = 1;
  //   turn++;
  // }

  pins.forEach((pin) => {
    if (pin.hasFallen) {
      score++;
      pin.inPlay = false;
    }
  });

  // check if there is any more pins in play
  let pinsInPlay = pins.filter((pin) => pin.inPlay);
  if (pinsInPlay.length == 0) {
    if (turn == 1) {
      score += 10;
      console.log("Strike");
      turn = 2;
    } else {
      score += 5;
      console.log("Spare");
    }
  } else {
    console.log("Pins left: " + pinsInPlay.length);
  }

  if (turn > 1) {
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


//========= MARK: - helpers
function calculateAngle(start, end) {
  return Math.atan2(end.y - start.y, end.x - start.x);
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