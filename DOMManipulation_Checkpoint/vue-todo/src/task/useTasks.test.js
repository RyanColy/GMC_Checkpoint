import { describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('adds a task with name and priority', () => {
    const { tasks, addTask } = useTasks()

    addTask('Buy milk', 'high')

    expect(tasks.value).toHaveLength(1)
    expect(tasks.value[0]).toMatchObject({ name: 'Buy milk', priority: 'high' })
  })

  it('updates a task name and priority', () => {
    const { tasks, addTask, updateTask } = useTasks()
    addTask('Buy milk', 'low')
    const id = tasks.value[0].id

    updateTask(id, { name: 'Buy oat milk', priority: 'medium' })

    expect(tasks.value[0]).toMatchObject({ name: 'Buy oat milk', priority: 'medium' })
  })

  it('removes a task', () => {
    const { tasks, addTask, removeTask } = useTasks()
    addTask('Buy milk', 'low')
    const id = tasks.value[0].id

    removeTask(id)

    expect(tasks.value).toHaveLength(0)
  })
})
