const { randomUUID } = require('crypto');

// in-memory array that acts as the tasks "database"
const tasks = [];

const Task = {
  // create a new task linked to a user via the owner field
  async create({ title, description, owner }) {
    const task = {
      _id: randomUUID(),
      title,
      description,
      completed: false,
      owner,
      createdAt: new Date(),
    };
    tasks.push(task);
    return task;
  },

  // return all tasks that match the given query (e.g. { owner: userId })
  async find(query) {
    return tasks.filter((t) =>
      Object.keys(query).every((key) => t[key] === query[key])
    );
  },

  // find a single task by its id
  async findById(id) {
    return tasks.find((t) => t._id === id) || null;
  },

  // remove a task from the array by its id
  async deleteById(id) {
    const index = tasks.findIndex((t) => t._id === id);
    if (index !== -1) tasks.splice(index, 1);
  },
};

module.exports = Task;
