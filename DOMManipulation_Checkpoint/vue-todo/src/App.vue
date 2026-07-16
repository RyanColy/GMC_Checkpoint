<script setup>
import { ref } from 'vue'
import BenchmarkPanel from './benchmark/BenchmarkPanel.vue'
import { useTasks } from './task/useTasks'
import TaskForm from './ui/TaskForm.vue'
import TaskList from './ui/TaskList.vue'

const TABS = ['To-do list', 'Benchmark']

const { tasks, addTask, updateTask, removeTask } = useTasks()
const tab = ref(TABS[0])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950">
    <div class="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <h1 class="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        Vue To-do
      </h1>

      <div class="flex gap-1 border-b border-slate-200 dark:border-slate-800">
        <button
          v-for="label in TABS"
          :key="label"
          @click="tab = label"
          :class="[
            '-mb-px px-3 py-2 text-sm font-medium transition-colors',
            tab === label
              ? 'border-b-2 border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200',
          ]"
        >
          {{ label }}
        </button>
      </div>

      <div v-if="tab === 'To-do list'" class="flex flex-col gap-4">
        <TaskForm @add="addTask" />
        <TaskList :tasks="tasks" @update="updateTask" @remove="removeTask" />
      </div>
      <BenchmarkPanel v-else />
    </div>
  </div>
</template>
