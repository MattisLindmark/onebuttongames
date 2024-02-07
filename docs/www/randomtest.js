function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
  
    return color;
}

setTimeout(() => {
    
    
    var items = document.querySelectorAll('.item');
    items.forEach(function(item) {
        item.addEventListener('mouseover', function() {
            var card = item.querySelector('.card');
            console.log("card");
            card.style.backgroundColor = getRandomColor();
        });
    });
    
}, 1000);
  // var cards = document.querySelectorAll('.item:hover .card');
  // cards.forEach(function(card) {
  //   console.log("card");
  //     card.style.backgroundColor = getRandomColor();
  // });
  