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

    // more info on why you need to keep a counter
    // when implementing dnd
    // https://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    this._dragCounter = 0;
  }

  connectedCallback() {
    this.appendChild(templateColumn.content.cloneNode(true));

    // get local references
    this.$title = this.querySelector('h2');
    this.$cardCreator = this.querySelector('trello-card-creator');
    this.$cardsContainer = this.querySelector('.cards-container');
    this.$columnWrapper = this.querySelector('.column-wrapper');

    // listen to custom events
    this.$cardCreator.addEventListener('cardCreation', this.addCard.bind(this));
    // listen to dnd events
    this.$columnWrapper.addEventListener('dragenter', this.onCardHover.bind(this))
    this.$columnWrapper.addEventListener('dragleave', this.onCardLeave.bind(this))
    this.$columnWrapper.addEventListener('drop', this.onDrop.bind(this))
    this.$columnWrapper.addEventListener('dragover', this.onDragOver.bind(this))

    // render
    this._render();

    this.fetchData();
  }

  disconnectedCallback() { }

  static get observedAttributes() {
    return ['id', 'title'];
  }
  attributeChangedCallback(name, _, newValue) {
    this[`_${name}`] = newValue;
  }

  // https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
  onDragOver(e) { e.preventDefault() }
  onCardHover(e) {
    // console.log('hover', e);
    e.preventDefault();
    this._dragCounter++;

    this.$columnWrapper.className += " hovered";
  }
  onCardLeave() {
    this._dragCounter--;

    if (this._dragCounter === 0) {
      this.$columnWrapper.className = "column-wrapper";
    }
  }
  async onDrop(e) {
    this.$columnWrapper.className = "column-wrapper";
    this._dragCounter = 0;

    const data = JSON.parse(e.dataTransfer.getData('text/json'));

    // update card
    await API.update.card({ ...data, columnId: this._id });

    // NOTE optimization here
    await this.fetchData();
  }


  async fetchData() {
    const cards = await API.get.cards(`columnId=${this._id}`);

    this._cards = cards;

    this._render();
  }

  async addCard(e) {
    // find the next id
    const { title, description } = e.detail;

    const data = await API.create.card({
      title,
      description,
      columnId: this._id,
    });

    this._cards.push(data);

    this._render();
  }

  replaceCard(e) {
    const newCard = e.detail;
    const index = this._cards.findIndex(card => card.id === newCard.id)

    this._cards[index] = newCard;

    // NOTE rerendering everything is quite poor as we loose
    // the other cards state
    this._render();
  }

  _render() {
    this.$title.textContent = this._title;

    this.$cardsContainer.innerHTML = '';

    this._cards.forEach(({ id, title, description, columnId }, index) => {
      // instantiate a new column
      const $item = document.createElement('trello-card');

      $item.setAttribute('id', id);
      $item.setAttribute('title', title);
      $item.setAttribute('columnId', columnId);
      $item.setAttribute('description', description || '');

      $item.index = index;

      // listen to custom event
      $item.addEventListener('cardUpdate', this.replaceCard.bind(this))
      // listen to native event dragend to fetch all data again
      $item.addEventListener('dragend', this.fetchData.bind(this));

      this.$cardsContainer.appendChild($item);
    });
  }
}

window.customElements.define('trello-column', TrelloColumn);
