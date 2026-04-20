export class Librarian {
  constructor({ staffId, name, role = 'librarian' }) {
    this.staffId = staffId;
    this.name    = name;
    this.role    = role;
  }

  addBook(catalog, book) {
    catalog.addBook(book);
  }

  removeBook(catalog, isbn) {
    catalog.removeBook(isbn);
  }

  registerMember(memberService, memberData) {
    return memberService.register(memberData);
  }

  processReturn(member, copy) {
    return member.returnBook(copy);
  }
}
