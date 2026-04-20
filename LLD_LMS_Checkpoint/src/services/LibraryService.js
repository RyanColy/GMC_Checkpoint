import { BookStatus } from '../models/BookCopy.js';
import { LibraryEvent } from '../observers/NotificationObserver.js';
import { BookSearcher } from '../strategies/SearchStrategy.js';
import { BookSorter } from '../strategies/SortStrategy.js';

export class LibraryService {
  constructor({ eventEmitter, searcher = new BookSearcher(), sorter = new BookSorter() }) {
    this._catalog  = [];   // Book[]
    this._members  = [];   // Member[]
    this._emitter  = eventEmitter;
    this._searcher = searcher;
    this._sorter   = sorter;
  }

  // --- Catalog ---

  addBook(book) {
    if (this._catalog.find((b) => b.isbn === book.isbn)) {
      throw new Error(`Book with ISBN ${book.isbn} already exists`);
    }
    this._catalog.push(book);
    return book;
  }

  removeBook(isbn) {
    const idx = this._catalog.findIndex((b) => b.isbn === isbn);
    if (idx === -1) throw new Error(`Book not found: ${isbn}`);
    this._catalog.splice(idx, 1);
  }

  getBook(isbn) {
    return this._catalog.find((b) => b.isbn === isbn) || null;
  }

  searchBooks(query) {
    return this._searcher.search(this._catalog, query);
  }

  sortBooks() {
    return this._sorter.sort(this._catalog);
  }

  setSearchStrategy(strategy) {
    this._searcher.setStrategy(strategy);
  }

  setSortStrategy(strategy) {
    this._sorter.setStrategy(strategy);
  }

  // --- Members ---

  registerMember(member) {
    if (this._members.find((m) => m.memberId === member.memberId)) {
      throw new Error(`Member ${member.memberId} already registered`);
    }
    this._members.push(member);
    return member;
  }

  getMember(memberId) {
    return this._members.find((m) => m.memberId === memberId) || null;
  }

  // --- Loans ---

  borrowBook(member, isbn) {
    const book = this.getBook(isbn);
    if (!book) throw new Error(`Book not found: ${isbn}`);

    const copy = book.getAvailableCopy();
    if (!copy) throw new Error(`No available copy for: ${book.title}`);

    const loan = member.borrowBook(copy);
    this._emitter.notify(LibraryEvent.BOOK_BORROWED, { member, loan });
    return loan;
  }

  returnBook(member, copyId) {
    const copy = this._findCopy(copyId);
    const fine = member.returnBook(copy);
    const loan = member.loanHistory.at(-1);
    this._emitter.notify(LibraryEvent.BOOK_RETURNED, { member, loan });
    return fine;
  }

  renewLoan(member, copyId) {
    const loan = member.activeLoans.find((l) => l.copy.copyId === copyId);
    if (!loan) throw new Error('No active loan found for this copy');
    loan.renew();
    return loan;
  }

  reserveCopy(member, isbn) {
    const book = this.getBook(isbn);
    if (!book) throw new Error(`Book not found: ${isbn}`);

    const copy = book.copies.find((c) => c.status === BookStatus.ISSUED);
    if (!copy) throw new Error('No copy to reserve — an available copy exists, borrow it directly');

    copy.setStatus(BookStatus.RESERVED);
    return copy;
  }

  // --- Reports ---

  getOverdueLoans() {
    return this._members.flatMap((m) =>
      m.activeLoans.filter((l) => l.isOverdue?.() ?? this._isOverdue(l))
    );
  }

  sendOverdueReminders() {
    this.getOverdueLoans().forEach((loan) => {
      this._emitter.notify(LibraryEvent.LOAN_OVERDUE, { member: loan.member, loan });
    });
  }

  generateReport() {
    const totalBooks  = this._catalog.length;
    const totalCopies = this._catalog.reduce((sum, b) => sum + b.copies.length, 0);
    const borrowed    = this._catalog.reduce(
      (sum, b) => sum + b.copies.filter((c) => c.status === BookStatus.ISSUED).length, 0
    );
    const overdueLoans = this.getOverdueLoans();

    return {
      totalBooks,
      totalCopies,
      borrowedCopies:    borrowed,
      availableCopies:   totalCopies - borrowed,
      totalMembers:      this._members.length,
      overdueLoans:      overdueLoans.length,
    };
  }

  // --- Private ---

  _findCopy(copyId) {
    for (const book of this._catalog) {
      const copy = book.copies.find((c) => c.copyId === copyId);
      if (copy) return copy;
    }
    throw new Error(`Copy not found: ${copyId}`);
  }

  _isOverdue(loan) {
    return loan.returnDate === null && new Date() > loan.dueDate;
  }
}
