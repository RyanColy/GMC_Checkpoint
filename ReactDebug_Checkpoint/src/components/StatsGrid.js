import React, { useState, useEffect } from 'react';

// BUG 2: completedCount is never updated because useEffect has empty deps
// The displayed "Completed" stat will always show 0
function StatsGrid({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter(t => !t.done).length;
  const urgent = tasks.filter(t => t.priority === 'high' && !t.done).length;

  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCompletedCount(tasks.filter(t => t.done).length);
  }, [tasks]);

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon purple">📋</div>
        <div className="stat-info">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Tasks</div>
          <div className="stat-change up">↑ 4 this week</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon green">✅</div>
        <div className="stat-info">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed</div>
          <div className="stat-change up">↑ 2 today</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon orange">⏳</div>
        <div className="stat-info">
          <div className="stat-value">{pending}</div>
          <div className="stat-label">In Progress</div>
          <div className="stat-change down">↓ 1 vs yesterday</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon blue">🔥</div>
        <div className="stat-info">
          <div className="stat-value">{urgent}</div>
          <div className="stat-label">Urgent</div>
          <div className="stat-change down">Need attention</div>
        </div>
      </div>
    </div>
  );
}

export default StatsGrid;
