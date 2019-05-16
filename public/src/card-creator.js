const templateCardCreator = document.createElement('template');
templateCardCreator.innerHTML = `
  <div class="card-composer">
    <form id="new-card-form">
      <div class="card">
        <div class="card-creator">
          <textarea placeholder="Enter a title for this card..." style="overflow: hidden; overflow-wrap: break-word;resize: none;height: 54px;"></textarea>
        </div>
      </div>
      <button class="primary" type="submit">Add card</button>
    </form>
  </div>
`;

class TrelloCardCreator extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.appendChild(templateCardCreator.content.cloneNode(true));

    this.$form = this.querySelector('form');
    this.$input = this.querySelector('textarea');
    this.$form.addEventListener('submit', e => {
      e.preventDefault();

      if (!this.$input.value) return;
      // TODO: check unicity of title here ?

      this.dispatchEvent(new CustomEvent('cardCreation', { detail: { title: this.$input.value } }));
      this.$input.value = '';
    });
  }

  disconnectedCallback() {}
}

window.customElements.define('trello-card-creator', TrelloCardCreator);
