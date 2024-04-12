title = "DJBH-Ninja";

description = ` DoubleJumping\n BurgerHunting\n Ninja
`;

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
`,`  
   l
 lllll
llllll
 llll
`
];

const G = {
  WIDTH: 80,
  HEIGHT: 80,
};
options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  theme: "simple",
  isCapturing: true,
  captureCanvasScale: 2,
  isCapturingGameCanvasOnly: true
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

let HUNGER = 100;
//let hungerValue = 1;

const middleZone = G.HEIGHT / 2;
const highZone = G.HEIGHT / 4;

let jumps = 3;
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
let airTimer = 0;
const airTimerMax = 120;
let airCounter = 0;

let AChighscore = 0;

let spawnrate = 60;
let spawnTimer = 0;

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
let smallCloud = new TopItem();
bigBurger.char = "c";
deathCloud.char = "g";
smallCloud.char = "h";

let steps = G.WIDTH / 10;

// TODO:
/*
- BigBurger and DeathClowd
- Skippa random speed. Add global speed
- sätta burgare och sånd spawna i steg. Bort med så många % som möjligt.?
- Slide funciton
- add birds

*/








let animOffsett = 0;


function update() {
  if (!ticks) {    
    sss.setVolume(0.01);
    // airCounter = 0;
    // airTimer = 0;
    // groundTimer = 0;
    // HUNGER = 100;
    // AChighscore = 0;

    resetSomeStuff();

    setupPools();
  }
  
  // // for loop of 10
  // for (let i = 0; i < 10; i++) {
  //   color("light_black");
  //   text ("|",i*steps, 40);
  // }


  animOffsett = ticks % 20 > 10 ? 1 : 0;
  
  if (ticks % 15 === 0) {
    HUNGER -= difficulty;
    if (HUNGER < 0) {
      end();
    }
  }

  if (ticks % 5 === 0) {
    starRotation -= 1;
  }
  
//  text("gt: " + groundTimer, 3, 13);

  // MARK: - Main Loop Player Movement
 // text("jump: " + jumps, 3, 8);
  color("light_black");
  rect(0, GroundLevel + 3, G.WIDTH, 10);
  color("black");
  //text("Diff: " + difficulty, 3, G.HEIGHT - 3);
  
 
  drawJumpBar();

  if (HUNGER > 100) HUNGER = 100;

  let hungerBarWidth = (HUNGER / 100) * G.WIDTH;
  color("black");
  if (HUNGER < 35) color("red");
  rect(0, G.HEIGHT - 3, hungerBarWidth, 2);
  char("c",hungerBarWidth, G.HEIGHT - 2);//, {scale: {x: .5, y: .5}});
  
  // draw a rect that is full width when health is maxHealth and empty when health is 0
 // let healthBarWidth = (player.health / player.healthMax) * G.WIDTH;
 // rect(0, G.HEIGHT - 4, healthBarWidth, 2);

//  drawHungerMeeter();
  drawAirTime();
  

  // move and draw enemies
  enemies.forEach((e) => {
    e.pos.x -= e.speed;
    if (e.pos.x < 0) {
      e.pos.y = rnd(5, middleZone);
      e.pos.x = 100;
    }
    char("d", e.pos, { rotation: starRotation });
  });

  // Player
  playerMovement();
  if (player.grounded && ticks % 10 === 0) {
    plc = plc === "a" ? "b" : "a";
  }

  let col = char(plc, player.pos);
// end of player



  // move and draw food an check collissions with player.
  foods.forEach((f) => {
    f.pos.x -= f.speed;
    if (f.pos.x < 0) {
      f.pos.y = rnd(highZone, middleZone);
      f.pos.x = G.WIDTH + 10;
      f.isActive = false;
    } else {
      if (f.isActive)
        drawFood(f);
    }
  });


// MARK: === Spawners ===
  spawnTimer --;
  if (spawnTimer < 0) {
    spawnTimer = spawnrate;
    for (let i = 0; i < foods.length; i++) {
      let f = foods[i];
      if (!f.isActive) {
        f.isActive = true;
        f.pos.x = G.WIDTH + rndi(1,3)*steps;
        f.pos.y = rnd(highZone, middleZone);
        f.speed = rnd(0.5, 1);
        break;    
      }
    }

  }


  if (groundTimer % 120 === 0 && player.grounded) {
    spawnSamurai();
    if (jumps < 1)
      jumps = 1; // NOTE: För att ej hamna i en loop där man aldrig hinner ladda upp jumps. Se över detta.
  }

  if (ticks % 180 === 0) {
     item = rndi(0, 2)? deathCloud : bigBurger; // 33% chans för moln?
     if (!item.isActive) {     
       item.isActive = true;
       item.pos.x = G.WIDTH + 5;
       item.pos.y = rnd(3, 8);        
      }
  }
//MARK: - Clouds XXXXXXXXXXXXXXXXXXX
  if (ticks % 250 === 0 && !smallCloud.isActive){
    let r = rnd(0,10);
    console.log(r);
    if (r>5 && !smallCloud.isActive){
      console.log("Spawn small cloud");
      smallCloud.isActive = true;
      smallCloud.pos.x = G.WIDTH + 5;
      smallCloud.pos.y = rndi(1,7)*10;//rnd(10, 16);
      smallCloud.speed = rnd(0.4,.9);
    }
  }

//  moveAndDrawItems();

  moveAndDrawSamurai();
  if (groundTimer % 30 === 0 && player.grounded) {
    jumps++;
  }

  moveAndDrawItems(); // due to collission detection.

  if (col.isColliding.char.d && !player.isHit) {
    color("red");
    particle(player.pos);
    color("black");
    play("hit");
    HUNGER --;
    //player.health--;
    //score --;
    player.isHit = true;
    plForce = -2;
    jumps = 0;
  }


  // MARK: - Draw food

  if (jumps > maxJumps) {
    jumps = maxJumps;
  }
  if (jumps < 0) {
    jumps = 0;
  }

  // Debugg
  // input the mouse position
 // text("x: " + input.pos.x + " y: " + input.pos.y, input.pos.x, input.pos.y);

 //MARK: TIMERS

  groundTimer = player.grounded ? groundTimer + 1 : 0;
  airTimer = player.grounded ?  0 : airTimer + 1;
  if (player.grounded && airCounter > 0){
    if (airCounter > AChighscore) {
      AChighscore = airCounter;
    }
    airCounter = 0;
  } 
  
  if (airTimer > airTimerMax) {
    airCounter++;
    play("powerUp");
    color("purple");
    particle(4,25);
//    text(""+airCounter*2, 10, 25);
    score += 2*airCounter;
    airTimer = 0;
  }
  if (airCounter > 0) {
    color ("blue")
    text ("X"+airCounter, 5, 35);
  }
  if (AChighscore > 0) {
    color ("light_blue")
    text (""+AChighscore, 3, 10);
  }

}


// ================== Functions ==================




function resetSomeStuff(){
  player.pos = vec(G.WIDTH / 3, middleZone+10);
  player.speed = 1;
  player.grounded = false;
  player.isHit = false;
  player.health = 5;
  player.healthMax = 5
  HUNGER = 100;
  jumps = 2;  
  JUMPFORCE = 2;
  plForce = 0;
  starRotation = 0;
  groundTimer = 0;
  airTimer = 0;
  airCounter = 0;
  AChighscore = 0;
  spawnrate = 60;
  spawnTimer = 0;

  bigBurger.isActive = false;
  deathCloud.isActive = false;
  smallCloud.isActive = false;

}




function drawHungerMeeter() {

  // hunger meeter is a bar at the right of the screen. It is half the height of the screen. It goes up and down. Full upp is 100 and full down is 0
  //rect(G.WIDTH - 3, G.HEIGHT / 2 - hungerBarHeight, 3, hungerBarHeight);
  // same but left of screen
  // rect(0, G.HEIGHT / 2 - hungerBarHeight, 3, hungerBarHeight);
  // Using bar() draw hunger as a meeter, like a speed meeter in a car.
  // Hunger 0 should give rotation value of 0 and hunger 100 should give rotation value of pi.
  //let rotation = (HUNGER / 100) * Math.PI;
  
  //let hungerBarHeight = (HUNGER / 100) * G.HEIGHT / 2;
  let hungerBarHeight = (HUNGER / 100) * 20;
  color ("light_black");
  rect(1,26, 5, 21);
    if (HUNGER> 45) color("light_green");
    else color ("red");

  rect (2, 46, 3, hungerBarHeight*-1);
//  bar(7, 33, hungerBarHeight, 3, 1.57,1);

//  text("H "+HUNGER, 3, 40);
  color("black");
}

function drawJumpBar() {
  let sectionWidth = G.WIDTH / maxJumps;
  for (let i = 0; i < maxJumps; i++) {
    if (i < jumps) {
      color("light_green");
    } else {
      color("light_blue");
    }
    rect(i * sectionWidth, G.HEIGHT - 6, sectionWidth, 2);
  }
//  let jumpBarWidth = (jumps / maxJumps) * G.WIDTH;
//  rect(0, G.HEIGHT - 6, jumpBarWidth, 2);
}

function drawAirTime() {

  if (airTimer < 1) {
    color ("light_blue");
    rect(1,26, 5, 21);
    color("black");
    return;
  }

  let airTimerBarHeight = (airTimer / airTimerMax) * 20;
  color ("purple");
  rect(1,26, 5, 21);
  color("light_cyan");
  rect (2, 46, 3, airTimerBarHeight*-1);
  color("black");
    
}

function degreesToRadians(degrees) {
  return (degrees / 180) * Math.PI;
}

function drawFood(f) {
 // foods.forEach((f) => {
    color("black");
    let fcol = char("c", f.pos);
    if (fcol.isColliding.char.a || fcol.isColliding.char.b) {
      particle(f.pos);
      f.pos.x = -120;
      play("coin");
//      player.health++;
      plForce += .5;
      if (!player.isHit) jumps++;
      score++;
      if (HUNGER < 30){HUNGER += 5;}
      HUNGER += 10;
    }
 // });
}






//MARK: ITEMPS

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
      jumps = maxJumps;
      score += 4;
      HUNGER += 40;
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
//      deathCloud.isActive = false;
      HUNGER -= 10;
      play("explosion");
    }
  }
  
  if (smallCloud.isActive){    
    smallCloud.pos.x -= smallCloud.speed;
    let y = smallCloud.pos.y + Math.sin(ticks*0.1)*2;
    
    if (smallCloud.pos.x < -5) {
      smallCloud.isActive = false;
      //      smallCloud.speed = rnd (0.2,1);
    } 
    color("red");
    let col = char(smallCloud.char,smallCloud.pos.x,y);//,smallCloud.pos.x,smallCloud.pos.y);
    if (col.isColliding.char.a || col.isColliding.char.b) {
      color("red");
      particle(smallCloud.pos);
      smallCloud.isActive = false;
      HUNGER -= 15;
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
      let col = char(addWithCharCode("e", animOffsett), s.pos);

      if (col.isColliding.char.a || col.isColliding.char.b) {
        color("red");
        particle(s.pos);
           play("explosion");
        HUNGER -=5;
        color("black");
      }

    }
  });
}

function spawnSamurai() {
  // find a samurai that is not active
  let samurai = samurais.find((s) => !s.isActive);
  if (samurai === undefined) {
    //console.log("No samurai available");
    return;
  }
  samurai.isActive = true;
  samurai.pos.x = G.WIDTH + rndi(1, 3) * steps;
}

function playerMovement() {
  plForce -= GRAVITY;

  // if (input.isPressed) {
  //   plForce ++;
  // }
  if (input.isJustPressed && jumps > 0 && ticks > 10) {
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
    if (jumps < 1)
      jumps = 1;
  }
}


// MARK: - Setup functions
function setupPools() {
  enemies = [];
  for (let i = 0; i < 3; i++) {
    enemies.push({
      pos: vec(rnd(0, 100), rnd(middleZone, highZone)),
      speed: .5,//rnd(0.5, .8)
      isActive: false
    });
  }

  foods = [];
  for (let i = 0; i < 3; i++) {
    foods.push({
      pos: vec(i*(steps*3), rnd(middleZone,highZone)),//vec(rndi(0,10)*steps,rnd(middleZone,highZone)),//vec(rnd(0, 100), rnd(0, 100)),
      speed: .5,
      isActive: false//rnd(0.5, 1)
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

  ---

    // hunger meeter is circular. Draw with an arc that is full when hunger is 100 and empty when hunger is 0
  let hungerArc = degreesToRadians((HUNGER / 100) * 360);
  color("light_black");
  arc(40, 40, 2, 3,360);
  color("green");
  arc(40, 40, 5, 5,0, hungerArc);
  color("black");


  // Här följer funktionerna för mätare som timers, men det blev inte så najs.

  function drawHungerMeeter() {

  // hunger meeter is a bar at the right of the screen. It is half the height of the screen. It goes up and down. Full upp is 100 and full down is 0
  // let hungerBarHeight = (HUNGER / 100) * G.HEIGHT / 2;
  //rect(G.WIDTH - 3, G.HEIGHT / 2 - hungerBarHeight, 3, hungerBarHeight);
  // same but left of screen
  // rect(0, G.HEIGHT / 2 - hungerBarHeight, 3, hungerBarHeight);
  // Using bar() draw hunger as a meeter, like a speed meeter in a car.
  // Hunger 0 should give rotation value of 0 and hunger 100 should give rotation value of pi.
  let rotation = (HUNGER / 100) * Math.PI;
  color ("light_black");
  rect(4, 43, 12, 8);
    if (HUNGER> 45) color("light_green");
    else color ("red");
  bar(10, 50, 5, 1, rotation,1);
  text("H "+HUNGER, 3, 40);
  color("black");
}

function drawAirTime() {

  let rotation = (airTimer / 120) * Math.PI;
  color("light_black");
  rect(44, 43, 12, 8);
  if (airTimer > 45) color("light_green");
  else color("red");
  bar(50, 50, 5, 1, rotation, 1);
  text("A " + airTimer, 3, 40);
  color("black");

}
  
*/