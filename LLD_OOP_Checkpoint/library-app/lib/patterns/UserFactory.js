import { Student, Teacher } from "../models/User";

export class UserFactory {
  static createUser(type, id, name, email) {
    switch (type) {
      case "student":
        return new Student(id, name, email);
      case "teacher":
        return new Teacher(id, name, email);
      default:
        throw new Error(`Unknown user type: ${type}`);
    }
  }
}
