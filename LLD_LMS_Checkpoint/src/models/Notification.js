export const NotificationType = {
  REMINDER:     'reminder',
  CONFIRMATION: 'confirmation',
  OVERDUE:      'overdue',
};

export class Notification {
  constructor({ type, message, member }) {
    this.type    = type;
    this.message = message;
    this.member  = member;
    this.sentAt  = null;
  }

  send() {
    this.sentAt = new Date();
    // delivery handled by NotificationObserver
    console.log(`[${this.type}] → ${this.member.email}: ${this.message}`);
  }
}
