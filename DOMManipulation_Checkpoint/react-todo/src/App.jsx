import { useState } from 'react'
import { BenchmarkPanel } from './ui/BenchmarkPanel'
import { TaskForm } from './ui/TaskForm'
import { TaskList } from './ui/TaskList'
import { useTasks } from './task/useTasks'

const TABS = ['To-do list', 'Benchmark']

function App() {
  const { tasks, addTask, updateTask, removeTask } = useTasks()
  const [tab, setTab] = useState(TABS[0])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex max-w-xl flex-col gap-6 p-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          React To-do
        </h1>

        <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
          {TABS.map((label) => (
            <button
              key={label}
              onClick={() => setTab(label)}
              className={`-mb-px px-3 py-2 text-sm font-medium transition-colors ${
                tab === label
                  ? 'border-b-2 border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'To-do list' ? (
          <div className="flex flex-col gap-4">
            <TaskForm onAdd={addTask} />
            <TaskList tasks={tasks} onUpdate={updateTask} onRemove={removeTask} />
          </div>
        ) : (
          <BenchmarkPanel />
        )}
      </div>
    </div>
  )
}

export default App
