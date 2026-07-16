import { TaskItem } from './TaskItem'

export function TaskList({ tasks, onUpdate, onRemove }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
        No tasks yet — add one above.
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onUpdate={onUpdate} onRemove={onRemove} />
      ))}
    </ul>
  )
}
