title = "ZpaceInvader";

description = ` They just\n sent one?
`;

characters = [
`
  ll
  ll
  ll
 llll
llllll
ll  ll
`,`

 llll 
l ll l
llllll
 llll 
ll  ll
`,`
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
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 2,
  theme: "dark",
};
/**
* @typedef { object } enemy - It is a rock.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
* @property { number } step - it has a step.
*/

let enemy = {
  pos: vec(G.WIDTH,15),
  speed: 1,
  direction: 1,
  step: 0,
  sprite: "b",
  hp: 1,
  value: 10,
  chr: null
};

const player = {
  pos: vec(G.WIDTH/2, G.HEIGHT - 10),
  speed: 1,
  sprite: "a",
  plc: null
};

let collision = null;

let laserbeam = {
  pos: vec(0,0),
  speed: 2,
  sprite: "c",
  status: "ready",
  char: null  
};

function update() {
  if (!ticks) {
    initCharacters();     
  }

  color("light_green");
  rect(0,G.HEIGHT-7,G.WIDTH,10);
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
  enemy.pos = vec(G.WIDTH,15);
  enemy.step = 0;
  enemy.speed += 0.2;
  enemy.direction = 1; 
  enemy.value += 10;

}

function test() {
  laserbeam.char = char("c", 55, 5, {scale:{x:2, y:2}});
}

function handleShots() {

  if (input.isJustPressed && laserbeam.status == "ready") {
    laserbeam.pos = vec(player.pos.x, player.pos.y);
    play("hit");
    particle(player.pos, 10, 1);
    laserbeam.status = "fired";
  }

  if (laserbeam.status == "fired") {
    laserbeam.pos.y -= laserbeam.speed;
    char("c", laserbeam.pos, {scale:{x:1, y:2}});
    if (laserbeam.pos.y < 10) {
      laserbeam.status = "ready";
    }
  }
  
}


function initCharacters() {
  enemy.chr = char("b", enemy.pos);
  player.plc = char("a", player.pos);
}

function enemyMoveAndDraw() {
  
  if (enemy.pos.x < 0 || enemy.pos.x > G.WIDTH) {
    enemy.direction *= -1;
    enemy.step++;
    enemy.pos.y += G.ROW_HEIGHT;
  }
  enemy.pos.x -= (enemy.speed*enemy.direction);
//  enemy.chr.pos = enemy.pos;
  collision = char(enemy.sprite, enemy.pos);
//  enemy.chr.draw();  
}

function checkCollisions() {

  // if (collision.isColliding.rect.black) {
  //  particle(enemy.pos, 10, 1);
  //   play("powerUp");
  // }

  if (laserbeam.status == "fired") {
    if (collision.isColliding.char.c) {
      particle(enemy.pos, 10, 1);
      play("explosion");
      enemy.hp--;
      laserbeam.status = "ready";
    }
  }

  if (collision.isColliding.char.a) {
    play("random");
    resetEverything();
    end();
  }
}

function playerMoveAndDraw() {
  //player.pos.x += player.speed * (input.isPressed ? 1 : 0) * difficulty;
  //player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    player.pos.x = 50 + sin(ticks/15)*20;
   
  //player.pos = vec(input.pos.x, input.pos.y);
  //player.plc.pos = player.pos;

  char("a", player.pos);
}

function resetEverything() {
  enemy.hp = 1;
  enemy.pos = vec(G.WIDTH,15);
  enemy.step = 0;
  enemy.speed = 1;
  enemy.value = 10;
  player.pos = vec(G.WIDTH/2, G.HEIGHT - 10);
  player.speed = 1;
  laserbeam.status = "ready";
}

