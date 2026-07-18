import { DownloadSimple, FilePdf, FileDoc, FileXls, FilePpt, FileText, File } from "@phosphor-icons/react";
import formatFileSize from "../../utils/formatFileSize";

const TYPE_ICONS = {
  "application/pdf": FilePdf,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FileDoc,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": FileXls,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": FilePpt,
  "text/plain": FileText,
};

const API = import.meta.env.VITE_API_URL;

const downloadViaProxy = async (url, name) => {
  const token  = localStorage.getItem("token");
  const params = new URLSearchParams({ url, filename: name || "file" });
  try {
    const res = await fetch(`${API}/download?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = name || "file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  } catch {
    window.open(url, "_blank");
  }
};

const FileAttachment = ({ url, name, size, mimeType }) => {
  const Icon = TYPE_ICONS[mimeType] || File;

  return (
    <div className="file-attachment">
      <Icon size={28} weight="duotone" className="file-attachment__icon" />
      <div className="file-attachment__info">
        <span className="file-attachment__name">{name || "File"}</span>
        <span className="file-attachment__size">{formatFileSize(size)}</span>
      </div>
      <button
        className="file-attachment__download"
        onClick={() => downloadViaProxy(url, name)}
        aria-label="Download"
      >
        <DownloadSimple size={16} weight="bold" />
      </button>
    </div>
  );
};

export default FileAttachment;
