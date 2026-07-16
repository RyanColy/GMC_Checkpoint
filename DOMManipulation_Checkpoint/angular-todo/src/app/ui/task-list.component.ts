import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Priority, Task } from '../task/task.model';
import { TaskItemComponent } from './task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent {
  @Input({ required: true }) tasks!: Task[];
  @Output() update = new EventEmitter<{ id: string; name: string; priority: Priority }>();
  @Output() remove = new EventEmitter<string>();
}
