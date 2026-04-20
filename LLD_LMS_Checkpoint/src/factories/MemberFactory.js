import { Member } from '../models/Member.js';
import { Librarian } from '../models/Librarian.js';

let memberCounter = 1;
let staffCounter  = 1;

export class MemberFactory {
  static createMember({ name, email }) {
    return new Member({
      memberId: `MBR-${String(memberCounter++).padStart(4, '0')}`,
      name,
      email,
    });
  }

  static createLibrarian({ name, role = 'librarian' }) {
    return new Librarian({
      staffId: `STF-${String(staffCounter++).padStart(4, '0')}`,
      name,
      role,
    });
  }
}
