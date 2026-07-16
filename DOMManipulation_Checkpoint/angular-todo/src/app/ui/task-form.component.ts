import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRIORITIES, Priority } from '../task/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
})
export class TaskFormComponent {
  @Output() add = new EventEmitter<{ name: string; priority: Priority }>();

  readonly name = signal('');
  readonly priority = signal<Priority>('medium');
  readonly priorities = PRIORITIES;

  handleSubmit(): void {
    const name = this.name().trim();
    if (!name) return;
    this.add.emit({ name, priority: this.priority() });
    this.name.set('');
    this.priority.set('medium');
  }
}
