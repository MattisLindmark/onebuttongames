title = "";

description = `
`;

characters = [
`
 rr
r ry
  ll  
 rrlr
 rrr r
 rrrrr
`,
`

L
LLLLLL
 LLLL
 L  L
LLLLLL
`,
  `

   LL
  L Lr
Y   Y
YYYYY
Y   Y
`,
  `

  LL
 L Lr
   Y
 YYYY
 Y   Y
`,
`  
GGgGG
GGgGG
ggggg
GGgGG
GGgGG
`
,
`
BBbBB
BBbBB
bbbbb
BBbBB
BBbBB
`,`  
 ll
llll
lllll
llllll
 llll
  ll
`,`  
   l
 lllll
llllll
 llll
`,`
  l
`,
`
  ll
l ll l
  ll
 l  l
ll  ll
 `

];

const G = {
  WIDTH: 150, // 110
  HEIGHT: 150, // 90
  SNOWAMMOUNT: 20,
  GROUNDLEVEL: 10,
 // WORLDSPEED: 1,
};

const worldPhysics = {
  gravity: .1,
  jump: -2,
  maxSpeed: .5,
  worldSpeed: 1,
};

const offsets = {
  sledge: vec(0, 4),
  reindeer: vec(10, 3),
  dropzone: vec(0, 0)
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "crt",
  //  theme: "shapeDark",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
};

//======== Classes
class player {
  constructor() {
    this.pos = vec(G.WIDTH * 0.2, G.HEIGHT * 0.5);
    this.speed = 0;
    this.jump = 0;
    this.jumpforce = .2;
    this.jumpPower = -.5;
    this.char = "a";
    
  }

  update() {
    this.pos.x += this.speed;
    this.speed *= 0.9;
    this.jumpforce += worldPhysics.gravity;
    this.jumpforce *= 0.1;
    this.jumpforce = clamp(this.jumpforce,-2, 2);
    this.jump += this.jumpforce;
    this.jump = clamp(this.jump,worldPhysics.maxSpeed*-1, worldPhysics.maxSpeed);
    this.pos.y += this.jump;

    this.pos.x = clamp(this.pos.x, 0, G.WIDTH);
    this.pos.y = clamp(this.pos.y, 0, G.HEIGHT);
  }
}

class present {
  constructor() {
    this.pos = vec(0,0);
    this.fallspeed = 0;
    this.char = "e";
    this.isactive = false;
  }
  
  activate() {
    this.fallspeed = -1;
    this.isactive = true;
  }

  update() {
    if (!this.isactive) {      
      // leave the function
      return;
    }
    this.pos.x -= 0.1; 

    // this should fall down
    this.fallspeed += .05;
//    this.fallspeed *= 0.9;
    this.fallspeed = clamp(this.fallspeed, -2, 2);
    this.pos.y += this.fallspeed;
  }
}

/*
class snowflake {
  constructor() {
    this.pos = vec(0,0);
    this.fallspeed = 0;
    this.char = "i";
    this.isactive = false;
    this.drag = 0.85;
  }
  
  activate() {
    this.fallspeed = 0;
    this.isactive = true;
    // RND for drag is +- 0.1
    
  }

  update() {
    if (!this.isactive) {      
      // leave the function
      return;
    }
    // this should fall down
    this.fallspeed += .05;
    this.fallspeed *= this.drag;
    this.fallspeed = clamp(this.fallspeed, -2, 2);
    this.pos.y += this.fallspeed;
    if (this.pos.y > G.HEIGHT) {
      this.isactive = false;
      this.pos = vec(rnd(0, G.WIDTH), 0);
      this.activate();
    }
  }
}
*/

class snowflake {
  constructor() {
    this.pos = vec(0, 0);
    this.fallspeed = 0;
    this.horizontalspeed = 0;
    this.targetHorizontalspeed = 0;
    this.char = "i";
    this.isactive = false;
    this.drag = 0.85;
    this.changeDirectionTimer = 0;
  }

  activate() {
    this.fallspeed = 0;
    this.horizontalspeed = rnd(-0.3, 0.3); // Random initial horizontal speed
    this.targetHorizontalspeed = this.horizontalspeed;
    this.isactive = true;
    this.changeDirectionTimer = rnd(60, 120); // Change direction every 60 to 120 frames
  }

  update() {
    if (!this.isactive) {
      // leave the function
      return;
    }

    // Apply gravity to the vertical speed
    this.fallspeed += 0.04;
    this.fallspeed *= this.drag;
    this.fallspeed = clamp(this.fallspeed, -2, 2);

    // Smoothly interpolate towards the target horizontal speed
    this.horizontalspeed += (this.targetHorizontalspeed - this.horizontalspeed) * 0.05;
    this.horizontalspeed = clamp(this.horizontalspeed, -0.5, 0.5);

    // Update position
    this.pos.y += this.fallspeed;
    this.pos.x += this.horizontalspeed;

    // Wrap around the screen horizontally
    if (this.pos.x < 0) {
      this.pos.x = G.WIDTH;
    } else if (this.pos.x > G.WIDTH) {
      this.pos.x = 0;
    }

    // Change direction from time to time
    this.changeDirectionTimer--;
    if (this.changeDirectionTimer <= 0) {
      this.targetHorizontalspeed = rnd(-0.3, 0.3);
      this.changeDirectionTimer = rnd(60, 120); // Reset the timer
    }

    // Reset snowflake if it goes off the bottom of the screen
    if (this.pos.y > G.HEIGHT) {
      this.isactive = false;
      this.pos = vec(rnd(0, G.WIDTH), 0);
      this.activate();
    }
  }
}

