//title = "ZpaceMiner";

//description = `Mine the good stuff, avoid the looser rocks
//`;

characters = [
  `
   l
  ll
 llll
llllll
ll  ll
`, `
llll
llllll
 lllll
  lll
`, `
  lll
lllll
 lllll
  lll
`, `
  lll
lllll
 lllll
  lll
`, `
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
`, `
  ll  
  ll
  ll
  ll
  ll
llllll
`,  `
llllll
llllll
llllll
llllll
llllll
`, `
l




l
`, 

];

const G = {
  WIDTH: 200,
  HEIGHT: 100
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
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

let TMP;// = generateMaze(21,31);


function update() {
  if (!ticks) {
    setupRocks();
    setupGems();
    TMP = generateMaze(21,11);

  }

//  drawMaze(TMP, 5);
  drawMaze(TMP, 12);
  displayRocksAndGems();
  movePlayer();
  checkCollisions();
  //displayGems();

  // check if player has collided with a gem
  // if (player.isColliding.rect.green) {
  //   play("coin"); 
  // }


}

function mapCharRotationToBar(charRotation) {
  switch(charRotation) {
    case 0: return 11; // Up
    case 1: return 0;  // Right
    case 2: return 33; // Down
    case 3: return 22; // Left
    default: return 0; // Default to right
  }
}


let r = 0;
let rr = -1;
//let tmp = 0;
let rotDir = 0;
function movePlayer() {
  //  let r = Math.atan2(input.pos.y - player.pos.y, input.pos.x - player.pos.x);
  r = rotDir;//ticks % 100 == 0 ? 1:0;//45 : 0;
  rr += r;
  rr = rr % 4;

  if (input.isJustReleased) {
    rotDir = 1;
  } else {
    rotDir = 0;
  }

  color("black");
  let plc = char("a", player.pos, { rotation: rr, scale: { x: 2, y: 2 } }); // 0 up. 1= right, 2= down, 3= left
  bar(player.pos, 40, 1,mapCharRotationToBar(rr),0.2); // 0=right, 11=up, 22=Left, 33=down

  calculatePlayerPosition();

  player.plc = plc;


  if (player.plc.isColliding.char.d || player.plc.isColliding.char.e) {
    gems.forEach((gem) => {
      if (char("e", gem.pos).isColliding.char.a) {
        addScore(10, gem.pos);
        gems.splice(gems.indexOf(gem), 1);
        play("coin");
      }
    });
  };

}

function checkCollisions() {
  // check if player has collided with a rock
  if (player.plc.isColliding.char.c) {
    play("hit");
  }
}

let thrust = 0;
let damping = 0.98;
let forceDirection = vec(0, 0);
//let acceleration = 0.1;

function calculatePlayerPosition() {
  if (input.isPressed) {
    damping = 0.94;
    thrust += 0.005;
     forceDirection.y += rr == 0 ? -thrust : rr == 2 ? thrust : 0;
     forceDirection.x += rr == 1 ? thrust : rr == 3 ? -thrust : 0;
  } else {
    damping = 0.98;
    thrust = 0;
  }

  thrust *= damping;
  // adjust force direction by dampening
  forceDirection.mul(damping);
  // update player position

  player.pos.x += forceDirection.x;
  player.pos.y += forceDirection.y;
  text("thr: " + thrust, 10, 20);


 // player.pos.add(forceDirection);
  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

  let plFrwd = vec(1, 0).rotate(rr);
  /* First version
  console.log("plFrwd: " + plFrwd.angle);   
  player.pos.add(plFrwd.mul(thrust));
  player.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
*/

  color("red");
  text("rr: " + rr, 10, 10);
}



// if (input.isJustPressed) {
//   color("black");
//   particle(player, 10, 2);
// }




function drawMaze(maze, cellSize) {
  // Iterate over each row in the maze
  for (let y = 0; y < maze.length; y++) {
    // Iterate over each cell in the row
    for (let x = 0; x < maze[y].length; x++) {
      // If the cell is a wall, draw a box at its position
      if (maze[y][x] === 1) {
        color("black");
        box(x * cellSize, y * cellSize, cellSize);
      }
    }
  }
}


function drawMazeMoreRoom(maze, cellSize) {
  // Iterate over each row in the maze
  for (let y = 0; y < maze.length; y++) {
    // Iterate over each cell in the row
    for (let x = 0; x < maze[y].length; x++) {
      // Draw a larger box for the empty cells
      if (maze[y][x] === 0) {
        color("white");
        box(x * cellSize * 2, y * cellSize * 2, cellSize * 2);
      }
      // Draw a smaller box for the walls on top of it
      if (maze[y][x] === 1) {
        color("black");
        box(x * cellSize * 2, y * cellSize * 2, cellSize);
      }
    }
  }
}


function drawMazeChar(maze, cellSize) {
  // Iterate over each row in the maze
  for (let y = 0; y < maze.length; y++) {
    // Iterate over each cell in the row
    for (let x = 0; x < maze[y].length; x++) {
      // If the cell is a wall, draw a 'a' at its position
      if (maze[y][x] === 1) {
        char("h", x * cellSize, y * cellSize);
      } else {
        // If the cell is a path, draw a 'g' at its position
        char("i", x * cellSize, y * cellSize);
      }
    }
  }
}




let maze2 = [
  [0, 0, 200, 0],
  [0, 0, 0, 100],
  [200, 0, 200, 100],
  [0, 100, 200, 100]
];

function drawMaze_Old() {
  // generate a maze of lines with random length and rotation
  // there should be enought space for the player to move around
  // add lines inside the maze

  color("black");
  //maze = TMP;
  maze2.forEach((cord) => {
    line(cord[0], cord[1], cord[2], cord[3]);
  });
  
}


function setupRocks() {
  rocks = times(10, () => {
    const posX = rnd(5, G.WIDTH - 5);
    const posY = rnd(5, G.HEIGHT - 5);
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
    const posX = rnd(5, G.WIDTH - 5);
    const posY = rnd(5, G.HEIGHT - 5);
    return {
      step: Math.floor(rnd(0, 200)),
      pos: vec(posX, posY),
      speed: rnd(-0.1, 0.1),
      sprite: rnd(1) < 0.6 ? "d" : "e"
    };
  });
}

function generateMaze(width, height) {
  // Create a 2D array filled with 1s
  let maze = new Array(height).fill(0).map(() => new Array(width).fill(1));

  // Define the starting coordinates
  let startX = 1;
  let startY = 1;

  // Create a stack for the cells to visit
  let stack = [[startX, startY]];

  while (stack.length > 0) {
    let [x, y] = stack.pop();

    // Mark the current cell as visited (set to 0)
    maze[y][x] = 0;

    // Define the directions that can be moved to
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // Shuffle the directions
    directions.sort(() => Math.random() - 0.5);

    for (let [dx, dy] of directions) {
      // Determine the next cell
      let nextX = x + dx * 2;
      let nextY = y + dy * 2;

      if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && maze[nextY][nextX] === 1) {
        // If the next cell is a wall, carve a path through to it
        maze[y + dy][x + dx] = 0;
        maze[nextY][nextX] = 0;  // Carve a path in the next cell

        // Add the next cell to the stack
        stack.push([nextX, nextY]);
      }
    }
  }

  return maze;
}








function displayRocksAndGems() {
  color("light_black");

  rocks.forEach((rock) => {
    char(rock.sprite, rock.pos);
    rock.step++;
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
    gem.step++;
    // every third step, move rock in opposite direction
    if (gem.step % 100 === 0) {
      gem.speed *= -1;
    }
    gem.pos.y += gem.speed;
    gem.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
  });
}


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