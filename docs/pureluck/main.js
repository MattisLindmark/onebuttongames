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
  REALWIDTH: 230,
  REALHEIGHT: 300
};

options = {
  viewSize: { x: G.REALWIDTH, y: G.REALHEIGHT },
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
const phrases = [
  "Pick me",
  "Choose me",
  "You seek",
  "Take me",
  "Select me",
  "I'm here",
  "Your turn",
  "Join me",
  "Grab me",
  "Vote me",
  "Tag me",
  "I'm ready",
  "Pick first",
  "Me next",
  "Claim me",
  "I volunteer",
  "My chance",
  "I'm available",
  "Your choice",
  "I'm up",
  "I'm the one",
  "correct\nchoice",
  "Wrong\nanswer",
  "Not this\none",
  "Bad choice",
  "Good\nchoice"
];

let rndPhrases = [];
let phrasesIndex = 0;

console.log(phrases);

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
    nrOfCards = 1; 
//    sss.setSeed(5);
//    sss.setVolume(0.05);
    setCardSize();
    setupAnswerPhrases();
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
  if (timer < 30) {
    drawItems();
    drawSelection(true);
    return;
  }
  
  if (timer < 70) {
    drawSelection(true);
    drawItems(false,true);
    return;
  }
  if (timer < 250) {
    drawSelection(true);
    drawItems(true,false);
    return;
  }


  drawItems(true);
  drawSelection(true);

  if (randomItems[selectIndex].isTheOne) {
    play("coin");
    color("green");
    text("You win!", G.WIDTH / 2-16, G.HEIGHT / 2);
  } else {
    play("explosion");
    color("red");
    text("You lose!", G.WIDTH / 2-16, G.HEIGHT / 2);
  }

  if (timer > 130) {
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
    color("black"); //allColors[rndi(0, allColors.length)]);
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
    let description = "this is the correct one.";
    let lable = rndPhrases[phrasesIndex];
    phrasesIndex = wrap(phrasesIndex + 1, 0, rndPhrases.length);
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

  cardSize = Math.min(cardSize,50);

}

function setupAnswerPhrases() {
  rndPhrases = [];
  phrasesIndex = 0;
  phrases.forEach(phrase => {
    rndPhrases.push(phrase);
  });
  shuffle(rndPhrases);  
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
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



function drawItems(showTheOne = false, dimTheLights = false) {
  randomItems.forEach(item => {
    let ccardSize = cardSize;
    let txt = item.lable;
        if (item.isTheOne) { txt = "the one"};
    color(item.color);
    //    rect(item.pos.x, item.pos.y, cardSize * item.sizeMod, 10 * item.sizeMod);

    if (showTheOne && item.isTheOne) {
     
      color(allColors[rndi(0, allColors.length)]);
      ccardSize += Math.cos(ticks * 0.1) * 5;
    } else if (showTheOne && !item.isTheOne){      
      color ("light_cyan");
      if (randomItems[selectIndex] == item) {
        color("green");
      }
    }

    if (dimTheLights && !showTheOne) {
      color("light_cyan");
      if (randomItems[selectIndex] == item) {
        color("green");
      }
    }

    rect(item.pos.x - ccardSize / 2, item.pos.y - ccardSize / 2, ccardSize * item.sizeMod, ccardSize * item.sizeMod);
    
    if (!showTheOne && !dimTheLights) {
      let bottomLeftX = item.pos.x - cardSize / 2;
      let bottomLeftY = item.pos.y - cardSize / 2 + cardSize * item.sizeMod;
      //    let bottomLeftCorner = vec(bottomLeftX+((txt.length*6)-(cardSize/2)), bottomLeftY+4);

      let bottomLeftCorner = vec(bottomLeftX, bottomLeftY + 4);
      //    console.log("hej" +(txt.length*20)/(cardSize/2));

      color("black");
      text(txt, bottomLeftCorner, { color: "black" });
    } else if (item.isTheOne && !dimTheLights) {
      color("black");
      text("The\none!", item.pos.x-15, item.pos.y,{scale: {x: 2, y: 2}});
    }
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