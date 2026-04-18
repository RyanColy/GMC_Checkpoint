export class Book {
  constructor(id, title, author, coverUrl = null) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.coverUrl = coverUrl;
    this.isAvailable = true;
  }
}
