import { useRef, useState, useCallback } from "react";
import api from "../services/api";

const SUPPORTED_TYPES = ["audio/webm", "audio/ogg", "audio/mp4"];

const getSupportedMimeType = () =>
  SUPPORTED_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || "";

const useVoiceRecorder = ({ onSend }) => {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);
  const durationRef = useRef(0);
  const mimeTypeRef = useRef("");

  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const resetState = () => {
    clearInterval(timerRef.current);
    setIsRecording(false);
    setDuration(0);
    durationRef.current = 0;
  };

  const uploadAndSend = useCallback(async () => {
    const chunks = chunksRef.current;
    const totalSize = chunks.reduce((s, c) => s + c.size, 0);

    // Skip upload if no audio data was captured
    if (chunks.length === 0 || totalSize === 0) {
      setUploading(false);
      return;
    }

    const mType = mimeTypeRef.current || "audio/webm";
    const ext = mType.split("/")[1];
    const blob = new Blob(chunks, { type: mType });
    const formData = new FormData();
    formData.append("file", blob, `voice-${Date.now()}.${ext}`);

    try {
      const { data } = await api.post("/upload", formData);
      onSend({
        type: "voice",
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: mType,
        duration: durationRef.current,
      });
    } catch {
      setError("Upload failed — try again");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploading(false);
      setDuration(0);
      durationRef.current = 0;
      chunksRef.current = [];
    }
  }, [onSend]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      durationRef.current = 0;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        await uploadAndSend();
      };

      // timeslice=250ms → garantit ondataavailable avant un stop rapide
      recorder.start(250);
      setIsRecording(true);
      setError("");

      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      setError("Microphone unavailable");
      setTimeout(() => setError(""), 3000);
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    // Force flush remaining buffered data before stopping
    recorder.requestData();
    recorder.stop();
    clearInterval(timerRef.current);
    setIsRecording(false);
    setUploading(true);
  };

  const cancelRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    chunksRef.current = [];
    resetState();
  };

  return {
    isRecording,
    duration,
    uploading,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
  };
};

export default useVoiceRecorder;
