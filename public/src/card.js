const templateCard = document.createElement('template');
templateCard.innerHTML = `
  <div class="card">
    <div class="card-id"></div>
    <div class="card-title"></div>
    <div class="card-description"></div>
  </div>
`;

class TrelloCard extends HTMLElement {
  constructor() {
    super();

    // initial state
    this._id = '';
    this._title = '';
    this._description = '';
  }

  connectedCallback() {
    this.appendChild(templateCard.content.cloneNode(true));

    // get local references
    this.$title = this.querySelector('.card-title');

    // render
    this._render();
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['id', 'title', 'description'];
  }
  attributeChangedCallback(name, _, newValue) {
    this[`_${name}`] = newValue;
  }

  _render() {
    this.$title.textContent = this._title;
  }
}

window.customElements.define('trello-card', TrelloCard);
