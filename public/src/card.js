const templateCard = document.createElement('template');
templateCard.innerHTML = `
  <div class="card" draggable="true">
    <div class="card-edit-btn"></div>
    <div class="card-delete-btn"></div>

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
    this.$id = this.querySelector('.card-id');
    this.$title = this.querySelector('.card-title');
    this.$description = this.querySelector('.card-description');

    this.$titleInput = this.querySelector('.card-title-input');
    this.$descriptionInput = this.querySelector('.card-description-input');

    this.$editButton = this.querySelector('.card-edit-btn');
    this.$saveButton = this.querySelector('.card-save-btn');
    this.$deleteButton = this.querySelector('.card-delete-btn');

    // listen for events
    this.$editButton.addEventListener('click', this.toggleEdit.bind(this));
    this.$saveButton.addEventListener('click', this.saveCard.bind(this));
    this.$deleteButton.addEventListener('click', this.deleteCard.bind(this));
    this.$card.addEventListener('click', this.toggleDescription.bind(this));

    // handle dnd
    this.$card.addEventListener('dragstart', this.onDragStart.bind(this));

    this.$titleInput.hidden = true;

    subscribeToSearch(this.displayAccordinglyToSearch.bind(this));

    // render
    this._render();
  }

  // displayAccordinglyToSearch will show or hide the card depending
  // of the search query. This way we won't rerender the board entirely.
  displayAccordinglyToSearch(searchValue) {
    if (!searchValue) {
      this.hidden = false;
      return;
    }

    // if either the title or the description of the card includes
    // the query we will display the card
    const containsQuery =
      this._title.includes(searchValue) || this._description.includes(searchValue);

    this.hidden = !containsQuery;
  }

  toggleDescription() {
    if (this.__mode !== 'view') return;

    this.$description.hidden = !this.$description.hidden;
  }

  toggleEdit(e) {
    e.stopPropagation();

    this.__mode = this.__mode === 'view' ? 'edit' : 'view';

    if (this.__mode === 'view') {
      this.$title.hidden = false;
      this.$description.hidden = false;

      this.$titleInput.hidden = true;
      this.$descriptionInput.hidden = true;
      this.$saveButton.hidden = true;
    }

    if (this.__mode === 'edit') {
      this.$title.hidden = true;
      this.$description.hidden = true;

      this.$titleInput.hidden = false;
      this.$descriptionInput.hidden = false;
      this.$saveButton.hidden = false;

      this.$titleInput.value = this._title;
      this.$descriptionInput.value = this._description;
    }
  }

  async deleteCard(e) {
    e.stopPropagation();

    if (!window.confirm('Are you sure to delete this card ?')) return;

    await API.delete.card({ id: this._id });

    this.dispatchEvent(new CustomEvent('cardDelete', { detail: this._id }));
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

  disconnectedCallback() {}

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
    e.dataTransfer.setData(
      'text/json',
      JSON.stringify({
        id: this._id,
        columnId: this._columnId,
        // add other fields otherwise the JSON-SERVER api will remove them
        description: this._description,
        title: this._title,
      })
    );
  }

  _render() {
    this.$id.textContent = `#${this._id}`;
    this.$title.textContent = this._title;
    this.$description.textContent = this._description;
  }
}

window.customElements.define('trello-card', TrelloCard);
