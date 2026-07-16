import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('adds a task with name and priority', () => {
    service.addTask('Buy milk', 'high');

    expect(service.tasks()).toHaveLength(1);
    expect(service.tasks()[0]).toMatchObject({ name: 'Buy milk', priority: 'high' });
  });

  it('updates a task name and priority', () => {
    service.addTask('Buy milk', 'low');
    const id = service.tasks()[0].id;

    service.updateTask(id, { name: 'Buy oat milk', priority: 'medium' });

    expect(service.tasks()[0]).toMatchObject({ name: 'Buy oat milk', priority: 'medium' });
  });

  it('removes a task', () => {
    service.addTask('Buy milk', 'low');
    const id = service.tasks()[0].id;

    service.removeTask(id);

    expect(service.tasks()).toHaveLength(0);
  });
});
