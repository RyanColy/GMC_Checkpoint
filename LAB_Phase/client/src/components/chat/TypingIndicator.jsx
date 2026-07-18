const TypingIndicator = ({ typers, participants }) => {
  if (typers.size === 0) return null;

  const names = [...typers]
    .map((id) => participants.find((p) => p._id === id)?.displayName || "Someone")
    .join(", ");

  return (
    <div className="typing-indicator">
      <span className="typing-indicator__dots">
        <span /><span /><span />
      </span>
      <span className="typing-indicator__text">{names} is typing…</span>
    </div>
  );
};

export default TypingIndicator;
