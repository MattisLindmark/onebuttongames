// read titles.json and generate html based on the class styles.css
// and the template template.html
// using javascript

//var fs = require('fs');
//var path = require('path');
var path = "titles.json";
var gamePath = "https://mattislindmark.github.io/onebuttongames/?";


// read the file and parse the json. Using fetch() instead of readFileSync()
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
        <div class="boxart" style="--boxart-url: url('../${title.folderName}/boxart.jpg')"></div>
        <h2>${title.title}</h2>
        <img src="../${title.folderName}/screenshot.gif" alt="${title.title} Screenshot">
        <div class="infolable">
        <p>${title.description}</p>        
        <div class="play-button">
        <a href="${gamePath}${title.folderName}">Play</a>
        </div>
        </div>
        </div>`;
    });
    document.getElementById("games").innerHTML = html;
}

//         <div class="boxart" style="--boxart-url('../${title.folderName}/boxart.jpg')">test</div>

//        <div class="item" style="--boxart-url: url('../${title.folderName}/boxart.jpg')">
