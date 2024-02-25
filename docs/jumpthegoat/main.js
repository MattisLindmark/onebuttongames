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
   ll
  l ll
l   l
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
`,`
    l
 l ll
Llllll


`,
`

 l
Llllll
   ll
    l
`

];

const G = {
  WIDTH: 110,
  HEIGHT: 90,
  ANIMAL_SPEED_MAX: 1,
  ANIMAL_SPEED_MIN: .5
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  //theme: "crt"
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


const animalSpeed = 0.8;
const maxJumpForce = 4;

let cJumpForce = 0.0;
let gravity = 0.1;
let groundPlaneY = G.HEIGHT/2+38;

let animals = [];
let player = {
  pos: vec(20, groundPlaneY-3),
  jumpforce: 0.0,
  isJumping: false
};

let spawnBird = false;
let bird;

let debuggrnd = 0;
function update() {
  if (!ticks) {
    setup();
  }
  
  // if (ticks % 10 == 0) {
  //   debuggrnd = rnd(-10,-250);
  // }
  // debuggrnd -= animalSpeed;
  // char("e", debuggrnd, 30);
  // return;

  drawEnviroment();  
  movePlayer();
  moveAnimals();

  if (spawnBird) {
    spawnBird = false;
    bird = {
      pos: vec(G.WIDTH, rnd(0, G.HEIGHT/2)),
      speed: 1
    };
  }

  if (bird) {
    if (player.isJumping) {
    bird.pos.x -= bird.speed;
  }
  if (bird.pos.x < 0) {
    bird = null;
  } else {
      let birdChar = ticks % 20 < 10 ? "g" : "h";
        if (char(birdChar, bird.pos).isColliding.char.b) {
          play("hit");
          score = score - 5;
          bird = null;
          cJumpForce = 0;
        }
    }
  }

  if (ticks % 100 == 0 && !bird) {
    spawnBird = true;
  }

  // debugg informatio
  // text("score: " + score, 3, 10);
   text("sb: " + scorebonus, 3, 14);

}

function setup(){
  let spriteset = ["c", "e", "f"];
  animals = times(6, () => {
    const posX = rnd(30, G.WIDTH);
    const posY = rnd(0, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, groundPlaneY-2),
      speed: rnd(G.ANIMAL_SPEED_MIN, G.ANIMAL_SPEED_MAX),
      sprite: spriteset[rndi(0, spriteset.length)],
      isGoat: false
    };
  });
  animals[0].isGoat = true;
  animals[0].sprite = "d";
  animals[1].isGoat = true;
  animals[1].sprite = "d";
  animals[2].isGoat = true;
  animals[2].sprite = "d";

// reset some stuff
spawnBird = true;

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
      s.pos.x -= s.speed;// animalSpeed;//s.speed;
      //      s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
      if (s.pos.x < 0) {
        console.log("-- "+s.pos.x+" --");
        s.pos.x = G.WIDTH + rnd(3, 50);
        console.log("NEW -- "+s.pos.x+" --");

//        console.log("-- "+s.pos.x+" --");

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
      if (cJumpForce < 0.1) {
        isCharColliding = true;
      }
    }

    if (isCharColliding) {

    if (col.isColliding.char.a || col.isColliding.char.b) {
      particle(s.pos);
      if (s.isGoat) {
        play("powerUp");
        if (!hasBeenGrounded) {
          scorebonus ++;
        } else {
          scorebonus = 0;
        }
        
        score = score +1+ scorebonus;
        cJumpForce = maxJumpForce;
        player.isJumping = true;
        isGoatJump = true;
        hasBeenGrounded = false;
        color("yellow");
      } else {
        score --;
        play("explosion");
        color("red");
      }
      particle(s.pos);
//      s.pos.x = rndi(-10,-250);
        s.pos.x = G.WIDTH + rnd(3, 50);
    } else {
//      s.pos.x = rndi(-10,-250);
//        s.pos.x = G.WIDTH + rnd(3, 50);
    }
  } else {
    //console.log("no char collision");
  }
  });

}

let jumpForceBar = 0;
let hasBeenGrounded = false;
let isGoatJump = false;
let scorebonus = 0;

function movePlayer(){
   // console.log(player.pos.y);
    // a green bar that shows current jump force;

    if (!player.isJumping || isGoatJump)
    {
      isGoatJump = false;
      jumpForceBar = clamp(cJumpForce * 20, 1, 100);
    }else{
//      jumpForceBar = 80+cJumpForce - player.pos.y;
      jumpForceBar -= 1;
    }

    color("green");  
    rect(15, G.HEIGHT-5, jumpForceBar, 1);
    //text(""+cJumpForce, 3, G.HEIGHT/2+10);
//    text("ply: " + player.pos.y, 3, G.HEIGHT/2+14);
    color("black");
  
  if (player.isJumping) {

    player.pos.y -= cJumpForce;
    cJumpForce -= gravity;

    if (input.isJustPressed) {
      cJumpForce -= 5; // var -2
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
    cJumpForce += 0.05;
    if (cJumpForce > maxJumpForce) {
      cJumpForce = maxJumpForce;
    }
  }

  if (input.isJustReleased) {
    player.isJumping = true;
    hasBeenGrounded = true;
  }
  char("a", player.pos);//.isColliding.rect.light_green;

}

function reset() {

}