// read titles.json and generate html based on the class styles.css
// and the template template.html
// using javascript

//var fs = require('fs');
//var path = require('path');
var path = "titles.json";
var gamePath = "https://mattislindmark.github.io/onebuttongames/?";

let titles = [];
fetch(path)
  .then(response => response.json())
  .then(data => {
    // Now data is the parsed JSON object from the URL
    titles = data.games;
    console.log(titles);
    printTheHTML(titles);    
    console.log("hoj"+titles[0].title);
  })
  .catch(error => console.error('Error:', error));

  function printTheHTML(titles) {
    var html = "";
    titles.forEach(title => {
      html += `
        <div class="item">
        <div class="titlebar">${title.title}</div>
        <div class="boxart" style="--boxart-url: url('../${title.folderName}/boxart.jpg')"></div>
        <div class="card" style="--card-color: ${getRandomColorDeSat()}")>
        <img src="../${title.folderName}/screenshot.gif" alt="${title.title} Screenshot">
        <div class="play-button"><a href="${gamePath}${title.folderName}" alt="Play game"></a></div>
        <h2>${title.title}</h2>
        <p>${title.description}</p>        
        </div>
        </div>`;
    });
    document.getElementById("games").innerHTML = html;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 8)];
  }

  return color;
}

function getRandomColorDeSat() {
  var hue = Math.floor(Math.random() * 360); // Hue is a degree on the color wheel from 0 to 360
  var saturation = 35; // Saturation is a percentage from 0 (gray) to 100 (full color)
  var lightness = Math.floor(Math.random() * 51) + 15; // Lightness is a percentage from 0 (black) to 100 (white)
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getRandomNiceColor() {
  const niceColors = [
    '#FF5733', // Coral
    '#3498DB', // Dodger Blue
    '#27AE60', // Emerald Green
    '#FFC300', // Sunflower Yellow
    '#9B59B6', // Amethyst Purple
    '#E74C3C', // Alizarin Red
    '#1ABC9C', // Turquoise
    '#F39C12', // Orange
  ];

  return niceColors[Math.floor(Math.random() * niceColors.length)];
}

//         <div class="boxart" style="--boxart-url('../${title.folderName}/boxart.jpg')">test</div>

//        <div class="item" style="--boxart-url: url('../${title.folderName}/boxart.jpg')">
