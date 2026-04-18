import React from 'react';

// BUG 3: email prop is expected here but never passed from App.js
function UserProfile({ name, role, email, initials, tasks }) {
  const done = tasks.filter(t => t.done).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const workTasks = tasks.filter(t => t.tag === 'work').length;
  const personalTasks = tasks.filter(t => t.tag === 'personal').length;
  const urgentTasks = tasks.filter(t => t.tag === 'urgent').length;

  return (
    <div className="card profile-card">
      <div className="card-header">
        <h3>My Profile</h3>
      </div>
      <div className="card-body">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{name}</div>
        <div className="profile-role">{role}</div>
        <div className="profile-email">{email || '⚠ No email set'}</div>

        <div className="profile-stats">
          <div className="profile-stat">
            <div className="value">{total}</div>
            <div className="label">Tasks</div>
          </div>
          <div className="profile-stat">
            <div className="value">{done}</div>
            <div className="label">Done</div>
          </div>
          <div className="profile-stat">
            <div className="value">{pct}%</div>
            <div className="label">Rate</div>
          </div>
        </div>

        <div className="progress-section" style={{ marginTop: 20, width: '100%' }}>
          <div className="progress-label">
            <span>Work</span>
            <strong>{workTasks}</strong>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill fill-purple"
              style={{ width: `${(workTasks / total) * 100}%` }}
            />
          </div>

          <div className="progress-label">
            <span>Personal</span>
            <strong>{personalTasks}</strong>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill fill-green"
              style={{ width: `${(personalTasks / total) * 100}%` }}
            />
          </div>

          <div className="progress-label">
            <span>Urgent</span>
            <strong>{urgentTasks}</strong>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill fill-orange"
              style={{ width: `${(urgentTasks / total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
