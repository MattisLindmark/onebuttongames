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
  LL
  L Lr
`

];

const G = {
  WIDTH: 110,
  HEIGHT: 90,
};

const worldPhysics = {
  gravity: .1,
  jump: -2,
  maxSpeed: .5, 
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
    //this.speed *= 0.9;
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
    this.char = "d";
    this.isactive = false;
  }
  
  activate() {
    this.fallspeed = 0;
    this.isactive = true;
  }

  update() {
    if (!this.isactive) {
      // leave the function
      return;
    }
    // this should fall down
    this.fallspeed += .05;
    this.fallspeed *= 0.9;
    this.fallspeed = clamp(this.fallspeed, -2, 2);
    this.pos.y += this.fallspeed;
  }
}

//======== Variables
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
//MARK: ======== Main Loop
function update() {
  if (!ticks) {
//    sss.setSeed(5);
//    sss.setVolume(0.05);
  }
  santa.update();
  raindeer.update();
  updatePresents();

  
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
}



function DropAPresent() {
  for (let i = 0; i < presents.length; i++) {
    if (!presents[i].isactive) {
      presents[i].pos = vec(santa.pos.x + offsets.dropzone.x, santa.pos.y + offsets.dropzone.y);
      presents[i].activate();
      play("powerUp");
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
