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
  ll
llllll
  ll
 l  l
ll ll
 `,
 `
 ll
 ll
 lll
lll
  l
 ll
`,
`
  y 
  GG
  GG
 GGGG
GGGGGG
  YY
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

//MARK: ====== Main Variables ============

let currentWorldSpeed = worldPhysics.worldSpeed;
let currentDifficulty = 1;
let SantaDetectionMeeter = 0;
let HappinessMeeter = 100;

// XXXXXXXXXXXXXXXXXX Gör poängen såhär:
// En hemlös som inte fått paket når slutet = -5
// Hus som inte fått paket = -10
// paket som slår i backen utan vidare = -1
// Men hur håller man reda på vilka hus som fått paket?
// En klass som håller reda på score per runda lixom kanske.

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
  reset() {
    this.pos = vec(G.WIDTH * 0.2, G.HEIGHT * 0.5);
    this.speed = 0;
    this.jump = 0;
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
    this.pos = vec(100,100);
    this.fallspeed = 0;
    this.char = "e";
    this.isactive = false;
  }
  
  activate() {
    this.fallspeed = -1;
    this.isactive = true;
    // 50% random char e or f
    this.char = rnd() > 0.5 ? "e" : "f";
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
    if (this.pos.y > G.HEIGHT-8) {
      this.isactive = false;
      // particle(player.pos, 5, 3, 33, 0.5);
      color("black");
      particle(this.pos, rnd(8,11), 1.5);
      HappinessMeeter -= 1;
    }
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
    this.animOffset = 0;
  }

  Activate() {
    this.isactive = true;
    this.speed = rnd(0.3, .8)*currentWorldSpeed;
//    this.speed += (difficulty * 0.1);
    let rndX = rnd(10, 50);
    // start at the right of screen
    this.pos = vec(G.WIDTH+rndX, G.HEIGHT - (G.GROUNDLEVEL+3));
  }

  update() {
    if (!this.isactive) {
      this.Activate();
      return null;
    }

    this.pos.x -= this.speed;
    if (this.pos.x < 0) {
      this.isactive = false;
    }
    this.animOffset = ticks % 20 > 10 ? 1 : 0;
    return char (addWithCharCode(this.char,this.animOffset), this.pos);
  }
    // Move from left to right with random speed

  }

// MARK: ====== More classes like trees and stuff
//======================================================================================

class tree {
  constructor() {
    this.pos = vec(0,0);
    this.char = "l";
    this.isactive = false;
    this.size = vec(1.2,2.2);
  }

  activate() {
    this.isactive = true;
    this.pos = vec(rnd(50,(G.WIDTH+50)), G.HEIGHT - G.GROUNDLEVEL-6);
  }

  update() {
    if (!this.isactive) {
      this.pos = vec(G.WIDTH+rnd(0,150), G.HEIGHT - G.GROUNDLEVEL-6);
      this.size = vec(rnd(1.0,1.4),2);//rnd(2.0,2.2));
      this.isactive = true;
      return;
    }

    this.pos.x -= 0.4*currentWorldSpeed;
    if (this.pos.x < 0) {
      this.isactive = false;
    }
    // let col = char(t.sprite,t.pos.x, t.pos.y, { scale: { x: 2, y: 3 } });
    //color("light_green");
    color("black");
    char(this.char, this.pos, { scale: this.size });
  }
}

class house {
  constructor() {
    this.pos = vec(0,0);
    this.isactive = false;
    this.myPosX = 0;
  }
  
  activate() {
    this.isactive = true;
    this.pos = vec(G.WIDTH, G.HEIGHT - 20);
  }

  update() {
    if (!this.isactive) {
      this.pos = vec(G.WIDTH+30, G.HEIGHT - 20);
      this.isactive = true;
      return;
    }
    this.pos.x -= 0.4*currentWorldSpeed;
    if (this.pos.x < -30) {
      this.isactive = false;
    }
    DrawFarmHouse(this.pos.x);
  }
}

class cloud {
  constructor() {
    this.pos = vec(0,0);
    this.isactive = false;
    this.speed = 0.4;
    this.NrOfArcs = 4;
    this.height = 5;
    this.width = 10;
    this.xMod = 0;
  }
  
  activateOld() {
    this.isactive = true;
    this.speed = rnd(0.3, 0.5);
    this.pos = vec(G.WIDTH+rnd(0,100), rnd(0, G.HEIGHT/2));
    this.NrOfArcs = rnd(2, 6);
    this.height = rnd(3, 6);
    this.width = rnd(8, 12);

    this.width*= currentDifficulty;
    this.height*= currentDifficulty;
  }

