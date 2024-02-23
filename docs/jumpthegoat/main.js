// title = "Jump The Goat";

// description = `
// `;

characters = [
  `
  rr
  rr
 gggg
 ggg g
 g g
 g g
`,
`
 rr
 rr
ggggg
 ggg
 g g
g   g
`,
  `
    ll
lllll
l   l
`,
  `
    l l
     ll
lllll
l   l
`,  `
   rrrr
   rr
llll
l  l
`,
`
 y y y
l l l
llllll
l  l l
`

];

const G = {
  WIDTH: 110,
  HEIGHT: 90,
  ANIMAL_SPEED_MAX: 1,
  ANIMAL_SPEED_MIN: .5
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT }
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  //theme: "shape",
  //    isCapturing: true,
  //  isCapturingGameCanvasOnly: true,
  //  captureCanvasScale: .2
};


/**
* @typedef { object } Animal - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
* @property { string } sprite - The sprite of this object
*@property { boolean } isGoat - If this object is a goat
* @property { boolean } isActive - The timer for the goat to jump
*/
/**
* @typedef { object } PlayerTemplate - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } jumpforce - The downwards floating speed of this object
* @property { string } sprite - The sprite of this object
*@property { boolean } isJumping
*/

let animals = [];
let player = {
  pos: vec(20, 50),
  jumpforce: 0.0,
  isJumping: false
};

const animalSpeed = 0.8;
const maxJumpForce = 3;

let cJumpForce = 0.0;
let gravity = 0.1;
let groundPlaneY = G.HEIGHT/2+8;


function update() {
  if (!ticks) {
    setup();
  }
  
//  moveJunk();
  drawEnviroment();  
  movePlayer();
  moveAnimals();

}

function setup(){
  let spriteset = ["c", "e", "f"];
  animals = times(5, () => {
    const posX = rnd(30, G.WIDTH);
    const posY = rnd(0, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, 50),
      speed: rnd(G.ANIMAL_SPEED_MIN, G.ANIMAL_SPEED_MAX),
      sprite: spriteset[rndi(0, spriteset.length)],
      isGoat: false
    };
  });
  animals[0].isGoat = true;
  animals[0].sprite = "d";
  animals[1].isGoat = true;
  animals[1].sprite = "d";
  


  // player = { 
  //   pos: vec(20, 50)
  // };
}

function drawEnviroment() {
    color("light_green");
    // rect middle screen over hwole width
    rect(0, groundPlaneY, G.WIDTH, 5);
    color("black");
  }

function moveAnimals() {
  if (player.isJumping) {
    animals.forEach((s) => {
      s.pos.x -= animalSpeed;//s.speed;
      //      s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
      if (s.pos.x < 0) {
        s.pos.x = G.WIDTH + rnd(3, 50);

        /* check if any animal is within 5 pixels of another // <---------------------------------------- TODO fix this check better.
        for (let i = 0; i < animals.length; i++) {
          for (let j = 0; j < animals.length; j++) {
            if (i != j) {
              if (animals[i].pos.distanceTo(animals[j].pos) < 8) {
                animals[i].pos.x = -10;
              }
            }
          }
        }
*/

      }
    });
  }
  animals.forEach((s) => {    
    let col = char(s.sprite, s.pos, {mirror: {x: -1, y: 1}});
    // check if collission is between any sprite
    let isCharColliding = false;
    if (col.isColliding.char.a || col.isColliding.char.b || col.isColliding.char.c || col.isColliding.char.d || col.isColliding.char.e || col.isColliding.char.f) {
      isCharColliding = true;
    }

    if (isCharColliding) {

    if (col.isColliding.char.a || col.isColliding.char.b) {
      particle(s.pos);
      if (s.isGoat) {
        play("powerUp");
        score ++;
        cJumpForce = maxJumpForce;
        player.isJumping = true;
      } else {
        score --;
        play("explosion");
      }
      particle(s.pos);
      s.pos.x = rnd(-10,-250);
    } else {
      s.pos.x = rndi(-10,-250);
    }


  } else {
    //console.log("no char collision");
  }
  });

}

function movePlayer(){
    console.log(player.pos.y);
    // a green bar that shows current jump force
    color("green");
    let jumpForceBar = clamp(cJumpForce*20, 1, 100);
    rect(5, G.HEIGHT/2+10, jumpForceBar, 1);
   // text(""+cJumpForce, 3, G.HEIGHT/2+12);
    color("black");
  
  if (player.isJumping) {
    player.pos.y -= cJumpForce;
    cJumpForce -= gravity;

    if (input.isJustPressed) {
      cJumpForce -= 2;
    }
    
    if (player.pos.y > groundPlaneY-3) {
      player.pos.y = groundPlaneY-3;
      player.isJumping = false;
      cJumpForce = 0;
    }
    char("b", player.pos);
    return;
  }

  if (input.isJustPressed) {
    cJumpForce = 0.1;
  }

  if (input.isPressed) {
    cJumpForce += 0.1;
    if (cJumpForce > maxJumpForce) {
      cJumpForce = maxJumpForce;
    }
  }

  if (input.isJustReleased) {
    player.isJumping = true;
  }
  char("a", player.pos);
}

function reset() {

}