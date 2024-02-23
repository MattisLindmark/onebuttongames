title = "Jump The Goat";

description = `
`;

characters = [
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
`,
`
  rr
  rr
 gggg
 g  gg
 g    g 
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT }
};

/**
* @typedef { object } Junk - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
* @property { string } sprite - The sprite of this object
*/
let junk;
let timer = 0;
let player;
let movementdirection = false;
let movespeed = 0.1;
//let speed = 1;

function update() {
  if (!ticks) {
      junk = times(20, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
        sprite: rnd(1)<0.6? "a" : "b"
      };
    });
    player = { 
      pos: vec(50, 50)
    };

  }

  movePlayer();
  
  junk.forEach((s) => {
    s.pos.y += s.speed;
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    color("light_green");
    //text("1", s.pos);
//    box(s.pos, 1);    
    char(s.sprite, s.pos);
  });

}

function movePlayer(){
  if (input.isJustPressed) {
    movementdirection = !movementdirection;
  }
  if (input.isPressed) {
    movespeed += 0.01;
  }
  if (input.isJustReleased) {
     movespeed = 0.7;
  }
  
  if (movementdirection)
    player.pos.x += movespeed*movespeed;
  else
    player.pos.x -= movespeed*movespeed;

    player.pos.clamp(0, G.WIDTH, 0, G.HEIGHT);
  //color("black");
  char("c", player.pos);
}

function reset() {
  // Reset your variables and game state here
  loadingTime = 0;
  G.STAR_SPEED_MAX = 1.0;
  // Reset other variables as needed...
}