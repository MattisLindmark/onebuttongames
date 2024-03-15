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
  WIDTH: 110,
  HEIGHT: 200,
  SEED: 1
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

// ==================== melodies ====================
/*
const melody = [
  "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4", // Main theme
  "c4", "e4", "a4", "b4", // Transition
  "e4", "g#4", "b4", "c5", // Transition
  "e4", "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4" // Main theme
];

const melody = [
  "c4", "a4", "a4", "a4", "g#4", "e4", "e4", "e4", "d#5", "d#5", // Main theme
  "d#5", "d#5", "e5", "e5", "e5", "e5", "e5", "e5", "b4", "b4", // Main theme
  "b4", "b4", "d5", "d5", "c5", "c5", "c5" // Main theme
];
const melody = [
  "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4", "", // Main theme
  "c4", "e4", "a4", "b4", "", // Transition
  "e4","g#4", "b4", "c5", "", // Transition
  "e4", "e5", "d#5", "e5", "d#5", "e5", "b4", "d5", "c5", "a4", "" // Main theme
];
*/

let baseNoteBar = {
  pos: vec(0, 0),
  isPause: false,
  note: "",
  hasPlayed: false
};

let sheet = [];


const melody = [
  "d4", "d4", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "c4", "c4", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "b3", "b3", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "a#3", "a#3", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  // lazy repeat
  "d4", "d4", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "c4", "c4", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "b3", "b3", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4",
  "a#3", "a#3", "d5", "", "a4", "", "", "g#4", "", "g4", "", "f4", "", "d4", "f4", "g4"
];

let duplex = false;
let dNr = 0;
let songPosition = 0;
let s = 1;
function update() {
  if (!ticks) {
    sss.setSeed(2);
    createSheet();
  }
  color("cyan");
  rect(50, 50, 1, 100,);
  drawSheet();
  
  moveNoteBar();

  // loop through sheet, and play each note bar
  for (let i = 0; i < sheet.length; i++) {
    let n = sheet[i].note;
    if (n != "" && sheet[i].pos.x < 61 && sheet[i].pos.x > 49 && !sheet[i].hasPlayed) {
      if (!sheet[i].hasPlayed) {
        if (input.isJustPressed || input.isJustReleased)
        {
          let scoreCalc= sheet[i].pos.x-50;
          if (scoreCalc < 0) scoreCalc = 0;
          if (scoreCalc > 9) particle(sheet[i].pos, 10);
          console.log("Score: " + scoreCalc);
          score += scoreCalc;

        if (duplex) {
          duplex = false;
          play("synth", { note: n, volume: 0.5, seed: s });
        } else {
          duplex = true;
          play("synth", { note: n, volume: 0.5, seed: s });
        }
        sheet[i].hasPlayed = true;
      }                   
      }
    }
  }

  /*
  if (ticks % 15 === 0) {
    color("black");
    rect(50, 50, 10, 10,);
    let n = calcNote(songPosition);
    //console.log("Note: " + n);
    if (n != "") {
      if (dNr == 0) {
        //duplex = false;
        play("synth", { note: n, volume: 0.5, seed: s });
      }
      if (dNr == 1) {
        //duplex = true;
        play("synth", { note: n, volume: 0.5, seed: s });
      }
      if (dNr == 2) {
        //duplex = false;
        play("synth", { note: n, volume: 0.5, seed: s });
      }
      if (dNr == 3) {
        //duplex = true;
        play("synth", { note: n, volume: 0.5, seed: s });
      }
      //    play("tone", { note: n, volume: 0.5, seed: 1});
    }
    duplex = !duplex;
    dNr++;
    if (dNr > 3) {
      dNr = 0;
    }
    songPosition++;
  }
  */

}

function calcNote(pos) {
  return melody[pos % melody.length];
}

function createSheet(m = melody) {
  let noteBar = {
    pos: vec(0, 0),
    isPause: false,
    note: "",
    hasPlayed: false
  };
  sheet = [];
  // based on the melody, create the sheet where each note represents a y value, like a piano. b4 = 10 and c3 = G.HEIGHT - 10
  // They are evely spred out in X. so they are 15 pixels apart.

  for (let i = 0; i < m.length; i++) {
    let note = m[i];
    let yValue = getY(note);
    let noteBar = {}; // Create a new object
    noteBar.pos = vec(G.WIDTH+(i*15), yValue);
    noteBar.isPause = m[i] == "";
    noteBar.note = note;
    sheet.push(noteBar);
  }
  // use json to console log the sheet for debugging
  console.log(JSON.stringify(sheet));

}
function getY(note = "") {
  if (note == "") {
    return G.HEIGHT / 10;
  }
  //  y value, like a piano. b4 = 10 and c3 = G.HEIGHT - 10.
  let noteMap = ["c3", "c#3", "d3", "d#3", "e3", "f3", "f#3", "g3", "g#3", "a3", "a#3", "b3", "c4", "c#4", "d4", "d#4", "e4", "f4", "f#4", "g4", "g#4", "a4", "a#4", "b4", "c5", "c#5", "d5", "d#5", "e5", "f5", "f#5", "g5", "g#5", "a5", "a#5", "b5"];
  // find index of note in noteMap
  let index = noteMap.indexOf(note);
  // return y value
 // console.log("y: " + (index + 1) * 2);
  return (index + 1) * 5;

}
function moveNoteBar() {
  // move note bar to the right
  // if it is at the end, reset to the beginning
  
  // loop through sheet, and move each note bar to the left
  for (let i = 0; i < sheet.length; i++) {
    sheet[i].pos.x -= 1;
    }
  }

function drawSheet() {
  // draw the sheet
  for (let i = 0; i < sheet.length; i++) {
    let n = sheet[i].note;
    if (n != "") {
      let c = sheet[i].hasPlayed ? "blue" : "green";
      color(c);
      rect(sheet[i].pos.x, sheet[i].pos.y, 5, 5);
      color("black");
      //console.log("Drawing note: " + n);
    }
  }
}
