//title = "Rock\n Paper\n  Scissors";

title = "  HOW ABOUT A NICE GAME OF";

description = `ROCK\n PAPER\n  SCISSORS?
`;

//description = `you know the rules,\nand so do I
//`;

characters = [
  `
 ll
lllll
llllll
 llll
`, `
 llll
l   l
ll  l
l l l
l   l
lllll
`, `
     l
lll l
l ll
lll l
     l
`, `
l    l
 l  l
  ll
 l  l
l    l
`,
];

const G = {
  WIDTH: 200,
  HEIGHT: 200,
  CPOS_Y: 100,
  STEP_X: 25,
  STEP_SPREAD: [1, 3, 5]
};

const Sprites = ["a", "b", "c"];
const charScaleBig = { x: 4, y: 4 };

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  //isPlayingBgm: true,
  //isReplayEnabled: true,
  seed: 15,
  isShowingScore: false,
  theme: "crt",
//  isCapturing: true,
//  captureCanvasScale: .2,
//  isCapturingGameCanvasOnly: true
};

class Choice {
  constructor(name, weakness, sprite) {
    this.name = name;
    this.weakness = weakness;
    this.sprite = sprite;
  }
}

const rock = new Choice("Rock");
const paper = new Choice("Paper");
const scissors = new Choice("Scissors");

rock.weakness = paper;
paper.weakness = scissors;
scissors.weakness = rock;
rock.sprite = "a";
paper.sprite = "b";
scissors.sprite = "c";

const PossibleChoices = [rock, paper, scissors];
let playerChoice = rock;
let computerChoice = rock;

let text1 = "Text1";
let text2 = "Text2 ";

let computerScore = 0;
let playerScore = 0;
let numberOfGames = 0;
let stateFunc = selectState;

let randomTargetAngle;

//let DissregardFirstButtonPress = true;

function update() {
  if (!ticks) {
    sss.setSeed(6);
    // Generate a random angle in radians (0 to 2π), equivalent to 0 to 360 degrees
    randomTargetAngle = Math.random() * 2 * Math.PI;
    init();
    //console.log("cs: " + computerScore + " ps: " + playerScore);
  }

  
  if (numberOfGames > 0) {
    let gnum = numberOfGames==1?" Game":" Games";
    let summary = numberOfGames+gnum+" Human:" + playerScore + "  AI:" + computerScore;
    color("light_green");
    text(summary, 35, G.HEIGHT-5, {scale: {x: 1, y: 1}});
    color("black");
  }
  
  stateFunc();

  // if (input.isJustPressed) {
  //   playerChoice = PossibleChoices[parseInt(input.pos.x/50)];
  //   computerChoice = PossibleChoices[parseInt(Math.random()*3)];
  //   if (playerChoice.weakness == computerChoice) {
  //     text1 = "You win LOOOSE!"+playerChoice.name;
  //     text2 = "Computer chose!"+computerChoice.name;
  //     score--;
  //   } else if (computerChoice.weakness == playerChoice) {
  //     text1 = "You WIIIN with!"+playerChoice.name;
  //     text2 = "Computer chose!"+computerChoice.name;
  //     score++;
  //   } else {
  //     text1 = "You both chose!"+playerChoice.name;
  //     text2 = "Computer chose!"+computerChoice.name;
  //   }
  // }

}

function init() {
  // FOR TEST
/*
  console.log("init");
  playerChoice = PossibleChoices[parseInt(Math.random()*3)];
  computerChoice = PossibleChoices[parseInt(Math.random()*3)];
  //playerChoice = rock;
  //computerChoice = scissors;
  let TPos1 = vec(50, 70);
  let TPos2 = vec(G.WIDTH - 55, 70);
  stateFunc = ()=> {
    FinalScreen(TPos1, TPos2);
  };
  
*/
  computerChoice = rock;
  playerChoice = rock;
  stateFunc = selectState;
  progress = 0;
  l = 1;
  finaltimer = 0;
  winnerData = null;

}
function writeBaseScreen() {
  color("black");
  text(" Rock", G.STEP_X * G.STEP_SPREAD[0], G.CPOS_Y);
  text(" Paper", G.STEP_X * G.STEP_SPREAD[1], G.CPOS_Y);
  text(" Scissors", G.STEP_X * G.STEP_SPREAD[2], G.CPOS_Y);

  //color("black");
  //text("AI: "+score, 5, 10);

}

