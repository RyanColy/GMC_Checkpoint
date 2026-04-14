import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  filter: 'all',       // 'all' | 'done' | 'notDone'
  editingId: null,     // id of the task currently being edited, or null
  editingValue: '',    // current value of the edit input
  newTaskInput: '',    // current value of the add-task input
};

let nextId = 1;

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // ── New task input ──────────────────────────────
    setNewTaskInput: (state, action) => {
      state.newTaskInput = action.payload;
    },
    addTask: (state) => {
      const trimmed = state.newTaskInput.trim();
      if (!trimmed) return;
      state.tasks.push({ id: nextId++, description: trimmed, isDone: false });
      state.newTaskInput = '';
    },

    // ── Task actions ────────────────────────────────
    toggleTask: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.isDone = !task.isDone;
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      if (state.editingId === action.payload) {
        state.editingId = null;
        state.editingValue = '';
      }
    },

    // ── Edit flow ───────────────────────────────────
    startEditing: (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (!task) return;
      state.editingId = action.payload;
      state.editingValue = task.description;
    },
    setEditingValue: (state, action) => {
      state.editingValue = action.payload;
    },
    saveEdit: (state) => {
      const trimmed = state.editingValue.trim();
      if (!trimmed) return;
      const task = state.tasks.find((t) => t.id === state.editingId);
      if (task) task.description = trimmed;
      state.editingId = null;
      state.editingValue = '';
    },
    cancelEditing: (state) => {
      state.editingId = null;
      state.editingValue = '';
    },

    // ── Filter ──────────────────────────────────────
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  setNewTaskInput,
  addTask,
  toggleTask,
  deleteTask,
  startEditing,
  setEditingValue,
  saveEdit,
  cancelEditing,
  setFilter,
} = todosSlice.actions;

export const selectAllTasks      = (state) => state.todos.tasks;
export const selectFilter        = (state) => state.todos.filter;
export const selectEditingId     = (state) => state.todos.editingId;
export const selectEditingValue  = (state) => state.todos.editingValue;
export const selectNewTaskInput  = (state) => state.todos.newTaskInput;
export const selectFilteredTasks = (state) => {
  const { tasks, filter } = state.todos;
  if (filter === 'done')    return tasks.filter((t) =>  t.isDone);
  if (filter === 'notDone') return tasks.filter((t) => !t.isDone);
  return tasks;
};

export default todosSlice.reducer;
