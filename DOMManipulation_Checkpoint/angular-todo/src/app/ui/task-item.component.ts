import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIORITIES, Priority, Task } from '../task/task.model';

const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400',
};

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Output() update = new EventEmitter<{ id: string; name: string; priority: Priority }>();
  @Output() remove = new EventEmitter<string>();

  readonly editing = signal(false);
  readonly draftName = signal('');
  readonly draftPriority = signal<Priority>('medium');
  readonly priorities = PRIORITIES;
  readonly priorityStyles = PRIORITY_STYLES;
  readonly priorityDot = PRIORITY_DOT;

  startEdit(): void {
    this.draftName.set(this.task.name);
    this.draftPriority.set(this.task.priority);
    this.editing.set(true);
  }

  save(): void {
    const name = this.draftName().trim() || this.task.name;
    this.update.emit({ id: this.task.id, name, priority: this.draftPriority() });
    this.editing.set(false);
  }
}
