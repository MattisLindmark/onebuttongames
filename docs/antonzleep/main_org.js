title = "Anton zleep";

description = `
`;

characters = [
  `
    rr
llllll
l    l

`,
  `  
  lllll
     l
    l
   l
  lllll
`,
`
yyyy
y 
 y
  y
yyyy
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 100,
  STAR_SPEED_MIN: 0.5,
  STAR_SPEED_MAX: 1.0,
  STAR_SPRITE: "b"

};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT }
};

/**
* @typedef { object } Star - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
*/
let stars;
let loadingTime = 0;


function update() {
  if (!ticks) {
    // A CrispGameLib function
    // First argument (number): number of times to run the second argument
    // Second argument (function): a function that returns an object. This
    // object is then added to an array. This array will eventually be
    // returned as output of the times() function.
    zsymbol = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(G.HEIGHT, G.HEIGHT);
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        speed: rnd(G.Z_SPEED, G.Z_SPEED_MAX),
        sprite: rnd(1)<0.6? "b" : "c"
      };
    });
  }

  zsymbol.forEach((s) => {
    // Move the star downwards
    s.pos.y -= s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_green");
    if (sleepTime > 100){
      color("light_red");
    };
    char(s.sprite, s.pos);
  });


  color("blue");
  char("a", 50, 42);  

  if (input.isPressed && sleepTime < 101){
    if (sleepTime < 40){
    color("light_black");
    } else if (sleepTime < 70){
      color("green");
    } else{
      color("light_red");
    }

    text(getSovaText(), 1, 60);
    sleepTime += 1;
    box(50, 50, sleepTime, 10);
    play("hit");
  }

  if (sleepTime >= 101){
    color("black");
    text("DU HAR JU JOUR", 5, 60);

    
    color("red");
    box(50, 50, 100, 10);
    sleepTime += 1;
  }
  
  if (sleepTime == 110){
    play("explosion");
  }
  
  if (sleepTime > 170){
    color("black");
    text("for helvete", 9, 70);
    reset();
    end("");
  }
  
  if (input.isJustReleased && sleepTime < 40){
    sleepTime = 0;         
  }

  if (input.isJustReleased && sleepTime > 40 && sleepTime < 101){
    score = sleepTime;
    reset();
    play("powerUp");
    text("sovtid: "+score, 3, 70);
    end("Du vaknade!");             
  }


}

function getSovaText(){
  if (sleepTime < 50) return "sover sover sover";
  if (sleepTime < 80 ) return "sover liiite till";
  if (sleepTime < 90) return "...";
  return "";
}

function reset() {
  // Reset your variables and game state here
  sleepTime = 0;
  G.Z_SPEED_MAX = 1.0;
  // Reset other variables as needed...
}