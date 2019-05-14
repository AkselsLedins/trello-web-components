const templateColumn = document.createElement('template');
templateColumn.innerHTML = `
  <div>
    <h2></h2>
    <div>
      <div>a first card</div>
      <div>a second card</div>
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
