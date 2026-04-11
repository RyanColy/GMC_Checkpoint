import { useState } from "react";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";
import "./TaskItem.css";

// TaskItem — single task card with toggle, edit, delete + confirm dialog
function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <li className={`task-item ${task.completed ? "completed" : ""}`}>

        {/* Circular checkbox toggle */}
        <button
          className="task-checkbox"
          onClick={() => onToggleComplete(task.id)}
          title={task.completed ? "Marquer comme active" : "Marquer comme complétée"}
          aria-label={task.completed ? "Marquer comme active" : "Marquer comme complétée"}
        >
          ✓
        </button>

        {/* Task content */}
        <div className="task-info">
          <p className="task-name">{task.name}</p>
          <p className="task-description">{task.description}</p>
        </div>

        {/* Action icon buttons */}
        <div className="task-actions">
          {!task.completed && (
            <button
              className="icon-btn icon-btn-edit"
              onClick={() => onEdit(task)}
              title="Modifier"
              aria-label="Modifier la tâche"
            >
              ✏️
            </button>
          )}
          <button
            className="icon-btn icon-btn-delete"
            onClick={() => setShowConfirm(true)}
            title="Supprimer"
            aria-label="Supprimer la tâche"
          >
            🗑️
          </button>
        </div>

      </li>

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        taskName={task.name}
        onConfirm={() => { setShowConfirm(false); onDelete(task.id); }}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}

export default TaskItem;
