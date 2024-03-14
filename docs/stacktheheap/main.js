title = "";

description = `Hack the past,\ncommand the future\n \n \n     Stack\n        The\n          Heap`;
/*

title = "  HOW ABOUT A NICE GAME OF";

description = `ROCK\n PAPER\n  SCISSORS?


title = "   Stack\n     The\n    Heap";

description = `Hack the Past, Command the Future!
`;
*/
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
  SPEED: 2,
  SEED: 1
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
   // seed: G.SEED,
  //  isShowingScore: false,
    theme: "crt",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .3,
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
  isEnter: true,
  isNew: true
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
    sss.setSeed(G.SEED);
//    console.log("FullLenth: " + fullLength);
//    console.log("MemoryStartPos: " + memoryStartPos);
    setup();
    //testCalculateScore();
  }

  


//  text("spd: " + levelData.speed, 3, 10);
//  text("StackSize: " + stack.length, 3, 20);

  // text("Ticks: " + ticks, 3, 10);

  // text topp middle of screen
  color("green");
  text("" + currentBlock.length + "KB", G.WIDTH / 2 - 10, 3);
  text("" + stack.length+"stk", G.WIDTH / 2 - 10, 10);
  color("black");
 // drawMatrix();
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

/* ======================================================= matrix rain =======================================================
  matrixRain = [];
 times(10, () => {
   matrixRain.push({ pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)), speed: rnd(0.5, 1.5) });
  });
*/
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

  if (currentBlock.pos.x < G.WIDTH && currentBlock.isNew) {
    play("laser", { volume: 1 });
    currentBlock.isNew = false;
  }

  if (input.isJustPressed && !currentBlock.isNew && !dropBlock){// && currentBlock.pos.x < G.WIDTH && !dropBlock) {
    dropSpeed = 0.1;
    dropBlock = true;
    // snap current block in x to closest full value
    let x = currentBlock.pos.x;
    x = Math.floor(x);
    currentBlock.pos.x = x;
  }

  // move the current block from side to side
  if (!dropBlock) {

    if (currentBlock.pos.x + currentBlock.length > G.WIDTH-1 && !currentBlock.isEnter) { 
     // play("laser" ,{ note:"c5", volume: 0.5 });
      play("hit", { volume: 0.5, seed: 10});
      currentBlock.speed *= -1;
      currentBlock.length -= levelData.degradationRate;
      if (currentBlock.length < 1) {
        end();
      }
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
//      play("laser");//, { volume: 0.5 });      
      let n = calcNote(stack.length);
      //console.log("Note: " + n);
      play("synth", { note: n, volume: 0.5, seed: 1});

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

//const notelist = ["c", "d", "e", "f", "g", "a", "b"];
const notelist = ["c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"];
/*
const melody = [
 // "c4", "d4", "e4", "f4", "g4", "a4", "b4", // Ascending notes in 4th octave
 // "c5", "b4", "a4", "g4", "f4", "e4", "d4", "c4", // Ascending to 5th octave and descending back to 4th
 "c4", "c4", "g4", "g4", "a4", "a4", "g4", // Twinkle, twinkle, little star,
 "f4", "f4", "e4", "e4", "d4", "d4", "c4", // How I wonder what you are.
 "g4", "g4", "f4", "f4", "e4", "e4", "d4", // Up above the world so high,
 "g4", "g4", "f4", "f4", "e4", "e4", "d4", // Like a diamond in the sky.
 "c4", "c4", "g4", "g4", "a4", "a4", "g4", // Twinkle, twinkle, little star,
 "f4", "f4", "e4", "e4", "d4", "d4", "c4"  // How I wonder what you are.
];
const melody = [
  "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4", // Main theme
  "c4", "e4", "a4", "b4", // Transition
  "e4", "g#4", "b4", "c5", // Transition
  "e4", "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4" // Main theme
];
const melody = [
  "f4", "f4", "f4", "a#4", "f5", // Main theme
  "d#5", "d5", "c5", "a#4", // Transition
  "f5", "d#5", "d5", "c5", "a#4", // Transition
  "f5", "d#5", "d5", "d#5", "c5", // Main theme
];
*/
function calcNote(number = 0) {
 // return melody[number % melody.length];

  let note = notelist[number % notelist.length];
  let octave = Math.floor(number / notelist.length);
  octave += 2;
  return "" + note + octave;
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
//  console.log("KB: " + KB + " Score: " + returScore);
  return returScore+1;
}

function testCalculateScore() {
  // make a test function that consol.logs all values from 64 to 1
  for (let i = 64; i > 0; i--) {
    console.log("KB: " + i + " Score: " + calculateScore(i, 0));
  }
}

function checkDifficulty() {
  
  if (stack.length % 8 == 0) {
    play("random", { volume: 0.3 });
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
//    console.log("outside of the block");
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
  //color("light_black");
  text("vvvvv vvv", memory.pos.x + 8, memory.pos.y + 10);
  color("black");

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
