 title = " Jump The Goat";

 description = `a turn based\n goatjumper
 `;

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
   gg
  g gg
l   g
lllll
l   l

`,`
   CCCC
   CC
llll
l  l
`,
`
y y y
l l l
llllll
l   l
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
`,`

 r r
rrrrr
rrrrr
 rrr
  r
`,`
   lyl
   ly
   yl
ylyly
lylyl
l   l
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 90,
  ANIMAL_SPEED_MAX: 1,
  ANIMAL_SPEED_MIN: 1
};

let C_ANIMAL_SPEED_MAX = 1;
let C_ANIMAL_SPEED_MIN = 1;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  //theme: "crt"
  //  isCapturing: true,
  //  isCapturingGameCanvasOnly: true,
  //  captureCanvasScale: 2
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

let leveldata = {
  newgame: true,
  level: 1,
  score: 0,
  energy: 3,
  life: 3,
  nrOfGoats: 3,
  nrOfAnimals: 8
};
let GLOBAL_goatCount = leveldata.nrOfGoats;


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

let life = leveldata.life;
let energy = leveldata.energy;
let playtime = 0;
let combo = 0;
let hiCombo = 0;

let displayHiCombo = 0;

let debuggrnd = 0;

let FIRSTFRAME = true;
let CHEATMODE = false;

function update() {
  if (!ticks) {
    setup();
  }
  
if (FIRSTFRAME) {
  if (input.isJustReleased) {
    FIRSTFRAME = false;
  }
  drawEnviroment();
  return;
}

  // if (ticks % 10 == 0) {
  //   debuggrnd = rnd(-10,-250);
  // }
  // debuggrnd -= animalSpeed;
  // char("e", debuggrnd, 30);
  // return;

  if (life < 1 && !CHEATMODE) {
    if (combo > hiCombo) {
      hiCombo = combo;
    }
    end();
  }

  
  for (let i = 0; i < life; i++) {
    char("i", 38+(i*8), 7);
  }
  // char("i", 40, 4);
  // char("i", 48, 4);
  // char("i", 56, 4);
  
  if (player.isJumping) {
    playtime++;
  }
  
if (GLOBAL_goatCount < 2) { // Lazy fix, when only one goat is left that one does not go to slow.
  for (let i = 0; i < animals.length; i++) {
    if (animals[i].isGoat) {
      if (animals[i].speed < 0.9) {
        animals[i].speed = 1;
      }
    }
  }
}

  // if (input.isJustPressed) {
    //   energy --;
    // }
    // if (isGoatJump) {
      //   energy += 2;
      //   if (energy > 5) {
        //     energy = 5;}
        // }
        
        
        drawEnviroment();
        movePlayer();
        moveAnimals();
        
        if (spawnBird) {
          spawnBird = false;
          bird = {
            pos: vec(G.WIDTH, rnd(5, G.HEIGHT/2)),
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
              score --;
              energy --;
              bird = null;
              cJumpForce = 0;
            }
          }
        }

       // text("pt" + playtime, 3, G.HEIGHT-5);
        
        if (playtime % 600 == 0) {
          score += leveldata.level;
          leveldata.level ++;
          play("random");
          C_ANIMAL_SPEED_MAX += 0.2;
          C_ANIMAL_SPEED_MIN -= 0.1;
                   // Limit MIN to 0.5 at the lowest. And MAX to 2 at the highest
          if (C_ANIMAL_SPEED_MIN < 0.5) {
            C_ANIMAL_SPEED_MIN = 0.5;
          }
          if (C_ANIMAL_SPEED_MAX > 1.6) {
            C_ANIMAL_SPEED_MAX = 1.6;
          }
          if (leveldata.level > 2) {
           checkAndRemoveGoat(); // if more than one goat is left, this will set one of them to turn next time it is out of game.
          }
        }

// Debugg        text("l:" + leveldata.level+" - "+C_ANIMAL_SPEED_MAX+" - "+C_ANIMAL_SPEED_MIN, 3, 16);
        color("light_black");
        text("" + leveldata.level, G.WIDTH/2-20, 9, {scale: {x: 2, y: 2}});
        color("black");
        text("" +combo, 3, 9,{scale: {x: 1, y: 1}});
        if (displayHiCombo>9) {       
        text("HC " +displayHiCombo, G.WIDTH-31,9,{scale: {x: 1, y: 1}});
        } else {
        text("HC " +displayHiCombo, G.WIDTH-25,9,{scale: {x: 1, y: 1}});
        }


        if (playtime % 200 == 0 && !bird) {
          let chance = leveldata.level *2;
          if (chance > 9) {
            chance = 9;
          }
          if (rndi(0, 10) < chance) {
            spawnBird = true;
          }
        }
        
        if (energy < 0 && !player.isJumping && !CHEATMODE) {
          player.isJumping = false;
          player.jumpforce = 0;
          if (combo > hiCombo) {
            hiCombo = combo;
          }
          end("out of energy!");
        }
        // debugg informatio
        // text("score: " + score, 3, 10);
