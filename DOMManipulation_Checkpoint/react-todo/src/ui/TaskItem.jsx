import { useState } from 'react'
import { PRIORITIES } from '../task/task'

const PRIORITY_STYLES = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  high: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-400',
}

const PRIORITY_DOT = {
  low: 'bg-slate-400',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export function TaskItem({ task, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(task.name)
  const [priority, setPriority] = useState(task.priority)

  function handleSave() {
    onUpdate(task.id, { name: name.trim() || task.name, priority })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-100/10">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          aria-label="Edit task name"
          autoFocus
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          aria-label="Edit task priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button
          onClick={handleSave}
          className="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Save
        </button>
      </li>
    )
  }

  return (
    <li className="group flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/10 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-slate-100/10">
      <span className="flex-1 truncate text-sm text-slate-800 dark:text-slate-100">{task.name}</span>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
        {task.priority}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="text-sm text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        Edit
      </button>
      <button
        onClick={() => onRemove(task.id)}
        className="text-sm text-red-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
      >
        Delete
      </button>
    </li>
  )
}
