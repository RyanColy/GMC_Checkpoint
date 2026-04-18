import React, { useState } from 'react';

function AddTaskModal({ onAdd, onClose }) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('work');
  const [priority, setPriority] = useState('medium');
  const [due, setDue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title: title.trim(), tag, priority, due: due || 'No date' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Task</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="add-task-form">
              <input
                className="form-input"
                placeholder="Task title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
              />
              <div className="form-row">
                <select className="form-select" value={tag} onChange={e => setTag(e.target.value)}>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="urgent">Urgent</option>
                  <option value="health">Health</option>
                </select>
                <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <input
                className="form-input"
                type="date"
                value={due}
                onChange={e => setDue(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit" style={{ padding: '10px 24px' }}>
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
