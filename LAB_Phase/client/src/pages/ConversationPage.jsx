import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import ConversationHeader from "../components/conversation/ConversationHeader";
import MessageList from "../components/chat/MessageList";
import MessageInput from "../components/chat/MessageInput";

const ConversationPage = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typers, setTypers] = useState(new Set());

  const otherParticipant = conversation?.participants?.find((p) => p._id !== user?.id);

  // Load or create conversation, then fetch messages
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data: conv } = await api.post("/conversations", { participantId: userId });
      if (cancelled) return;
      setConversation(conv);

      const { data: msgs } = await api.get(`/messages/${conv._id}`);
      if (!cancelled) setMessages(msgs);
    };

    load().catch(console.error);
    return () => { cancelled = true; };
  }, [userId]);

  // Socket: join room, handle incoming events
  useEffect(() => {
    if (!socket || !conversation) return;

    socket.emit("message:read", {
      conversationId: conversation._id,
      conversationType: "Conversation",
    });

    const onReceive = (msg) => setMessages((prev) => [...prev, msg]);

    const onDeleted = ({ messageId }) =>
      setMessages((prev) =>
        prev.map((m) => m._id === messageId ? { ...m, type: "deleted", content: null } : m)
      );

    const onReadUpdate = ({ messageId, readBy }) =>
      setMessages((prev) =>
        prev.map((m) => m._id === messageId ? { ...m, readBy: [...(m.readBy || []), readBy] } : m)
      );

    const onTyping = ({ userId: typerId, isTyping, conversationId: cId }) => {
      if (cId !== conversation._id) return;
      setTypers((prev) => {
        const next = new Set(prev);
        isTyping ? next.add(typerId) : next.delete(typerId);
        return next;
      });
    };

    const onStatus = ({ userId: uid, isOnline }) => {
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          participants: prev.participants.map((p) =>
            p._id === uid ? { ...p, isOnline } : p
          ),
        };
      });
    };

    socket.on("message:receive", onReceive);
    socket.on("message:deleted", onDeleted);
    socket.on("message:read-update", onReadUpdate);
    socket.on("typing:update", onTyping);
    socket.on("user:status", onStatus);

    return () => {
      socket.off("message:receive", onReceive);
      socket.off("message:deleted", onDeleted);
      socket.off("message:read-update", onReadUpdate);
      socket.off("typing:update", onTyping);
      socket.off("user:status", onStatus);
    };
  }, [socket, conversation]);

  const handleSend = useCallback((payload) => {
    if (!socket || !conversation) return;
    socket.emit("message:send", {
      conversationId: conversation._id,
      conversationType: "Conversation",
      ...payload,
    });
  }, [socket, conversation]);

  const handleTypingStart = useCallback(() => {
    if (!socket || !conversation) return;
    socket.emit("typing:start", { conversationId: conversation._id, conversationType: "Conversation" });
  }, [socket, conversation]);

  const handleTypingStop = useCallback(() => {
    if (!socket || !conversation) return;
    socket.emit("typing:stop", { conversationId: conversation._id, conversationType: "Conversation" });
  }, [socket, conversation]);

  return (
    <div className="conversation-page">
      <ConversationHeader participant={otherParticipant} />
      <MessageList
        messages={messages}
        currentUserId={user?.id}
        participants={conversation?.participants || []}
        typers={typers}
      />
      <MessageInput
        onSend={handleSend}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
};

export default ConversationPage;
