const templateColumn = document.createElement('template');
templateColumn.innerHTML = `
  <div class="column-wrapper">
    <div class="column">
      <div class="column-header">
        <h2></h2>
      </div>
      <div class="cards">
        <div class="card">
          <div class="card-title">a first card</div>
        </div>
        <div class="card">
          <div class="card-title">a second card</div>
        </div>

        <hr />
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
  }

  connectedCallback() {
    this.appendChild(templateColumn.content.cloneNode(true));

    // get local references
    this.$title = this.querySelector('h2');

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

  _render() {
    this.$title.textContent = this._title;
  }
}

window.customElements.define('trello-column', TrelloColumn);
