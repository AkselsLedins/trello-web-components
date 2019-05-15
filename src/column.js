const templateColumn = document.createElement('template');
templateColumn.innerHTML = `
  <div class="column-wrapper">
    <div class="column">
      <div class="column-header">
        <h2></h2>
      </div>

      <div class="cards cards-container"></div>

      <div class="cards">
        <trello-card-creator></trello-card-creator>
      </div>
    </div>
  </div>
`;

class TrelloColumn extends HTMLElement {
  constructor() {
    super();

    // initial state
    this._title = '';
    this._cards = [];
  }

  connectedCallback() {
    this.appendChild(templateColumn.content.cloneNode(true));

    // get local references
    this.$title = this.querySelector('h2');
    this.$cardsContainer = this.querySelector('.cards-container');
    this.$cardCreator = this.querySelector('trello-card-creator');

    // listen to events
    this.$cardCreator.addEventListener('cardCreation', this.addCard.bind(this));

    // render
    this._render();
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['title'];
  }
  attributeChangedCallback(name, _, newValue) {
    this[`_${name}`] = newValue;
  }

  addCard(e) {
    // find the next id
    const nextId = this._cards.length ? Math.max.apply(Math, this._cards.map(o => o.id)) + 1 : 1;
    const { title, description } = e.detail;

    const newCard = {
      id: nextId,
      title,
      description,
    };

    this._cards.push(newCard);

    this._render();
  }

  _render() {
    this.$title.textContent = this._title;

    this.$cardsContainer.innerHTML = '';

    this._cards.forEach(({ id, title, description }, index) => {
      // instantiate a new column
      const $item = document.createElement('trello-card');

      $item.setAttribute('id', id);
      $item.setAttribute('title', title);
      $item.setAttribute('description', description);

      $item.index = index;

      this.$cardsContainer.appendChild($item);
    });
  }
}

window.customElements.define('trello-column', TrelloColumn);
