import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const ConversationHeader = ({ participant }) => {
  const navigate = useNavigate();

  if (!participant) return <div className="conv-header" />;

  return (
    <div className="conv-header">
      <button className="conv-header__back" onClick={() => navigate("/")} aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <div className="conv-header__avatar">
        {participant.avatar
          ? <img src={participant.avatar} alt={participant.displayName} />
          : <span>{participant.displayName?.[0]?.toUpperCase()}</span>}
      </div>
      <div className="conv-header__info">
        <span className="conv-header__name">{participant.displayName}</span>
        <span className={`conv-header__status${participant.isOnline ? " conv-header__status--online" : ""}`}>
          {participant.isOnline ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
};

export default ConversationHeader;
