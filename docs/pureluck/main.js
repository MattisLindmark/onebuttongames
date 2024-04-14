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
llllll
llllll
`  
];

const G = {
  WIDTH: 200,
  HEIGHT: 300,
};

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "shapeDark",
  //  isShowingTime: true,
  //  isCapturing: true,
  //  captureCanvasScale: .2,
  //  isCapturingGameCanvasOnly: true
};

const colors = ["red", "blue", "green", "yellow", "purple", "cyan", "black"];
const allColors = ["red", "blue", "green", "yellow", "purple", "cyan", "black", "light_red", "light_blue", "light_green", "light_yellow", "light_purple", "light_cyan", "light_black"];

let nrOfCards = 4;
let cardSize = 0;// Math.ceil(G.HEIGHT / nrOfCards - 2);

class selectableItem {
  constructor(pos, color, sizeMod, description, lable, isTheOne) {
    this.pos = pos;
    this.color = color;
    this.sizeMod = sizeMod;
    this.description = description;
    this.lable = lable;
    this.isTheOne = false;
  }
}

let randomItems = [];
let currentStage = testStage;

let selectIndex = 0;
let timer = 0;
function update() {
  if (!ticks) {    
    nrOfCards = 2; 
//    sss.setSeed(5);
//    sss.setVolume(0.05);
    setCardSize();
  selectIndex = 0;
  }

  currentStage();

}

function testStage() {
  rect(20,20,30,30);
  currentStage = stageOne;
}

function stageOne(){ // create the board
  randomItems = [];
  createItems(nrOfCards);
  // check if there is a card that is the one
  currentStage = stageSelect;
}

function stageSelect(){  
  drawSelection();
  if (ticks % 30 == 0) {
    selectIndex++;
    selectIndex = wrap(selectIndex, 0, randomItems.length);
  }
  drawItems();
  if (input.isJustPressed) {
    timer = 0;
    currentStage = stageResult;
  }
}

function stageResult(){
  timer++;
  if (timer < 60) {
    drawItems();
    drawSelection(true);
    return;
  }
       
  if (randomItems[selectIndex].isTheOne) {
    play("coin");
    color("green");
    text("You win!", G.WIDTH / 2, G.HEIGHT / 2);
  } else {
    play("explosion");
    color("red");
    text("You lose!", G.WIDTH / 2, G.HEIGHT / 2);
  }
  if (timer > 120) {
    selectIndex = 0;
    nrOfCards++;
    setCardSize();
    currentStage = stageOne;
  }
}


function drawSelection(isResult = false) {
  let item = randomItems[selectIndex];
  color("black");
  if (isResult) {    
    color(allColors[rndi(0, allColors.length)]);
  }  
  rect(item.pos.x-cardSize/2-2, item.pos.y-cardSize/2-2, cardSize*item.sizeMod+4, cardSize*item.sizeMod+4);
  color("black");
}


function createItems (ammount = 1) {
  randomItems = [];
  for (let i = 0; i < ammount; i++) {
    let pos = vec(0,0);
    let color = allColors[rndi(0, allColors.length)];
    let sizeMod = rnd(.8,1.3);
    let description = "this is a description";
    let lable = "this is a lable";
    let isTheOne = false;
    randomItems.push(new selectableItem(pos, color, sizeMod, description, lable, isTheOne));
  }

  let positions = generateGridPositions(ammount);
  for (let i = 0; i < ammount; i++) {
    randomItems[i].pos = positions[i];
  }

  randomItems[rndi(0, ammount)].isTheOne = true; 
}

function setCardSize() {
  let tmp1 = Math.ceil(G.HEIGHT / nrOfCards - 2);
  let tmp2 = Math.ceil(G.WIDTH / nrOfCards - 2);
  cardSize = tmp1 > tmp2 ? tmp1 : tmp2;
}

function generateGridPositions(amount) {
  let positions = [];
  // Calculate number of rows and columns for even distribution
  let rows = Math.ceil(Math.sqrt(amount));
  let cols = Math.ceil(amount / rows);

  // Calculate cell size based on screen size and number of rows/columns
  let cellWidth = G.WIDTH / cols;
  let cellHeight = G.HEIGHT / rows;

  // Generate positions
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      // Calculate position of the center of the cell
      let x = j * cellWidth + cellWidth / 2;
      let y = i * cellHeight + cellHeight / 2;
      let rndX = rndi(-8,8);
      let rndY = rndi(-8,8);
      x += rndX;
      y += rndY;

      // Add position to the array
      positions.push(vec(x, y));
    }
  }

  return positions;
}



function drawItems() {
  randomItems.forEach(item => {
    let txt = "pick me!";
    if (item.isTheOne) { txt = "the one"};
    color(item.color);
//    rect(item.pos.x, item.pos.y, cardSize * item.sizeMod, 10 * item.sizeMod);
    rect(item.pos.x-cardSize/2, item.pos.y-cardSize/2, cardSize*item.sizeMod, cardSize*item.sizeMod);

    let bottomLeftX = item.pos.x - cardSize / 2;
    let bottomLeftY = item.pos.y - cardSize / 2 + cardSize * item.sizeMod;

    let bottomLeftCorner = vec(bottomLeftX+5, bottomLeftY+4);

    color("black");
    text(txt, bottomLeftCorner, {color: "black"});
//    text("x", bottomLeftCorner);
  });
}




/* =========== detta är ett quickgame, =========== 
// När en distraktion dyker upp och det börjar flyta ut, då klistrar jag in den här.


1: Intressana kortgrejs


// class cardItem {
//   constructor(x, y, value) {
//     this.x = x;
//     this.y = y;
//     this.value = value;
//     this.weakness = 0;
//     this.strength = 0;
//     this.isFlipped = false;    
//   }
// }





// onödigt komplicerat grid.
  let rows = Math.ceil(ammount / 5);
  let colums = Math.ceil(ammount / rows);
  let itemWidth = G.WIDTH / colums;
  let itemHeight = G.HEIGHT / rows;
  let itemSize = itemWidth < itemHeight ? itemWidth : itemHeight;
  let itemSpacing = 2;
  
  let x = itemSpacing;
  let y = itemSpacing;
  
  for (let i = 0; i < ammount && i < randomIdems.length; i++) {
    randomIdems[i].pos = vec(x, y);
    x += itemSize + itemSpacing;
    if (x > G.WIDTH - itemSize) {
      x = itemSpacing;
      y += itemSize + itemSpacing;
    }
  }

// Ytterligare positions försök


  let rows = Math.ceil(ammount / 5);
  let colums = Math.ceil(ammount / rows);

  let rowHeight = cardSize;
  let rowWidth = cardSize;

  // start in the middle of the screen
  let x = G.WIDTH / 2 - (colums * rowWidth) / 2;
  let y = G.HEIGHT / 2 - (rows * rowHeight) / 2;

  let gridpositions = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < colums; j++) {
      gridpositions.push(vec(x + j * rowWidth, y + i * rowHeight));
    }
  }

  randomIdems.forEach((item, i) => {
    item.pos = gridpositions[i];
  });



*/