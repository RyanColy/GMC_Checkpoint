// Base interface-like abstraction
class SearchStrategy {
  search(catalog, query) {
    throw new Error('search() must be implemented');
  }
}

export class SearchByTitle extends SearchStrategy {
  search(catalog, query) {
    const q = query.toLowerCase();
    return catalog.filter((book) => book.title.toLowerCase().includes(q));
  }
}

export class SearchByAuthor extends SearchStrategy {
  search(catalog, query) {
    const q = query.toLowerCase();
    return catalog.filter((book) => book.author.toLowerCase().includes(q));
  }
}

export class SearchByISBN extends SearchStrategy {
  search(catalog, query) {
    return catalog.filter((book) => book.isbn === query);
  }
}

export class SearchByGenre extends SearchStrategy {
  search(catalog, query) {
    const q = query.toLowerCase();
    return catalog.filter((book) => book.genre.toLowerCase().includes(q));
  }
}

// Context — holds the active strategy, swappable at runtime
export class BookSearcher {
  constructor(strategy = new SearchByTitle()) {
    this._strategy = strategy;
  }

  setStrategy(strategy) {
    this._strategy = strategy;
  }

  search(catalog, query) {
    return this._strategy.search(catalog, query);
  }
}
