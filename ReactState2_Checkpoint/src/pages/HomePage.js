import { useState } from "react";
import { useTaskContext } from "../context/TaskContext";
import TaskForm from "../components/TaskForm/TaskForm";
import TaskList from "../components/TaskList/TaskList";
import Modal from "../components/Modal/Modal";
import { FILTERS } from "../constants";
import { getTaskStats } from "../utils";
import "./HomePage.css";

// SVG icons for the filter bar
const FilterIcons = {
  all: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6"  x2="21" y2="6"  />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  active: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  completed: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// HomePage — main page, owns UI state (filter, modal, editing task)
function HomePage() {
  const { tasks, addTask, updateTask, toggleComplete, deleteTask } = useTaskContext();

  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen]  = useState(false);
  const [filter, setFilter]            = useState("all");

  const { total, completedCount, activeCount, progressPct } = getTaskStats(tasks);
  const counts = { all: total, active: activeCount, completed: completedCount };

  function openAddModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingTask(null);
  }

  function handleSubmit({ name, description }) {
    if (editingTask) {
      updateTask(editingTask.id, { name, description });
    } else {
      addTask({ name, description });
    }
    closeModal();
  }

  return (
    <div className="home-page">
      <div className="home-panel">

        {/* ── Header ── */}
        <header className="home-header">
          <div className="home-header-top">
            <span className="home-header-icon">✅</span>
            <div className="home-header-text">
              <h1>My To-Do List</h1>
              <p>Stay organised, get things done.</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-section">
            <div className="progress-label">
              <span>{completedCount} of {total} tasks completed</span>
              <span>{progressPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="home-body">

          {/* Filter icon bar */}
          <div className="filter-bar">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? "active" : ""}`}
                onClick={() => setFilter(key)}
                title={label}
                aria-label={`Filter: ${label}`}
              >
                <span className="filter-icon">{FilterIcons[key]}</span>
                <span className="filter-label">{label}</span>
                <span className="filter-count">{counts[key]}</span>
              </button>
            ))}
          </div>

          {/* Task list */}
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggleComplete={toggleComplete}
            onEdit={openEditModal}
            onDelete={deleteTask}
          />

          {/* Add task CTA */}
          <button className="add-task-btn" onClick={openAddModal}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5"  y1="12" x2="19" y2="12" />
            </svg>
            Ajouter une tâche
          </button>
        </div>

      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "✏️ Modifier la tâche" : "➕ Nouvelle tâche"}
      >
        <TaskForm
          onSubmit={handleSubmit}
          editingTask={editingTask}
          onCancelEdit={closeModal}
        />
      </Modal>
    </div>
  );
}

export default HomePage;
