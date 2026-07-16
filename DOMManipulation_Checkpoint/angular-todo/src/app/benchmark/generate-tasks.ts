import { PRIORITIES, Task } from '../task/task.model';

export function generateTasks(count: number): Task[] {
  return Array.from({ length: count }, (_, index) => ({
    id: crypto.randomUUID(),
    name: `Task ${index + 1}`,
    priority: PRIORITIES[index % PRIORITIES.length],
  }));
}
