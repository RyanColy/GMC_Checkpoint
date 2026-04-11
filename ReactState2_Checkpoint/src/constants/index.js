// ── Storage ────────────────────────────────────────
export const STORAGE_KEY = "todo_tasks";

// ── Filter options (icon is a string key resolved in FilterBar) ────
export const FILTERS = [
  { key: "all",       label: "All",    },
  { key: "active",    label: "Active", },
  { key: "completed", label: "Done",   },
];

// ── Empty state messages ───────────────────────────
export const EMPTY_MESSAGES = {
  all:       { icon: "📋", title: "No tasks yet",         sub: "Tap the button below to add your first task." },
  active:    { icon: "🎉", title: "All caught up!",        sub: "No active tasks remaining." },
  completed: { icon: "⏳", title: "Nothing completed yet", sub: "Complete a task to see it here." },
};
