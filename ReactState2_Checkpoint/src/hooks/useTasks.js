import { useState, useEffect } from "react";
import { getTasks, saveTasks } from "../services/storageService";
import { createTask } from "../utils";

// useTasks — custom hook that owns all task state and CRUD logic
function useTasks() {
  const [tasks, setTasks] = useState(getTasks);

  // Sync to localStorage whenever the task list changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addTask({ name, description }) {
    setTasks((prev) => [createTask({ name, description }), ...prev]);
  }

  function updateTask(id, { name, description }) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, name, description } : t))
    );
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tasks, addTask, updateTask, toggleComplete, deleteTask };
}

export default useTasks;
