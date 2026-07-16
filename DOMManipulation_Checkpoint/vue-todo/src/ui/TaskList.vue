<script setup>
import TaskItem from './TaskItem.vue'

defineProps({
  tasks: { type: Array, required: true },
})
defineEmits(['update', 'remove'])
</script>

<template>
  <div
    v-if="tasks.length === 0"
    class="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
  >
    No tasks yet — add one above.
  </div>
  <ul v-else class="flex flex-col gap-2">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @update="(...args) => $emit('update', ...args)"
      @remove="(id) => $emit('remove', id)"
    />
  </ul>
</template>
