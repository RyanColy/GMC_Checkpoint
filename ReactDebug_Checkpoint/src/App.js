import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import StatsGrid from './components/StatsGrid';
import TaskBoard from './components/TaskBoard';
import UserProfile from './components/UserProfile';
import ActivityFeed from './components/ActivityFeed';
import AddTaskModal from './components/AddTaskModal';

const INITIAL_TASKS = [
  { id: 1, title: 'Design new landing page', tag: 'work', priority: 'high', due: 'Today', done: false },
  { id: 2, title: 'Review pull requests', tag: 'work', priority: 'medium', due: 'Tomorrow', done: false },
  { id: 3, title: 'Go for a morning run', tag: 'health', priority: 'low', due: 'Today', done: true },
  { id: 4, title: 'Call the dentist', tag: 'personal', priority: 'medium', due: 'Apr 20', done: false },
  { id: 5, title: 'Fix authentication bug', tag: 'urgent', priority: 'high', due: 'Today', done: false },
  { id: 6, title: 'Update project documentation', tag: 'work', priority: 'low', due: 'Apr 22', done: false },
  { id: 7, title: 'Buy groceries', tag: 'personal', priority: 'low', due: 'Today', done: true },
];

const user = {
  name: 'Alex Martin',
  role: 'Product Designer',
  email: 'alex.martin@studio.io',
  initials: 'AM',
};

function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), done: false }]);
    setShowModal(false);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="app-layout">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} tasks={tasks} user={user} />

      <div className="main-content">
        <Topbar onAdd={() => setShowModal(true)} />

        <div className="page-body">
          <StatsGrid tasks={tasks} />

          <div className="content-grid">
            <div>
              <TaskBoard
                tasks={tasks}
                filter={filter}
                setFilter={setFilter}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <UserProfile name={user.name} role={user.role} email={user.email} initials={user.initials} tasks={tasks} />
              <ActivityFeed tasks={tasks} />
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <AddTaskModal onAdd={addTask} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default App;
