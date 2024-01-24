title = "EarthInvader";

description = ` Kill all humans!
`;

characters = [
  `
  ll
  ll
  ll
 llll
llllll
ll  ll
`, `

 llll 
l ll l
llllll
 llll 
ll  ll
`, `
  ll  
  ll
  ll
`
];

const G = {
  WIDTH: 90,
  HEIGHT: 110,
  ROW_HEIGHT: 8,//6
  E_START_Y: 19//15
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
  theme: "crt",
  //  theme: "dark",
};
/**
* @typedef { object } enemy - It is a rock.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
* @property { number } step - it has a step.
*/

let enemy = {
  pos: vec(G.WIDTH, G.E_START_Y),
  speed: 1,
  direction: 1,
  step: 0,
  offset: 0,
  sprite: "b",
  hp: 1,
  value: 10,
  chr: null
};
const enemies = [];

const player = {
  pos: vec(G.WIDTH / 2, G.HEIGHT - 10),
  speed: .5,
  sprite: "a",
  plc: null,
  canShoot: false
};

let timeToShoot = false;
//let shootchane = 50;
//let reloadTime = 40;
let collision = null;
let baseSpeed = 1;
let currentSpeed = baseSpeed;

let nextShotPosition = 0;
let shootingItterationCount = 0;

let debuggItterations = 0;

let laserbeam = {
  pos: vec(0, 0),
  speed: 1,
  sprite: "c",
  status: "ready",
  char: null
};
const laserBeams = [];

let inTransition = false;
let transistionFunc = null;

const CHEATMODE = false;

//======================================================= UUUPPPDDDAAATTEEE ==========================
function update() {
  if (!ticks) {
    fullReset();
    initCharacters();
  }

  if (inTransition) {
    transistionFunc();
    return;
  }

  HandleReloadState();

  color("light_green");
  rect(0, G.HEIGHT - 7, G.WIDTH, 10);
  color("black");
  //  rect(50,0,10,10);

  //test();
  handleShots();
  playerMoveAndDraw(); // <- this one also handles the random shoot position
  enemyMoveAndDraw();
  checkCollisions();

  // value from 0 to 100 that reach 100 when itterationCount == nextShotPosition
  if (player.canShoot) {
  let tmp = Math.floor((shootingItterationCount / nextShotPosition) * 10);
  bar(player.pos.x, G.HEIGHT-6, 11-tmp, 1, 0);
//  text("shoot: " + tmp , 3, 40);
// text("pl:"+enemies.length , 3, 40);
  }
}

function HandleReloadState() {

  if (!player.canShoot) {
    return;
  }

  if (shootingItterationCount < nextShotPosition) {
    shootingItterationCount++;
    return;
  }
  debuggItterations = shootingItterationCount;
  shootingItterationCount = 0;
  timeToShoot = true;
  
  /*
  if (ticks % reloadTime == 0) {
    if (rnd(0, 100) < shootchane) {
      timeToShoot = true;
    }
  }
*/
}

function NextLevel(bonuspoint = 0) {
  enemy.hp = 1;
  score += 10 + bonuspoint;
  //reloadTime -= 5;
  //shootchane += 5;
  player.speed = Math.abs(player.speed) + 0.2;
  if (player.speed > 4 || player.speed < 0) {
    player.speed = 4;
  }
  // i want playerspeed to be rounded to 2 decimals.
  player.speed = Math.round(player.speed * 100) / 100;
  console.log("player.speed: " + player.speed);
  //player.canShoot = true;

  laserBeams.forEach((laser) => {
    laser.status = "ready";
  });

  baseSpeed += 0.1;
  if (baseSpeed > 1.5) {
    baseSpeed = 1.5;
  }

//  enemy.pos = vec(G.WIDTH, 15);
//  enemy.step = 0;
//  enemy.speed += 0.2;
//  enemy.direction = 1;
//  enemy.value += 10;
}

function test() {
  laserbeam.char = char("c", 55, 5, { scale: { x: 2, y: 2 } });
}

