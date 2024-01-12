title = "Docker Hell";

description = `
`;

characters = [
  `
llllll
l    l
l    l
llllll 
  ll
llllll
`,
  `
      
  ll  
   l
   l
   l

`,
`

  ll  
 l  l
 l  l
 l  l
  ll

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
      const posY = rnd(0, G.HEIGHT);
      return {
        // Creates a Vector
        pos: vec(posX, posY),
        speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX),
        sprite: rnd(1)<0.6? "b" : "c"
      };
    });
    text("you looose!", 25, 70);
  }

  stars.forEach((s) => {
    // Move the star downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    // Choose a color to draw
    color("light_green");
    if (loadingTime > 100){
      color("light_red");
    };
    // Draw the star as a square of size 1    
    //text("1", s.pos);
//    box(s.pos, 1);    
    char(s.sprite, s.pos);
  });


  color("blue");
  char("a", 50, 42);  

  if (input.isPressed && loadingTime < 100){
    color("light_black");
    text("installing docker", 1, 60);
    loadingTime += 1;
    box(50, 50, loadingTime, 10);
    play("laser");
  }

  if (loadingTime >= 100){
    score = -100;
    color("black");
    text("docker installed", 5, 60);
    
    color("red");
    box(50, 50, 100, 10);
    loadingTime += 1;
  }
  
  if (input.isJustReleased && loadingTime < 100){
    loadingTime = 0;           
  }
  if (loadingTime == 110){
    play("explosion");
  }
  if (loadingTime > 120){
    color("black");
    text("you looose!", 25, 70);
    reset();
    end("");
  }

}

function reset() {
  // Reset your variables and game state here
  loadingTime = 0;
  G.STAR_SPEED_MAX = 1.0;
  // Reset other variables as needed...
}