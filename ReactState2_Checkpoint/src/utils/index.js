// ── Task factory ───────────────────────────────────
// Creates a new task object with a unique id and default state
export function createTask({ name, description }) {
  return {
    id: Date.now(),
    name,
    description,
    completed: false,
  };
}

// ── Task stats ─────────────────────────────────────
// Returns counts and progress percentage for a task list
export function getTaskStats(tasks) {
  const total = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = total - completedCount;
  const progressPct = total === 0 ? 0 : Math.round((completedCount / total) * 100);
  return { total, completedCount, activeCount, progressPct };
}
