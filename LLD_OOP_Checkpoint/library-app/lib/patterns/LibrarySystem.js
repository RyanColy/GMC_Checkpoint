import { BorrowTransaction } from "../models/BorrowTransaction";
import { NotificationService } from "./NotificationService";
import { UserFactory } from "./UserFactory";
import { Book } from "../models/Book";

const STORAGE_KEY = "libraryData";

class LibrarySystem {
  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.transactions = [];
    this.notifications = [];
    this.notificationService = new NotificationService();
    this._txnCounter = 0;
  }

  save() {
    if (typeof window === "undefined") return;
    const data = {
      users: Array.from(this.users.values()).map((u) => ({
        id: u.id, name: u.name, email: u.email, role: u.getRole().toLowerCase(),
      })),
      books: Array.from(this.books.values()).map((b) => ({
        id: b.id, title: b.title, author: b.author, coverUrl: b.coverUrl, isAvailable: b.isAvailable,
      })),
      transactions: this.transactions.map((t) => ({
        id: t.id,
        userId: t.user.id,
        bookId: t.book.id,
        borrowDate: t.borrowDate.toISOString(),
        dueDate: t.dueDate.toISOString(),
        returnDate: t.returnDate ? t.returnDate.toISOString() : null,
        isOverdue: t.isOverdue,
      })),
      notifications: this.notifications,
      _txnCounter: this._txnCounter,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  load() {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    try {
      const data = JSON.parse(raw);

      data.users.forEach((u) => {
        const user = UserFactory.createUser(u.role, u.id, u.name, u.email);
        this.users.set(user.id, user);
        this.notificationService.register(user);
      });

      data.books.forEach((b) => {
        const book = new Book(b.id, b.title, b.author, b.coverUrl);
        book.isAvailable = b.isAvailable;
        this.books.set(book.id, book);
      });

      data.transactions.forEach((t) => {
        const user = this.users.get(t.userId);
        const book = this.books.get(t.bookId);
        if (!user || !book) return;
        const txn = new BorrowTransaction(
          t.id, user, book,
          new Date(t.borrowDate),
          new Date(t.dueDate)
        );
        txn.returnDate = t.returnDate ? new Date(t.returnDate) : null;
        txn.isOverdue = t.isOverdue;
        this.transactions.push(txn);
      });

      this.notifications = data.notifications || [];
      this._txnCounter = data._txnCounter || 0;
      return true;
    } catch {
      return false;
    }
  }

  addUser(user) {
    this.users.set(user.id, user);
    this.notificationService.register(user);
    this.save();
  }

  addBook(book) {
    this.books.set(book.id, book);
    this.save();
  }

  borrowBook(userId, bookId, dueDays = 14) {
    const user = this.users.get(userId);
    const book = this.books.get(bookId);
    if (!user || !book || !book.isAvailable) return null;

    book.isAvailable = false;
    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDays);

    const txn = new BorrowTransaction(
      `txn-${++this._txnCounter}`,
      user, book, borrowDate, dueDate
    );
    this.transactions.push(txn);
    this.save();
    return txn;
  }

  returnBook(transactionId) {
    const txn = this.transactions.find((t) => t.id === transactionId);
    if (!txn) return;

    txn.returnDate = new Date();
    txn.book.isAvailable = true;
    txn.checkOverdue();

    if (txn.isOverdue) {
      const msg = `"${txn.book.title}" returned late by ${txn.user.name}.`;
      this.notifications.push(msg);
    }
    this.save();
  }

  checkOverdueTransactions() {
    const now = new Date();
    const overdue = this.transactions.filter((t) => !t.returnDate && now > t.dueDate);
    overdue.forEach((t) => { t.isOverdue = true; });
    this.notifications = overdue.map(
      (t) => `Overdue: "${t.book.title}" borrowed by ${t.user.name}.`
    );
    this.save();
  }

  removeNotification(index) {
    this.notifications.splice(index, 1);
    this.save();
  }

  clearNotifications() {
    this.notifications = [];
    this.save();
  }

  getBorrowedBooks(userId) {
    return this.transactions.filter((t) => t.user.id === userId && !t.returnDate);
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  getAllBooks() {
    return Array.from(this.books.values());
  }

  getAllTransactions() {
    return [...this.transactions];
  }
}

let instance = null;

LibrarySystem.getInstance = function () {
  if (!instance) {
    instance = new LibrarySystem();
  }
  return instance;
};

export default LibrarySystem.getInstance();
