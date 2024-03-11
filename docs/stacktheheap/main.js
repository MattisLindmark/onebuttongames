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
`  
];

const G = {
  WIDTH: 110,
  HEIGHT: 120,
  SPEED: 1
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
  //  theme: "crt",
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
  pos: vec(G.WIDTH+fullLength, 10),
  length: fullLength,
  height: 8,
  speed: 0,
  isEnter: true
};

let currentBlock;
let stack = [];

let levelData_template = {
  stackSize: 0,
  degradationRate: 1,
  speed: G.SPEED
}

let levelData;

let dropBlock = false;

const colors = [ "red", "blue", "green", "yellow", "purple", "cyan", "black", "light_black" ];

//========================================================= MAIN LOOP =========================================================

function update() {
  if (!ticks) {
    console.log("FullLenth: "+fullLength);
    console.log("MemoryStartPos: "+memoryStartPos);

    setup();
    // add a block to the stack
  }
  // text("Ticks: " + ticks, 3, 10);

  // text topp middle of screen
  text(""+currentBlock.length+"KB", G.WIDTH / 2-10, 5);
  color("yellow")
  rect(block_template.pos, block_template.length, block_template.height);
  color("black");
  handleMovement();
  CheckStackHeight();
  drawStack();
  drawCurrentBlock();  
  drawMemoryBase();
}

function setup() {
 memory.pos = vec(memoryStartPos.x, memoryStartPos.y);
 stack = [{ pos: vec(memory.pos.x, memory.pos.y), length: memory.length, height: memory.height }];

//  copy block_template to currentBlock;
  levelData = {...levelData_template};
  currentBlock = deepCopy(block_template);
  currentBlock.speed = levelData.speed;
  currentBlock.isEnter = true;
  
  currentBlock.speed = levelData.speed;
  currentBlock.speed *= -1;

 // stack.push({pos: vec(10, 10), length: 50, height: 8});
}

function CheckStackHeight()
{
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

function newCurrentBlock(lentgh = -1) {
  currentBlock = deepCopy(block_template);
  if (lentgh > 0) {
    currentBlock.length = lentgh;
  }
  currentBlock.speed = levelData.speed;
  currentBlock.speed *= -1;
  currentBlock.isEnter = true;
}

function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
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

      if (currentBlock.length < 1) {
        color("red");
        //rect(endX,currentBlock.pos.y, endLength, currentBlock.height);
//        color("black");
        end();
      }

      stack.push(currentBlock);
      score += currentBlock.length;
      score += stack.length;
      levelData.speed += 0.2;
      //stack.push({ pos: vec(currentBlock.pos.x, topBlock.pos.y - currentBlock.height), length: currentBlock.length, height: currentBlock.height });
      dropBlock = false;
      console.log("NewBlockLenth: "+currentBlock.length);
      newCurrentBlock(currentBlock.length);
    }
  }


}

function CutBlockBasedOnBlock(topBlock, currentBlock) {
  let leftOverlap = topBlock.pos.x - currentBlock.pos.x;
  let rightOverlap = (currentBlock.pos.x + currentBlock.length) - (topBlock.pos.x + topBlock.length);

  if (leftOverlap > 0) {
    currentBlock.pos.x += leftOverlap;
    currentBlock.length -= leftOverlap;
  }

  if (rightOverlap > 0) {
    currentBlock.length -= rightOverlap;
  }

  if (currentBlock.length < 1) {
    console.log("outside of the block");
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
    color(colors[stack.indexOf(block)%colors.length]);
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
    stack.push({pos: vec(cut.pos.x, cut.pos.y), length: input.pos.x - cut.pos.x, height: cut.height});
    stack.push({pos: vec(input.pos.x, cut.pos.y), length: cut.pos.x + cut.length - input.pos.x, height: cut.height});
  }
  
  // if (input.isJustPressed) {
  //   let cut = stack.pop();
  //   stack.push({pos: vec(cut.pos.x, cut.pos.y), length: cut.length/2, height: cut.height});
  //   stack.push({pos: vec(cut.pos.x + cut.length/2, cut.pos.y), length: cut.length/2, height: cut.height});
  // }
}
