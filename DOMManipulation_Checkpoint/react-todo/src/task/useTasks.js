import { useCallback, useState } from 'react'
import { createTask } from './task'

export function useTasks(initialTasks = []) {
  const [tasks, setTasks] = useState(initialTasks)

  const addTask = useCallback((name, priority) => {
    setTasks((prev) => [...prev, createTask(name, priority)])
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    )
  }, [])

  const removeTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }, [])

  return { tasks, setTasks, addTask, updateTask, removeTask }
}
