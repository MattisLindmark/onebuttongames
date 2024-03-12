//title = "  Stack\n The\n  Heap";

description = `
`;

characters = [
  `
llllll
llllll
llllll
llllll
llllll
llllll
`,
  `
l    l
 l  l
  ll   
`,`
   l
llll
   l
  l
  l
 l
`,`
ll
l  
l
l  
l l
 l
`
];

const G = {
  WIDTH: 130,
  HEIGHT: 150,
  SPEED: 2
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "crt",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
};

/*
* @typedef { object } player - It is a dude.
* @property { Vector } pos - it has a pos.
* @property { number } speed - it has a speed/direction
*/



let cutpos = vec(50, 50);


let fullLength = 64;// G.WIDTH - 50;

const memoryStartPos = vec(G.WIDTH / 2 - fullLength / 2, G.HEIGHT - 25);
let memory = {
  pos: vec(memoryStartPos.x, memoryStartPos.y),
  length: fullLength,
  height: 8,
};

let block_template = {
  pos: vec(G.WIDTH + fullLength, 10),
  length: fullLength,
  height: 8,
  speed: 0,
  isEnter: true
};

let separatedBlock = null;

let currentBlock;
let stack = [];

let levelData_template = {
  stackSize: 0,
  degradationRate: 1,
  speed: G.SPEED,
  rndY: [10, 18, 14, 20, 16, 13, 19, 15, 17, 12]
};

let matrixRain = [];

let levelData;

let dropBlock = false;

const colors = ["red", "blue", "green", "yellow", "purple", "cyan", "black", "light_black"];

//========================================================= MAIN LOOP =========================================================

function update() {
  if (!ticks) {
    console.log("FullLenth: " + fullLength);
    console.log("MemoryStartPos: " + memoryStartPos);
    setup();
    //testCalculateScore();
  }

  text("spd: " + levelData.speed, 3, 10);
//  text("StackSize: " + stack.length, 3, 20);

  // text("Ticks: " + ticks, 3, 10);

  // text topp middle of screen
  text("" + currentBlock.length + "KB", G.WIDTH / 2 - 10, 3);
  text("" + stack.length+"stk", G.WIDTH / 2 - 10, 10);
  color("black");
  //drawMatrix();
  handleMovement();
  CheckStackHeight();
  drawStack();
  drawCurrentBlock();
  drawMemoryBase();

  if (separatedBlock != null) {
    color("red");
    rect(separatedBlock.pos, separatedBlock.length, 8);
    separatedBlock.pos.y += separatedBlock.speed;
    separatedBlock.speed += 0.1;
    color("black");
  }
  

}
let rndYindex = 0;
function setup() {
  rndYindex = 0;
  memory.pos = vec(memoryStartPos.x, memoryStartPos.y);
  stack = [{ pos: vec(memory.pos.x, memory.pos.y), length: memory.length, height: memory.height }];
  
  //  copy block_template to currentBlock;
  levelData = { ...levelData_template };
  newCurrentBlock(fullLength);
  /*
  currentBlock = deepCopy(block_template);
  currentBlock.speed = levelData.speed;
  currentBlock.isEnter = true;
  currentBlock.speed = levelData.speed;
  currentBlock.speed *= -1;
  */
 // stack.push({pos: vec(10, 10), length: 50, height: 8});
 
 times(10, () => {
   matrixRain.push({ pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)), speed: rnd(0.5, 1.5) });
  });
  
}

function drawMatrix() {
  let index = 0;
  matrixRain.forEach((rain) => {
    rain.pos.y += rain.speed;
    if (rain.pos.y > G.HEIGHT) {
      rain.pos.y = rnd(0, -20);
    }
    color("light_green");
    let c = index % 2 == 0 ? "c" : "d";
    char(c, rain.pos, { scale: { x: 1, y: 1 } });
//    text(tmp, rain.pos, { scale: { x: .5, y: 2 } });
    color("black");
    index++;
  });
}

function rndLetter() {
  let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[rndi(0, letters.length)];
}


function newCurrentBlock(lentgh = -1) {

  // round the leveldata to 2 decimals
  levelData.speed = Math.round(levelData.speed * 100) / 100;

  currentBlock = deepCopy(block_template);
  if (lentgh > 0) {
    currentBlock.length = lentgh;
  }
  currentBlock.speed = levelData.speed;//+rnd(-0.5, 0.5);
  currentBlock.speed *= -1;
  currentBlock.isEnter = true;
  currentBlock.pos.y = levelData.rndY[rndYindex%levelData.rndY.length];
  rndYindex++;

}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function CheckStackHeight() {
  // if the last block is possisioned abow screenheight/2
  // move all blocks pos.y down by 1
  if (stack.length < 4) {
    return;
  }

  let topBlock = stack[stack.length - 1];
  if (topBlock.pos.y < G.HEIGHT / 2) {
    stack.forEach((block) => {
      block.pos.y += 1;
    });
  }

  memory.pos.y = stack[0].pos.y;
}






