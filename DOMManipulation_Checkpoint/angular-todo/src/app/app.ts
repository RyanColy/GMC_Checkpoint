import { Component, signal } from '@angular/core';
import { Priority } from './task/task.model';
import { TaskService } from './task/task.service';
import { BenchmarkPanelComponent } from './benchmark/benchmark-panel.component';
import { TaskFormComponent } from './ui/task-form.component';
import { TaskListComponent } from './ui/task-list.component';

type Tab = 'To-do list' | 'Benchmark';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent, TaskListComponent, BenchmarkPanelComponent],
  templateUrl: './app.html',
})
export class App {
  readonly tabs: Tab[] = ['To-do list', 'Benchmark'];
  readonly tab = signal<Tab>('To-do list');

  constructor(private readonly taskService: TaskService) {}

  get tasks() {
    return this.taskService.tasks;
  }

  addTask(event: { name: string; priority: Priority }): void {
    this.taskService.addTask(event.name, event.priority);
  }

  updateTask(event: { id: string; name: string; priority: Priority }): void {
    this.taskService.updateTask(event.id, { name: event.name, priority: event.priority });
  }

  removeTask(id: string): void {
    this.taskService.removeTask(id);
  }
}
