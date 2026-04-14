export const FILTERS = [
  { value: 'all',     label: '📋 All'     },
  { value: 'notDone', label: '⏳ Pending' },
  { value: 'done',    label: '✅ Done'    },
];

export const EMPTY_MESSAGES = {
  all:     { icon: '🗒️', title: 'No tasks yet',          hint: 'Add your first task above!'              },
  done:    { icon: '🏆', title: 'Nothing completed yet', hint: 'Check off some tasks to see them here.' },
  notDone: { icon: '🎉', title: 'All caught up!',        hint: 'Everything is done — great work!'       },
};