function selectState() {
  writeBaseScreen();
  drawChoiseText(true);
  // currentStep should be 1, 3 or 5  
  let currentIndex = parseInt(ticks / 60) % G.STEP_SPREAD.length;
  let currentStep = G.STEP_SPREAD[currentIndex];

  let charColor = "light_black";
/*
  if (input.isPressed) {
    color("yellow");
    rect((G.STEP_X * currentStep) - 1, G.CPOS_Y - 6, 52, 12);
    //      charScaleBig = {x:4, y:4};
    charColor = "black";
  }
*/

  color("green");
  rect(G.STEP_X * currentStep, G.CPOS_Y - 5, 50, 10);
  color("yellow");
  text(" " + PossibleChoices[currentIndex].name, G.STEP_X * currentStep, G.CPOS_Y);
  color(charColor);

  let amplitude = (60 - 20) / 2; // The amplitude of the oscillation is half the range
  let midpoint = (60 + 20) / 2; // The midpoint of the oscillation is the average of the range
  let y = amplitude * Math.sin((ticks / 60) * 2 * Math.PI - Math.PI * 2) + midpoint;

  char(PossibleChoices[currentIndex].sprite, G.WIDTH / 2, y, { scale: charScaleBig });

  if (input.isJustPressed) {
    playerChoice = PossibleChoices[currentIndex];
    let tmp = 0;
    let startPos = vec(G.WIDTH / 2, y);
    play("coin", { volume: 0.5 });
    stateFunc = () => {
      tmp++;
      if (tmp < 100) {
        //        y=selecionDone(currentIndex, currentStep, y, charScaleBig);
        selecionDoneB(startPos, tmp);
      } else {
        stateFunc = computerSelectionState;
      }
    };

    /*
        stateFunc = () => {
            // move Y towards center
            if (y < 60) {
              y++;
            } else if (y > 62) {
              y--;
            }
    
            color ("black");
            text("YOUR CHOICE:", 50, 20);
            color("green");
            rect(G.STEP_X*currentStep,G.CPOS_Y-5, 50, 10);
            color("black");
            text(" "+PossibleChoices[currentIndex].name,G.STEP_X*currentStep, G.CPOS_Y);
            char(PossibleChoices[currentIndex].sprite, G.WIDTH/2, y, {scale: charScale});       
        };
      }
    */
    //  char(PossibleChoices[currentIndex].sprite, G.WIDTH/2, 40, {scale: {x: 4, y: 4}});
  }
}

function selecionDoneB(startVec, currentStep) {
  drawChoiseText(true);
  let PLendPos = vec(65, 25);
  writeBaseScreen();
  let t = currentStep * 0.01;
  let vp = easeVec(startVec, PLendPos, t, 50);
  color("green");
  char(playerChoice.sprite, vp, { scale: charScaleBig });
  //char(playerChoice.sprite, G.WIDTH/2, 50, {scale: charScaleBig});

  //  text("Humans\nchoice:", 10, 25);
  //  char(playerChoice.sprite, vecPos, {scale: {x: 4, y: 4}});

}

function selecionDone(currentIndex, currentStep, y, charScale) {
  writeBaseScreen();
  // move Y towards center
  if (y < 60) {
    y++;
  } else if (y > 62) {
    y--;
  }
  color("black");
  text("YOUR CHOICE:", 50, 20);
  color("green");
  rect(G.STEP_X * currentStep, G.CPOS_Y - 5, 50, 10);
  color("black");
  text(" " + PossibleChoices[currentIndex].name, G.STEP_X * currentStep, G.CPOS_Y);
  char(PossibleChoices[currentIndex].sprite, G.WIDTH / 2, y, { scale: charScale });
  return y;
}

function computerSelectionState() {


  drawCharactersInCircle();
  // a bar that rotates in the middle of the screen
  color("green");
  // text("Humans\nchoice:", 10, 25);
  char(playerChoice.sprite, 65, 25, { scale: { x: 4, y: 4 } });
  //color("black");
  text(playerChoice.name, 55, 40);

  drawChoiseText();
  //color("cyan");
  //text("AIs\nchoice:", G.WIDTH/2+5, 25);


}

function drawChoiseText(onlyHuman = false) {
  color("green");
  text("Humans\nchoice:", 10, 25);
  if (onlyHuman) {
    return;
  }
  color("cyan");
  text("AIs\nchoice:", G.WIDTH / 2 + 5, 25);
  color("black");

}

let tmpSpeed = 1;// rnd(0.09,0.4); <- can be used to randomize a bit more, but might give problem with end sequence
let l = 1;




const centerX = G.WIDTH / 2;
const centerY = G.HEIGHT / 2;
let radius = 0; // Reduce radius to make characters closer together

