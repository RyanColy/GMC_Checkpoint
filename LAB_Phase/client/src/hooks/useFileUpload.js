import { useState, useRef } from "react";
import api from "../services/api";

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

const getMessageType = (mimeType) => {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "file";
};

const useFileUpload = ({ onSend }) => {
  const [progress, setProgress] = useState(null); // null | 0-100
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const openPicker = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be picked again

    if (file.size > MAX_SIZE) {
      setError("File too large (max 50 MB)");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setProgress(0);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await api.post("/upload", formData, {
        onUploadProgress: (event) => {
          const pct = Math.round((event.loaded * 100) / event.total);
          setProgress(pct);
        },
      });

      onSend({
        type: getMessageType(data.mimeType),
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      });
    } catch {
      setError("Upload failed — please retry");
      setTimeout(() => setError(""), 3000);
    } finally {
      setProgress(null);
    }
  };

  return { fileInputRef, progress, error, openPicker, handleFileChange };
};

export default useFileUpload;
