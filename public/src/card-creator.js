const templateCardCreator = document.createElement('template');
templateCardCreator.innerHTML = `
  <div class="card-composer">
    <form id="new-card-form" class="card-creator">
      <div class="card" style="padding: 6px 8px; margin: 0;">
        <div>
          <input class="card-creator-title-input" placeholder="Enter a title for this card..."></input>
          <textarea class="card-creator-description-input" placeholder="Enter a description for this card..." style="overflow: hidden; overflow-wrap: break-word;resize: none;height: 54px;"></textarea>
        </div>
        <button class="add-card-btn primary" type="submit">Add card</button>
      </div>
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

    this.$titleInput = this.querySelector('.card-creator-title-input');
    this.$descriptionInput = this.querySelector('.card-creator-description-input');

    this.$form.addEventListener('submit', e => {
      e.preventDefault();

      if (!this.$titleInput.value) return;
      // TODO: check unicity of title here ?

      this.dispatchEvent(
        new CustomEvent('cardCreation', {
          detail: { title: this.$titleInput.value, description: this.$descriptionInput.value },
        })
      );
      this.$titleInput.value = '';
    });
  }

  disconnectedCallback() {}
}

window.customElements.define('trello-card-creator', TrelloCardCreator);
