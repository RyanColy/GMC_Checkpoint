import React from 'react';

function TaskItem({ task, onToggle, onDelete }) {
  return (
    <div
      className={`task-item ${task.done ? 'done' : ''}`}
      onClick={() => onToggle(task.id)}
    >
      <div className="task-checkbox">
        {task.done && '✓'}
      </div>

      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`task-tag tag-${task.tag}`}>{task.tag}</span>
          <span className="task-due">📅 {task.due}</span>
        </div>
      </div>

      <div className={`task-priority priority-${task.priority}`} title={task.priority} />

      <button
        onClick={e => { e.stopPropagation(); onDelete(task.id); }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#ccc',
          fontSize: 16,
          padding: '0 4px',
          lineHeight: 1,
        }}
        title="Delete"
      >
        ×
      </button>
    </div>
  );
}

export default TaskItem;
