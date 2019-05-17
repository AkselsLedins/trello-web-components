const timeout = 5000;

describe(
  '/ (Initial state)',
  () => {
    let page;
    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.goto('http://localhost:3000');
    }, timeout);

    afterAll(async () => {
      await page.close();
    });

    it('should load without error', async () => {
      let text = await page.evaluate(() => document.body.textContent);
      // let ok = await page.evaluate(() => document.querySelector('trello-column[id="1"]').innerHTML)
      // console.log('HTML', ok);

      expect(text).toContain('Trello');
    });

    it('should contain two columns at first', async () => {
      await page.waitForSelector('#columns-container');
      let number = await page.evaluate(
        () => document.querySelector('#columns-container').children.length
      );

      expect(number).toBe(2);
    });

    it('first column should contain 3 cards', async () => {
      await page.waitForSelector('trello-column[id="1"] .cards-container');
      let numberOfCardsRendered = await page.evaluate(() => {
        const cardsContainer = document.querySelector('trello-column[id="1"] .cards-container');
        return cardsContainer.children.length;
      });

      expect(numberOfCardsRendered).toBe(3);
    });

    it('second column should contain 2 cards', async () => {
      await page.waitForSelector('trello-column[id="1"] .cards-container');
      let numberOfCardsRendered = await page.evaluate(() => {
        const cardsContainer = document.querySelector('trello-column[id="1"] .cards-container');
        return cardsContainer.children.length;
      });

      expect(numberOfCardsRendered).toBe(3);
    });

    describe('Card creation', () => {
      it('we can create a card', async () => {
        await page.waitForSelector('trello-column[id="2"] .card-creator .card-creator-title-input');
        // simulate a card creation
        await page.evaluate(() => {
          const cardCreator = document.querySelector('trello-column[id="2"] .card-creator');

          const titleInput = cardCreator.querySelector('.card-creator-title-input');
          const descriptionInput = cardCreator.querySelector('.card-creator-description-input');
          const addButton = cardCreator.querySelector('.add-card-btn');

          titleInput.value = 'foo';
          descriptionInput.value = 'bar';

          addButton.click();
        });

        await page.waitForSelector('trello-column[id="2"] .cards-container trello-card[id="6"]');

        let numberOfCardsRendered = await page.evaluate(() => {
          const cardsContainer = document.querySelector('trello-column[id="2"] .cards-container');
          return cardsContainer.children.length;
        });

        expect(numberOfCardsRendered).toBe(3);

        const card = await page.evaluate(() => {
          const card = document.querySelector(
            'trello-column[id="2"] .cards-container trello-card[id="6"]'
          );
          return {
            id: card.querySelector('.card-id').textContent,
            title: card.querySelector('.card-title').textContent,
            description: card.querySelector('.card-description').textContent,
          };
        });

        expect(card.id).toBe('#6');
        expect(card.title).toBe('foo');
        expect(card.description).toBe('bar');
      });
    });
  },
  timeout
);
