// storageService — abstracts all localStorage read/write operations for tasks

import { STORAGE_KEY } from "../constants";

export function getTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
