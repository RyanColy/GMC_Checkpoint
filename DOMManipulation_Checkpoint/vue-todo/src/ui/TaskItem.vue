<script setup>
import { ref } from 'vue'
import { PRIORITIES } from '../task/task'

const props = defineProps({
  task: { type: Object, required: true },
})
const emit = defineEmits(['update', 'remove'])

const editing = ref(false)
const draftName = ref(props.task.name)
const draftPriority = ref(props.task.priority)

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

function startEdit() {
  draftName.value = props.task.name
  draftPriority.value = props.task.priority
  editing.value = true
}

function save() {
  const name = draftName.value.trim() || props.task.name
  emit('update', props.task.id, { name, priority: draftPriority.value })
  editing.value = false
}
</script>

<template>
  <li
    v-if="editing"
    class="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-100/10"
  >
    <input
      v-model="draftName"
      aria-label="Edit task name"
      class="flex-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    />
    <select
      v-model="draftPriority"
      aria-label="Edit task priority"
      class="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <option v-for="p in PRIORITIES" :key="p" :value="p">{{ p }}</option>
    </select>
    <button
      @click="save"
      class="rounded-md bg-slate-900 px-3 py-1 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
    >
      Save
    </button>
  </li>
  <li
    v-else
    class="group flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/10 transition-shadow hover:shadow-md dark:bg-slate-900 dark:ring-slate-100/10"
  >
    <span class="flex-1 truncate text-sm text-slate-800 dark:text-slate-100">{{ task.name }}</span>
    <span
      :class="`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`"
    >
      <span :class="`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`" />
      {{ task.priority }}
    </span>
    <button
      @click="startEdit"
      class="text-sm text-slate-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
    >
      Edit
    </button>
    <button
      @click="emit('remove', task.id)"
      class="text-sm text-red-500 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
    >
      Delete
    </button>
  </li>
</template>
