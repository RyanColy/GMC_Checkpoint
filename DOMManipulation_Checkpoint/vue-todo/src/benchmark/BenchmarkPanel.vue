<script setup>
import { ref } from 'vue'
import { useTasks } from '../task/useTasks'
import TaskList from '../ui/TaskList.vue'
import { generateTasks } from './generateTasks'
import { now } from './measure'

const { tasks, setTasks, updateTask, removeTask } = useTasks()
const results = ref([])
let startedAt = 0

function afterPaint(callback) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}

function record(label) {
  afterPaint(() => {
    const ms = (now() - startedAt).toFixed(2)
    results.value = [{ label, ms }, ...results.value]
  })
}

function runRender(count) {
  startedAt = now()
  setTasks(generateTasks(count))
  record(`Render ${count} tasks`)
}

function runUpdate(count = 50) {
  startedAt = now()
  setTasks(
    tasks.value.map((task, index) => (index < count ? { ...task, name: `${task.name} *` } : task))
  )
  record(`Update ${count} tasks`)
}

function runDelete(count = 50) {
  startedAt = now()
  setTasks(tasks.value.slice(count))
  record(`Delete ${count} tasks`)
}
</script>

<template>
  <section class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="count in [100, 500, 1000]"
        :key="count"
        @click="runRender(count)"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Render {{ count }}
      </button>
      <button
        @click="runUpdate(50)"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Update 50
      </button>
      <button
        @click="runDelete(50)"
        class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Delete 50
      </button>
    </div>

    <div
      v-if="results.length > 0"
      class="overflow-hidden rounded-xl shadow-sm ring-1 ring-slate-900/10 dark:ring-slate-100/10"
    >
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="bg-slate-50 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
            <th class="px-3 py-2 font-medium">Operation</th>
            <th class="px-3 py-2 font-medium">Time (ms)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(result, index) in results"
            :key="index"
            class="border-t border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-950"
          >
            <td class="px-3 py-2 text-slate-800 dark:text-slate-100">{{ result.label }}</td>
            <td class="px-3 py-2 font-mono text-slate-800 dark:text-slate-100">{{ result.ms }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-slate-500 dark:text-slate-400">{{ tasks.length }} tasks currently rendered</p>
    <div class="max-h-64 overflow-y-auto">
      <TaskList :tasks="tasks" @update="updateTask" @remove="removeTask" />
    </div>
  </section>
</template>
