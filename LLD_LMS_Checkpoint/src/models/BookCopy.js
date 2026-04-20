export const BookStatus = {
  AVAILABLE:      'available',
  ISSUED:         'issued',
  RESERVED:       'reserved',
  LOST:           'lost',
  DECOMMISSIONED: 'decommissioned',
};

export class BookCopy {
  constructor({ copyId, book, location = '' }) {
    this.copyId   = copyId;
    this.book     = book;
    this.status   = BookStatus.AVAILABLE;
    this.location = location;
  }

  isAvailable() {
    return this.status === BookStatus.AVAILABLE;
  }

  setStatus(status) {
    this.status = status;
  }
}
