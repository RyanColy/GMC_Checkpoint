import React from 'react';

const navItems = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'tasks', icon: '✓', label: 'My Tasks' },
  { id: 'projects', icon: '◫', label: 'Projects' },
  { id: 'calendar', icon: '◻', label: 'Calendar' },
  { id: 'messages', icon: '◉', label: 'Messages', badge: 3 },
];

const secondaryItems = [
  { id: 'settings', icon: '⚙', label: 'Settings' },
  { id: 'help', icon: '?', label: 'Help & Support' },
];

function Sidebar({ activeNav, setActiveNav, tasks, user }) {
  const pending = tasks.filter(t => !t.done).length;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">✦</div>
        <h1>TaskFlow</h1>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-title">Main</span>
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.id === 'tasks' && pending > 0 && (
              <span className="nav-badge">{pending}</span>
            )}
            {item.badge && item.id !== 'tasks' && (
              <span className="nav-badge">{item.badge}</span>
            )}
          </button>
        ))}

        <span className="nav-section-title">Account</span>
        {secondaryItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-user">
        <div className="avatar">{user.initials}</div>
        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-role">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
