import { generateTasks } from './generate-tasks';

describe('generateTasks', () => {
  it('generates the requested number of tasks with unique ids', () => {
    const tasks = generateTasks(100);

    expect(tasks).toHaveLength(100);
    expect(new Set(tasks.map((task) => task.id)).size).toBe(100);
  });

  it('cycles through priorities', () => {
    const tasks = generateTasks(3);

    expect(tasks.map((task) => task.priority)).toEqual(['low', 'medium', 'high']);
  });
});
