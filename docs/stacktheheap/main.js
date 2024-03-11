title = "";

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
  WIDTH: 120,
  HEIGHT: 120,
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

let block_template = {
  pos: vec(10, 10),
  length: 50,
  height: 8,
};

let stack = [];

let cutpos = vec(50, 50);


const colors = [ "red", "blue", "green", "yellow", "purple", "cyan", "black", "white" ];

//========================================================= MAIN LOOP =========================================================

function update() {
  if (!ticks) {
    stack = [];
    // add a block to the stack
    stack.push({pos: vec(10, 10), length: 50, height: 8});
  }
  
  
  char("b", cutpos);
  cutpos = vec(input.pos.x, input.pos.y);

  color("green");
  // draw the stack
  stack.forEach((block) => {
    color(colors[stack.indexOf(block)]);
    rect(block.pos, block.length, block.height);
  });
  CutTheBlock(cutpos);

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
