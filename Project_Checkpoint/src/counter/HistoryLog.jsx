function badgeKind(label) {
  if (label.startsWith("+")) return "positive";
  if (label.startsWith("-")) return "negative";
  return "neutral";
}

function HistoryLog({ entries }) {
  if (entries.length === 0) {
    return <p className="history-empty">No actions yet.</p>;
  }

  return (
    <ul className="history-log" aria-label="Action history">
      {entries.map((entry) => (
        <li key={entry.id} className="history-entry">
          <span className={`history-badge history-badge--${badgeKind(entry.label)}`}>
            {entry.label}
          </span>
          <span className="history-values">
            {entry.from} &rarr; {entry.to}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default HistoryLog;
