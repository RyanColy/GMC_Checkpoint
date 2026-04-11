import { useState, useEffect } from "react";
import "./TaskForm.css";

// TaskForm — handles both adding and editing a task.
// Designed to live inside a Modal — no card wrapper of its own.
function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [name, setName]         = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors]     = useState({});

  // Sync fields whenever the task being edited changes
  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setDescription(editingTask.description);
      setErrors({});
    } else {
      setName("");
      setDescription("");
      setErrors({});
    }
  }, [editingTask]);

  function validate() {
    const e = {};
    if (!name.trim())        e.name        = "Le nom de la tâche est requis.";
    if (!description.trim()) e.description = "La description est requise.";
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({ name: name.trim(), description: description.trim() });
    setName("");
    setDescription("");
    setErrors({});
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-fields">
        <div className="form-group">
          <label htmlFor="task-name">Nom de la tâche</label>
          <input
            id="task-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Qu'est-ce qui doit être fait ?"
            autoFocus
          />
          {errors.name && <span className="error">⚠ {errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ajoute quelques détails..."
            rows={3}
          />
          {errors.description && (
            <span className="error">⚠ {errors.description}</span>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancelEdit}>
            Annuler
          </button>
          <button type="submit" className="btn btn-primary">
            {editingTask ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
