const FINE_PER_DAY = 0.50;
const LOAN_DURATION_DAYS = 14;

export class Loan {
  constructor({ copy, member }) {
    this.loanId     = `${member.memberId}-${copy.copyId}-${Date.now()}`;
    this.copy       = copy;
    this.member     = member;
    this.issueDate  = new Date();
    this.dueDate    = new Date(Date.now() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
    this.returnDate = null;
    this.fine       = 0;
  }

  calculateFine() {
    const ref = this.returnDate || new Date();
    if (ref > this.dueDate) {
      const daysLate = Math.floor((ref - this.dueDate) / (1000 * 60 * 60 * 24));
      return daysLate * FINE_PER_DAY;
    }
    return 0;
  }

  renew() {
    if (this.copy.status === 'reserved') {
      throw new Error('Cannot renew: copy is reserved by another member');
    }
    this.dueDate = new Date(this.dueDate.getTime() + LOAN_DURATION_DAYS * 24 * 60 * 60 * 1000);
  }

  close(returnDate = new Date()) {
    this.returnDate = returnDate;
    this.fine = this.calculateFine();
    return this.fine;
  }
}
