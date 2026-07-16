export const PRIORITIES = ['low', 'medium', 'high']

export function createTask(name, priority = 'medium') {
  return {
    id: crypto.randomUUID(),
    name,
    priority,
  }
}
