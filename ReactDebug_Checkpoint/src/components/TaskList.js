import React from 'react';

// BUG 5: no key prop on list items (uses index fallback which causes issues on reorder)
function TaskList({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {tasks.map((task, index) => (
        // BUG 5: key uses index instead of task.id
        <li
          key={index}
          onClick={() => onToggle(task.id)}
          style={{
            padding: '10px 14px',
            marginBottom: 8,
            background: task.done ? '#d4edda' : '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: 6,
            cursor: 'pointer',
            textDecoration: task.done ? 'line-through' : 'none',
            color: task.done ? '#6c757d' : '#212529',
          }}
        >
          {task.text}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
