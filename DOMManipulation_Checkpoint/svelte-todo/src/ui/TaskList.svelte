<script>
  import TaskItem from './TaskItem.svelte'

  let { tasks, onUpdate, onRemove } = $props()
</script>

{#if tasks.length === 0}
  <div class="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
    No tasks yet — add one above.
  </div>
{:else}
  <ul class="flex flex-col gap-2">
    {#each tasks as task (task.id)}
      <TaskItem {task} {onUpdate} {onRemove} />
    {/each}
  </ul>
{/if}
