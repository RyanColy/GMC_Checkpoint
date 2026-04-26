const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

// in-memory array that acts as the users "database"
const users = [];

const User = {
  // create a new user, hash the password if provided (Google OAuth users have no password)
  async create({ name, email, password, googleId }) {
    const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined;
    const user = {
      _id: randomUUID(),
      name,
      email,
      password: hashedPassword,
      googleId,
      createdAt: new Date(),
    };
    users.push(user);
    // never return the password outside of this model
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // find a user by any field — returns the user without password
  async findOne(query) {
    console.log('findOne called with:', query, '| users in memory:', users.length);
    const user = users.find((u) =>
      Object.keys(query).every((key) => u[key] === query[key])
    );
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  // same as findOne but includes the password — used only for login verification
  async findOneWithPassword(query) {
    const user = users.find((u) =>
      Object.keys(query).every((key) => u[key] === query[key])
    );
    if (!user) return null;
    return {
      ...user,
      // attach comparePassword directly so the controller doesn't need to import bcrypt
      comparePassword: (candidate) => bcrypt.compare(candidate, user.password),
    };
  },

  // find a user by their id — used by verifyToken after decoding the JWT
  async findById(id) {
    const user = users.find((u) => u._id === id);
    if (!user) return null;
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
};

module.exports = User;
