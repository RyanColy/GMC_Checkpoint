import React from 'react';

function Topbar({ onAdd }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2>Good morning, Alex 👋</h2>
        <p>{today}</p>
      </div>
      <div className="topbar-right">
        <button className="topbar-btn ghost">⚙ Preferences</button>
        <button className="topbar-btn primary" onClick={onAdd}>
          + New Task
        </button>
      </div>
    </header>
  );
}

export default Topbar;