class GiftReciver {
  constructor() {
    this.pos = vec(0,0);
    this.char = "j";
    this.speed = 1;
    this.isactive = false;
  }

  Activate() {
    this.isactive = true;
    this.speed = rnd(0.3, .8);
//    this.speed += (difficulty * 0.1);
    let rndX = rnd(10, 50);
    // start at the right of screen
    this.pos = vec(G.WIDTH+rndX, G.HEIGHT - (G.GROUNDLEVEL+4));
  }

  update() {
    if (!this.isactive) {
      this.Activate();
      return;
    }

    this.pos.x -= this.speed;
    if (this.pos.x < 0) {
      this.isactive = false;
    }
    
    return char (this.char, this.pos);    
  }
    // Move from left to right with random speed

  }



//======== Variables
let GIFTRECIVER = new GiftReciver();
let snowflakes = [];
// create 50 snowflakes in the array
for (let i = 0; i < G.SNOWAMMOUNT; i++) {
  snowflakes.push(new snowflake());
}

let stars = times(20, () => {
  return {
    pos: vec(rnd(G.WIDTH), rnd(G.HEIGHT)),
    speed: rnd(0.01, 0.02),
    color: getRandomColor()
  };
});

let presents = [];
// create 5 presents in the array
for (let i = 0; i < 5; i++) {
  presents.push(new present());
}

let raindeer = {
  pos: vec(0,0),
  flipChar: "c",  
  char: "c",
  animOffset: 0,

  update() {
    this.pos = vec(santa.pos.x + offsets.reindeer.x, santa.pos.y + offsets.reindeer.y);
    this.animOffset = ticks % 20 > 10 ? 1 : 0;
  }
};

let santa = new player();

let btnTimer = 0;
let btnTreshold = 12;


//MARK: ====== Main Loop 
//======================================================================================

function update() {
  if (!ticks) {
    GIFTRECIVER.Activate();
    // Activate all snowflakes
    for (let i = 0; i < snowflakes.length; i++) {
      snowflakes[i].pos = vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT));
      snowflakes[i].activate();
    }
//    sss.setSeed(5);
//    sss.setVolume(0.05);
  }
/*
  // Debuggzone
  color("black");
  char("f", 20, 20);
  // end of debuggzone
*/
  color ("black")
  DrawSnowflakes();
//  drawStars();
  santa.update();
  raindeer.update();
  updatePresents();

  // dra ground
  DrawBackground();

  
  if (input.isPressed) {
    btnTimer++;
    //santa.jump = worldPhysics.jump;
    santa.jumpforce = santa.jumpPower;
  }
  color("black");  
  
  if (input.isJustReleased) {
    if (btnTimer < btnTreshold) {
      DropAPresent();
    } 
    btnTimer = 0;
  }
  
  char(santa.char, santa.pos);
  // make temp valu for santa.pos + offsets.sledge
  let tempS = vec(santa.pos.x + offsets.sledge.x, santa.pos.y + offsets.sledge.y);
  char("b", tempS);
  let tempR = vec(santa.pos.x + offsets.reindeer.x, santa.pos.y + offsets.reindeer.y);
  //char("c", tempR);
  char(addWithCharCode(raindeer.char, raindeer.animOffset), raindeer.pos);
  // Draw a thin line petween santa and the reindeer
  color("light_black");
  line(santa.pos,tempR,1);

  let tmp = GIFTRECIVER.update();
  if (tmp.isColliding.char.e || tmp.isColliding.char.f) {
    play("powerUp");
    score += 10;
  }

}

function DrawSnowflakes() {
  for (let i = 0; i < snowflakes.length; i++) {
    snowflakes[i].update();    
    char(snowflakes[i].char, snowflakes[i].pos);
  }
}

function DropAPresent() {
  for (let i = 0; i < presents.length; i++) {
    if (!presents[i].isactive) {
      presents[i].pos = vec(santa.pos.x + offsets.dropzone.x, santa.pos.y + offsets.dropzone.y);
      presents[i].activate();
      play("click");
      break;
    }
  }
}

function updatePresents() {
  for (let i = 0; i < presents.length; i++) {
    presents[i].update();
    if (presents[i].pos.y > G.HEIGHT) {
      presents[i].isactive = false;
    }
    char(presents[i].char, presents[i].pos);
  }
}

function drawStars() {
  stars.forEach((star) => {
    star.pos.x -= star.speed;
    color (star.color);
    rect(star.pos, 1, 1);
    color("black");
    if (star.pos.x < 0) {
      star.pos.y = rnd(G.HEIGHT-50,0);
      star.pos.x = rnd(G.WIDTH, G.WIDTH+50);
    }
  });
}

function DrawBackground() {
  color("light_black");
  rect(0, G.HEIGHT - G.GROUNDLEVEL, G.WIDTH, G.GROUNDLEVEL);
}





//============================= UTILS
function getRandomColor()
{
  let avColors = ["black", "red", "blue", "green", "yellow", "purple", "cyan"];
  return avColors[Math.floor(Math.random() * avColors.length)];
}

/*
  | "transparent"
  | "white"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "purple"
  | "cyan"
  | "black"
  */