function handleShots() {

  laserBeams.forEach((laser) => {
    if (timeToShoot && laser.status == "ready") {
      timeToShoot = false;
      player.canShoot = false;
      laser.pos = vec(player.pos.x, player.pos.y);
      play("hit");
      particle(player.pos, 10, 1);
      laser.status = "fired";
    }

    if (laser.status == "fired") {
      laser.pos.y -= laser.speed;
      laser.char = char("c", laser.pos, { scale: { x: 1, y: 0.5+difficulty } });
      if (laser.pos.y < 10) {
        play("coin", { volume: 0.4 });
        score ++;
        laser.status = "ready";
      }
    }
  });

}

function fullReset() {
  console.log("fullReset");
  resetEverything();
  score = 0;
  //reloadTime = 40;
  //shootchane = 50;
  player.speed = 0.5;
  player.canShoot = false;
  baseSpeed = 1;
  currentSpeed = baseSpeed;
}

function initCharacters() {
  console.log("initCharacters");
  enemies.length = 0;
  laserBeams.length = 0;

  enemy.chr = char("b", enemy.pos);
  player.plc = char("a", player.pos);

  let index = 0;
  times(5, () => {
    enemies.push({
      pos: vec(G.WIDTH - (index * 10), G.E_START_Y),
      speed: 1,
      direction: 1,
      step: 0,
      offset: index * 10,
      sprite: "b",
      hp: 1,
      value: 10,
      chr: char("b", vec(G.WIDTH - (index * 10), G.E_START_Y))
    });
    index++;
  }
  );

  times(10, () => {
    laserBeams.push({
      pos: vec(0, 0),
      speed: laserbeam.speed,
      sprite: "c",
      status: "ready",
      char: char("c", vec(0, 0), { scale: { x: 1, y: 2 } })
    });
  });
}

function resetEnemys() {
  let index = 0;
  enemies.forEach((enemyR) => {
    //enemyR.pos.y = G.E_START_Y;// vec(G.WIDTH - (index * 10), G.E_START_Y);
    enemyR.pos = vec(G.WIDTH - enemyR.offset, G.E_START_Y);
    enemyR.step = 0;
    enemyR.speed = 1;
    enemyR.direction = 1;
    enemyR.value = 10;
    enemyR.hp = 1;
  });
  index++;
}


function enemyMoveAndDraw() {
  enemies.forEach((enemyA) => {
    enemyA.pos.x -= ((enemyA.speed * enemyA.direction) * currentSpeed);
    if (enemyA.pos.x < 0 || enemyA.pos.x > G.WIDTH) {
      enemyA.direction *= -1;
      enemyA.step++;
      enemyA.pos.y += G.ROW_HEIGHT;
    }
    let tmp = clamp(enemyA.pos.x, 0, G.WIDTH);
    enemyA.pos.x = tmp;

    if (input.isPressed) {
      currentSpeed = .3;
    } else {
      currentSpeed = baseSpeed;
    }
    enemyA.char = char(enemyA.sprite, enemyA.pos);
  });

  /*
  if (enemy.pos.x < 0 || enemy.pos.x > G.WIDTH) {
    enemy.direction *= -1;
    enemy.step++;
    enemy.pos.y += G.ROW_HEIGHT;
    enemy.pos.x -= ((enemy.speed * enemy.direction));
  } else {
    enemy.pos.x -= ((enemy.speed * enemy.direction) * currentSpeed);
  }
  
  if (input.isPressed) {
    currentSpeed = 0.5;
  } else {
    currentSpeed = baseSpeed;
  }
  collision = char(enemy.sprite, enemy.pos);
*/

}

