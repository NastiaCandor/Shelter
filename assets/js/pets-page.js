const animalSlider = document.querySelector('.animal__slider');
const currGrid = document.getElementById('grid-curr');
const prevGrid = document.getElementById('grid-prev');
const nextGrid = document.getElementById('grid-next');
const btnNumber = document.getElementById('btn-number');
const btnPrev = document.getElementById('btn-prev'),
      btnNext = document.getElementById('btn-next'),
      btnStart = document.getElementById('btn-start'),
      btnEnd = document.getElementById('btn-end');
var data; // pets data
var order; // order for layout
var viewPics = 8; // how many pets are on the screen
let pageNumber = Number(btnNumber.innerHTML);

window.onload = function() {
  loadAnimalData(); // load pet data
  plugButtons(); // turn buttons
};

// Loading data from pets.json
const loadAnimalData = () => {
  fetch("../../assets/js/pets.json")
  .then(response => response.json())
  .then(json => createAnimalGrid(json));
};

// Fill grid with necessary content according the grid and order
const fillGrid = (grid,order) => {
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
    aboutHref.classList.add('_slider');     
    aboutHref.innerHTML = 'Learn more';
    aboutButton.appendChild(aboutHref);
    animalContent.appendChild(aboutButton);
    
    grid.appendChild(animalContent);
  });
};

// Get random order for layout
// This function used only once as said in the task
const getRandomOrder = () => {
  let randomOrder = [];
  let result = [];
  for (let i = 0; i < 8; i++) randomOrder.push(i);
  randomOrder.sort(() => Math.random()-0.5);

  const part1 = randomOrder.slice(0,3);
  const part2 = randomOrder.slice(3,6);
  const part3 = randomOrder.slice(6,8);

  for (let i = 0; i < 6; i++) {
    part1.sort(() => Math.random()-0.5);
    part2.sort(() => Math.random()-0.5);
    part3.sort(() => Math.random()-0.5);
    result.push(...part1, ...part2, ...part3);
  }
  return result;
};

// How many content slides should be on the screen
function checkViewPics() {
  let width = document.documentElement.clientWidth;
  if (width <= 600 ) { // if screen is smaller 600px
    if (viewPics != 3) {
      // if screen size change the layout of grid
      resizeGrid(viewPics,3); 
      viewPics = 3;
    }
  } else if (width < 1279 ) { // if screen is smaller 1279px
    if (viewPics !=6 ) {
      resizeGrid(viewPics,6);
      viewPics = 6;
    }
  } else { 
    if (viewPics != 8) {
      resizeGrid(viewPics,8);
      viewPics = 8;
    }
  }
}

// Split order to page sets, orders for each page
function pageOrder(size) {
  let result = [];
  for (let i = 0; i < Math.ceil(order.length/size); i++) {
    result[i] = order.slice((i*size), (i*size)+size);
  }
  return result;
}

// Fresh grid if screen is changed
function resizeGrid(oldView,newView) {
  let start = oldView*(pageNumber-1)+1;
  // change page according new layout
  if (pageNumber != 1) {
    pageNumber = Math.ceil(start/newView);
  }
  // split whole order to page sets
  let newOrder = pageOrder(newView);
  currGrid.innerHTML = '';
  // fill current grid with content according to new page 
  fillGrid(currGrid,newOrder[pageNumber-1]);
  viewPics = newView;
  buttonChange(pageNumber); // change page on screen and if necessary turn buttons off
}

// Track viewed cards on the screen
window.addEventListener('resize', () => {
  if (!checkTransition()) {
    setTimeout(checkViewPics,1000); // set timeout to avoid incorrect layout if screensize change while page is moving
  } else {
    checkViewPics();
  }
});

// Start page function
const createAnimalGrid = (json) => {
  data = json; // saving data for other functions
  order = getRandomOrder(); // creating order for layout
  buttonChange(pageNumber); // enable buttons
  fillGrid(currGrid, order.slice(0,viewPics)); // fill current grid
};

// On/Off for buttons depending on the page and screen size
function buttonChange(page) {
  if (page == 1) { // if the first page
    btnPrev.classList.add('_disabled');
    btnStart.classList.add('_disabled');
    btnNext.classList.remove('_disabled');
    btnEnd.classList.remove('_disabled');
  } else if ( ((page == 6)&&(viewPics==8))||((page == 8)&&(viewPics==6))||((page == 16)&&(viewPics==3)) ){ // if the last page
    btnPrev.classList.remove('_disabled');
    btnStart.classList.remove('_disabled');
    btnNext.classList.add('_disabled');
    btnEnd.classList.add('_disabled');
  } else { // if other pages
    btnPrev.classList.remove('_disabled');
    btnStart.classList.remove('_disabled');
    btnNext.classList.remove('_disabled');
    btnEnd.classList.remove('_disabled');
  }
  btnNumber.innerHTML = page; // show page number
}

// Buttons logic
function changeContent(dir) {
  switch (dir) {
    case 'next':
      buttonChange(++pageNumber);
      animalSlider.classList.add('transition-right'); //transitioning
      // fill grid to transition effect with necessary part of order
      fillGrid(nextGrid, order.slice(viewPics*(pageNumber-1),viewPics*pageNumber));
      break;
    case 'prev':
      buttonChange(--pageNumber);
      animalSlider.classList.add('transition-left'); //transitioning
      fillGrid(prevGrid, order.slice(viewPics*(pageNumber-1),viewPics*pageNumber));
      break;
    case 'start':
      buttonChange(pageNumber = 1);
      animalSlider.classList.add('transition-left'); //transitioning
      prevGrid.innerHTML='';
      fillGrid(prevGrid, order.slice(0,viewPics));
      break;
    case 'end':
      if (viewPics == 8) pageNumber = 6;
        else if (viewPics == 6) pageNumber = 8;
          else pageNumber = 16;
      buttonChange(pageNumber);
      animalSlider.classList.add('transition-right'); //transitioning
      nextGrid.innerHTML='';
      fillGrid(nextGrid, order.slice(viewPics*(pageNumber-1),viewPics*pageNumber));
      break;
  }
}

// check is grid is moving
function checkTransition() {
  return ((!animalSlider.classList.contains('transition-right')) && (!animalSlider.classList.contains('transition-left')));
}

// adding listeners to buttons
function plugButtons() {
  btnStart.addEventListener('click',() => {
    if (checkTransition()&&(!btnStart.classList.contains('_disabled')))
      changeContent('start');
  });
  btnPrev.addEventListener('click',() => {
    if (checkTransition()&&(!btnStart.classList.contains('_disabled'))) changeContent('prev');
  });
  btnNext.addEventListener('click', () => {
    if (checkTransition()&&(!btnEnd.classList.contains('_disabled'))) changeContent('next');
  });
  btnEnd.addEventListener('click',() => {
    if (checkTransition()&&(!btnEnd.classList.contains('_disabled'))) changeContent('end');
  });
}

// movement of slider
animalSlider.addEventListener('animationend', (animationEvent) => {
  // next or end btn clicked then
  if (animationEvent.animationName == "click-right") {
    animalSlider.classList.remove('transition-right');
    currGrid.innerHTML = nextGrid.innerHTML; // move nect to curr
    nextGrid.innerHTML = ''; // delete next grid 
  } else { // prev or start btn clicked then
      animalSlider.classList.remove('transition-left');
      currGrid.innerHTML = prevGrid.innerHTML; // move prev to curr
      prevGrid.innerHTML = ''; // delete prev grid
  }
});