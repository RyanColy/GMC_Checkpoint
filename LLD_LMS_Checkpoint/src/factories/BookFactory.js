import { Book } from '../models/Book.js';
import { BookCopy } from '../models/BookCopy.js';

let copyCounter = 1;

export class BookFactory {
  static createBook({ isbn, title, author, genre }) {
    return new Book({ isbn, title, author, genre });
  }

  static createCopy(book, location = '') {
    const copy = new BookCopy({
      copyId: `COPY-${String(copyCounter++).padStart(4, '0')}`,
      book,
      location,
    });
    book.addCopy(copy);
    return copy;
  }

  static createBookWithCopies({ isbn, title, author, genre }, numCopies = 1, location = '') {
    const book = BookFactory.createBook({ isbn, title, author, genre });
    for (let i = 0; i < numCopies; i++) {
      BookFactory.createCopy(book, location);
    }
    return book;
  }
}
