import { UserFactory } from "./patterns/UserFactory";
import { Book } from "./models/Book";
import library from "./patterns/LibrarySystem";

export function seedLibrary() {
  const loaded = library.load();
  if (loaded || library.getAllUsers().length > 0) return;

  const users = [
    UserFactory.createUser("student", "u1", "Aminata Diallo",   "aminata@school.sn"),
    UserFactory.createUser("student", "u2", "Moussa Ndiaye",    "moussa@school.sn"),
    UserFactory.createUser("student", "u3", "Fatou Sow",        "fatou@school.sn"),
    UserFactory.createUser("student", "u4", "Ibrahima Fall",    "ibrahima@school.sn"),
    UserFactory.createUser("student", "u5", "Rokhaya Mbaye",    "rokhaya@school.sn"),
    UserFactory.createUser("student", "u6", "Oumar Diop",       "oumar@school.sn"),
    UserFactory.createUser("student", "u7", "Ndéye Sarr",       "ndeye@school.sn"),
    UserFactory.createUser("student", "u8", "Cheikh Gueye",     "cheikh@school.sn"),
    UserFactory.createUser("teacher", "u9",  "Prof. Amadou Bâ",      "ba@school.sn"),
    UserFactory.createUser("teacher", "u10", "Prof. Mariama Dème",   "deme@school.sn"),
    UserFactory.createUser("teacher", "u11", "Prof. Lamine Touré",   "toure@school.sn"),
    UserFactory.createUser("teacher", "u12", "Prof. Aïssatou Faye",  "faye@school.sn"),
  ];

  const books = [
    new Book("b1",  "Clean Code",                                        "Robert C. Martin",  "https://covers.openlibrary.org/b/id/15126503-L.jpg"),
    new Book("b2",  "Design Patterns",                                   "GoF",               "https://covers.openlibrary.org/b/id/10827044-L.jpg"),
    new Book("b3",  "The Pragmatic Programmer",                          "Hunt & Thomas",     "https://covers.openlibrary.org/b/id/10143650-L.jpg"),
    new Book("b4",  "You Don't Know JS",                                 "Kyle Simpson",      "https://covers.openlibrary.org/b/id/8514044-L.jpg"),
    new Book("b5",  "Refactoring",                                       "Martin Fowler",     "https://covers.openlibrary.org/b/id/134964-L.jpg"),
    new Book("b6",  "Introduction to Algorithms",                        "Cormen et al.",     "https://covers.openlibrary.org/b/id/11106524-L.jpg"),
    new Book("b7",  "The Mythical Man-Month",                            "Fred Brooks",       "https://covers.openlibrary.org/b/id/10653425-L.jpg"),
    new Book("b8",  "Code Complete",                                     "Steve McConnell",   "https://covers.openlibrary.org/b/id/8629368-L.jpg"),
    new Book("b9",  "Structure and Interpretation of Computer Programs", "Abelson & Sussman", "https://covers.openlibrary.org/b/id/9325174-L.jpg"),
    new Book("b10", "The Art of Computer Programming",                   "Donald Knuth",      "https://covers.openlibrary.org/b/id/7883943-L.jpg"),
    new Book("b11", "Cracking the Coding Interview",                     "Gayle McDowell",    "https://covers.openlibrary.org/b/id/8091016-L.jpg"),
    new Book("b12", "Head First Design Patterns",                        "Freeman & Robson",  "https://covers.openlibrary.org/b/id/388950-L.jpg"),
    new Book("b13", "Domain-Driven Design",                              "Eric Evans",        "https://covers.openlibrary.org/b/id/14596704-L.jpg"),
    new Book("b14", "Working Effectively with Legacy Code",              "Michael Feathers",  "https://covers.openlibrary.org/b/id/7898496-L.jpg"),
    new Book("b15", "A Philosophy of Software Design",                   "John Ousterhout",   "https://covers.openlibrary.org/b/id/10352230-L.jpg"),
  ];

  users.forEach((u) => library.addUser(u));
  books.forEach((b) => library.addBook(b));

  // Active borrows
  library.borrowBook("u1", "b1", 14);
  library.borrowBook("u2", "b3", 7);
  library.borrowBook("u4", "b6", 10);
  library.borrowBook("u9", "b5", 21);
  library.borrowBook("u5", "b8", 14);
  library.borrowBook("u11", "b13", 30);
  library.borrowBook("u6", "b15", 7);

  // Simulate overdue borrows
  const overdueData = [
    { userId: "u3", bookId: "b2", date: "2025-01-15" },
    { userId: "u7", bookId: "b7", date: "2025-02-01" },
    { userId: "u10", bookId: "b9", date: "2024-12-20" },
  ];

  overdueData.forEach(({ userId, bookId, date }) => {
    const txn = library.borrowBook(userId, bookId, 14);
    if (txn) {
      txn.dueDate = new Date(date);
      txn.isOverdue = true;
      const msg = `Overdue: "${txn.book.title}" borrowed by ${txn.user.name}.`;
      library.notifications.push(msg);
    }
  });

  // Returned books (history)
  const returned = [
    { userId: "u8", bookId: "b4", days: 7 },
    { userId: "u12", bookId: "b10", days: 14 },
    { userId: "u1", bookId: "b11", days: 10 },
    { userId: "u2", bookId: "b12", days: 5 },
    { userId: "u5", bookId: "b14", days: 21 },
  ];

  returned.forEach(({ userId, bookId, days }) => {
    const txn = library.borrowBook(userId, bookId, days);
    if (txn) library.returnBook(txn.id);
  });

  library.save();
}
