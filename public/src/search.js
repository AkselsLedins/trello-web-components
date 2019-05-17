// initial query is empty
window.__SEARCH = '';

// all the objects which subscribed to
// the changes of the search query
const searchObservers = [];

// updateSearch will inform all observers about changes
const updateSearch = value => {
  window.__SEARCH = value;
  searchObservers.forEach(observer => {
    observer(value);
  });
};

// subscribeToSearch will add an observer to the observers
// list and will return its index
const subscribeToSearch = func => searchObservers.push(func) - 1;
