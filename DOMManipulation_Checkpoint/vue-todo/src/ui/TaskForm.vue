<script setup>
import { ref } from 'vue'
import { PRIORITIES } from '../task/task'

const emit = defineEmits(['add'])

const name = ref('')
const priority = ref('medium')

function handleSubmit() {
  const trimmed = name.value.trim()
  if (!trimmed) return
  emit('add', trimmed, priority.value)
  name.value = ''
  priority.value = 'medium'
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="handleSubmit">
    <input
      v-model="name"
      placeholder="New task"
      aria-label="Task name"
      class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-slate-100/20"
    />
    <select
      v-model="priority"
      aria-label="Task priority"
      class="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
    >
      <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }}</option>
    </select>
    <button
      type="submit"
      class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
    >
      Add
    </button>
  </form>
</template>
