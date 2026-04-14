import { useDispatch, useSelector } from 'react-redux';
import {
  toggleTask,
  deleteTask,
  startEditing,
  setEditingValue,
  saveEdit,
  cancelEditing,
  selectEditingId,
  selectEditingValue,
} from '../Redux/todosSlice';

function Task({ task }) {
  const dispatch = useDispatch();
  const editingId    = useSelector(selectEditingId);
  const editingValue = useSelector(selectEditingValue);
  const isEditing    = editingId === task.id;

  return (
    <li className={`task-item ${task.isDone ? 'done' : ''}`}>
      <input
        className="task-checkbox"
        type="checkbox"
        checked={task.isDone}
        onChange={() => dispatch(toggleTask(task.id))}
        title={task.isDone ? 'Mark as pending' : 'Mark as done'}
      />

      {isEditing ? (
        <input
          type="text"
          value={editingValue}
          onChange={(e) => dispatch(setEditingValue(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') dispatch(saveEdit());
            if (e.key === 'Escape') dispatch(cancelEditing());
          }}
          autoFocus
        />
      ) : (
        <span className="task-description">{task.description}</span>
      )}

      {task.isDone && !isEditing && (
        <span className="done-badge">Done</span>
      )}

      <div className="task-actions">
        {isEditing ? (
          <button className="btn-icon save" onClick={() => dispatch(saveEdit())} title="Save">
            💾
          </button>
        ) : (
          <button className="btn-icon edit" onClick={() => dispatch(startEditing(task.id))} title="Edit">
            ✏️
          </button>
        )}
        <button className="btn-icon delete" onClick={() => dispatch(deleteTask(task.id))} title="Delete">
          🗑️
        </button>
      </div>
    </li>
  );
}

export default Task;
