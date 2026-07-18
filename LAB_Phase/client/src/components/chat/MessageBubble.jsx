import { formatMessageTime } from "../../utils/formatDate";
import AudioPlayer from "../media/AudioPlayer";
import ImageViewer from "../media/ImageViewer";
import FileAttachment from "../media/FileAttachment";

const StatusTick = ({ readBy, deliveredTo }) => {
  if (readBy?.length > 0) return <span className="bubble__status bubble__status--read">✓✓</span>;
  if (deliveredTo?.length > 0) return <span className="bubble__status bubble__status--delivered">✓✓</span>;
  return <span className="bubble__status">✓</span>;
};

const MessageBubble = ({ message, isMine, isGroup }) => {
  const senderName = !isMine && isGroup ? message.sender?.displayName : null;

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return <p className="bubble__text">{message.content}</p>;
      case "voice":
        return <AudioPlayer src={message.fileUrl} duration={message.duration} />;
      case "image":
        return <ImageViewer src={message.fileUrl} alt={message.fileName} />;
      case "video":
        return (
          <video
            className="bubble__video"
            src={message.fileUrl}
            controls
            preload="metadata"
          />
        );
      case "audio":
        return <AudioPlayer src={message.fileUrl} duration={message.duration} />;
      case "file":
        return (
          <FileAttachment
            url={message.fileUrl}
            name={message.fileName}
            size={message.fileSize}
            mimeType={message.mimeType}
          />
        );
      case "deleted":
        return <em className="bubble__deleted">This message was deleted</em>;
      default:
        return <p className="bubble__text">{message.content}</p>;
    }
  };

  return (
    <div className={`bubble ${isMine ? "bubble--mine" : "bubble--theirs"}`}>
      {senderName && <span className="bubble__sender">{senderName}</span>}
      {renderContent()}
      <div className="bubble__meta">
        <span className="bubble__time">{formatMessageTime(message.createdAt)}</span>
        {isMine && <StatusTick readBy={message.readBy} deliveredTo={message.deliveredTo} />}
      </div>
    </div>
  );
};

export default MessageBubble;
