export class BorrowTransaction {
  constructor(id, user, book, borrowDate, dueDate) {
    this.id = id;
    this.user = user;
    this.book = book;
    this.borrowDate = borrowDate;
    this.dueDate = dueDate;
    this.returnDate = null;
    this.isOverdue = false;
  }

  checkOverdue() {
    if (!this.returnDate && new Date() > this.dueDate) {
      this.isOverdue = true;
    }
  }
}
