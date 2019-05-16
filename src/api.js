const callApi = async (what, method, query, body = {}) => {
  if (['GET'].includes(method)) {
    const response = await fetch(`http://localhost:3000/${what}?${query}`, {
      method,
      headers: {
        Accept: 'application/json',
      },
    });
    return await response.json();
  }
  if (['PUT', 'POST'].includes(method)) {
    const response = await fetch(`http://localhost:3000/${what}?${query}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  }

  throw new Error('Unsupported method.');
};

const API = {
  get: {
    columns: opts => callApi('columns', 'GET', opts),
    cards: opts => callApi('cards', 'GET', opts),
  },
  create: {
    card: data => callApi('cards', 'POST', '', data),
  },
};

window.__API = API;
