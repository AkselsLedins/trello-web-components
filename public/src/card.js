const templateCard = document.createElement('template');
templateCard.innerHTML = `
  <div class="card">
    <button class="card-edit-btn">Edit</button>
    <div class="card-id"></div>
    <div class="card-title"></div>
    <input hidden class="card-title card-title-input" />
    <textarea hidden class="card-description card-description-input"></textarea>
    <div class="card-description"></div>
    <button hidden class="primary card-save-btn">Save</button>
  </div>
`;

class TrelloCard extends HTMLElement {
  constructor() {
    super();

    // initial state
    this._id = '';
    this._title = '';
    this._description = '';
    this._columnId = null;
  }

  connectedCallback() {
    this.appendChild(templateCard.content.cloneNode(true));

    // get local references
    this.$title = this.querySelector('.card-title');
    this.$titleInput = this.querySelector('.card-title-input');
    this.$descriptionInput = this.querySelector('.card-description-input');

    this.$editButton = this.querySelector('.card-edit-btn');
    this.$saveButton = this.querySelector('.card-save-btn');

    // listen for events
    this.$editButton.addEventListener('click', this.toggleEdit.bind(this));
    this.$saveButton.addEventListener('click', this.saveCard.bind(this));

    this.$titleInput.hidden = true;

    // render
    this._render();
  }

  toggleEdit() {
    this.$title.hidden = !this.$title.hidden;
    this.$titleInput.hidden = !this.$titleInput.hidden;
    this.$descriptionInput.hidden = !this.$descriptionInput.hidden;
    this.$saveButton.hidden = false

    if (!this.$titleInput.hidden) {
      this.$titleInput.value = this._title;
      this.$descriptionInput.value = this._description;


      console.log('this.$descriptionInput.value', this._description, this.$descriptionInput.value);
    }
  }

  async saveCard() {
    const title = this.$titleInput.value;
    const description = this.$descriptionInput.value;
    const columnId = this._columnId;
    const id = this._id;

    const card = await API.update.card({ id, title, columnId, description });

    this.dispatchEvent(new CustomEvent('cardUpdate', { detail: card }));

    this.toggleEdit();
  }

  disconnectedCallback() { }

  static get observedAttributes() {
    return ['id', 'title', 'description', 'columnid'];
  }
  attributeChangedCallback(name, _, newValue) {
    if (name === 'columnid') {
      this[`_columnId`] = newValue;
      return;
    }
    this[`_${name}`] = newValue || '';
  }

  _render() {
    this.$title.textContent = this._title;
  }
}

window.customElements.define('trello-card', TrelloCard);