let dropSpeed = 0.1;
function handleMovement() {
  if (input.isJustPressed && currentBlock.pos.x < G.WIDTH && !dropBlock) {
    dropSpeed = 0.1;
    dropBlock = true;
    // snap current block in x to closest full value
    let x = currentBlock.pos.x;
    x = Math.floor(x);
    currentBlock.pos.x = x;
  }

  // move the current block from side to side
  if (!dropBlock) {
    if (currentBlock.pos.x == G.WIDTH-levelData.speed && currentBlock.isEnter) {
      play("laser");
    }

    if (currentBlock.pos.x > G.WIDTH - currentBlock.length - 1 && !currentBlock.isEnter) {
      play("coin");
      currentBlock.speed *= -1;
      currentBlock.length -= levelData.degradationRate;
    }
    if (currentBlock.pos.x < 1) {
      currentBlock.isEnter = false;
      currentBlock.speed *= -1;
    }
    currentBlock.pos.x += currentBlock.speed;
  }

  if (dropBlock) {
    dropSpeed += 0.1;
    currentBlock.pos.y += dropSpeed;

    let topBlock = stack[stack.length - 1];

    if (currentBlock.pos.y > topBlock.pos.y - currentBlock.height) {

      let topBlock = stack[stack.length - 1];
      currentBlock.pos.y = topBlock.pos.y - currentBlock.height;

      currentBlock = CutBlockBasedOnBlock(topBlock, currentBlock);
      let hasEnded = false;
      if (currentBlock.length < 1) {
        color("red");
        //rect(endX,currentBlock.pos.y, endLength, currentBlock.height);
        //        color("black");
        console.log("THE END");
        end();
        hasEnded = true;
      }

// ======================================================= sucessfully placed block on stack =======================================================
      if (!hasEnded){
      play("laser", { volume: 0.5 });
      if (topBlock.length == currentBlock.length)
      {
        score += 5;
        play("powerUp",{ volume: 0.5 });
      }
      stack.push(currentBlock);
      score += calculateScore(currentBlock.length, stack);
      checkDifficulty();
      } else {
        play("explosion");
      }
      dropBlock = false;
      newCurrentBlock(currentBlock.length);
    }
  }
}

function calculateScore(KB, stack){
  let returScore = 0;
  let step = 0.15625;//10 / range; // 0,15625
  returScore = KB * step;
  returScore = Math.floor(returScore); // ceil or floor

  // if the stack is under 3
  if (stack < 5) {
    returScore += 1;
  } else{
    returScore += stack.length - 2;
  }
  console.log("KB: " + KB + " Score: " + returScore);
  return returScore+1;
}

function testCalculateScore() {
  // make a test function that consol.logs all values from 64 to 1
  for (let i = 64; i > 0; i--) {
    console.log("KB: " + i + " Score: " + calculateScore(i, 0));
  }
}

function checkDifficulty() {
  if (stack.length % 5 == 0) {
    levelData.speed += 0.5;
  }
}

function CutBlockBasedOnBlock(topBlock, currentBlock) {
  let leftOverlap = topBlock.pos.x - currentBlock.pos.x;
  let rightOverlap = (currentBlock.pos.x + currentBlock.length) - (topBlock.pos.x + topBlock.length);

  if (leftOverlap > 0) {
    //BlockSeparation:
    separatedBlock = {
      pos: { x: currentBlock.pos.x, y: currentBlock.pos.y },
      length: leftOverlap,
      speed: 0.5
    };

    currentBlock.pos.x += leftOverlap;
    currentBlock.length -= leftOverlap;
  }

  if (rightOverlap > 0) {

    //BlockSeparation:
    separatedBlock = {
      pos: { x: currentBlock.pos.x + currentBlock.length-rightOverlap, y: currentBlock.pos.y },
      length: rightOverlap,
      speed: 0.5
    };
    currentBlock.length -= rightOverlap;
  }

  if (currentBlock.length < 1) {
    console.log("outside of the block");
    separatedBlock = null;
  } 

  return currentBlock;
}

function easeOutCubic(currentStep, totalSteps) {
  let t = currentStep / totalSteps;
  return --t * t * t + 1;
}

function easeInOutCubic(currentStep, totalSteps) {
  let t = currentStep / totalSteps;
  if ((t /= 0.5) < 1) return 0.5 * t * t * t;
  return 0.5 * ((t -= 2) * t * t + 2);
}

function drawMemoryBase() {
  color("blue");
  rect(memory.pos, memory.length, memory.height);
  color("green");
  // put this text inside the rect
  text("64 KB RAM", memory.pos.x + 10, memory.pos.y + 3);

}

function drawCurrentBlock() {
  color("green");
  rect(currentBlock.pos, currentBlock.length, currentBlock.height);
}

function drawStack() {
  stack.forEach((block) => {
    color(colors[stack.indexOf(block) % colors.length]);
    rect(block.pos, block.length, block.height);
  });
}

function CutTheBlock(cutpos = vec(50, 50)) {

  if (!input.isJustPressed) return;
  // if the cut pos is inside the top block
  let topblock = stack[stack.length - 1];
  if (input.pos.x > topblock.pos.x && input.pos.x < topblock.pos.x + topblock.length) {
    // cut the block at the cut pos. The length of the block is now the length of the block from the start to the cut pos
    let cut = stack.pop();
    stack.push({ pos: vec(cut.pos.x, cut.pos.y), length: input.pos.x - cut.pos.x, height: cut.height });
    stack.push({ pos: vec(input.pos.x, cut.pos.y), length: cut.pos.x + cut.length - input.pos.x, height: cut.height });
  }

  // if (input.isJustPressed) {
  //   let cut = stack.pop();
  //   stack.push({pos: vec(cut.pos.x, cut.pos.y), length: cut.length/2, height: cut.height});
  //   stack.push({pos: vec(cut.pos.x + cut.length/2, cut.pos.y), length: cut.length/2, height: cut.height});
  // }
}