function checkCollisions() {
  let PlayerIsHit = false;
  enemies.forEach((enemyB) => {
    if (enemyB.char.isColliding.char.c) {
      play("explosion");
      let boom = particle(enemyB.pos, 20, .5);
      enemyB.hp--;

      let beam = laserBeams.find(laser => laser.pos.y >= enemyB.pos.y - 1 && laser.status == "fired");
      if (beam) {
        console.log("Beam hit");
        beam.status = "ready";
      }
    }

    /* Nedan tycker jag borde funka men icket.
        let beam = laserBeams.find(laser => laser.status == "fired" && laser.char.isColliding.char.b);
        if (beam) {
          console.log("Beam hit");
          beam.status = "ready";
        }
    */


    if (enemyB.char.isColliding.char.a) {
      PlayerIsHit = true;
    }

  });

  if (!CHEATMODE) {
    remove(enemies, (e) => {
      return e.hp <= 0;
    });

    if (enemies.length == 0) {
      end();
    }
  }


  /*
    laserBeams.forEach((laser) => {
      if (laser.status == "fired") {
        if (collision.isColliding.char.c) {
          particle(enemy.pos, 10, 1);
          play("explosion");
          //enemy.hp--;
          laser.status = "ready";
        }
      }
    } );
  
    if (laserbeam.status == "fired") {
      if (collision.isColliding.char.c) {
        particle(enemy.pos, 10, 1);
        play("explosion");
        enemy.hp--;
        laserbeam.status = "ready";
      }
    }
  */
  if (PlayerIsHit) {
    play("random");
    play("lucky");

    inTransition = true;

    let bonus = Math.round(enemies.length * difficulty);

    transistionFunc = () => {
      color("red");
      particle(player.pos, 10, 1);
      color("light_green");
      rect(0, G.HEIGHT - 7, G.WIDTH, 10);
      color("black");
      text("Invaders: "+enemies.length, 10, 50);
      text("Bonus: "+ bonus , 10, 60);
//      text("Dificulty"+ difficulty, 10, 70);

//            text("GAME OVER\nFOR THE HUMANS!", 30, 50);
      //  if (input.isJustPressed) {
      //  inTransition = false;
      //        resetEverything();
      //     }
    };
    setTimeout(() => { inTransition = false; NextLevel(bonus) }, 1000);
    resetEnemys();
    //resetEverything();

  }
}

function playerMoveAndDraw() {
  //player.pos.x += player.speed * (input.isPressed ? 1 : 0) * difficulty;

  // linear movement
  player.pos.x += player.speed;
  if (player.pos.x > G.WIDTH-10 || player.pos.x < 10) {
    player.speed *= -1;
    player.canShoot = true;
    calculateItterations();
  }


  //  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

  //player.pos.x = 50 + sin(ticks / 20) * 30;

  //player.pos = vec(input.pos.x, input.pos.y);
  //player.plc.pos = player.pos;

  color(player.canShoot?"red":"light_black");
  char("a", player.pos);
  color("black");
}

function calculateItterations() {
  let boundary = player.speed > 0 ? G.WIDTH - 10 : 10;
  let distance = Math.abs(player.pos.x - boundary);
  let itterations = Math.floor(distance / player.speed);

  let tmp = Math.abs(itterations);
  nextShotPosition = Math.round(rnd(2, tmp));
  debuggItterations = nextShotPosition;
//  console.log("nextShotPosition: " + nextShotPosition);
  //itterations = 0;

//  reloadTime = itterations;
//  console.log("reloadTime: " + reloadTime);
  //console.log("itterations: " + itterations);

}

function resetEverything() {
  // enemy.hp = 1;
  // enemy.pos = vec(G.WIDTH, 15);
  // enemy.step = 0;
  // enemy.speed = 1;
  // enemy.value = 10;

  // XXX TODO: remove?
  player.pos = vec(G.WIDTH / 2, G.HEIGHT - 10);
  player.speed = player.speed;
  laserbeam.status = "ready";
  resetEnemys();

}

/*
function enemyMoveAndDraw() {
  
  
  if (enemy.pos.x < 0 || enemy.pos.x > G.WIDTH) {
    enemy.direction *= -1;
    enemy.step++;
    enemy.pos.y += G.ROW_HEIGHT;
    enemy.pos.x -= ((enemy.speed * enemy.direction));
  } else {
    enemy.pos.x -= ((enemy.speed * enemy.direction) * currentSpeed);
  }
  
  if (input.isPressed) {
    currentSpeed = 0.5;
  } else {
    currentSpeed = baseSpeed;
  }
  collision = char(enemy.sprite, enemy.pos);


}


// is in rect excempel, funkar nästan.
let beam = laserBeams.find(laser => laser.pos.isInRect(enemyB.pos.x, enemyB.pos.y, 20, 20) && laser.status == "fired");
      if (beam) {
        console.log("Beam hit");
        beam.status = "ready";
      }
*/