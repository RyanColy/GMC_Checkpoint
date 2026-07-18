const UNITS = ["B", "KB", "MB", "GB"];

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = (bytes / Math.pow(1024, i)).toFixed(i > 0 ? 1 : 0);
  return `${value} ${UNITS[i]}`;
};

export default formatFileSize;
