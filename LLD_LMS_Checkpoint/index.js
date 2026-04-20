import readline from 'readline';
import { LibraryService }                            from './src/services/LibraryService.js';
import { LibraryEventEmitter, NotificationObserver } from './src/observers/NotificationObserver.js';
import { BookFactory }                               from './src/factories/BookFactory.js';
import { MemberFactory }                             from './src/factories/MemberFactory.js';
import { SearchByTitle, SearchByAuthor, SearchByISBN, SearchByGenre } from './src/strategies/SearchStrategy.js';
import { SortByTitle, SortByAuthor, SortByAvailability }              from './src/strategies/SortStrategy.js';
import { validateBookData, validateMemberData }      from './src/utils/validators.js';

// --- Bootstrap ---
const emitter = new LibraryEventEmitter();
emitter.subscribe(new NotificationObserver());
const library = new LibraryService({ eventEmitter: emitter });

// Seed data
const seedBooks = [
  { isbn: '978-0-06-112008-4', title: 'To Kill a Mockingbird', author: 'Harper Lee',    genre: 'Fiction'  },
  { isbn: '978-0-7432-7356-5', title: '1984',                  author: 'George Orwell', genre: 'Dystopia' },
  { isbn: '978-0-14-028329-7', title: 'Animal Farm',           author: 'George Orwell', genre: 'Satire'   },
];
seedBooks.forEach((data) => library.addBook(BookFactory.createBookWithCopies(data, 2, 'Shelf A')));

const seedMembers = [
  { name: 'Alice Martin', email: 'alice@example.com' },
  { name: 'Bob Dupont',   email: 'bob@example.com'   },
];
seedMembers.forEach((data) => library.registerMember(MemberFactory.createMember(data)));

// --- CLI ---
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

const SEARCH_STRATEGIES = {
  1: { label: 'Title',  strategy: new SearchByTitle()  },
  2: { label: 'Author', strategy: new SearchByAuthor() },
  3: { label: 'ISBN',   strategy: new SearchByISBN()   },
  4: { label: 'Genre',  strategy: new SearchByGenre()  },
};

const SORT_STRATEGIES = {
  1: { label: 'Title',        strategy: new SortByTitle()        },
  2: { label: 'Author',       strategy: new SortByAuthor()       },
  3: { label: 'Availability', strategy: new SortByAvailability() },
};

function printMenu() {
  console.log(`
╔══════════════════════════════════╗
║      Library Management CLI      ║
╠══════════════════════════════════╣
║  1. List all books               ║
║  2. Search books                 ║
║  3. Sort books                   ║
║  4. Add a book                   ║
║  5. List members                 ║
║  6. Register a member            ║
║  7. Borrow a book                ║
║  8. Return a book                ║
║  9. Renew a loan                 ║
║ 10. View member loans            ║
║ 11. Generate report              ║
║  0. Exit                         ║
╚══════════════════════════════════╝`);
}

function listBooks(books) {
  if (!books.length) { console.log('  No books found.'); return; }
  books.forEach((b) => {
    const avail = b.copies.filter((c) => c.isAvailable()).length;
    console.log(`  [${b.isbn}] ${b.title} — ${b.author} (${b.genre}) | copies: ${avail}/${b.copies.length} available`);
  });
}

async function handleSearch() {
  console.log('\n  Search by: 1.Title  2.Author  3.ISBN  4.Genre');
  const choice = (await ask('  Choice: ')).trim();
  const s = SEARCH_STRATEGIES[choice];
  if (!s) { console.log('  Invalid choice.'); return; }
  library.setSearchStrategy(s.strategy);
  const query = await ask(`  Enter ${s.label}: `);
  const results = library.searchBooks(query.trim());
  console.log(`\n  Results for "${query}" by ${s.label}:`);
  listBooks(results);
}

async function handleSort() {
  console.log('\n  Sort by: 1.Title  2.Author  3.Availability');
  const choice = (await ask('  Choice: ')).trim();
  const s = SORT_STRATEGIES[choice];
  if (!s) { console.log('  Invalid choice.'); return; }
  library.setSortStrategy(s.strategy);
  console.log(`\n  Books sorted by ${s.label}:`);
  listBooks(library.sortBooks());
}