function drawCharactersInCircle() {
  let characters = ['a', 'b', 'c', 'a', 'b', 'c']; // Repeat characters
  radius = radius + 0.5;
  radius = Math.min(radius, 50);
  for (let i = 0; i < characters.length; i++) {
    let angle = (i / characters.length) * 2 * Math.PI; // Calculate angle for this character
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    color("light_black");
    char(characters[i], x, y, { scale: { x: 1, y: 1 } }); // Change scale to 1
  }

  l = l + tmpSpeed;
  //  let col = bar(G.WIDTH/2, G.HEIGHT/2, l, 3, ticks/10 % 360,0);

  // Define the total duration of the rotation in ticks
  const totalDuration = 500; // Adjust this value as needed

  // Calculate the progress of the rotation from 0 to 1
  let progress = Math.min(l / totalDuration, 1);

  // Apply the ease in out cubic function
  let easedProgress;
  //if (progress < 0.5) {
  //  easedProgress = 4 * Math.pow(progress, 3);
  //} else {
  easedProgress = 1 - Math.pow(-2 * progress + 2, 3) / 2;
  //}

  // Define the maximum rotation speed
  const maxSpeed = 4; // Adjust this value as needed
  let angle = easedProgress * randomTargetAngle * maxSpeed;
  let col = bar(G.WIDTH / 2, G.HEIGHT / 2, radius, 4, angle, 0);

  //text("l "+l, 50, 50);
//  let lastC = computerChoice.name;

  if (col.isColliding.char.a || col.isColliding.char.b || col.isColliding.char.c) {
    if (col.isColliding.char.a) {      
      computerChoice = rock;
    } else if (col.isColliding.char.b) {
      computerChoice = paper;
    } else if (col.isColliding.char.c) {
      computerChoice = scissors;
    }
  } 

  color("cyan");
  char(computerChoice.sprite, G.WIDTH - 40, 25, { scale: { x: 4, y: 4 } });
//  if (lastC != computerChoice.name) {
    //play("hit", {numberOfSounds: 1});
    text(computerChoice.name, G.WIDTH - 52, 40);
//  }

  if (l==totalDuration) {
    play("coin",{volume: 0.5});
  }

  if (l > totalDuration + 100) {
    radius = 0;   
    stateFunc = displayResultState;
  } else if (l > totalDuration) {
    color("red");
    bar(G.WIDTH / 2, G.HEIGHT / 2, 50, 5, randomTargetAngle * maxSpeed, 0);
    color("blue");
    text(computerChoice.name, G.WIDTH - 52, 40);
  }

  if (input.isPressed) {
    color("red");
    text("HANDS OFF!", G.WIDTH/2-30, G.HEIGHT/2-8);
    //particle(100,100, 150, 5);
    color("black");
  }


  //  let col = bar(G.WIDTH/2, G.HEIGHT/2, 55, 3, ticks/10 % 360,0);
  /*
  if (col.isColliding.char.a || col.isColliding.char.b || col.isColliding.char.c) {
    tmpSpeed = 0;
    if (col.isColliding.char.a) {
      computerChoice = rock;
    } else if (col.isColliding.char.b) {
      computerChoice = paper;
    } else if (col.isColliding.char.c) {
      computerChoice = scissors;
    }

    stateFunc = displayResultState;
  }
  */

}


let progress = 0;
let t2=0;
const totalDuration = 500;

function displayResultState() {
  let PLstartPos = vec(65, 25);
  let PLendPos = vec(50, 70);
  let AIstartPos = vec(G.WIDTH - 40, 25);
  let AIendPos = vec(G.WIDTH - 55, 70);

  progress = Math.min(progress + 0.01, 1);
  let vecPos = easeVec(PLstartPos, PLendPos, progress);
  let aiPos = lerpVec(AIstartPos, AIendPos, progress);
  color("green");
  //  text("Humans\nchoice:", 10, 25);
  char(playerChoice.sprite, vecPos, { scale: { x: 4, y: 4 } });

  color("cyan");
  //  text("AIs\nchoice:", G.WIDTH/2+5, 25);
  char(computerChoice.sprite, aiPos, { scale: { x: 4, y: 4 } });
  drawChoiseText();

  if (progress >= 1) {
    t2++;
    text(playerChoice.name, PLendPos.x - 10, PLendPos.y + 14);
    text(computerChoice.name, AIendPos.x - 10, AIendPos.y + 14);
  }

  if (t2 > 50) {
    text("VS", G.WIDTH / 2-5 , PLendPos.y, {scale: {x: 2, y: 2}});
  }

  if (t2>100) {
    progress = 0;
    stateFunc = ()=> {
      FinalScreen(PLendPos, AIendPos);
    };
    t2=0;
  }

}

