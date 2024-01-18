let namespace = (function () {

title = "ZpaceMiner";

description = `Mine the good stuff, avoid the looser rocks
`;

characters = [
`
   l
  ll
 llll
llllll
ll  ll
`,`
llll
llllll
 lllll
  lll
`,`
  lll
lllll
 lllll
  lll
`,`
  lll
lllll
 lllll
  lll
`,`
  lll
lllll
  lllll
    lll
`,
`
tttttt
tttttt
tttttt
tttttt
tttttt
tttttt
`,
];

const G = {
  WIDTH: 200,
  HEIGHT: 100
};

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 1,
  theme: "dark",
};
/**
* @typedef { object } rocks - It is a rock.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
* @property { number } step - it has a step.
*/

let rocks;
let gems;

const player = {
  pos: vec(100, 50),
  speed: 1,
  sprite: "a",
  plc: null
};

function update() {
  if (!ticks) {
      setupRocks();
      setupGems();
  }
  displayRocksAndGems();
  movePlayer();
  checkCollisions();
  //displayGems();
  
  // check if player has collided with a gem
  // if (player.isColliding.rect.green) {
    //   play("coin"); 
    // }
    
    
  }
  
  let r= 0;
  let rr= 0;
function movePlayer() {
//  let r = Math.atan2(input.pos.y - player.pos.y, input.pos.x - player.pos.x);
    r = ticks % 50==0?45:0;
    rr += r;

  color("black");
  //let plc = char("a", player.pos, {rotation: r});
  let plc = char("a", player.pos, {rotation: rr, scale:{x: 2, y: 2}});
  player.pos = vec(input.pos.x, input.pos.y);
  player.plc = plc;


  // if (plc.isColliding.char.c) {
  //   remove(rocks, (r) => {
  //     return char("c", r.pos).isColliding.char.a;
  //   });
  //   play("hit");
  // }

  if (player.plc.isColliding.char.d || player.plc.isColliding.char.e) {
    gems.forEach((gem) => {
      if (char("e", gem.pos).isColliding.char.a) {
        addScore(10, gem.pos);
        gems.splice(gems.indexOf(gem), 1);
        play("coin");
      }
    });
    //play("explosion");
  };


  // if (pc == true) {
  //   particle(player, 10, 2);
  //   play("coin");
  //   console.log("player collided with cyan");
  // }
}

function checkCollisions() {
  // check if player has collided with a rock
  if (player.plc.isColliding.char.c) {
    play("hit");
  }

}



  // if (input.isJustPressed) {
  //   color("black");
  //   particle(player, 10, 2);
  // }




function setupRocks() {
  rocks = times(10, () => {
    const posX = rnd(5, G.WIDTH-5);
    const posY = rnd(5, G.HEIGHT-5);
    return {
      step: Math.floor(rnd(0, 200)),
      pos: vec(posX, posY),
      speed: rnd(-0.1, 0.1),
      sprite: rnd(1) < 0.6 ? "b" : "c"
    };
  });
}

function setupGems() {
  gems = times(10, () => {
    const posX = rnd(5, G.WIDTH-5);
    const posY = rnd(5, G.HEIGHT-5);
    return {
      step: Math.floor(rnd(0, 200)),
      pos: vec(posX, posY),
      speed: rnd(-0.1, 0.1),
      sprite: rnd(1) < 0.6 ? "d" : "e"
    };
  });
}

function displayRocksAndGems() {
  color("light_black");

  rocks.forEach((rock) => {    
    char(rock.sprite, rock.pos);
    rock.step ++;
    // every third step, move rock in opposite direction
    if (rock.step % 100 === 0) {
      rock.speed *= -1;
    }
    rock.pos.y += rock.speed;
    rock.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
  });
  color("green");
  gems.forEach((gem) => {    
    char(gem.sprite, gem.pos);
    gem.step ++;
    // every third step, move rock in opposite direction
    if (gem.step % 100 === 0) {
      gem.speed *= -1;
    }
    gem.pos.y += gem.speed;
    gem.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
  });
}

}); // namespace


// ------------------------ Saved Sprite
// title = "ZpaceMiner";
/*
`
  ll  
  ll
 llll
llllll
ll  ll
llllll
`
*/