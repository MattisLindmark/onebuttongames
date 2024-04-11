//title = "DJBH-Ninja";

//description = ` DoubleJumping\n BurgerHunting\n Ninja
//`;

characters = [
  ` 
  lll
  lyY
  lll
  l
 l l
 l ll
  `,
  ` 
  lll
  lyY
  lll
  l
  l 
  ll
  `,
  `
  yyy
 yyyyy
 lllll
 yyyyy
 `, `  
  l
 llll
   l   
`,
  ` 
    yl
 l yl
  l r
   lr
    l
   l l  
  `,
  ` 
    yl
   yl
    r
llllr
    l
    l  
  `,`  
 ll
llll
lllll
llllll
 llll
  ll
`
];

const G = {
  WIDTH: 80,
  HEIGHT: 80,
};
options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  theme: "simple",
};

const GroundLevel = G.HEIGHT - 10;

let player = {
  pos: vec(G.WIDTH / 3, 40),
  speed: 1,
  grounded: false,
  isHit: false,
  health: 5,
  healthMax: 5
}

const middleZone = G.HEIGHT / 2;
const highZone = G.HEIGHT / 4;

let jumps = 1;
const maxJumps = 5;


const GRAVITY = 0.1;
let JUMPFORCE = 2;
let plForce = 0;

let enemies = [];
let foods = [];
let plc = "a";
let samurais = [];
let maxSamurais = 1;

let starRotation = 0;
let groundTimer = 0;

let topItem_base = {
  pos: vec(0, 0),
  speed: 1,
  char: "c",
  isActive: false
}
class TopItem {
  constructor() {
    this.pos = vec(0, 0);
    this.speed = .2;
    this.char = "c";
    this.isActive = false;    
  }
}
let bigBurger = new TopItem();
let deathCloud = new TopItem();
bigBurger.char = "c";
deathCloud.char = "g";


// TODO:
/*
- BigBurger and DeathClowd
- Slide funciton
- add birds

*/








let animOffsett = 0;


function update() {
  if (!ticks) {
    sss.setVolume(0.001);
    setupPools();
  }

  animOffsett = ticks % 20 > 10 ? 1 : 0;


  // MARK: - Main Loop Player Movement
  text("jump: " + jumps, 3, 8);
  color("light_black");
  rect(0, GroundLevel + 3, G.WIDTH, 10);
  color("black");
  //text("Diff: " + difficulty, 3, G.HEIGHT - 3);

  // draw a rect that is full width when jumps is maxjumps and empty when jumps is 0
  let jumpBarWidth = (jumps / maxJumps) * G.WIDTH;
  rect(0, G.HEIGHT - 2, jumpBarWidth, 2);
  // draw a rect that is full width when health is maxHealth and empty when health is 0
  let healthBarWidth = (player.health / player.healthMax) * G.WIDTH;
  rect(0, G.HEIGHT - 4, healthBarWidth, 2);


  // move enemies
  enemies.forEach((e) => {
    e.pos.x -= e.speed;
    if (e.pos.x < 0) {
      e.pos.y = rnd(5, middleZone);
      e.pos.x = 100;
    }
  });

  // move food
  foods.forEach((f) => {
    f.pos.x -= f.speed;
    if (f.pos.x < 0) {
      f.pos.y = rnd(highZone, middleZone);
      f.pos.x = 100;
    }
  });

  // draw enemies
  if (ticks % 5 === 0) {
    starRotation -= 1;
  }
  enemies.forEach((e) => {
    char("d", e.pos, { rotation: starRotation });
  });

  groundTimer = player.grounded ? groundTimer + 1 : 0;
  playerMovement();

// MARK: === Spawners ===

  if (groundTimer % 120 === 0 && player.grounded) {
    spawnSamurai();
    if (jumps < 1)
      jumps = 1; // NOTE: För att ej hamna i en loop där man aldrig hinner ladda upp jumps. Se över detta.
  }

  if (ticks % 180 === 0) {
     item = rndi(0, 2)? deathCloud : bigBurger; // 33% chans för moln?
     if (item.isActive) {
       return;
     }
     item.isActive = true;
     item.pos.x = G.WIDTH + 5;
     item.pos.y = rnd(3, 8);
        
  }

//  moveAndDrawItems();

  moveAndDrawSamurai();
  if (groundTimer % 30 === 0 && player.grounded) {
    jumps++;
  }
  // draw player
  if (player.grounded && ticks % 10 === 0) {
    plc = plc === "a" ? "b" : "a";
  }

  let col = char(plc, player.pos);

  moveAndDrawItems(); // due to collission detection.

  if (col.isColliding.char.d && !player.isHit) {
    color("red");
    particle(player.pos);
    color("black");
    play("hit");
    player.health--;
    //score --;
    player.isHit = true;
    plForce = -2;
    jumps = 0;
  }


  // MARK: - Draw food
  // draw food     
  foods.forEach((f) => {
    color("black");
    let fcol = char("c", f.pos);
    if (fcol.isColliding.char.a || fcol.isColliding.char.b) {
      particle(f.pos);
      f.pos.x = -120;
      play("coin");
      player.health++;
      plForce += .5;
      if (!player.isHit) jumps++;
      score++;
    }
  });

  if (player.health < 0) {
    end();
  }
  if (player.health > player.healthMax) {
    player.health = player.healthMax;
  }
  text("+ " + player.health, 30, 3);

  if (jumps > maxJumps) {
    jumps = maxJumps;
  }
  if (jumps < 0) {
    jumps = 0;
  }

}



