let finaltimer=0;
let winnerData;
function FinalScreen(PLendPos, AIendPos) {
  
  let endPos = vec(G.WIDTH / 2, G.HEIGHT / 2);
  progress = Math.min(progress + 0.02, 1);
  let vecPosPL = easeVecInBack(PLendPos, endPos, progress);
  let vecPosAI = easeVecInBack(AIendPos, endPos, progress);

  if (finaltimer < 1) {
  color("black");
  text("VS", G.WIDTH / 2-5 , PLendPos.y, {scale: {x: 2, y: 2}});
  color("red");
  char(playerChoice.sprite, vecPosPL, { scale: { x: 4, y: 4 } });
  char(computerChoice.sprite, vecPosAI, { scale: { x: 4, y: 4 } });
  }

  if (progress >= 1) {
    if (finaltimer == 0) {
      play("explosion");
      winnerData = getWinner(playerChoice, computerChoice);
    }
    
    
    if (finaltimer < 4)
    {
      color(LoopColor());
      particle(vecPosPL, 250, 2+finaltimer);
    }
    if (finaltimer < 40)
    {
      color(LoopColor());
      char(winnerData.sprite, vecPosPL, { scale: { x: 5, y: 5 } }); 
    }
    
    finaltimer++;
    if (finaltimer > 40) {
      //color("white");
      //rect(vecPosPL.x - 30, vecPosPL.y - 40, 80, 80);
      color("purple");
      char(winnerData.sprite, vecPosPL, { scale: { x: 5, y: 5 } }); 
      color("black");
      text(winnerData.endText, (G.WIDTH/2)-((winnerData.endText.length*6)/2), vecPosPL.y+20);          
//      text(playerChoice.name, vecPosPL.x - 10, vecPosPL.y + 14);
//      text(computerChoice.name, vecPosAI.x - 10, vecPosAI.y + 14);
    }

    if (finaltimer == 150)
    {
      numberOfGames++;
      if (winnerData.winner == "Player") {
        play("powerUp");
        play("lucky");
        playerScore++;
      } else if (winnerData.winner == "Computer") {
        play("random");
        computerScore++;
      } else {
        play("synth");
      }
    }

    if (finaltimer > 150) {      
      let s = Math.abs(sin(ticks/30))
      color("white");
      rect(0,0, G.WIDTH, G.HEIGHT);
      color("black");
      let endText;
      let endText2;

      if (winnerData.winner == "Player") {
        endText="Human WINS!";
        endText2 = "(for now)"
      } else if (winnerData.winner == "Computer") {
        endText="  AI WINS!";
        endText2="  Human obsolete!";
      } else {
        endText="NO WINNERS!";
        endText2= "Only losers!";
      }
      color(LoopColor());
      text(endText, 10, G.HEIGHT/2, {scale: {x: 3, y: 3+s}});
      text(endText2, (G.WIDTH/2)-((endText2.length*12)/2), G.HEIGHT/2+20, {scale: {x: 2, y: 2}});
    }    
  }
  if (finaltimer > 400) {
    color("white");
    rect(0,0, G.WIDTH, G.HEIGHT);
    end("Play again?");
  }

}
let colors = ["red", "blue", "green", "yellow", "purple", "cyan", "light_red", "light_blue", "light_green", "light_yellow", "light_purple", "light_cyan"];
function LoopColor() {
  let index = parseInt(ticks / 2) % colors.length;
  return colors[index];
}

function getWinner(playerChoice, computerChoice) {
  let endText = "draw";
  if (playerChoice.weakness == computerChoice) {
    endText = `${computerChoice.name} beats ${playerChoice.name}`;
    return { winner: "Computer", loser: "Player", sprite: computerChoice.sprite, endText: endText};
  } else if (computerChoice.weakness == playerChoice) {
    endText = `${playerChoice.name} beats ${computerChoice.name}`;
    return { winner: "Player", loser: "Computer", sprite: playerChoice.sprite, endText: endText};
  } else {
    endText = `${playerChoice.name} is ${computerChoice.name}`;
    return { winner: "Draw", loser: "Draw", sprite: "d", endText: endText};
  }

}

function lerpVec(from, to, t) {
  return vec(
    from.x + (to.x - from.x) * t,
    from.y + (to.y - from.y) * t
  );
}

function lerp(from, to, t) {
  return from + (to - from) * t;
}

