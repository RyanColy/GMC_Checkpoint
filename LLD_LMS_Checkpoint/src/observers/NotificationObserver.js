import { Notification, NotificationType } from '../models/Notification.js';

// --- EventEmitter (Subject) ---

export class LibraryEventEmitter {
  constructor() {
    this._observers = [];
  }

  subscribe(observer) {
    this._observers.push(observer);
  }

  unsubscribe(observer) {
    this._observers = this._observers.filter((o) => o !== observer);
  }

  notify(event, payload) {
    this._observers.forEach((observer) => observer.update(event, payload));
  }
}

// --- Events ---

export const LibraryEvent = {
  BOOK_BORROWED:   'BOOK_BORROWED',
  BOOK_RETURNED:   'BOOK_RETURNED',
  LOAN_OVERDUE:    'LOAN_OVERDUE',
  DUE_DATE_REMINDER: 'DUE_DATE_REMINDER',
};

// --- Base Observer (interface-like) ---

class Observer {
  update(event, payload) {
    throw new Error('update() must be implemented');
  }
}

// --- Concrete Observer ---

export class NotificationObserver extends Observer {
  update(event, payload) {
    const { member, loan } = payload;
    let notification;

    switch (event) {
      case LibraryEvent.BOOK_BORROWED:
        notification = new Notification({
          type: NotificationType.CONFIRMATION,
          message: `You borrowed "${loan.copy.book.title}". Due date: ${loan.dueDate.toDateString()}.`,
          member,
        });
        break;

      case LibraryEvent.BOOK_RETURNED:
        notification = new Notification({
          type: NotificationType.CONFIRMATION,
          message: loan.fine > 0
            ? `Book returned. Fine applied: €${loan.fine.toFixed(2)}.`
            : `Book returned on time. Thank you!`,
          member,
        });
        break;

      case LibraryEvent.LOAN_OVERDUE:
        notification = new Notification({
          type: NotificationType.OVERDUE,
          message: `Your loan for "${loan.copy.book.title}" is overdue. Fine so far: €${loan.calculateFine().toFixed(2)}.`,
          member,
        });
        break;

      case LibraryEvent.DUE_DATE_REMINDER:
        notification = new Notification({
          type: NotificationType.REMINDER,
          message: `Reminder: "${loan.copy.book.title}" is due on ${loan.dueDate.toDateString()}.`,
          member,
        });
        break;

      default:
        return;
    }

    notification.send();
  }
}
