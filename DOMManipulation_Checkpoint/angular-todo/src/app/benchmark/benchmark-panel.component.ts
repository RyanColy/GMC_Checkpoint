import { Component, signal } from '@angular/core';
import { Priority } from '../task/task.model';
import { TaskService } from '../task/task.service';
import { TaskListComponent } from '../ui/task-list.component';
import { generateTasks } from './generate-tasks';
import { now } from './measure';

interface BenchmarkResult {
  label: string;
  ms: string;
}

function afterPaint(callback: () => void): void {
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

@Component({
  selector: 'app-benchmark-panel',
  standalone: true,
  imports: [TaskListComponent],
  templateUrl: './benchmark-panel.component.html',
})
export class BenchmarkPanelComponent {
  readonly results = signal<BenchmarkResult[]>([]);
  private startedAt = 0;

  constructor(private readonly taskService: TaskService) {}

  get tasks() {
    return this.taskService.tasks;
  }

  private record(label: string): void {
    afterPaint(() => {
      const ms = (now() - this.startedAt).toFixed(2);
      this.results.update((prev) => [{ label, ms }, ...prev]);
    });
  }

  runRender(count: number): void {
    this.startedAt = now();
    this.taskService.setTasks(generateTasks(count));
    this.record(`Render ${count} tasks`);
  }

  runUpdate(count = 50): void {
    this.startedAt = now();
    this.taskService.setTasks(
      this.taskService.tasks().map((task, index) =>
        index < count ? { ...task, name: `${task.name} *` } : task
      )
    );
    this.record(`Update ${count} tasks`);
  }

  runDelete(count = 50): void {
    this.startedAt = now();
    this.taskService.setTasks(this.taskService.tasks().slice(count));
    this.record(`Delete ${count} tasks`);
  }

  onUpdate(event: { id: string; name: string; priority: Priority }): void {
    this.taskService.updateTask(event.id, { name: event.name, priority: event.priority });
  }

  onRemove(id: string): void {
    this.taskService.removeTask(id);
  }
}
