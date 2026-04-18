export class NotificationService {
  constructor() {
    this.observers = [];
  }

  register(observer) {
    this.observers.push(observer);
  }

  unregister(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(message) {
    this.observers.forEach((o) => o.notify(message));
  }
}
