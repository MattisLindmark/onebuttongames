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
  ROW_HEIGHT: 6
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
  pos: vec(G.WIDTH, 15),
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
  speed: .3,
  sprite: "a",
  plc: null
};

let timeToShoot = false;
let shootchane = 50;
let reloadTime = 40;
let collision = null;
let baseSpeed = 1;
let currentSpeed = baseSpeed;

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

//======================================================= UUUPPPDDDAAATTEEE ==========================
function update() {
  if (!ticks) {
    initCharacters();
  }

  if (inTransition) {
    transistionFunc();
    return;
  }

  if (ticks % reloadTime == 0) {
    reloadTime = Math.floor(rnd(6, 17))*10;
    console.log(reloadTime);
    timeToShoot = true;//rnd(0, 100) < shootchane ? true : false;
  }

  color("light_green");
  rect(0, G.HEIGHT - 7, G.WIDTH, 10);
  color("black");
  //  rect(50,0,10,10);

  //test();
  handleShots();
  playerMoveAndDraw();
  enemyMoveAndDraw();
  checkCollisions();
  checkGameConditions();

}

function checkGameConditions() {
  if (enemy.hp <= 0) {
    score += 1;// enemy.value;
    NextLevel();
  }
}

function NextLevel() {
  enemy.hp = 1;
  enemy.pos = vec(G.WIDTH, 15);
  enemy.step = 0;
  enemy.speed += 0.2;
  enemy.direction = 1;
  enemy.value += 10;
}

function test() {
  laserbeam.char = char("c", 55, 5, { scale: { x: 2, y: 2 } });
}

function handleShots() {

  laserBeams.forEach((laser) => {
    if (timeToShoot && laser.status == "ready") {
      timeToShoot = false;
      laser.pos = vec(player.pos.x, player.pos.y);
      play("hit");
      particle(player.pos, 10, 1);
      laser.status = "fired";
    }

    if (laser.status == "fired") {
      laser.pos.y -= laser.speed;
      laser.char = char("c", laser.pos, { scale: { x: 1, y: 2} });
      if (laser.pos.y < 10) {
        laser.status = "ready";
      }
    }
  });


  // if (timeToShoot == true && laserbeam.status == "ready") {
  //   timeToShoot = false;
  //   laserbeam.pos = vec(player.pos.x, player.pos.y);
  //   play("hit");
  //   particle(player.pos, 10, 1);
  //   laserbeam.status = "fired";
  // }

  // if (laserbeam.status == "fired") {
  //   laserbeam.pos.y -= laserbeam.speed;
  //   char("c", laserbeam.pos, { scale: { x: 1, y: 2 } });
  //   if (laserbeam.pos.y < 10) {
  //     laserbeam.status = "ready";
  //   }
  // }

}


function initCharacters() {
  enemies.length = 0;
  laserBeams.length = 0;

  enemy.chr = char("b", enemy.pos);
  player.plc = char("a", player.pos);

  let index = 0;
  times(5, () => {    
    enemies.push({
      pos: vec(G.WIDTH-(index*10), 15),
      speed: 1,
      direction: 1,
      step: 0,
      offset: index*10,
      sprite: "b",
      hp: 1,
      value: 10,
      chr: char("b", vec(G.WIDTH-(index*10), 15))   
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
      enemyR.pos = vec(G.WIDTH-(index*10), 15);
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
    let tmp = clamp(enemyA.pos.x,0,G.WIDTH);
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

      let beam = laserBeams.find(laser => laser.pos.y >= enemyB.pos.y-1 && laser.status == "fired");
      if (beam) {
        console.log("Beam hit");
        beam.status = "ready";
      }
//      laserbeam.status = "ready";
    }

/* Nedan tycker jag borde funka men icket.
    let beam = laserBeams.find(laser => laser.status == "fired" && laser.char.isColliding.char.b);
    if (beam) {
      console.log("Beam hit");
      beam.status = "ready";
    }
*/

    
    remove(enemies, (e) => {
      return e.hp <= 0;
    });

    if (enemies.length == 0) {
      end();
    }

    if (enemyB.char.isColliding.char.a) {
      PlayerIsHit = true;
    }

  });
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
    enemy.hp = 0;

    inTransition = true;
    transistionFunc = () => {
      color("red");
      particle(player.pos, 10, 1);
      //      text("GAME OVER\nFOR THE HUMANS!", 30, 50);
      //  if (input.isJustPressed) {
      //  inTransition = false;
      //        resetEverything();
      //     }
    };
    setTimeout(() => { inTransition = false; NextLevel() }, 1000);
    resetEverything();        
    
  }
}

function playerMoveAndDraw() {
  //player.pos.x += player.speed * (input.isPressed ? 1 : 0) * difficulty;

// linear movement
  player.pos.x += player.speed;
  if (player.pos.x > G.WIDTH || player.pos.x < 0) {
    player.speed *= -1;
  }


//  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

  //player.pos.x = 50 + sin(ticks / 20) * 30;

  //player.pos = vec(input.pos.x, input.pos.y);
  //player.plc.pos = player.pos;

  char("a", player.pos);
}

function resetEverything() {
  // enemy.hp = 1;
  // enemy.pos = vec(G.WIDTH, 15);
  // enemy.step = 0;
  // enemy.speed = 1;
  // enemy.value = 10;
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