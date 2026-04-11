import TaskItem from "../TaskItem/TaskItem";
import { EMPTY_MESSAGES } from "../../constants";

// TaskList renders the filtered list of tasks or an empty state.
function TaskList({ tasks, filter, onToggleComplete, onEdit, onDelete }) {
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    const { icon, title, sub } = EMPTY_MESSAGES[filter];

    return (
      <div className="empty-state">
        <span className="empty-state-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
    );
  }

  return (
    <ul className="task-list">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
