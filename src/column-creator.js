console.log('oui');
const templateColumnCreator = document.createElement('template');
templateColumnCreator.innerHTML = `
  <div class="column-wrapper mod-add">
    <div class="column">

      <div class="column-creator">
        <form id="new-column-form">
          <input id="new-column-input" type="text" placeholder="Enter list title..." />
          <button class="primary" type="submit">Add another column</button>
        </form>
      </div>

    </div>
  </div>
`;

class TrelloColumnCreator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.appendChild(templateColumnCreator.content.cloneNode(true));
  }

  disconnectedCallback() {}
}

window.customElements.define('trello-column-creator', TrelloColumnCreator);