function moveAndDrawItems() {
  if (bigBurger.isActive) {
    bigBurger.pos.x -= bigBurger.speed + difficulty * 0.2;
    if (bigBurger.pos.x < -5) {
      bigBurger.isActive = false;
    }
    //color("green");
    let col = char(bigBurger.char, bigBurger.pos, {scale:{x:2, y:2}});

    if (col.isColliding.char.a || col.isColliding.char.b) {
      particle(bigBurger.pos);
      bigBurger.isActive = false;
      player.health += 2;
      //plForce += 1;
      jumps++;
      score += 4;
      play("powerUp");
    }
  }

  if (deathCloud.isActive) {
    deathCloud.pos.x -= deathCloud.speed + difficulty * 0.2;
    if (deathCloud.pos.x < -5) {
      deathCloud.isActive = false;
    }
    color("red");
    let col = char(deathCloud.char, deathCloud.pos,{scale:{x:2, y:1}});

    if (col.isColliding.char.a || col.isColliding.char.b) {
      particle(deathCloud.pos);
      deathCloud.isActive = false;
      end();
      play("explosion");
    }
  }
  color("black");
}


function moveAndDrawSamurai() {
  samurais.forEach((s) => {
    if (s.isActive) {
      s.pos.x -= s.speed + difficulty * 0.2;
      if (s.pos.x < 0) {
        s.isActive = false;
      }
      //        char (addWithCharCode("e",offset), vec(10, 30));
      color("black");
      char(addWithCharCode("e", animOffsett), s.pos);
    }
  });
}

function spawnSamurai() {
  // find a samurai that is not active
  let samurai = samurais.find((s) => !s.isActive);
  if (samurai === undefined) {
    return;
  }
  samurai.isActive = true;
  samurai.pos.x = G.WIDTH + 5;
}

function playerMovement() {
  plForce -= GRAVITY;

  // if (input.isPressed) {
  //   plForce ++;
  // }
  if (input.isJustPressed && jumps > 0) {
    plForce = JUMPFORCE;
    player.grounded = false;
    jumps--;
  }
  player.pos.y -= plForce;

  // warp player pos
  //player.pos.wrap(0, 100, 0, 100);

  if (player.pos.y > GroundLevel) {
    player.pos.y = GroundLevel;
    player.grounded = true;
    player.isHit = false;
    plForce = 0;
  }
}


// MARK: - Setup functions
function setupPools() {
  enemies = [];
  for (let i = 0; i < 3; i++) {
    enemies.push({
      pos: vec(rnd(0, 100), rnd(0, 100)),
      speed: rnd(0.5, .8)
    });
  }

  foods = [];
  for (let i = 0; i < 3; i++) {
    foods.push({
      pos: vec(rnd(0, 100), rnd(0, 100)),
      speed: rnd(0.5, 1)
    });
  }



  samurais = [];
  // pool with 3 samurais
  for (let i = 0; i < 3; i++) {
    let newSamurai = {
      pos: vec(G.WIDTH + 5, GroundLevel),
      speed: .5,
      isActive: false
    }
    samurais.push(newSamurai);
  }

}
/*
skräp
    if (plForce > 5) {
    plForce = 5;
  }
  if (plForce < -2) {
    plForce = -2;
  }
*/