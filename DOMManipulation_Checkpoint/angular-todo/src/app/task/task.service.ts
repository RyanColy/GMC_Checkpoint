import { Injectable, signal } from '@angular/core';
import { createTask, Priority, Task } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  readonly tasks = signal<Task[]>([]);

  addTask(name: string, priority: Priority): void {
    this.tasks.update((tasks) => [...tasks, createTask(name, priority)]);
  }

  updateTask(id: string, updates: Partial<Pick<Task, 'name' | 'priority'>>): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  }

  removeTask(id: string): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  setTasks(tasks: Task[]): void {
    this.tasks.set(tasks);
  }
}
