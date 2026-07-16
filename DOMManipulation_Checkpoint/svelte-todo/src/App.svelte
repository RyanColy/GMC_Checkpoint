<script>
  import BenchmarkPanel from './benchmark/BenchmarkPanel.svelte'
  import { createTaskStore } from './task/taskStore.svelte'
  import TaskForm from './ui/TaskForm.svelte'
  import TaskList from './ui/TaskList.svelte'

  const TABS = ['To-do list', 'Benchmark']

  const store = createTaskStore()
  let tab = $state(TABS[0])
</script>

<div class="min-h-screen bg-slate-50 dark:bg-slate-950">
  <div class="mx-auto flex max-w-xl flex-col gap-6 p-6">
    <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
      Svelte To-do
    </h1>

    <div class="flex gap-1 border-b border-slate-200 dark:border-slate-800">
      {#each TABS as label (label)}
        <button
          onclick={() => (tab = label)}
          class="-mb-px px-3 py-2 text-sm font-medium transition-colors {tab === label
            ? 'border-b-2 border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100'
            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'}"
        >
          {label}
        </button>
      {/each}
    </div>

    {#if tab === 'To-do list'}
      <div class="flex flex-col gap-4">
        <TaskForm onAdd={store.addTask} />
        <TaskList tasks={store.tasks} onUpdate={store.updateTask} onRemove={store.removeTask} />
      </div>
    {:else}
      <BenchmarkPanel />
    {/if}
  </div>
</div>
