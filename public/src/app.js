const templateApp = document.createElement('template');
templateApp.innerHTML = `
  <section id="app">
    <div class="search">
      <div class="search-icon"></div>
      <input id="search" type="text" placeholder="search here" />
    </div>

    <div id="columns-section">
      <div id="columns-container">
      </div>

      <trello-column-creator></trello-column-creator>
    </div>
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
    this.$search = this.querySelector('#search');

    // listen for events
    this.$columnCreator.addEventListener('columnCreation', this.addColumn.bind(this));
    this.$search.addEventListener('input', this.search.bind(this));

    // render
    this._render();
  }

  disconnectedCallback() {}

  search(e) {
    const query = this.$search.value;
    updateSearch(query);
  }

  async fetchData() {
    const columns = await API.get.columns();

    this._columns = columns;

    this._render();
  }

  async addColumn(e) {
    const { title } = e.detail;

    const data = await API.create.column({ title });

    this._columns.push(data);

    this._render();
  }

  async deleteColumn(e) {
    const columnId = e.detail;
    const index = this._columns.findIndex(column => column.id === columnId);

    this._columns.splice(index, 1);
    // NOTE: rerendering everything is quite poor in term of perf.
    this._render();

    // NOTE: we should delete all cards associated to this column but
    //       the API should handle that so we can just ignore that and
    //       let the cards column less in the db
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

      $item.addEventListener('columnDelete', this.deleteColumn.bind(this));

      this.$columnsContainer.appendChild($item);
    });
  }
}

window.customElements.define('trello-app', TrelloApp);
