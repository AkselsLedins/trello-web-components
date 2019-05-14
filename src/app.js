const templateApp = document.createElement('template');
templateApp.innerHTML = `
  <section>
    <column-creator></column-creator>

    <div id="columns-container">
    </div>
  </section>
`;

class TrelloApp extends HTMLElement {
  constructor() {
    super();

    // initial state
    this._columns = [{ id: 1, title: 'First column' }, { id: 2, title: 'Second column' }];
  }

  connectedCallback() {
    this.appendChild(templateApp.content.cloneNode(true));

    // get local references
    this.$columnCreator = this.querySelector('column-creator');
    this.$columnsContainer = this.querySelector('#columns-container');

    // render
    this._render();
  }

  disconnectedCallback() {}

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
