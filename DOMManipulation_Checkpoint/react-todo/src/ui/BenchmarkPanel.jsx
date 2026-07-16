import { useRef, useState } from 'react'
import { generateTasks } from '../benchmark/generateTasks'
import { now } from '../benchmark/measure'
import { useTasks } from '../task/useTasks'
import { TaskList } from './TaskList'

function afterPaint(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

export function BenchmarkPanel() {
  const { tasks, setTasks, updateTask, removeTask } = useTasks()
  const [results, setResults] = useState([])
  const startRef = useRef(null)

  function record(label) {
    afterPaint(() => {
      const ms = (now() - startRef.current).toFixed(2)
      setResults((prev) => [{ label, ms }, ...prev])
    })
  }

  function runRender(count) {
    startRef.current = now()
    setTasks(generateTasks(count))
    record(`Render ${count} tasks`)
  }

  function runUpdate(count = 50) {
    startRef.current = now()
    setTasks((prev) =>
      prev.map((task, index) =>
        index < count ? { ...task, name: `${task.name} *` } : task
      )
    )
    record(`Update ${count} tasks`)
  }

  function runDelete(count = 50) {
    startRef.current = now()
    setTasks((prev) => prev.slice(count))
    record(`Delete ${count} tasks`)
  }

  const buttonClass =
    'rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {[100, 500, 1000].map((count) => (
          <button key={count} onClick={() => runRender(count)} className={buttonClass}>
            Render {count}
          </button>
        ))}
        <button onClick={() => runUpdate(50)} className={buttonClass}>
          Update 50
        </button>
        <button onClick={() => runDelete(50)} className={buttonClass}>
          Delete 50
        </button>
      </div>

      {results.length > 0 && (
        <div className="overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-900/10 dark:ring-slate-100/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                <th className="px-3 py-2 font-medium">Operation</th>
                <th className="px-3 py-2 font-medium">Time (ms)</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr
                  key={index}
                  className="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950"
                >
                  <td className="px-3 py-2 text-slate-800 dark:text-slate-100">{result.label}</td>
                  <td className="px-3 py-2 font-mono text-slate-800 dark:text-slate-100">{result.ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {tasks.length} tasks currently rendered
      </p>
      <div className="max-h-64 overflow-y-auto">
        <TaskList tasks={tasks} onUpdate={updateTask} onRemove={removeTask} />
      </div>
    </section>
  )
}