async function handleAddBook() {
  const isbn   = await ask('  ISBN: ');
  const title  = await ask('  Title: ');
  const author = await ask('  Author: ');
  const genre  = await ask('  Genre: ');
  const copies = parseInt(await ask('  Number of copies: '), 10) || 1;
  try {
    const data = { isbn: isbn.trim(), title: title.trim(), author: author.trim(), genre: genre.trim() };
    validateBookData(data);
    library.addBook(BookFactory.createBookWithCopies(data, copies, 'Shelf B'));
    console.log(`  Book "${title.trim()}" added with ${copies} cop${copies > 1 ? 'ies' : 'y'}.`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

function listMembers() {
  const members = library._members;
  if (!members.length) { console.log('  No members registered.'); return; }
  members.forEach((m) => console.log(`  [${m.memberId}] ${m.name} — ${m.email} | active loans: ${m.activeLoans.length}`));
}

async function handleRegisterMember() {
  const name  = await ask('  Name: ');
  const email = await ask('  Email: ');
  try {
    validateMemberData({ name: name.trim(), email: email.trim() });
    const member = MemberFactory.createMember({ name: name.trim(), email: email.trim() });
    library.registerMember(member);
    console.log(`  Member "${member.name}" registered as ${member.memberId}.`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function handleBorrow() {
  listMembers();
  const memberId = await ask('\n  Member ID: ');
  const member   = library.getMember(memberId.trim());
  if (!member) { console.log('  Member not found.'); return; }
  listBooks(library.sortBooks());
  const isbn = await ask('\n  Book ISBN: ');
  try {
    const loan = library.borrowBook(member, isbn.trim());
    console.log(`  Loan created: ${loan.loanId} | Due: ${loan.dueDate.toDateString()}`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function handleReturn() {
  listMembers();
  const memberId = await ask('\n  Member ID: ');
  const member   = library.getMember(memberId.trim());
  if (!member) { console.log('  Member not found.'); return; }
  if (!member.activeLoans.length) { console.log('  No active loans.'); return; }
  console.log('\n  Active loans:');
  member.activeLoans.forEach((l) => console.log(`    ${l.copy.copyId} — "${l.copy.book.title}" (due: ${l.dueDate.toDateString()})`));
  const copyId = await ask('\n  Copy ID to return: ');
  try {
    const fine = library.returnBook(member, copyId.trim());
    console.log(fine > 0 ? `  Returned. Fine: €${fine.toFixed(2)}` : '  Returned on time.');
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function handleRenew() {
  listMembers();
  const memberId = await ask('\n  Member ID: ');
  const member   = library.getMember(memberId.trim());
  if (!member) { console.log('  Member not found.'); return; }
  if (!member.activeLoans.length) { console.log('  No active loans.'); return; }
  console.log('\n  Active loans:');
  member.activeLoans.forEach((l) => console.log(`    ${l.copy.copyId} — "${l.copy.book.title}" (due: ${l.dueDate.toDateString()})`));
  const copyId = await ask('\n  Copy ID to renew: ');
  try {
    const loan = library.renewLoan(member, copyId.trim());
    console.log(`  Renewed. New due date: ${loan.dueDate.toDateString()}`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }
}

async function handleViewLoans() {
  listMembers();
  const memberId = await ask('\n  Member ID: ');
  const member   = library.getMember(memberId.trim());
  if (!member) { console.log('  Member not found.'); return; }
  console.log(`\n  Active loans for ${member.name}:`);
  if (!member.activeLoans.length) { console.log('  None.'); }
  member.activeLoans.forEach((l) =>
    console.log(`    ${l.copy.copyId} — "${l.copy.book.title}" | due: ${l.dueDate.toDateString()} ${l.isOverdue?.() ? '⚠ OVERDUE' : ''}`)
  );
  console.log(`\n  Loan history: ${member.loanHistory.length} returned`);
}

function handleReport() {
  const r = library.generateReport();
  console.log(`
  ── Library Report ──────────────────
  Books in catalog : ${r.totalBooks}
  Total copies     : ${r.totalCopies}
  Borrowed copies  : ${r.borrowedCopies}
  Available copies : ${r.availableCopies}
  Registered members: ${r.totalMembers}
  Overdue loans    : ${r.overdueLoans}
  ────────────────────────────────────`);
}

async function main() {
  console.log('\n  Library seeded with 3 books (2 copies each) and 2 members.');
  while (true) {
    printMenu();
    const choice = (await ask('\nChoice: ')).trim();
    console.log('');
    switch (choice) {
      case '1':  listBooks(library._catalog); break;
      case '2':  await handleSearch();        break;
      case '3':  await handleSort();          break;
      case '4':  await handleAddBook();       break;
      case '5':  listMembers();               break;
      case '6':  await handleRegisterMember(); break;
      case '7':  await handleBorrow();        break;
      case '8':  await handleReturn();        break;
      case '9':  await handleRenew();         break;
      case '10': await handleViewLoans();     break;
      case '11': handleReport();              break;
      case '0':  console.log('  Goodbye!'); rl.close(); process.exit(0);
      default:   console.log('  Invalid choice.');
    }
  }
}

main();
