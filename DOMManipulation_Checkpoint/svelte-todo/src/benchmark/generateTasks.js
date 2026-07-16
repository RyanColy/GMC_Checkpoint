import { PRIORITIES } from '../task/task'

export function generateTasks(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    name: `Task ${index + 1}`,
    priority: PRIORITIES[index % PRIORITIES.length],
  }))
}
