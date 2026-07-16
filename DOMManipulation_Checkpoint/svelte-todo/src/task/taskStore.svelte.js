import { createTask } from './task'

export function createTaskStore(initialTasks = []) {
  let tasks = $state(initialTasks)

  function addTask(name, priority) {
    tasks = [...tasks, createTask(name, priority)]
  }

  function updateTask(id, updates) {
    tasks = tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
  }

  function removeTask(id) {
    tasks = tasks.filter((task) => task.id !== id)
  }

  function setTasks(next) {
    tasks = next
  }

  return {
    get tasks() {
      return tasks
    },
    addTask,
    updateTask,
    removeTask,
    setTasks,
  }
}
