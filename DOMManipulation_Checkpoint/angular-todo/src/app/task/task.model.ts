export type Priority = 'low' | 'medium' | 'high';

export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export interface Task {
  id: string;
  name: string;
  priority: Priority;
}

export function createTask(name: string, priority: Priority = 'medium'): Task {
  return { id: crypto.randomUUID(), name, priority };
}
