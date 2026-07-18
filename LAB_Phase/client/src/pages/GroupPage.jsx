import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

const GroupHeader = ({ group, currentUserId }) => {
  const isAdmin = group?.admin?._id === currentUserId || group?.admin === currentUserId;
  const navigate = useNavigate();
  return (
    <div className="conv-header">
      <button className="conv-header__back" onClick={() => navigate("/")} aria-label="Back">
        <ArrowLeft size={18} />
      </button>
      <div className="conv-header__avatar">
        {group?.avatar
          ? <img src={group.avatar} alt={group.name} />
          : <span>{group?.name?.[0]?.toUpperCase()}</span>}
      </div>
      <div className="conv-header__info">
        <span className="conv-header__name">{group?.name}</span>
        <span className="conv-header__status">{group?.members?.length} members{isAdmin ? " · Admin" : ""}</span>
      </div>
    </div>
  );
};

const GroupPage = () => {
  const { groupId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [group, setGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typers, setTypers] = useState(new Set());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data: g } = await api.get(`/groups/${groupId}`);
      if (cancelled) return;
      setGroup(g);
      const { data: msgs } = await api.get(`/messages/${groupId}`);
      if (!cancelled) setMessages(msgs);
    };
    load().catch(console.error);
    return () => { cancelled = true; };
  }, [groupId]);

  useEffect(() => {
    if (!socket || !group) return;

    const onReceive = (msg) => setMessages((prev) => [...prev, msg]);

    const onDeleted = ({ messageId }) =>
      setMessages((prev) =>
        prev.map((m) => m._id === messageId ? { ...m, type: "deleted", content: null } : m)
      );

    const onTyping = ({ userId: typerId, isTyping, conversationId: cId }) => {
      if (cId !== group._id) return;
      setTypers((prev) => {
        const next = new Set(prev);
        isTyping ? next.add(typerId) : next.delete(typerId);
        return next;
      });
    };

    socket.on("message:receive", onReceive);
    socket.on("message:deleted", onDeleted);
    socket.on("typing:update", onTyping);

    return () => {
      socket.off("message:receive", onReceive);
      socket.off("message:deleted", onDeleted);
      socket.off("typing:update", onTyping);
    };
  }, [socket, group]);

  const handleSend = useCallback((payload) => {
    if (!socket || !group) return;
    socket.emit("message:send", {
      conversationId: group._id,
      conversationType: "Group",
      ...payload,
    });
  }, [socket, group]);

  const handleTypingStart = useCallback(() => {
    if (!socket || !group) return;
    socket.emit("typing:start", { conversationId: group._id, conversationType: "Group" });
  }, [socket, group]);

  const handleTypingStop = useCallback(() => {
    if (!socket || !group) return;
    socket.emit("typing:stop", { conversationId: group._id, conversationType: "Group" });
  }, [socket, group]);

  return (
    <div className="conversation-page">
      <GroupHeader group={group} currentUserId={user?.id} />
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        participants={group?.members || []}
        typers={typers}
        isGroup
      />
      <MessageInput onSend={handleSend} onTypingStart={handleTypingStart} onTypingStop={handleTypingStop} />
    </div>
  );
};

export default GroupPage;