  activate(NewxMod) {
    this.xMod = NewxMod;
    this.isactive = true;
    this.speed = 0.4;//*currentWorldSpeed;
    this.pos = vec(G.WIDTH+this.xMod+rnd(0,5), rnd(10, G.HEIGHT/2));
    this.NrOfArcs = rnd(2, 6);
    this.height = 10;
    this.width = 20;    
  }

  update() {
    if (!this.isactive) {
      this.activate(this.xMod);
      return;
    }
    this.pos.x -= this.speed*currentWorldSpeed;
    if (this.pos.x < -30) {
      this.isactive = false;
    }
    drawCloud(this.pos.x, this.pos.y, this.width, this.height, this.NrOfArcs);
  }
}

let clouds = [];


// generate 6 trees
let trees = times(6, () => {
  return new tree();
});


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
let btnTreshold = 10;
let theHouse = new house();
let testTrack = [];
for (let i = 0; i < 15; i++)
  {
    testTrack.push(new cloud());
    //clouds.push(new cloud());
  }

let SantaIsDetected = true;
let presentCOLdetected = false;

//MARK: ====== Main Loop 
//======================================================================================

function update() {
  if (!ticks) {
    ResetStuff();
    SantaIsDetected = true;
    presentCOLdetected = false;

    // Ensure the canvas is created and added to the document
    //const canvas = document.querySelector('canvas');
    //const context = canvas.getContext('2d', { willReadFrequently: true });

    let i = 0;
    testTrack.forEach(cloud => {
      i++;
      cloud.activate(i*15);      
    });

    GIFTRECIVER.Activate();
    // Activate all snowflakes
    for (let i = 0; i < snowflakes.length; i++) {
      snowflakes[i].pos = vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT));
      snowflakes[i].activate();
    }

    for (let i = 0; i < trees.length; i++) {
      trees[i].activate();
    }

    //    sss.setSeed(5);
    //    sss.setVolume(0.05);
  }

  color("black")
  DrawSnowflakes();
  //  drawStars();
  santa.update();
  raindeer.update();
  trees.forEach((tree) => {
    tree.update();
  });
  
  // ========================== Draw Environments
  DrawBackground();
  
  color("black");
  char(santa.char, santa.pos);
  
  
  testTrack.forEach(cloud => {
    cloud.update();
  });
  // clouds.forEach((cloud) => {
    //   cloud.update();
    // });
    updatePresents();
    theHouse.update();
    
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

// SANTA ORIGINAL PLACEMENT

  // make temp valu for santa.pos + offsets.sledge
  let tempS = vec(santa.pos.x + offsets.sledge.x, santa.pos.y + offsets.sledge.y);
  char("b", tempS);
  let tempR = vec(santa.pos.x + offsets.reindeer.x, santa.pos.y + offsets.reindeer.y);
  //char("c", tempR);
  char(addWithCharCode(raindeer.char, raindeer.animOffset), raindeer.pos);
  // Draw a thin line petween santa and the reindeer
  color("light_black");
  line(santa.pos, tempR, 1);
  color("black");

  // if (SantaCOL.isColliding.char.e) {
  //   santa.pos.x = 0;
  //   santa.speed = 0;
  // }

  let GiftCOL = GIFTRECIVER.update();
  if (GiftCOL != null && (GiftCOL.isColliding.char.e || GiftCOL.isColliding.char.f)) {
    play("powerUp");
    HappinessMeeter += 10;
    score += 10;
  }

  //======================================= HandleMeeters
  // SantaDetectionMeeter

  SantaDetectionMeeter = clamp(SantaDetectionMeeter, -1, 100);
  HappinessMeeter = clamp(HappinessMeeter, -1, 100);
  
  DrawMeeters();
  if (SantaIsDetected) {
    SantaDetectionMeeter += 0.1;
  } else {
    SantaDetectionMeeter -= 0.01;
  }  
  if (SantaDetectionMeeter > 100) {
    SantaDetectionMeeter = 0;
  }
  HappinessMeeter -= 0.01;
  if (HappinessMeeter < 0) {
    end();
  }

  text("hej "+presentCOLdetected, 50, 100);
  SantaIsDetected = true;

  



   if (ticks % 100 == 0) {
     currentWorldSpeed += 0.1;
     currentDifficulty += 0.1;
   }

}
//========================================================== END OF MAIN LOOP ======
//MARK: ====== Draw Functions

