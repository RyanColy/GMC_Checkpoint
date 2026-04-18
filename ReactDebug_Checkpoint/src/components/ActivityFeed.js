import React from 'react';

const STATIC_ACTIVITIES = [
  { dot: 'purple', text: <><strong>Alex</strong> completed "Update API docs"</>, time: '2m ago' },
  { dot: 'green',  text: <><strong>Alex</strong> added a new task "Fix auth bug"</>, time: '18m ago' },
  { dot: 'orange', text: <><strong>Alex</strong> marked "Design mockup" as urgent</>, time: '1h ago' },
  { dot: 'blue',   text: <><strong>Alex</strong> joined project "Dashboard v2"</>, time: '3h ago' },
  { dot: 'green',  text: <><strong>Alex</strong> completed "Write unit tests"</>, time: 'Yesterday' },
];

function ActivityFeed({ tasks }) {
  const recentDone = tasks.filter(t => t.done).slice(0, 2);

  const activities = [
    ...recentDone.map(t => ({
      dot: 'green',
      text: <><strong>You</strong> completed "{t.title}"</>,
      time: 'Recently',
    })),
    ...STATIC_ACTIVITIES,
  ].slice(0, 6);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Recent Activity</h3>
      </div>
      <div className="card-body">
        <div className="activity-list">
          {activities.map((a, i) => (
            <div key={i} className="activity-item">
              <div className={`activity-dot dot-${a.dot}`} />
              <div style={{ flex: 1 }}>
                <div className="activity-text">{a.text}</div>
                <div className="activity-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActivityFeed;
