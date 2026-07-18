import { useRef, useState, useEffect } from "react";
import { Play, Pause, CircleNotch } from "@phosphor-icons/react";

const formatTime = (secs) => {
  if (!secs || !isFinite(secs) || isNaN(secs) || secs < 0) return "0:00";
  const s = Math.floor(secs);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const AudioPlayer = ({ src, duration: initialDuration }) => {
  const audioRef = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [loaded,       setLoaded]       = useState(false);
  const [currentTime,  setCurrentTime]  = useState(0);
  const [totalDuration, setTotalDuration] = useState(
    initialDuration && isFinite(initialDuration) ? initialDuration : 0
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Browser-driven state — React never lies about what the audio is doing
    const onPlay           = () => setIsPlaying(true);
    const onPause          = () => setIsPlaying(false);
    const onTimeUpdate     = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0)
        setTotalDuration(audio.duration);
    };
    const onCanPlay = () => setLoaded(true);
    const onEnded   = () => { setCurrentTime(0); };

    audio.addEventListener("play",           onPlay);
    audio.addEventListener("pause",          onPause);
    audio.addEventListener("timeupdate",     onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("canplay",        onCanPlay);
    audio.addEventListener("ended",          onEnded);

    return () => {
      audio.removeEventListener("play",           onPlay);
      audio.removeEventListener("pause",          onPause);
      audio.removeEventListener("timeupdate",     onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("canplay",        onCanPlay);
      audio.removeEventListener("ended",          onEnded);
    };
  }, []);

  // Read audio.paused from DOM directly — never from React state
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else              audio.pause();
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio || !totalDuration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min((e.clientX - rect.left) / rect.width, 1));
    const newTime = ratio * totalDuration;
    const wasPlaying = !audio.paused;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    // Browser may pause internally during seek — force resume if needed
    if (wasPlaying) audio.play().catch(() => {});
  };

  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} preload="auto" />

      <button
        className="audio-player__btn"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {!loaded
          ? <CircleNotch size={14} weight="bold" className="audio-player__spinner" />
          : isPlaying
            ? <Pause size={14} weight="fill" />
            : <Play size={14} weight="fill" />}
      </button>

      <div className="audio-player__track" onClick={handleSeek}>
        <div className="audio-player__progress" style={{ width: `${progress}%` }} />
      </div>

      <span className="audio-player__time">
        {formatTime(currentTime)} / {formatTime(totalDuration)}
      </span>
    </div>
  );
};

export default AudioPlayer;
