export function validateBookData({ isbn, title, author, genre }) {
  if (!isbn || typeof isbn !== 'string') throw new Error('Invalid ISBN');
  if (!title || typeof title !== 'string') throw new Error('Invalid title');
  if (!author || typeof author !== 'string') throw new Error('Invalid author');
  if (!genre || typeof genre !== 'string') throw new Error('Invalid genre');
}

export function validateMemberData({ name, email }) {
  if (!name || typeof name !== 'string') throw new Error('Invalid name');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
}
