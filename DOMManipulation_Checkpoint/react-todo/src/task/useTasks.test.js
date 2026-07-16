import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('adds a task with name and priority', () => {
    const { result } = renderHook(() => useTasks())

    act(() => result.current.addTask('Buy milk', 'high'))

    expect(result.current.tasks).toHaveLength(1)
    expect(result.current.tasks[0]).toMatchObject({
      name: 'Buy milk',
      priority: 'high',
    })
  })

  it('updates a task name and priority', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Buy milk', 'low'))
    const id = result.current.tasks[0].id

    act(() => result.current.updateTask(id, { name: 'Buy oat milk', priority: 'medium' }))

    expect(result.current.tasks[0]).toMatchObject({
      name: 'Buy oat milk',
      priority: 'medium',
    })
  })

  it('removes a task', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.addTask('Buy milk', 'low'))
    const id = result.current.tasks[0].id

    act(() => result.current.removeTask(id))

    expect(result.current.tasks).toHaveLength(0)
  })
})
