import { useState } from 'react'
import { PRIORITIES } from '../task/task'

export function TaskForm({ onAdd }) {
  const [name, setName] = useState('')
  const [priority, setPriority] = useState('medium')

  function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim(), priority)
    setName('')
    setPriority('medium')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="New task"
        aria-label="Task name"
        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-100/20"
      />
      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
        aria-label="Task priority"
        className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      >
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        Add
      </button>
    </form>
  )
}
