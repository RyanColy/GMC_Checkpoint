import { Loan } from './Loan.js';
import { BookStatus } from './BookCopy.js';

const MAX_LOANS = 5;

export class Member {
  constructor({ memberId, name, email }) {
    this.memberId    = memberId;
    this.name        = name;
    this.email       = email;
    this.activeLoans = [];
    this.loanHistory = [];
  }

  borrowBook(copy) {
    if (this.activeLoans.length >= MAX_LOANS) {
      throw new Error('Loan limit reached');
    }
    if (!copy.isAvailable()) {
      throw new Error('Copy not available');
    }

    const loan = new Loan({ copy, member: this });
    copy.setStatus(BookStatus.ISSUED);
    this.activeLoans.push(loan);
    return loan;
  }

  returnBook(copy, returnDate = new Date()) {
    const loan = this.activeLoans.find((l) => l.copy.copyId === copy.copyId);
    if (!loan) throw new Error('No active loan found for this copy');

    const fine = loan.close(returnDate);
    copy.setStatus(BookStatus.AVAILABLE);
    this.activeLoans = this.activeLoans.filter((l) => l !== loan);
    this.loanHistory.push(loan);
    return fine;
  }
}
