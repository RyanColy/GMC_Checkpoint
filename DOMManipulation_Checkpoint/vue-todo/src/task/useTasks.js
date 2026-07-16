import { ref } from 'vue'
import { createTask } from './task'

export function useTasks(initialTasks = []) {
  const tasks = ref(initialTasks)

  function addTask(name, priority) {
    tasks.value = [...tasks.value, createTask(name, priority)]
  }

  function updateTask(id, updates) {
    tasks.value = tasks.value.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    )
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((task) => task.id !== id)
  }

  function setTasks(next) {
    tasks.value = next
  }

  return { tasks, addTask, updateTask, removeTask, setTasks }
}
