export class Book {
  constructor({ isbn, title, author, genre }) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.copies = [];
  }

  addCopy(copy) {
    this.copies.push(copy);
  }

  getAvailableCopy() {
    return this.copies.find((copy) => copy.isAvailable()) || null;
  }
}
