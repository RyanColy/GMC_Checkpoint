import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Paperclip, Microphone, PaperPlaneTilt, ArrowLeft } from "@phosphor-icons/react";
import useVoiceRecorder from "../../hooks/useVoiceRecorder";
import useFileUpload from "../../hooks/useFileUpload";
import VoiceRecorder from "../media/VoiceRecorder";

const HOLD_THRESHOLD = 300;
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const MessageInput = ({ onSend, onTypingStart, onTypingStop }) => {
  const [text, setText] = useState("");
  const [isHoldMode, setIsHoldMode] = useState(false);
  // Prevents VoiceRecorder from flashing during the 300ms hold detection window
  const [isPotentialHold, setIsPotentialHold] = useState(false);

  const typingTimerRef = useRef(null);
  const isTypingRef   = useRef(false);
  const holdTimerRef  = useRef(null);
  const holdModeRef   = useRef(false);

  const {
    isRecording, duration, uploading,
    error: voiceError,
    startRecording, stopRecording, cancelRecording,
  } = useVoiceRecorder({ onSend });

  const {
    fileInputRef, progress,
    error: uploadError,
    openPicker, handleFileChange,
  } = useFileUpload({ onSend });

  const hasText = text.trim().length > 0;
  const reduced = useReducedMotion();

  // ── Text ────────────────────────────────────────────────────────
  const handleChange = (e) => {
    setText(e.target.value);
    if (!isTypingRef.current) { isTypingRef.current = true; onTypingStart?.(); }
    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false; onTypingStop?.();
    }, 2000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend({ type: "text", content: trimmed });
    setText("");
    clearTimeout(typingTimerRef.current);
    isTypingRef.current = false;
    onTypingStop?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  // ── Hold / tap ──────────────────────────────────────────────────
  const resetHold = () => {
    holdModeRef.current = false;
    setIsHoldMode(false);
    setIsPotentialHold(false);
  };

  const handleActionPointerDown = (e) => {
    if (hasText) return;
    e.preventDefault();
    holdModeRef.current = false;
    setIsPotentialHold(true); // freeze VoiceRecorder render during detection window

    holdTimerRef.current = setTimeout(() => {
      holdModeRef.current = true;
      setIsHoldMode(true);
      setIsPotentialHold(false);
    }, HOLD_THRESHOLD);

    startRecording(); // fire-and-forget — no await, pointer events stay synchronous
  };

  const handleActionPointerUp = (e) => {
    if (hasText) return;
    e.preventDefault();
    clearTimeout(holdTimerRef.current);
    if (holdModeRef.current) {
      // Hold mode: release → send
      stopRecording();
      resetHold();
    } else {
      // Tap mode: release before threshold → VoiceRecorder UI takes over
      setIsPotentialHold(false);
    }
  };

  const handleActionPointerLeave = () => {
    clearTimeout(holdTimerRef.current);
    if (holdModeRef.current && isRecording) {
      // Slid off while holding → cancel
      cancelRecording();
      resetHold();
    } else {
      setIsPotentialHold(false);
    }
  };

  useEffect(() => () => {
    clearTimeout(typingTimerRef.current);
    clearTimeout(holdTimerRef.current);
  }, []);

  // ── Render guards ────────────────────────────────────────────────
  // Tap mode: show full VoiceRecorder only once past the hold window
  if ((isRecording || uploading) && !isHoldMode && !isPotentialHold) {
    return (
      <VoiceRecorder
        duration={duration}
        uploading={uploading}
        onStop={stopRecording}
        onCancel={cancelRecording}
      />
    );
  }

  const isBusy = progress !== null;
  const error  = uploadError || voiceError;

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleFileChange} />

      {progress !== null && (
        <div className="message-input__progress-bar">
          <div className="message-input__progress-fill" style={{ width: `${progress}%` }} />
          <span className="message-input__progress-label">{progress}%</span>
        </div>
      )}

      {error && <p className="message-input__error">{error}</p>}

      <button
        type="button"
        className="message-input__attach"
        onClick={openPicker}
        disabled={isBusy || isHoldMode}
        aria-label="Attach file"
      >
        <Paperclip size={18} />
      </button>

      {/* Hold mode: timer + animated slide-to-cancel replaces textarea */}
      {isHoldMode && isRecording ? (
        <div className="message-input__hold-indicator">
          <span className="voice-recorder__dot" />
          <span className="voice-recorder__timer">{fmt(duration)}</span>
          <motion.span
            className="message-input__slide-cancel"
            animate={reduced ? {} : { x: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
          >
            <ArrowLeft size={13} weight="bold" />
            Slide to cancel
          </motion.span>
        </div>
      ) : (
        <textarea
          className="message-input__field"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          rows={1}
          disabled={isBusy}
        />
      )}

      <button
        type={hasText ? "submit" : "button"}
        className={`message-input__send ${!hasText && isRecording ? "message-input__mic--active" : ""}`}
        onPointerDown={!hasText ? handleActionPointerDown : undefined}
        onPointerUp={!hasText ? handleActionPointerUp : undefined}
        onPointerLeave={!hasText ? handleActionPointerLeave : undefined}
        disabled={isBusy}
        aria-label={hasText ? "Send message" : "Hold to record, tap for recorder"}
        title={hasText ? "Send" : "Hold to record · tap to open recorder"}
      >
        {hasText
          ? <PaperPlaneTilt size={18} weight="fill" />
          : isRecording
            ? <Microphone size={18} weight="fill" style={{ color: "var(--danger)" }} />
            : <Microphone size={18} />}
      </button>
    </form>
  );
};

export default MessageInput;
