const callApi = (what, query) => fetch(`http://localhost:3000/${what}?${query}`);

const API = {
  get: {
    columns: opts => callApi('columns', opts),
    cards: opts => callApi('cards', opts),
  },
};

window.__API = API;
