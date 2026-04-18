import React from 'react';
import TaskItem from './TaskItem';

const FILTERS = ['all', 'work', 'personal', 'urgent', 'health'];

function TaskBoard({ tasks, filter, setFilter, onToggle, onDelete }) {
  const filtered = filter === 'all'
    ? tasks
    : tasks.filter(t => t.tag === filter);

  return (
    <div className="card">
      <div className="card-header">
        <h3>My Tasks</h3>
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <p>No tasks here — enjoy your day!</p>
          </div>
        ) : (
          <div className="tasks-list">
            {filtered.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskBoard;
