title = "Pure Luck";

description = `Do you feel lucky?
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
  // isReplayEnabled: true,
  //  seed: 1,
  //  isShowingScore: false,
    theme: "shapeDark",
  //  isShowingTime: true,
    isCapturing: true,
    captureCanvasScale: .2,
    isCapturingGameCanvasOnly: true
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

const luckyPhrases = [ // OBS: Både lucky och unlucky phrases ska vara lika långa. 26 st just nu.
  "Bingo!",
  "Nailed it!",
  "Spot on!",
  "Perfect!",
  "Winner!",
  "Got it!",
  "Exactly!",
  "Bravo!",
  "Well done!",
  "You're right!",
  "Precisely!",
  "Excellent!",
  "That's it!",
  "On the money!",
  "Absolutely!",
  "Hooray!",
  "Incredible!",
  "Just right!",
  "Gold star!",
  "Luck favors you!",
  "CORRECT!",
  "Right answer!",
  "That was the one!",
  "You got it!",
  "Impressive!",
  "Pro guesser!"
];

const unluckyPhrases = [
  "Wrong!",
  "Not quite.",
  "Missed it!",
  "Not even close!",
  "Try again!",
  "Hard luck.",
  "Better luck next time.",
  "Wrong path.",
  "No dice.",
  "Unlucky.",
  "Not the one.",
  "Back to the drawing board.",
  "Swing and a miss.",
  "Fate frowns.",
  "Off target.",
  "No jackpot.",
  "Bad call.",
  "Lost in the shuffle.",
  "Missed the mark.",
  "Luck eludes you.",
  "No luck!",
  "Nope.",
  "Git Gud Noob!",
  "Incorrect.",
  "Seriously?",
  "Pick better next time."
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
let extraLife = 0;

let selectIndex = 0;
let timer = 0;
let bonusFX = false;
let FXposY = 5;
let FXspeed = 0.05;

let totalGuesses = 0;

const CHEATMODE = false;

// MARK: - Main loop
function update() {
  if (!ticks) {
    totalGuesses = 0;
    extraLife = 0;
    nrOfCards = 1;
    timer = 0;
    bonusFX = false;
    FXposY = 5;
    FXspeed = 0.05;
//    sss.setSeed(5);
//    sss.setVolume(0.05);
    setCardSize();
    setupAnswerPhrases();
  selectIndex = 0;
  }
  color("black");
  //bonusFX = true;

  if (extraLife < 0 && currentStage != endStage) {
    timer = 0;
    currentStage = endStage;
    extraLife = 0;
    bonusFX = false;
  }

  currentStage();
  
  
  color("black");
  text("Bonus Luck: " + extraLife, G.REALWIDTH/2-50, 5);
  if (bonusFX) {
    let tmp = extraLife+1;
    color("red");
    text(""+tmp,G.REALWIDTH/2+23,FXposY);
    color("black");
    FXposY += FXspeed;
    FXspeed += 0.05;
    if (FXposY > G.HEIGHT) {
      bonusFX = false;
      FXposY = 5;
      FXspeed = 0.05;
    }
  }

}

function endStage() {
  timer ++;
//  console.log(""+timer);
  color("transparent");
  rect(0,0,G.WIDTH,G.HEIGHT);
  color("red");
  text("You ran out of luck!", G.WIDTH / 2 - 20, G.HEIGHT / 3);
  text("Score:" + score, G.WIDTH / 2 - 20, G.HEIGHT / 3 + 10);
  text("Total guesses:" + totalGuesses, G.WIDTH / 2 - 20, G.HEIGHT / 3 + 20);
  text("Reached level: " + nrOfCards, G.WIDTH / 2 - 20, G.HEIGHT / 3 + 30);
  if (timer > 60) {
    extraLife = 0;
    currentStage = testStage;
    end();
  }
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
    play("select");
    currentStage = stageResult;
  }
}

let soundFlag = false;
let endTextIndex = -1;

function stageResult(){
  let isCorrect = randomItems[selectIndex].isTheOne;
  timer++;
  if (timer < 30) {
    soundFlag = false;
    drawItems();
    drawSelection(true);
    return;
  }
  
  if (timer < 90) {
    drawSelection(true);
    drawItems(false,true);
    return;
  }
  if (timer < 150) {
    drawSelection(true);
    drawItems(true,false);
    return;
  }

  if (endTextIndex < 0) {
    endTextIndex = rndi(0,26);
  }

  drawItems(true);
  drawSelection(true);
  // rectange behind the text
  // MARK: Result stage stuff.
  let playstr = "explosion";
  if (isCorrect) {
    color("light_green");
    rect(0, G.HEIGHT / 2 - 10, G.REALWIDTH, 20);
    playstr ="powerUp";
    color("black");
    text(luckyPhrases[endTextIndex], G.REALWIDTH / 2-luckyPhrases[endTextIndex].length*3, G.HEIGHT / 2);
  } else {
    color("light_red");
    rect(0, G.HEIGHT / 2 - 10, G.REALWIDTH, 20);
    playstr = "explosion";
    color("black");
    text(unluckyPhrases[endTextIndex], G.REALWIDTH / 2-unluckyPhrases[endTextIndex].length*3, G.HEIGHT / 2);
  }

  if (!soundFlag) {
    play(playstr);
    soundFlag = true;
  }


  if (timer > 210) {
    endTextIndex = -1;
    selectIndex = 0;
    isCorrect ? nrOfCards++ : nrOfCards+=0;
    isCorrect ? extraLife++ : extraLife--;
    isCorrect ? score++ : score+=0;
    totalGuesses++;
    if (!isCorrect && !bonusFX) {
      bonusFX = true;      
    }
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
        if (item.isTheOne && CHEATMODE) { txt = "the one"};
    color(item.color);
    //    rect(item.pos.x, item.pos.y, cardSize * item.sizeMod, 10 * item.sizeMod);

    if (showTheOne && item.isTheOne) {
     
      color(allColors[rndi(0, allColors.length)]);
      ccardSize += Math.cos(ticks * 0.1) * 5;
    } else if (showTheOne && !item.isTheOne){      
      color ("light_blue");
      if (randomItems[selectIndex] == item) {
        color("green");
      }
    }

    if (dimTheLights && !showTheOne) {
      color("light_blue");
      if (randomItems[selectIndex] == item) {
        color("green");
      }
    }

    rect(item.pos.x - (ccardSize / 2), item.pos.y - (ccardSize / 2), ccardSize * item.sizeMod, ccardSize * item.sizeMod);   
    
    if (!showTheOne && !dimTheLights) {
      let bottomLeftX = item.pos.x - cardSize / 2;
      let bottomLeftY = item.pos.y - cardSize / 2 + cardSize * item.sizeMod;
      //    let bottomLeftCorner = vec(bottomLeftX+((txt.length*6)-(cardSize/2)), bottomLeftY+4);
      
      let bottomLeftCorner = vec(bottomLeftX, bottomLeftY + 8);
      //    console.log("hej" +(txt.length*20)/(cardSize/2));
      
      color("black");
      text(txt, bottomLeftCorner, { color: "black" });
    } else if (item.isTheOne && !dimTheLights) {
      color("black");
      text("The  \none", item.pos.x - (ccardSize/2)+((ccardSize*item.sizeMod) / 2)-12, item.pos.y-ccardSize/4 ,{scale: {x: 2, y: 2}}); // för y: - (ccardSize*item.sizeMod)/2
//      text("The  \none!", (item.pos.x- cardSize/2)+5, item.pos.y-2,{scale: {x: 2, y: 2}});
    }

//     color ("black");
//     text("The  \none", item.pos.x - (ccardSize/2)+((ccardSize*item.sizeMod) / 2)-12, item.pos.y-ccardSize/4 ,{scale: {x: 2, y: 2}}); // för y: - (ccardSize*item.sizeMod)/2

//    text("The  \none!", (item.pos.x- cardSize/2)+10, item.pos.y-(cardSize/4),{scale: {x: 2, y: 2}});
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