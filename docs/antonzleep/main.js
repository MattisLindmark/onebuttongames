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
    stars = times(20, () => {
      // Random number generator function
      // rnd( min, max )
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(G.HEIGHT, G.HEIGHT);
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
        sprite: rnd(1)<0.6? "b" : "c"
      };
    });
  }

  stars.forEach((s) => {
    // Move the star downwards
    s.pos.y -= s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_green");
    if (loadingTime > 100){
      color("light_red");
    };
    char(s.sprite, s.pos);
  });


  color("blue");
  char("a", 50, 42);  

  if (input.isPressed && loadingTime < 101){
    if (loadingTime < 40){
    color("light_black");
    } else if (loadingTime < 70){
      color("green");
    } else{
      color("light_red");
    }

    text(getSovaText(), 1, 60);
    loadingTime += 1;
    box(50, 50, loadingTime, 10);
    play("hit");
  }

  if (loadingTime >= 101){
    color("black");
    text("DU HAR JU JOUR", 5, 60);

    
    color("red");
    box(50, 50, 100, 10);
    loadingTime += 1;
  }
  
  if (loadingTime == 110){
    play("explosion");
  }
  
  if (loadingTime > 170){
    color("black");
    text("for helvete", 9, 70);
    reset();
    end("");
  }
  
  if (input.isJustReleased && loadingTime < 40){
    loadingTime = 0;         
  }

  if (input.isJustReleased && loadingTime > 40 && loadingTime < 101){
    score = loadingTime;
    reset();
    play("powerUp");
    text("sovtid: "+score, 3, 70);
    end("Du vaknade!");             
  }


}

function getSovaText(){
  if (loadingTime < 50) return "sover sover sover";
  if (loadingTime < 80 ) return "sover liiite till";
  if (loadingTime < 90) return "...";
  return "";
}

function reset() {
  // Reset your variables and game state here
  loadingTime = 0;
  G.STAR_SPEED_MAX = 1.0;
  // Reset other variables as needed...
}