function easeVec(from, to, t, duration) {
  // Calculate the eased progress using an ease in out cubic function
  let easedT;
  if (t < 0.5) {
    easedT = 4 * t * t * t;
  } else {
    easedT = (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  // Calculate the current position using linear interpolation
  return vec(
    from.x + (to.x - from.x) * easedT,
    from.y + (to.y - from.y) * easedT
  );
}

function easeVecQ(from, to, t, duration) {
  // Calculate the eased progress using an ease in out quartic function
  let easedT = t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

  // Calculate the current position using linear interpolation
  return vec(
    from.x + (to.x - from.x) * easedT,
    from.y + (to.y - from.y) * easedT
  );
}

function easeVecInBack(from, to, t) {
  // Calculate the eased progress using the easeInBack function
  let easedT = easeInBack(t);

  // Calculate the current position using linear interpolation
  return vec(
    from.x + (to.x - from.x) * easedT,
    from.y + (to.y - from.y) * easedT
  );
}
function easeInBack(t, c = 1.70158) {
  return t * t * ((c + 1) * t - c);
}

// let fastSpinDuration = Math.random() * 4 + 1; // Random number between 1 and 5
// let startTicks = ticks;

// function drawCharactersInCircleB() {
//   let characters = ['a', 'b', 'c', 'a', 'b', 'c']; // Repeat characters
//   let centerX = G.WIDTH / 2;
//   let centerY = G.HEIGHT / 2;
//   let radius = 50; // Reduce radius to make characters closer together

//   for (let i = 0; i < characters.length; i++) {
//     let angle = (i / characters.length) * 2 * Math.PI; // Calculate angle for this character
//     let x = centerX + radius * Math.cos(angle);
//     let y = centerY + radius * Math.sin(angle);

//     char(characters[i], x, y, {scale: {x: 1, y: 1}}); // Change scale to 1
//   }

//   let elapsedSeconds = (ticks - startTicks) / 60; // Assuming 60 ticks per second
//   let deceleration = elapsedSeconds < fastSpinDuration ? 1 : 1 / elapsedSeconds;
//   let rotation = (ticks / 10 * deceleration) % 360;

//   bar(G.WIDTH/2, G.HEIGHT/2, 50, 2, rotation, 0);
// }

/*
------------------------ on select version with on release ------------------------
function selectState() {
  // currentStep should be 1, 3 or 5  
  let currentIndex = parseInt(ticks / 60) % G.STEP_SPREAD.length;
  let currentStep = G.STEP_SPREAD[currentIndex];
  
  let charScale = {x:3, y:3};
  let charColor = "light_black";
  
    if (input.isPressed) {
      color("yellow");
      rect((G.STEP_X*currentStep)-1,G.CPOS_Y-6, 52, 12);
      charScale = {x:4, y:4};
      charColor = "black";
    }
  
  color("green");
  rect(G.STEP_X*currentStep,G.CPOS_Y-5, 50, 10);
  color("yellow");
  text(" "+PossibleChoices[currentIndex].name,G.STEP_X*currentStep, G.CPOS_Y);
  color(charColor);
  
  let amplitude = (60 - 20) / 2; // The amplitude of the oscillation is half the range
  let midpoint = (60 + 20) / 2; // The midpoint of the oscillation is the average of the range
  let y = amplitude * Math.sin((ticks / 60) * 2 * Math.PI - Math.PI * 2) + midpoint;
  
  char(PossibleChoices[currentIndex].sprite, G.WIDTH/2, y, {scale: charScale});

  if (input.isJustReleased) {
    if (DissregardFirstButtonPress) {
      DissregardFirstButtonPress = false;
      return;
    }
    stateFunc = () => {
        color ("black");
        text("YOUR CHOICE:", 50, 20);
        color("green");
        rect(G.STEP_X*currentStep,G.CPOS_Y-5, 50, 10);
        color("black");
        text(" "+PossibleChoices[currentIndex].name,G.STEP_X*currentStep, G.CPOS_Y);
        char(PossibleChoices[currentIndex].sprite, G.WIDTH/2, y, {scale: charScale});       
    };
  }

  if (input.isJustPressed && DissregardFirstButtonPress) {
    DissregardFirstButtonPress = false;
    return;
  }

//  char(PossibleChoices[currentIndex].sprite, G.WIDTH/2, 40, {scale: {x: 4, y: 4}});
}


==== Old rotation code ==== (20240131)
const totalDuration = 500; // Adjust this value as needed
//Smooth rotation
let progress = Math.min(l / totalDuration, 1);
let easedProgress = 1- Math.pow(1-progress, 3);
let angle = easedProgress * 360;
let col = bar(G.WIDTH/2, G.HEIGHT/2, 55, 3, angle, 0);


*/