function DrawMeeters() {
  
    color("black");
    rect(0, 0, 100, 5);
    color("green");
    rect(0, 0, SantaDetectionMeeter, 5);

    color("black");
    rect(0, 5, 100, 5);
    color("red");
    rect(0, 5, HappinessMeeter, 5);
    
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

  // First, if present is colliding with house, deactivate it
  if (presentCOLdetected) {
    presentCOLdetected = false;
    // find the present that has a Y position closest to the house, witch is at G.HEIGHT - 20
    let closest = presents.reduce((prev, curr) => {
      return (Math.abs(curr.pos.y - (G.HEIGHT - 20)) < Math.abs(prev.pos.y - (G.HEIGHT - 20)) ? curr : prev);
    });
    closest.isactive = false;    
  }

  for (let i = 0; i < presents.length; i++) {
    presents[i].update();
    if (presents[i].pos.y > G.HEIGHT) {
      presents[i].isactive = false;
    }
    if (presents[i].isactive) {
    char(presents[i].char, presents[i].pos);
    }
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

function DrawHouse(globalBGRCenterX) {
  let mod = 15;

  //    globalBGRCenterX = G.WIDTH;
  color("light_black");
  rect(globalBGRCenterX + mod - 17, G.HEIGHT - 20, 34, 20);
  //  color("red");
  rect(globalBGRCenterX + mod - 15, G.HEIGHT - 30, 30, 10);
  //  color("light_blue");
  rect(globalBGRCenterX + mod - 10, G.HEIGHT - 40, 20, 10);
  color("yellow");

  // draw windows
  rect(globalBGRCenterX + mod - 10, G.HEIGHT - 15, 5, 5);
  rect(globalBGRCenterX + mod + 5, G.HEIGHT - 15, 5, 5);
  rect(globalBGRCenterX + mod - 10, G.HEIGHT - 25, 5, 5);
  rect(globalBGRCenterX + mod + 5, G.HEIGHT - 25, 5, 5);
  color("black");

}

function DrawFarmHouse(globalBGRCenterX) {
  let mod = 15;
  let HPos = G.HEIGHT - 9;

  color("light_red");

  const scale = 0.5; // 50% scale

  let housCollision = rect(globalBGRCenterX - 17 * scale, HPos - 21 * scale, 34 * scale, 20 * scale);
  line(globalBGRCenterX - 17 * scale, HPos - 17 * scale, globalBGRCenterX, HPos - 25 * scale, 8 * scale);
  line(globalBGRCenterX + 17 * scale, HPos - 17 * scale, globalBGRCenterX, HPos - 25 * scale, 8 * scale);

  color("yellow");
  rect(globalBGRCenterX - 12 * scale, HPos - 15 * scale, 5 * scale, 5 * scale);
  rect(globalBGRCenterX + 7 * scale, HPos - 15 * scale, 5 * scale, 5 * scale);

  color("light_black");
  rect(globalBGRCenterX - 3 * scale, HPos - 10 * scale, 7 * scale, 10 * scale);

  if (housCollision.isColliding.char.e || housCollision.isColliding.char.f) {
    play("powerUp");
    HappinessMeeter += 5;
    score += 5;
    presentCOLdetected = true;
  }

}

function DrawFlappyBirdLevel(centerPosition) {

  centerPosition = G.HEIGHT*0.5;
  // dra a rect in the middle of the screen
  color("light_black");  
  rect(centerPosition, centerPosition, 20, 20);
  color("black");

}

function drawCloud(centerX, centerY, cloudWidth, cloudHeight, numArcs) {
//  const numArcs = 4; // Number of arcs to create the cloud
  const arcRadius = cloudWidth / numArcs; // Radius of each arc

  color("blue");
  for (let i = 0; i < numArcs; i++) {
    const angle = (i / (numArcs - 1)) * Math.PI; // Spread the arcs evenly in a semi-circle
    const x = centerX + Math.cos(angle) * (cloudWidth / 2);
    const y = centerY + Math.sin(angle) * (cloudHeight / 2);
    var col = arc(x, y, arcRadius, arcRadius+2, 0, 2 * Math.PI);
    if (col.isColliding.char.a) {
      SantaIsDetected = false;
    }
  }
  color("black");
}

function ResetStuff() {
  currentWorldSpeed = worldPhysics.worldSpeed;
  currentDifficulty = 1;
  SantaDetectionMeeter = 0;
  HappinessMeeter = 100;
  score = 0;

  // Reset santa position
  santa.reset();
}