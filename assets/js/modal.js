class Modal {
  constructor (classes) {
    this.classes = classes;
    this.modal = '';
    this.modalContent = '';
    this.modalCloseBtn = '';
    this.overlay = '';
  }

  buildModal(content) {
    this.overlay = this.createDomNode(this.overlay, 'div', 'overlay', 'overlay_modal');
    this.modal = this.createDomNode(this.modal, 'div','modal', this.classes);
    this.modalContent = this.createDomNode(this.modalContent, 'div', 'modal__content');
    this.modalCloseBtn = this.createDomNode(this.modalCloseBtn, 'button','button_round','button', 'modal__close-btn');
    this.modalCloseBtn.innerHTML = '<img src="../../assets/icons/x-icon.svg" alt="x" class="modal__close-icon">';

    this.setContent(content);

    this.appendModalElements();

    // Bind events
    this.bindEvents();

    this.openModal(); // open modal
  }

  createDomNode(node, element, ...classes) {
    node = document.createElement(element);
    node.classList.add(...classes);
    return node;
  }

  setContent(content) {
    if (typeof content === 'string') {
      this.modalContent.innerHTML = content;
    } else {
      this.modalContent.innerHTML = '';
      this.modalContent.appendChild(content);
    }
  }

  appendModalElements() {
    this.modal.append(this.modalCloseBtn);
    this.modal.append(this.modalContent);
    this.overlay.append(this.modal);
  }

  bindEvents() {
    this.modalCloseBtn.addEventListener('click', this.closeModal);
    this.overlay.addEventListener('click', this.closeModal);
  }

  openModal() {
    document.body.append(this.overlay);
    document.body.classList.toggle('_lock');
    this.modal.classList.add('modal-open');
  }

  closeModal(e){
    let classes = e.target.classList;
    if (classes.contains('overlay')||classes.contains('modal__close-btn')||classes.contains('modal__close-icon')) {
      document.querySelector('.modal').classList.add('modal-close');
      document.body.classList.remove('_lock');
      setTimeout(() => {
        document.querySelector('.overlay').remove();
      }, 450);
    }
  }
}

class PetModal extends Modal {
  constructor(classes, {name, img,type,breed,description,age,inoculations,diseases,parasites}) {
    super(classes);
    this.name = name;
    this.img = img;
    this.type = type;
    this.breed = breed;
    this.description = description;
    this.age = age;
    this.inoculations = inoculations;
    this.diseases = diseases;
    this.parasites = parasites;
  }

  generatePetsModal() {
    let template = '';
    let petContent = document.createElement('div');
    petContent.className = 'pet-modal__content';

    this.img && 
    (template += `<img src="../../assets/icons/${this.img}" alt="pet photo" class="pet-modal__img">`);

    template += `<div class="pet-modal__info">`;
      
    this.name && 
    (template += `<h3 class="pet-modal__name">${this.name}</h3>`);

    this.type && 
    (template += `<h4 class="pet-modal__type">${this.type} - `);

    if (this.breed) {
      (template += `${this.breed}</h4>`);
    } else {
      (template += `unknown breed </h4>`);
    }

    this.description && 
    (template += `<h5 class="pet-modal__description">${this.description}</h5>`);

    template += `<ul class="pet-modal__list">`;
    
    if(this.age) {
      template += `<li class="pet-modal__list-item"><span class="pet-modal__span">Age: </span>${this.age}</li>`;
    }
    if(this.inoculations) {
      template += `<li class="pet-modal__list-item"><span class="pet-modal__span">Inoculations: </span>${this.inoculations}</li>`;
    }
    if(this.diseases) {
      template += `<li class="pet-modal__list-item"><span class="pet-modal__span">Diseases: </span>${this.diseases}</li>`;
    }
    if(this.parasites) {
      template += `<li class="pet-modal__list-item"><span class="pet-modal__span">Parasites: </span>${this.parasites}</li>`;
    }

    template += `</ul>`;
    template += `</div>`;

    petContent.innerHTML = template;
    return petContent;
  }

  renderModal() {
    let content = this.generatePetsModal();
    super.buildModal(content);
}
}

const grid = document.getElementById('grid-curr');
var data;
// Loading data from pets.json 
const loadAnimalData = () => {
  fetch("../../assets/js/pets.json")
  .then(response => response.json())
  .then(json => modalFunction(json));
};
loadAnimalData();

const modalFunction = (json) => {
  data = json;
  addPetsClickHandler();
};

const addPetsClickHandler = () => {
  document.getElementById('grid-curr').addEventListener('click', (event) => {
    if (event.target.closest('.animal__content')) {
      generateToolsModal(event.target.closest('.animal__content'));
    }
  });
};

const generateToolsModal = (item) => {
  let clickedPetId = item.getAttribute('id');
  let clickedPetData = data[clickedPetId];
  renderPetModalWindow(clickedPetData);
};

const renderPetModalWindow = (pet) => {
  let modal = new PetModal ('pet-modal', pet);
  modal.renderModal();
};