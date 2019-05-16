const templateApp = document.createElement('template');
templateApp.innerHTML = `
  <section id="app">
    <div id="columns-container">
    </div>

    <trello-column-creator></trello-column-creator>
  </section>
`;

class TrelloApp extends HTMLElement {
  constructor() {
    super();

    // initial state
    this._columns = [];

    this.fetchData.bind(this);
    this.fetchData();
  }

  connectedCallback() {
    this.appendChild(templateApp.content.cloneNode(true));

    // get local references
    this.$columnCreator = this.querySelector('trello-column-creator');
    this.$columnsContainer = this.querySelector('#columns-container');

    // listen for events: column creation
    this.$columnCreator.addEventListener('columnCreation', this.addColumn.bind(this));

    // render
    this._render();
  }

  disconnectedCallback() {}

  async fetchData() {
    const response = await API.get.columns();
    const columns = await response.json();

    this._columns = columns;

    this._render();
  }

  addColumn(e) {
    // find the highest id if present and add 1
    const nextId = Math.max.apply(Math, this._columns.map(o => o.id)) || 0 + 1;

    this._columns.push({ id: nextId, title: e.detail });
    this._render();
  }

  _render() {
    if (!this.$columnsContainer) return;

    // redraw everything
    //
    // NOTE: poor performance but it should be ok for small boards
    //       We may run into issues quickly when we'll start
    //       drag'n'dropping cards.
    this.$columnsContainer.innerHTML = '';

    this._columns.forEach(({ id, title }, index) => {
      // instantiate a new column
      const $item = document.createElement('trello-column');

      $item.setAttribute('id', id);
      $item.setAttribute('title', title);
      $item.index = index;

      this.$columnsContainer.appendChild($item);
    });
  }
}

window.customElements.define('trello-app', TrelloApp);
