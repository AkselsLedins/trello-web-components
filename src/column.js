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
    this._id = this.getAttribute('id') || null;
    this._title = this.getAttribute('title') || null;
    this._cards = [];

    this.fetchData.bind(this);
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

    this.fetchData();
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['id', 'title'];
  }
  attributeChangedCallback(name, _, newValue) {
    this[`_${name}`] = newValue;
  }

  async fetchData() {
    const response = await fetch(`http://localhost:3000/cards?columnId=${this._id}`);
    const cards = await response.json();

    this._cards = cards;

    this._render();
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
