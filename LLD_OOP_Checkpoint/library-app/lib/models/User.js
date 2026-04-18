export class User {
  constructor(id, name, email) {
    if (new.target === User) {
      throw new Error("User is abstract and cannot be instantiated directly.");
    }
    this.id = id;
    this.name = name;
    this.email = email;
  }

  getRole() {
    throw new Error("getRole() must be implemented by subclass.");
  }

  notify(message) {
    console.log(`[${this.getRole()}] ${this.name} — ${message}`);
  }
}

export class Student extends User {
  getRole() {
    return "Student";
  }
}

export class Teacher extends User {
  getRole() {
    return "Teacher";
  }
}
