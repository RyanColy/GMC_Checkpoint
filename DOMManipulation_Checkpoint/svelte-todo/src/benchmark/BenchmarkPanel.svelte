<script>
  import { createTaskStore } from '../task/taskStore.svelte'
  import TaskList from '../ui/TaskList.svelte'
  import { generateTasks } from './generateTasks'
  import { now } from './measure'

  const store = createTaskStore()
  let results = $state([])
  let startedAt = 0

  function afterPaint(callback) {
    requestAnimationFrame(() => requestAnimationFrame(callback))
  }

  function record(label) {
    afterPaint(() => {
      const ms = (now() - startedAt).toFixed(2)
      results = [{ label, ms }, ...results]
    })
  }

  function runRender(count) {
    startedAt = now()
    store.setTasks(generateTasks(count))
    record(`Render ${count} tasks`)
  }

  function runUpdate(count = 50) {
    startedAt = now()
    store.setTasks(
      store.tasks.map((task, index) => (index < count ? { ...task, name: `${task.name} *` } : task))
    )
    record(`Update ${count} tasks`)
  }

  function runDelete(count = 50) {
    startedAt = now()
    store.setTasks(store.tasks.slice(count))
    record(`Delete ${count} tasks`)
  }
</script>

<section class="flex flex-col gap-4">
  <div class="flex flex-wrap gap-2">
    {#each [100, 500, 1000] as count (count)}
      <button
        onclick={() => runRender(count)}
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Render {count}
      </button>
    {/each}
    <button
      onclick={() => runUpdate(50)}
      class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      Update 50
    </button>
    <button
      onclick={() => runDelete(50)}
      class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      Delete 50
    </button>
  </div>

  {#if results.length > 0}
    <div class="overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-900/10 dark:ring-slate-100/10">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <th class="px-3 py-2 font-medium">Operation</th>
            <th class="px-3 py-2 font-medium">Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          {#each results as result, index (index)}
            <tr class="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950">
              <td class="px-3 py-2 text-slate-800 dark:text-slate-100">{result.label}</td>
              <td class="px-3 py-2 font-mono text-slate-800 dark:text-slate-100">{result.ms}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  <p class="text-xs text-slate-500 dark:text-slate-400">{store.tasks.length} tasks currently rendered</p>
  <div class="max-h-64 overflow-y-auto">
    <TaskList tasks={store.tasks} onUpdate={store.updateTask} onRemove={store.removeTask} />
  </div>
</section>
