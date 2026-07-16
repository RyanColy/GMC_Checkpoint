import { describe, expect, it } from 'vitest'
import { createTaskStore } from './taskStore.svelte'

describe('createTaskStore', () => {
  it('adds a task with name and priority', () => {
    const store = createTaskStore()

    store.addTask('Buy milk', 'high')

    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0]).toMatchObject({ name: 'Buy milk', priority: 'high' })
  })

  it('updates a task name and priority', () => {
    const store = createTaskStore()
    store.addTask('Buy milk', 'low')
    const id = store.tasks[0].id

    store.updateTask(id, { name: 'Buy oat milk', priority: 'medium' })

    expect(store.tasks[0]).toMatchObject({ name: 'Buy oat milk', priority: 'medium' })
  })

  it('removes a task', () => {
    const store = createTaskStore()
    store.addTask('Buy milk', 'low')
    const id = store.tasks[0].id

    store.removeTask(id)

    expect(store.tasks).toHaveLength(0)
  })
})
