const animalSlider = document.querySelector('.animal__slider');
const currGrid = document.getElementById('grid-curr');
const prevGrid = document.getElementById('grid-prev');
const nextGrid = document.getElementById('grid-next');
const leftButton = document.getElementById('btn-slider-left');
const rightButton = document.getElementById('btn-slider-right');
let prevOrder = [],
    currOrder = [],
    nextOrder = [];
var data;

window.onload = function() {
  loadAnimalData();
  moveSlider();
  document.addEventListener("touchstart", function(){}, true);
};

// Loading data from pets.json and filling the main page slider with content
const loadAnimalData = () => {
  fetch("../../assets/js/pets.json")
  .then(response => response.json())
  .then(json => createAnimalGrid(json));
};

const getRandomOrder = (out, max) => {
  let randomOrder = [];
  for (let i = 0; i <= (max-1); i++) {
    if (!out.includes(i)) {
      randomOrder.push(i);
    } 
  }
  randomOrder.sort(() => Math.random()-0.5);
  return randomOrder;
};

function fillGrid (data, grid, order) {
  order.forEach((i) => {
    let animalContent = document.createElement('div');
    animalContent.classList.add('animal__content');
    animalContent.setAttribute('id',i);
    let img = document.createElement('img');
    img.src = data[i].img;
    img.alt = `photo of ${data[i].name} ${data[i].type}`;
    img.classList.add('animal__photo_content');

    let animalImg = document.createElement('div');
    animalImg.classList.add('animal__photo');
    animalContent.appendChild(img);

    let animalName =  document.createElement('p');
    animalName.innerHTML = data[i].name;
    animalName.classList.add('animal__name');
    animalContent.appendChild(animalName);

    let aboutButton = document.createElement('div');
    aboutButton.classList.add('btn-learn');
    let aboutHref = document.createElement('a');
    aboutHref.classList.add('button');
    aboutHref.classList.add('button_bordered');     
    aboutHref.innerHTML = 'Learn more';
    aboutButton.appendChild(aboutHref);
    animalContent.appendChild(aboutButton);

    grid.appendChild(animalContent);
  });
} 

// Filling main page slider with content (3 items) when page is open
const createAnimalGrid = (json) => {
  data = json;
  let order = getRandomOrder([], 8);
  prevOrder = order.slice(0, 3);
  currOrder = order.slice(3, 6);
  nextOrder = order.slice(0, 3);
  fillGrid(data, prevGrid, prevOrder);
  fillGrid(data, currGrid, currOrder);
  fillGrid(data, nextGrid, nextOrder);
};

const changeSlides = (dir) => {
  if (dir === -1) { // prev btn clicked
    nextOrder = currOrder;
    currOrder = prevOrder;
    prevOrder = getRandomOrder(currOrder, 8).slice(0,3);
  } else { // next btn clicked
    prevOrder = currOrder;
    currOrder = nextOrder;
    nextOrder = getRandomOrder(currOrder, 8).slice(0,3);
  }
};

const moveSlider = () => {
  leftButton.addEventListener("click", () => {
    // if not in movement
    if ((!animalSlider.classList.contains('transition-right')) && (!animalSlider.classList.contains('transition-left'))) {
        changeSlides(-1); 
        animalSlider.classList.add('transition-left'); //transitioning
    } 
  });
  // next click
  rightButton.addEventListener("click", () => {
      // if not in movement
      if ((!animalSlider.classList.contains('transition-right')) && (!animalSlider.classList.contains('transition-left'))) {
          changeSlides(1);
          animalSlider.classList.add('transition-right');
      }
  });
};

// movement of slider
animalSlider.addEventListener('animationend', (animationEvent) => {
  // next btn clicked then
  if (animationEvent.animationName == "click-right") {
    animalSlider.classList.remove('transition-right');
    prevGrid.innerHTML = currGrid.innerHTML; // move curr to prev
    currGrid.innerHTML = nextGrid.innerHTML; // move nect to curr
    nextGrid.innerHTML = ''; // delete next grid
    fillGrid(data, nextGrid, nextOrder); // create next grid
      
  } else { // prev btn clicked then
      animalSlider.classList.remove('transition-left');
      nextGrid.innerHTML = currGrid.innerHTML; // move curr to next
      currGrid.innerHTML = prevGrid.innerHTML; // move prev to curr
      prevGrid.innerHTML = ''; // delete prev grid
      fillGrid(data, prevGrid, prevOrder); // create prev grid
  }
});