//        text("E: " + energy, 3, 14);
        // draw a bar that shows the current energy
        color("light_black");
        rect(38, 12, 18, 2);
        
        let energyBar = energy*6;
        color("yellow");
        if (energy == 0) {
          color("red");
          energyBar = 3;
        } else if (energy < 0) {
          energyBar = 0;
        }
        rect(38, 12, energyBar, 2);
        color("black");      
      }
      

      function setup(){
        displayHiCombo = hiCombo;
        C_ANIMAL_SPEED_MAX = G.ANIMAL_SPEED_MAX;
        C_ANIMAL_SPEED_MIN = G.ANIMAL_SPEED_MIN;

        let spriteset = ["c", "e", "f","j"];
        //  let spriteset = ["j"];
        let i = 0;
        animals = times(leveldata.nrOfAnimals-leveldata.nrOfGoats, () => {
          i++;
          const posX = rnd(30, G.WIDTH);
          //const posY = rnd(0, G.HEIGHT);
    // make a variable that loops thorugh the spriteset
    // so that the sprites are not random
    
    let cSprite = spriteset[i%spriteset.length];
    let h = 2;
    if (cSprite == "j") {
      h = 3;
    }

    return {
      pos: vec(posX, groundPlaneY-h),
      speed: rnd(C_ANIMAL_SPEED_MIN, C_ANIMAL_SPEED_MAX),      
      sprite: cSprite,//spriteset[rndi(0, spriteset.length)],
      isGoat: false,
      turnToJ: false
    };
  });

  // add new goats to animals array
  let goats = times(leveldata.nrOfGoats, () => {
    const posX = rnd(30, G.WIDTH);
    //const posY = rnd(0, G.HEIGHT);
    return {
      // Creates a Vector
      pos: vec(posX, groundPlaneY-2),
      speed: rnd(C_ANIMAL_SPEED_MIN, C_ANIMAL_SPEED_MAX),      
      sprite: "d",
      isGoat: true,
      turnToJ: false
    };
  });

  // put goats in the front of the array
  animals = goats.concat(animals);
  // move the animals with sprite J to the front of the array
  let j = 0;
  for (let i = 0; i < animals.length; i++) {
    if (animals[i].sprite == "j") {
      let temp = animals[i];
      animals[i] = animals[j];
      animals[j] = temp;
      j++;
    }
  }






  /*
  animals[0].isGoat = true;
  animals[0].sprite = "d";
  animals[1].isGoat = true;
  animals[1].sprite = "d";
  animals[2].isGoat = true;
  animals[2].sprite = "d";
  */

// reset some stuff
spawnBird = false;
life = leveldata.life;
playtime = 0;
playtime ++;
energy = leveldata.energy;
jumpForceBar = 0;
cJumpForce = 0;
player.isJumping = false;
player.pos = vec(20, groundPlaneY-3);
score = 0;
FIRSTFRAME = true;
leveldata.level = 1;
GLOBAL_goatCount = leveldata.nrOfGoats;
scorebonus = 0;
combo = 0;

/*
let jumpForceBar = 0;
let hasBeenGrounded = false;
let isGoatJump = false;
let scorebonus = 0;
let combo = 0;
*/
}

function checkAndRemoveGoat() {
  if (GLOBAL_goatCount < 2) {
    return;
  }

  let goats = 0;
  for (let i = 0; i < animals.length; i++) {
    if (animals[i].isGoat && !animals[i].turnToJ) {
      goats ++;
    }
  }
  GLOBAL_goatCount = goats;
  //console.log("goats: "+goats);
  if (goats > 1) {
    // get the first goat and turn it into a j
    for (let i = 0; i < animals.length; i++) {
      if (animals[i].isGoat && animals[i].turnToJ == false) {
        animals[i].turnToJ = true;
//        console.log("turning goat to J");
        break;
      }
    }
  }  
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
//        console.log("-- "+s.pos.x+" --");
        s.pos.x = G.WIDTH + rnd(3, 120);
//        console.log("NEW -- "+s.pos.x+" --");
        s.speed = rnd(C_ANIMAL_SPEED_MIN, C_ANIMAL_SPEED_MAX);

        if (s.turnToJ) {
          s.sprite = "j";
          s.turnToJ = false;
          s.isGoat = false;
          s.pos.y = groundPlaneY-3;
        }

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
  let lifeLimiter = life; // We will limit lifeloss to 1 per frame  

  animals.forEach((s) => {    
    if (s.turnToJ) {
      color("green");
    }else{ color("black");}
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

        if (scorebonus+1 > combo) {
          combo = scorebonus+1;
        }


        score = score +1+ scorebonus;
        if (scorebonus == 4) {
          play("coin");
          life ++;
          if (life > leveldata.life) {
            life = leveldata.life;
          }

        //  console.log("life bonus");
        }
        cJumpForce = maxJumpForce;
        player.isJumping = true;
        isGoatJump = true;
        energy ++;
        if (energy > leveldata.energy) {
          energy = leveldata.energy;
        }
        hasBeenGrounded = false;
        color("yellow");
      } else {
        score --;
        play("explosion");
        life --;
        color("red");
      }
      particle(s.pos);
      color("black");
      s.pos.x = -10;
//        s.pos.x = G.WIDTH + rnd(3, 50);
    }
  } else {
    //console.log("no char collision");
  }
  });

  if (life < lifeLimiter-1) {
    life = lifeLimiter-1;
  }

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
    energy --;
    hasBeenGrounded = true;
  }
  char("a", player.pos);//.isColliding.rect.light_green;

}

function reset() {

}