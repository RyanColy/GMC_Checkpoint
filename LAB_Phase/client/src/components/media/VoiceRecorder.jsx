import { X, ArrowUp } from "@phosphor-icons/react";

const formatDuration = (secs) =>
  `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

const VoiceRecorder = ({ duration, uploading, onStop, onCancel }) => (
  <div className="voice-recorder">
    <button className="voice-recorder__cancel" onClick={onCancel} disabled={uploading} aria-label="Cancel">
      <X size={18} />
    </button>
    <div className="voice-recorder__indicator">
      <span className="voice-recorder__dot" />
      <span className="voice-recorder__timer">{formatDuration(duration)}</span>
    </div>
    <button className="voice-recorder__send" onClick={onStop} disabled={uploading} aria-label="Send voice message">
      {uploading ? <span style={{ fontSize: "0.75rem" }}>…</span> : <ArrowUp size={18} weight="bold" />}
    </button>
  </div>
);

export default VoiceRecorder;
