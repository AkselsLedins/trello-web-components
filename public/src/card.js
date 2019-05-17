const templateCard = document.createElement('template');
templateCard.innerHTML = `
  <div class="card" draggable="true">
    <button class="card-edit-btn">Edit</button>
    <div class="card-id"></div>
    <div class="card-title"></div>
    <div hidden class="card-description"></div>

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

    this.__mode = 'view';
  }

  connectedCallback() {
    this.appendChild(templateCard.content.cloneNode(true));

    // get local references
    this.$card = this.querySelector('.card');
    this.$title = this.querySelector('.card-title');
    this.$description = this.querySelector('.card-description');

    this.$titleInput = this.querySelector('.card-title-input');
    this.$descriptionInput = this.querySelector('.card-description-input');

    this.$editButton = this.querySelector('.card-edit-btn');
    this.$saveButton = this.querySelector('.card-save-btn');

    // listen for events
    this.$editButton.addEventListener('click', this.toggleEdit.bind(this));
    this.$saveButton.addEventListener('click', this.saveCard.bind(this));
    this.$card.addEventListener('click', this.toggleDescription.bind(this));

    // handle dnd
    this.$card.addEventListener('dragstart', this.onDragStart.bind(this))

    this.$titleInput.hidden = true;

    // render
    this._render();
  }

  toggleDescription() {
    if (this.__mode !== 'view') return;

    this.$description.hidden = !this.$description.hidden;
  }

  toggleEdit(e) {
    e.stopPropagation();

    this.__mode = this.__mode === 'view' ? 'edit' : 'view';

    if (this.__mode === 'view') {
      this.$title.hidden = false
      this.$description.hidden = false

      this.$titleInput.hidden = true
      this.$descriptionInput.hidden = true
      this.$saveButton.hidden = true
    }


    if (this.__mode === 'edit') {
      this.$title.hidden = true
      this.$description.hidden = true

      this.$titleInput.hidden = false
      this.$descriptionInput.hidden = false
      this.$saveButton.hidden = false

      this.$titleInput.value = this._title;
      this.$descriptionInput.value = this._description;
    }
  }

  async saveCard(e) {
    e.stopPropagation();

    const title = this.$titleInput.value;
    const description = this.$descriptionInput.value;
    const columnId = this._columnId;
    const id = this._id;

    const card = await API.update.card({ id, title, columnId, description });

    this.dispatchEvent(new CustomEvent('cardUpdate', { detail: card }));

    this.toggleEdit(e);
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

  onDragStart(e) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/json', JSON.stringify({
      id: this._id,
      columnId: this._columnId,
      // add other fields otherwise the JSON-SERVER api will remove them
      description: this._description,
      title: this._title,
    }));
  }

  _render() {
    this.$title.textContent = this._title;
    this.$description.textContent = this._description;
  }
}

window.customElements.define('trello-card', TrelloCard);
