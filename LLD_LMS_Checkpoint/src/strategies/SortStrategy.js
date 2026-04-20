class SortStrategy {
  sort(books) {
    throw new Error('sort() must be implemented');
  }
}

export class SortByTitle extends SortStrategy {
  sort(books) {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  }
}

export class SortByAuthor extends SortStrategy {
  sort(books) {
    return [...books].sort((a, b) => a.author.localeCompare(b.author));
  }
}

export class SortByAvailability extends SortStrategy {
  sort(books) {
    return [...books].sort((a, b) => {
      const aAvail = a.getAvailableCopy() ? 0 : 1;
      const bAvail = b.getAvailableCopy() ? 0 : 1;
      return aAvail - bAvail;
    });
  }
}

// Context
export class BookSorter {
  constructor(strategy = new SortByTitle()) {
    this._strategy = strategy;
  }

  setStrategy(strategy) {
    this._strategy = strategy;
  }

  sort(books) {
    return this._strategy.sort(books);
  }
}
